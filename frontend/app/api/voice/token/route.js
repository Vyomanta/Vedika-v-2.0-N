import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const auth = await authenticateRequest(request);
  if (auth.response) return auth.response;
  return NextResponse.json({ transport: 'websocket', wsServerConfigured: Boolean(process.env.NEXT_PUBLIC_VOICE_WS_URL), model: process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview' }, { headers: { 'Cache-Control': 'private, no-store' } });
}
