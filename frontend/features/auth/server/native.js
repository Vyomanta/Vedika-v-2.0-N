import { NextResponse } from 'next/server';
import { authenticateNativeUser, registerNativeUser } from '@/lib/native-lms';
import { signJwt } from '@/lib/auth';

const attempts = new Map();
export async function nativeLogin(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const record = attempts.get(ip);
  if (record && record.until > Date.now() && record.count >= 10) return NextResponse.json({ error: 'Too many login attempts. Try again in 15 minutes.' }, { status: 429 });
  if (attempts.size > 10000) for (const [key, value] of attempts) if (value.until < Date.now()) attempts.delete(key);
  attempts.set(ip, record && record.until > Date.now() ? { ...record, count: record.count + 1 } : { count: 1, until: Date.now() + 900000 });
  try {
    const body = await request.json();
    const email = String(body.usr || body.email || '').trim().toLowerCase();
    const password = body.pwd || body.password;
    if (!email || typeof password !== 'string' || password.length > 256) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 400 });
    const user = await authenticateNativeUser(email, password);
    if (!user) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    const role = ({ admin: 'Administrator', instructor: 'Instructor', super_admin: 'super_admin' })[user.role] || 'Student';
    const token = signJwt({ user_id: user.email, email: user.email, role, tenant_id: user.tenant_id || 'default' }, { expiresIn: 86400 });
    const response = NextResponse.json({ success: true, message: 'Logged In', token, user: { email: user.email, username: user.email, name: user.full_name, role }, full_name: user.full_name, role });
    response.cookies.set('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 86400 });
    attempts.delete(ip);
    return response;
  } catch (error) {
    console.error('[Native login]', error.code || error.name);
    return NextResponse.json({ error: 'Login service unavailable. Check database configuration and migrations.' }, { status: 503 });
  }
}

export async function nativeSignup(request) {
  try {
    const body = await request.json();
    const email = String(body.email || body.usr || '').trim().toLowerCase();
    const fullName = String(body.name || body.full_name || '').trim();
    const password = body.password || body.pwd;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 || fullName.length < 2 || fullName.length > 150 || typeof password !== 'string' || password.length < 8 || password.length > 256) return NextResponse.json({ error: 'Provide a valid email, name, and password of 8–256 characters.' }, { status: 400 });
    const user = await registerNativeUser(email, password, fullName, 'student');
    const token = signJwt({ user_id: user.email, email: user.email, role: 'Student', tenant_id: 'default' });
    const response = NextResponse.json({ success: true, user: { ...user, username: user.email, name: user.full_name, role: 'Student' }, token });
    response.cookies.set('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 3600 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.code === '23505' ? 'An account with this email already exists.' : 'Registration service unavailable.' }, { status: error.code === '23505' ? 409 : 503 });
  }
}
