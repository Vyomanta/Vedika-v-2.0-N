import syllabusesData from '@/data/syllabuses.json';


export async function geminiCall(system, user, maxTokens = 8192, opts = {}) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system, user, maxOutputTokens: maxTokens,
      sessionId: opts.sessionId, userId: opts.userId,
    }),
  });
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try { const d = await res.json(); errMsg = d.error || errMsg; } catch {}
    throw new Error(errMsg);
  }
  const d = await res.json();
  if (d.error) throw new Error(d.error);
  return d.text || '';
}
