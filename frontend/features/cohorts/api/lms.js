
import { FRAPPE_URL, frappeRestGet, frappeRestPost, frappeRestPut, frappeRestDelete, invalidateCoursesCache } from '@/integrations/frappe/transport';
import { DEFAULT_BATCHES } from '@/features/auth/api/lms';

export async function getBatches() {
  if (FRAPPE_URL) {
    try {
      const batches = await frappeRestGet("LMS Batch", {
        fields: JSON.stringify(["name", "title", "start_date", "end_date", "medium", "seat_count", "published", "amount", "currency"]),
        limit_page_length: 100
      });
      return batches.map(b => ({
        id: b.name,
        title: b.title,
        start_date: b.start_date,
        end_date: b.end_date,
        medium: b.medium || 'Online',
        seat_count: b.seat_count || 0,
        published: !!b.published,
        amount: b.amount || 0,
        currency: b.currency || 'USD'
      }));
    } catch (e) {
      console.error("Failed to fetch batches. Falling back to local state.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_batches_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem('admin_batches_list', JSON.stringify(DEFAULT_BATCHES));
    return DEFAULT_BATCHES;
  }
  return DEFAULT_BATCHES;
}

export async function createBatch(batchData) {
  if (FRAPPE_URL) {
    try {
      const result = await frappeRestPost("LMS Batch", {
        title: batchData.title,
        start_date: batchData.start_date,
        end_date: batchData.end_date,
        medium: batchData.medium || 'Online',
        seat_count: parseInt(batchData.seat_count) || 0,
        published: batchData.published ? 1 : 0,
        amount: parseFloat(batchData.amount) || 0,
        currency: batchData.currency || 'USD',
        // Add defaults for required fields in the backend
        start_time: batchData.start_time || "09:00:00",
        end_time: batchData.end_time || "18:00:00",
        timezone: batchData.timezone || "Asia/Kolkata",
        description: batchData.description || `${batchData.title} batch cohort.`,
        batch_details: batchData.batch_details || `${batchData.title} batch details.`,
        instructors: [{ instructor: "Administrator" }]
      });
      return { ...batchData, id: result.name };
    } catch (e) {
      console.warn("Notice: Frappe REST API unavailable for createBatch. Falling back to local state.", e.message || e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_batches_list') || JSON.stringify(DEFAULT_BATCHES);
    const list = JSON.parse(saved);
    const newBatch = { ...batchData, id: Date.now().toString() };
    list.unshift(newBatch);
    localStorage.setItem('admin_batches_list', JSON.stringify(list));
    return newBatch;
  }
  return batchData;
}

export async function updateBatch(id, batchData) {
  if (FRAPPE_URL) {
    try {
      await frappeRestPut("LMS Batch", id, {
        title: batchData.title,
        start_date: batchData.start_date,
        end_date: batchData.end_date,
        medium: batchData.medium,
        seat_count: parseInt(batchData.seat_count) || 0,
        published: batchData.published ? 1 : 0,
        amount: parseFloat(batchData.amount) || 0,
        currency: batchData.currency,
        // Optional updates/defaults
        start_time: batchData.start_time || "09:00:00",
        end_time: batchData.end_time || "18:00:00",
        timezone: batchData.timezone || "Asia/Kolkata",
        description: batchData.description || `${batchData.title} batch cohort.`,
        batch_details: batchData.batch_details || `${batchData.title} batch details.`,
        instructors: [{ instructor: "Administrator" }]
      });
      return batchData;
    } catch (e) {
      console.warn("Notice: Frappe REST API unavailable for updateBatch. Falling back to local state.", e.message || e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_batches_list') || JSON.stringify(DEFAULT_BATCHES);
    const list = JSON.parse(saved);
    const updated = list.map(b => b.id === id ? { ...b, ...batchData } : b);
    localStorage.setItem('admin_batches_list', JSON.stringify(updated));
    return batchData;
  }
  return batchData;
}

export async function deleteBatch(id) {
  if (FRAPPE_URL) {
    try {
      await frappeRestDelete("LMS Batch", id);
      return true;
    } catch (e) {
      console.error("Failed to delete batch.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('admin_batches_list') || JSON.stringify(DEFAULT_BATCHES);
    const list = JSON.parse(saved);
    const filtered = list.filter(b => b.id !== id);
    localStorage.setItem('admin_batches_list', JSON.stringify(filtered));
    return true;
  }
  return false;
}

export async function enrollStudentInCourse(courseId, studentEmail) {
  invalidateCoursesCache();
  if (FRAPPE_URL) {
    try {
      return await frappeRestPost("LMS Enrollment", {
        course: courseId,
        member: studentEmail
      });
    } catch (e) {
      console.error("Failed to enroll via Frappe REST API. Falling back to local state.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('student_course_enrollments') || '[]';
    let enrollments = [];
    try {
      enrollments = JSON.parse(saved);
    } catch (e) {}

    const exists = enrollments.some(e => e.course === courseId && e.member === studentEmail);
    if (!exists) {
      enrollments.push({ course: courseId, member: studentEmail });
      localStorage.setItem('student_course_enrollments', JSON.stringify(enrollments));
    }
    return true;
  }
  return false;
}

export async function checkStudentEnrollment(courseId, studentEmail) {
  if (!studentEmail) return false;

  if (FRAPPE_URL) {
    try {
      const res = await frappeRestGet("LMS Enrollment", {
        fields: JSON.stringify(["name"]),
        filters: JSON.stringify([
          ["course", "=", courseId],
          ["member", "=", studentEmail]
        ])
      });
      return res && res.length > 0;
    } catch (e) {
      console.error("Failed to check enrollment via Frappe REST API. Falling back to local state.", e);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('student_course_enrollments') || '[]';
    let enrollments = [];
    try {
      enrollments = JSON.parse(saved);
    } catch (e) {}

    return enrollments.some(e => e.course === courseId && e.member === studentEmail);
  }
  return false;
}

export async function getStudentEnrollments(studentEmail) {
  if (!studentEmail) return [];

  let local = [];
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('student_course_enrollments') || '[]';
      const enrollments = JSON.parse(saved);
      local = enrollments.filter(e => e && e.member === studentEmail).map(e => e.course);
    } catch (e) {}
  }

  if (local.length > 0) return local;

  if (FRAPPE_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const res = await frappeRestGet("LMS Enrollment", {
        fields: JSON.stringify(["course"]),
        filters: JSON.stringify([
          ["member", "=", studentEmail]
        ]),
        limit_page_length: 100
      });
      clearTimeout(timeoutId);
      return (res || []).map(e => e.course);
    } catch (_) {
      // Fast fallback to local
    }
  }

  return local;
}
