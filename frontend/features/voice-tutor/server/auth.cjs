const crypto = require('node:crypto');

function verify(token, secret) {
  if (!token || !secret) return null;
  try {
    const parts = token.replace(/^Bearer\s+/i, '').split('.');
    if (parts.length !== 3) return null;
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    if (header.alg !== 'HS256' || header.typ !== 'JWT') return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (typeof payload.exp !== 'number' || payload.exp <= Date.now() / 1000 || !(payload.user_id || payload.email)) return null;
    const signature = crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
    const received = Buffer.from(parts[2]);
    if (received.length !== signature.length || !crypto.timingSafeEqual(received, Buffer.from(signature))) return null;
    return payload;
  } catch { return null; }
}

function createWsAuthenticator(redis) {
  return async (params, cookies = '') => {
    const ticket = params.get('ticket');
    if (ticket && redis) {
      try {
      // GETDEL is atomic: the same ticket cannot open two simultaneous connections.
      const value = await redis.getdel(`ws_ticket:${ticket}`);
      if (value) {
        const record = typeof value === 'string' ? JSON.parse(value) : value;
        return { valid: true, user: record.user_id, backend: record.backend, tenantId: record.tenant_id, sessionId: record.session_id };
      }
      } catch { return { valid: false }; }
    }
    const match = cookies.match(/(?:^|;\s*)(?:jwt|token)=([^;]+)/);
    const payload = verify(params.get('token') || match?.[1], process.env.JWT_SECRET || process.env.ENCRYPTION_KEY);
    return payload ? { valid: true, user: payload.user_id || payload.email, backend: payload.aud, tenantId: payload.tenant_id, sessionId: params.get('sessionId') } : { valid: false };
  };
}
module.exports = { verify, createWsAuthenticator };
