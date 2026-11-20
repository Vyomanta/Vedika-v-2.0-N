import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { backend } from '@/lib/backend.cjs';
import { nativeResource } from '@/integrations/native/resources';
import { frappeResource } from '@/integrations/frappe/server';

export const dynamic = 'force-dynamic';

function parseEnrollmentMember(request, data) {
  if (data?.member) return String(data.member).trim();
  const url = new URL(request.url);
  if (url.searchParams.get('member')) return url.searchParams.get('member').trim();
  const filtersRaw = url.searchParams.get('filters');
  if (filtersRaw) {
    try {
      const parsed = JSON.parse(filtersRaw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (Array.isArray(item)) {
            const field = item.length === 4 ? item[1] : item[0];
            const val = item.length === 4 ? item[3] : item[2];
            if (field === 'member') return String(val).trim();
          }
        }
      } else if (typeof parsed === 'object' && parsed !== null && parsed.member) {
        return String(parsed.member).trim();
      }
    } catch (_) {}
  }
  return null;
}

async function handle(request, context) {
  const auth = await authenticateRequest(request);
  if (auth.response) return auth.response;

  try {
    const { segments } = await context.params;
    const [type, id] = segments;

    if (/quiz|assignment|question/i.test(type)) {
      return NextResponse.json({ error: 'Use the permission-checked assessment API.' }, { status: 403 });
    }
    if (type === 'User' && !auth.isAdmin) {
      return NextResponse.json({ error: 'Administrator permission required.' }, { status: 403 });
    }
    if (request.method !== 'GET' && !auth.isAdmin && type !== 'LMS Enrollment') {
      return NextResponse.json({ error: 'Administrator permission required.' }, { status: 403 });
    }

    const data = ['POST', 'PUT', 'PATCH'].includes(request.method) ? await request.json().catch(() => ({})) : undefined;

    if (type === 'LMS Enrollment' && !auth.isAdmin) {
      const member = parseEnrollmentMember(request, data) || auth.user.email;
      if (member.toLowerCase() !== auth.user.email.toLowerCase() || !['GET', 'POST'].includes(request.method)) {
        return NextResponse.json({ error: 'Only your own enrollment is accessible.' }, { status: 403 });
      }
    }

    const result = backend() === 'neon'
      ? await nativeResource(request, auth, type, id, request.method, data)
      : await frappeResource(request, auth, type, id, request.method, data, segments);

    return NextResponse.json({ data: result }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (e) {
    return NextResponse.json(
      { error: e.status < 500 ? e.message : 'LMS resource service unavailable.' },
      { status: e.status || 503 }
    );
  }
}

export const GET = handle, POST = handle, PUT = handle, DELETE = handle;
