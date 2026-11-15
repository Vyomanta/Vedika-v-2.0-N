// OAuth secrets must only be read on the server from deployment configuration.
export function getActiveOAuthCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) throw new Error('Google OAuth is not configured.');
  return { clientId, clientSecret, fallbackSecret: null };
}
export async function getGoogleOAuthConfig() { return getActiveOAuthCredentials(); }
export async function getAlternativeClientSecret() { return null; }
