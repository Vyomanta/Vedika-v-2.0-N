import { NextResponse } from 'next/server';
import { getGoogleOAuthConfig } from '@/lib/google-auth-config';
import { randomBytes } from 'crypto';
export async function GET(request) {
 try {
  const {clientId}=await getGoogleOAuthConfig();
  const origin=new URL(request.url).origin;
  const state=randomBytes(32).toString('base64url');
  const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  for(const [key,value] of Object.entries({client_id:clientId,redirect_uri:origin+'/auth/callback',response_type:'code',scope:'openid profile email',state,prompt:'select_account'}))url.searchParams.set(key,value);
  const response=NextResponse.json({url:url.toString()},{headers:{'Cache-Control':'private, no-store'}});
  response.cookies.set('vedika_oauth_state',state,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:600});
  return response;
 }catch{return NextResponse.json({error:'Google OAuth is not configured.'},{status:503});}
}
