
import { DEFAULT_NOTIFICATIONS } from '@/features/opportunities/api/lms';
import { FRAPPE_URL, frappeRestGet, frappeRestPost, frappeRestDelete } from '@/integrations/frappe/transport';

export async function getNotifications() {
  // LMS Alert is a mock DocType not present in standard Frappe LMS.
  // We fall back directly to avoid console 404 network errors.
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_notifications_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('admin_notifications_list', JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
  return DEFAULT_NOTIFICATIONS;
}

export async function markNotificationRead(id) {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_notifications_list') || JSON.stringify(DEFAULT_NOTIFICATIONS);
    const list = JSON.parse(saved);
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('admin_notifications_list', JSON.stringify(updated));
    return true;
  }
  return false;
}

export async function clearAllNotifications() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_notifications_list') || JSON.stringify(DEFAULT_NOTIFICATIONS);
    const list = JSON.parse(saved);
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem('admin_notifications_list', JSON.stringify(updated));
    return true;
  }
  return false;
}

export const DEFAULT_CERTIFICATES = [
  { id: 'cert-101', student_name: 'Aarav Mehta', course_title: 'Python Fundamentals', issue_date: 'Jun 10, 2026', cert_hash: 'py-8f3a9b2c1d', status: 'Active' },
  { id: 'cert-102', student_name: 'Sneha Patel', course_title: 'Data Structures & Algorithms', issue_date: 'Jun 12, 2026', cert_hash: 'dsa-4c7e6d2a8b', status: 'Active' }
];

export const DEFAULT_CERT_CONFIG = {
  signer_name: 'Dr. Seshu Kumar',
  signer_title: 'LMS Academic Director',
  require_passing_quiz: true,
  require_assignments_submitted: true,
  theme_color: '#9B6EF8'
};

export async function getCertificates() {
  if (FRAPPE_URL) {
    try {
      const certs = await frappeRestGet("LMS Certificate", {
        fields: JSON.stringify(["name", "member_name", "course_title", "issue_date", "published"]),
        limit_page_length: 100
      });
      if (certs && Array.isArray(certs)) {
        return certs.map(c => ({
          id: c.name,
          student_name: c.member_name || "Unknown Student",
          course_title: c.course_title,
          issue_date: c.issue_date ? new Date(c.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "",
          cert_hash: c.name,
          status: c.published ? "Active" : "Draft"
        }));
      }
    } catch (e) {
      console.error("Failed to fetch certificates from Frappe REST API. Falling back.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_certificates_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('admin_certificates_list', JSON.stringify(DEFAULT_CERTIFICATES));
    return DEFAULT_CERTIFICATES;
  }
  return DEFAULT_CERTIFICATES;
}

export async function createCertificate(certData) {
  if (FRAPPE_URL) {
    try {
      const result = await frappeRestPost("LMS Certificate", {
        member: certData.member_email || "admin@lms.com",
        member_name: certData.student_name,
        course_title: certData.course_title,
        issue_date: certData.issue_date ? new Date(certData.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        published: 1
      });
      return { ...certData, id: result.name, cert_hash: result.name, status: "Active" };
    } catch (e) {
      console.error("Failed to create certificate via Frappe REST API. Falling back.", e);
      throw e;
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_certificates_list') || JSON.stringify(DEFAULT_CERTIFICATES);
    const list = JSON.parse(saved);
    const newCert = {
      ...certData,
      id: 'cert-' + Date.now(),
      cert_hash: certData.cert_hash || Math.random().toString(36).substr(2, 10),
      issue_date: certData.issue_date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active'
    };
    list.unshift(newCert);
    localStorage.setItem('admin_certificates_list', JSON.stringify(list));
    return newCert;
  }
  return certData;
}

export async function deleteCertificate(id) {
  if (FRAPPE_URL) {
    try {
      await frappeRestDelete("LMS Certificate", id);
      return true;
    } catch (e) {
      console.error("Failed to delete certificate.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_certificates_list') || JSON.stringify(DEFAULT_CERTIFICATES);
    const list = JSON.parse(saved);
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem('admin_certificates_list', JSON.stringify(filtered));
    return true;
  }
  return false;
}

export async function getCertificateConfig() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_cert_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('admin_cert_config', JSON.stringify(DEFAULT_CERT_CONFIG));
    return DEFAULT_CERT_CONFIG;
  }
  return DEFAULT_CERT_CONFIG;
}

export async function saveCertificateConfig(config) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_cert_config', JSON.stringify(config));
    return config;
  }
  return config;
}

export async function saveProgressToRedis(email, completed) {
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, completed })
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to save progress to Redis:", e);
    return false;
  }
}

export async function getProgressFromRedis(email) {
  try {
    const res = await fetch(`/api/progress?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.completed || {};
    }
  } catch (e) {
    console.error("Failed to get progress from Redis:", e);
  }
  return null;
}
