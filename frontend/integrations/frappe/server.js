export async function frappeRequest(request, route, { method = 'GET', data } = {}) {
  const base = process.env.FRAPPE_URL;
  if (!base) throw Object.assign(new Error('FRAPPE_URL is not configured.'), { status: 503 });
  const sid = request.headers.get('cookie')?.match(/(?:^|;\s*)sid=([^;]+)/)?.[1];
  const response = await fetch(`${base.replace(/\/$/, '')}${route}`, {
    method, headers: { 'Content-Type': 'application/json', ...(sid ? { Cookie: `sid=${sid}` } : {}) },
    body: data ? JSON.stringify(data) : undefined, cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  const result = await response.json();
  if (!response.ok) throw Object.assign(new Error('The LMS backend rejected the request.'), { status: response.status >= 500 ? 503 : response.status });
  return result.data ?? result.message ?? result;
}
