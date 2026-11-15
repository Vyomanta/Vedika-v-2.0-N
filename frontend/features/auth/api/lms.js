


export function isAdminUser(userOrEmail) {
  if (!userOrEmail) return false;
  if (typeof userOrEmail === 'string') {
    const s = userOrEmail.trim().toLowerCase();
    return s === 'admin' || s === 'administrator' || s === 'admin@lms.com';
  }
  const role = (userOrEmail.role || '').toLowerCase();
  const email = (userOrEmail.email || '').toLowerCase();
  const username = (userOrEmail.username || '').toLowerCase();
  return (
    role === 'administrator' ||
    role === 'admin' ||
    role === 'system manager' ||
    email === 'admin@lms.com' ||
    username === 'administrator' ||
    username === 'admin'
  );
}

export async function login(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!normalizedEmail || !trimmedPassword) {
    throw new Error('Please enter both email and password.');
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password: trimmedPassword })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== 'undefined') {
        if (data.sid) localStorage.setItem('frappe_sid', data.sid);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('jwt', data.token);
        }
      }
      return data.user;
    } else {
      throw new Error(data.error || data.message || "Invalid email or password.");
    }
  } catch (err) {
    console.error('[Auth Login Error]:', err.message);
    throw err;
  }
}

export const DEFAULT_BATCHES = [
  { id: '1', title: 'Python Cohort - Summer 2026', start_date: '2026-06-01', end_date: '2026-08-31', medium: 'Online', seat_count: 50, published: true, amount: 199, currency: 'USD' },
  { id: '2', title: 'Data Structures Intensive - Q3', start_date: '2026-07-15', end_date: '2026-09-15', medium: 'Offline', seat_count: 25, published: true, amount: 299, currency: 'USD' },
  { id: '3', title: 'ML/AI Boot Camp', start_date: '2026-09-01', end_date: '2026-12-15', medium: 'Online', seat_count: 100, published: false, amount: 499, currency: 'USD' }
];
