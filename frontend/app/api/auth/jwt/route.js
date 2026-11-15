import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { signJwt } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const auth = await authenticateRequest(request);
  if (auth.response) return auth.response;
  return NextResponse.json({ token: signJwt(auth.user, { expiresIn: 3600 }) }, { headers: { 'Cache-Control': 'private, no-store' } });
}
