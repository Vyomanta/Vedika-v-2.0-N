import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import service from '@/features/assessments/server/service.cjs';

const headers = { 'Cache-Control': 'private, no-store, max-age=0' };

async function body(request) {
  if (Number(request.headers.get('content-length') || 0) > 1024 * 1024) throw Object.assign(new Error('Request exceeds 1 MB.'), { status: 413 });
  const raw = await request.text();
  if (raw.length > 1024 * 1024) throw Object.assign(new Error('Request exceeds 1 MB.'), { status: 413 });
  try { return JSON.parse(raw); } catch { throw Object.assign(new Error('Invalid JSON.'), { status: 400 }); }
}

export function handler(action) {
  return async (request) => {
    const auth = await authenticateRequest(request);
    if (auth.response) return auth.response;
    try {
      const origin = request.headers.get('origin');
      if (request.method !== 'GET' && origin && new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: 'Cross-origin mutations are not permitted.' }, { status: 403, headers });
      return NextResponse.json(await action(request, auth), { headers });
    } catch (error) {
      const status = error.status || (error.code ? 503 : 500);
      if (status >= 500) console.error('[Assessments]', error.code || error.name);
      return NextResponse.json({ error: status < 500 ? error.message : 'Assessment storage unavailable. Please retry or contact your administrator.' }, { status, headers });
    }
  };
}

export function assessmentHandlers(kind) {
  return {
    GET: handler((request, auth) => service.assessments(auth, kind, Object.fromEntries(new URL(request.url).searchParams))),
    POST: handler(async (request, auth) => { const data = await body(request); return { status: 'success', [kind]: await service.saveAssessment(auth, kind, data[kind] || data) }; }),
    DELETE: handler(async (request, auth) => service.deleteAssessment(auth, kind, new URL(request.url).searchParams.get('id') || (await body(request)).id)),
  };
}

export function submissionHandlers(kind) {
  return {
    GET: handler((request, auth) => service.submissions(auth, kind, Object.fromEntries(new URL(request.url).searchParams))),
    POST: handler(async (request, auth) => { const data = await body(request); return { status: 'success', submission: await service.submit(auth, kind, data.submission || data) }; }),
    PUT: handler(async (request, auth) => {
      if (kind !== 'assignment') throw Object.assign(new Error('Quiz grades are calculated by the server.'), { status: 405 });
      return { status: 'success', submission: await service.grade(auth, await body(request)) };
    }),
  };
}
