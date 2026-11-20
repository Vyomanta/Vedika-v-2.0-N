import { getFrappeDb } from './database';
import crypto from 'crypto';

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

function extractFilters(url) {
  const result = {};
  const searchParams = url.searchParams;
  if (searchParams.get('member')) result.member = searchParams.get('member');
  if (searchParams.get('course')) result.course = searchParams.get('course');
  const raw = searchParams.get('filters');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (Array.isArray(item)) {
            const field = item.length === 4 ? item[1] : item[0];
            const val = item.length === 4 ? item[3] : item[2];
            if (field === 'member') result.member = val;
            if (field === 'course') result.course = val;
          }
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.member) result.member = parsed.member;
        if (parsed.course) result.course = parsed.course;
      }
    } catch (_) {}
  }
  return result;
}

export async function frappeResource(request, auth, type, id, method, data = {}, segments = []) {
  if (type === 'LMS Enrollment') {
    const db = getFrappeDb();
    if (db) {
      const url = new URL(request.url);
      const parsedFilters = extractFilters(url);
      const owner = (auth?.user?.email || '').toLowerCase();
      const isAdmin = Boolean(auth?.isAdmin);

      if (method === 'GET') {
        const member = isAdmin ? (parsedFilters.member || null) : owner;
        const course = parsedFilters.course || null;

        let sql = 'SELECT name, course, member FROM `tabLMS Enrollment` WHERE 1=1';
        const params = [];
        if (member) {
          sql += ' AND LOWER(member) = ?';
          params.push(member.toLowerCase());
        }
        if (course) {
          sql += ' AND course = ?';
          params.push(course);
        }
        sql += ' ORDER BY creation DESC';
        const [rows] = await db.query(sql, params);
        return (rows || []).map(r => ({
          name: r.name || `${r.member}:${r.course}`,
          course: r.course,
          member: r.member
        }));
      }

      if (method === 'POST') {
        const member = String(data?.member || owner).toLowerCase();
        const course = String(data?.course || '');
        if (!course) {
          throw Object.assign(new Error('Course ID is required.'), { status: 400 });
        }
        if (!isAdmin && member !== owner) {
          throw Object.assign(new Error('Cannot enroll another student.'), { status: 403 });
        }

        // Check if already enrolled in tabLMS Enrollment
        const [existing] = await db.query(
          'SELECT name, member, course FROM `tabLMS Enrollment` WHERE LOWER(member) = ? AND course = ? LIMIT 1',
          [member, course]
        );
        if (existing && existing.length > 0) {
          return { name: existing[0].name, member, course };
        }

        // Fetch student full_name from tabUser if present
        let memberName = member;
        try {
          const [users] = await db.query('SELECT full_name FROM `tabUser` WHERE LOWER(email) = ? OR name = ? LIMIT 1', [member, member]);
          if (users && users[0] && users[0].full_name) {
            memberName = users[0].full_name;
          }
        } catch (_) {}

        const name = crypto.randomBytes(5).toString('hex');
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.query(
          'INSERT INTO `tabLMS Enrollment` (name, creation, modified, modified_by, owner, docstatus, idx, course, member, member_name, member_type, role) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?)',
          [name, now, now, member, member, course, member, memberName, 'Student', 'Member']
        );
        return { name, member, course };
      }

      if (method === 'DELETE' && id) {
        const [found] = await db.query('SELECT name, member FROM `tabLMS Enrollment` WHERE name = ? LIMIT 1', [id]);
        if (found && found[0]) {
          if (!isAdmin && found[0].member?.toLowerCase() !== owner) {
            throw Object.assign(new Error('Forbidden'), { status: 403 });
          }
          await db.query('DELETE FROM `tabLMS Enrollment` WHERE name = ?', [id]);
          return { name: id };
        }
      }
    }
  }

  // Fallback to HTTP frappeRequest
  const route = `/api/resource/${segments.map(encodeURIComponent).join('/')}${new URL(request.url).search}`;
  return frappeRequest(request, route, { method, data });
}
