import { backend } from '@/lib/backend.cjs';
import { nativeQuery } from '@/lib/native-db';
import { registerNativeUser } from '@/lib/native-lms';
import { randomBytes, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/auth';
import mysql from 'mysql2/promise';
import { getGoogleOAuthConfig, getAlternativeClientSecret } from '@/lib/google-auth-config';

export async function POST(request) {
  try {
    const { code, redirect_uri, state } = await request.json();
    const expectedState=request.headers.get('cookie')?.match(/(?:^|;\s*)vedika_oauth_state=([^;]+)/)?.[1];
    if(!state||!expectedState||state.length!==expectedState.length||!timingSafeEqual(Buffer.from(state),Buffer.from(expectedState))) return NextResponse.json({error:'Invalid or expired Google sign-in state. Please sign in again.'},{status:400});
    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    const { clientId, clientSecret } = await getGoogleOAuthConfig();
    const redirectUri = new URL(request.url).origin+'/auth/callback';
    if(redirect_uri && redirect_uri!==redirectUri)return NextResponse.json({error:'Invalid OAuth redirect URI.'},{status:400});

    // Helper to exchange authorization code for access token with Google
    async function exchangeToken(secret) {
      return await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: secret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
    }

    let tokenRes = await exchangeToken(clientSecret);
    let tokenData = await tokenRes.json();

    // Resilient auto-fallback: If initial exchange fails with client secret error, try alternative secret
    if (!tokenRes.ok && (tokenData.error === 'invalid_client' || (tokenData.error_description || '').includes('client secret') || (tokenData.error || '').includes('client secret'))) {
      const altSecret = await getAlternativeClientSecret();
      if (altSecret && altSecret !== clientSecret) {
        console.warn('[Google OAuth] Retrying token exchange with alternative secret...');
        tokenRes = await exchangeToken(altSecret);
        tokenData = await tokenRes.json();
      }
    }

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google OAuth Error]', tokenData);
      return NextResponse.json({ 
        error: tokenData.error_description || tokenData.error || 'Failed to exchange authorization code with Google' 
      }, { status: 400 });
    }

    // Fetch user profile directly from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileRes.json();
    if (!profileRes.ok || !profile.email || profile.verified_email !== true) {
      return NextResponse.json({ error: 'Failed to retrieve Google profile' }, { status: 400 });
    }

    const email = profile.email.toLowerCase();
    const name = profile.name || email.split('@')[0];
    const isAdmin = false;
    let role = 'Student';
    let tenantId = 'default';
    if(backend()==='neon'){
      let result=await nativeQuery('SELECT role,enabled,tenant_id FROM users WHERE LOWER(email)=LOWER($1)',[email]);
      if(!result.rows.length){await registerNativeUser(email,randomBytes(32).toString('hex'),name);result=await nativeQuery('SELECT role,enabled,tenant_id FROM users WHERE LOWER(email)=LOWER($1)',[email]);}
      if(!result.rows[0]?.enabled)return NextResponse.json({error:'Account disabled.'},{status:403});
      role=({admin:'Administrator',instructor:'Instructor',super_admin:'super_admin'})[result.rows[0].role]||'Student';
      tenantId=result.rows[0].tenant_id;
    }

    // Synchronize user in TiDB if database credentials are present
    try {
      if (backend()==='frappe' && process.env.DB_HOST && process.env.DB_USER) {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 4000,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME || 'test',
          ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: true }
        });

        // Check if user exists
        const [existing] = await connection.execute('SELECT name, email, enabled FROM `tabUser` WHERE email = ?', [email]);
        if (existing.length === 0) {
          await connection.execute(
            'INSERT INTO `tabUser` (name, email, first_name, full_name, enabled, user_type, docstatus) VALUES (?, ?, ?, ?, 1, ?, 0)',
            [email, email, name, name, isAdmin ? 'System User' : 'Website User']
          );
          await connection.execute(
            'INSERT IGNORE INTO `tabHas Role` (name, parent, role, parenttype, parentfield) VALUES (?, ?, ?, "User", "roles")',
            [`${email}-${role}`, email, role]
          );
        }
        const [roles]=await connection.execute('SELECT role FROM `tabHas Role` WHERE parent = ?', [email]);
        if(roles.some(r=>['Administrator','System Manager'].includes(r.role)))role='Administrator';
        if(existing[0] && !existing[0].enabled){await connection.end();return NextResponse.json({error:'Account disabled.'},{status:403});}
        await connection.end();
      }
    } catch (dbErr) {
      console.warn('[Google OAuth] TiDB user sync skipped:', dbErr.message);
    }

    // Issue standard JWT session token
    const token = signJwt({
      email,
      name,
      role,
      tenant_id: tenantId,
      user_id: email,
      picture: profile.picture
    }, { expiresIn: 60 * 60 * 24 * 7 }); // 7 days

    const userProfile = {
      email,
      username: email,
      name,
      role,
      token,
      picture: profile.picture
    };

    const response=NextResponse.json({success:true,user:userProfile,token},{headers:{'Cache-Control':'private, no-store'}});
    response.cookies.set('jwt',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:86400*7});
    response.cookies.set('vedika_oauth_state','',{path:'/',maxAge:0});
    return response;

  } catch (err) {
    console.error('[Google OAuth Callback] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
