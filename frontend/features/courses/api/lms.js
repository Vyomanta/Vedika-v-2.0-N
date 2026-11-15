
import { FRAPPE_URL, DEFAULT_COURSES, frappeGet, clientCache, invalidateCoursesCache, frappeRestPost, sanitizeTitle, invalidateSyllabusCache, frappeRestPut, frappeRestGet, frappeRestDelete, frappePost, getActiveUserId } from '@/integrations/frappe/transport';

export async function getEnrolledCourses() {
  if (FRAPPE_URL) {
    return frappeGet("academy_portal.api.get_enrolled_courses");
  }
  // Simulated Fallback
  return DEFAULT_COURSES.filter(c => c.status === 'Published');
}

export async function getCourseCategories() {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem('admin_course_categories', JSON.stringify(list));
          return list;
        }
      }
    } catch (_) {}

    const saved = localStorage.getItem('admin_course_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
  }

  return [
    "Web Development",
    "Frontend",
    "Framework",
    "Data Structures & Algorithms",
    "Python Programming",
    "Finance",
    "Business",
    "Design",
    "Personal Development"
  ];
}

export async function addCourseCategory(categoryName) {
  const trimmed = (categoryName || '').trim();
  if (!trimmed) return null;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: trimmed })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.categories) {
          localStorage.setItem('admin_course_categories', JSON.stringify(data.categories));
        }
      }
    } catch (_) {}

    const saved = localStorage.getItem('admin_course_categories');
    let list = [];
    try { list = JSON.parse(saved) || []; } catch (_) {}
    if (!list.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      list.push(trimmed);
      localStorage.setItem('admin_course_categories', JSON.stringify(list));
    }
  }

  return trimmed;
}

export function prepareCourses(list, locallyDeleted = []) {
  let localEnrollments = [];
  if (typeof window !== 'undefined') {
    try {
      const savedEnrollments = localStorage.getItem('student_course_enrollments');
      if (savedEnrollments) {
        localEnrollments = JSON.parse(savedEnrollments);
      }
    } catch (e) {}
  }

  const localCounts = {};
  if (Array.isArray(localEnrollments)) {
    localEnrollments.forEach(e => {
      if (e && e.course) {
        localCounts[e.course] = (localCounts[e.course] || 0) + 1;
      }
    });
  }

  return (list || [])
    .filter(c => c && !locallyDeleted.includes(String(c.id)))
    .map(c => ({
      ...c,
      enrolled: localCounts[c.id] !== undefined ? localCounts[c.id] : (c.enrolled || 0)
    }));
}

export async function getCourses(options = {}) {
  let locallyDeleted = [];
  if (typeof window !== 'undefined') {
    try {
      locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String);
    } catch (e) {}
  }

  const now = Date.now();

  // 1. Instant in-memory cache check (< 60s)
  if (!options.forceRefresh && clientCache.courses && (now - clientCache.coursesTimestamp < 60000)) {
    return prepareCourses(clientCache.courses, locallyDeleted);
  }

  // 2. Instant local read from localStorage
  let list = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('admin_courses_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
          clientCache.courses = list;
          clientCache.coursesTimestamp = now;
        }
      }
    } catch (e) {}
  }

  // Background server fetch to sync newly published courses
  const revalidateCourses = async () => {
    if (typeof window === 'undefined') return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/courses', { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.courses) && data.courses.length > 0) {
          let updated = data.courses;
          if (list && Array.isArray(list)) {
            const serverIds = new Set(data.courses.map(c => String(c.id)));
            const localOnly = list.filter(c => !serverIds.has(String(c.id)));
            updated = [...localOnly, ...data.courses];
          }
          clientCache.courses = updated;
          clientCache.coursesTimestamp = Date.now();
          try {
            localStorage.setItem('admin_courses_list', JSON.stringify(updated));
          } catch (e) {}
          window.dispatchEvent(new Event('courses_updated'));
        }
      }
    } catch (_) {}
  };

  // 3. If local list is available and forceRefresh not requested, return INSTANTLY (0ms!)
  if (list && !options.forceRefresh) {
    revalidateCourses();
    return prepareCourses(list, locallyDeleted);
  }

  // If forceRefresh, await revalidation
  if (options.forceRefresh && typeof window !== 'undefined') {
    await revalidateCourses();
    if (clientCache.courses) {
      list = clientCache.courses;
    }
  }

  // 4. Fallback to DEFAULT_COURSES if nothing is initialized yet
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = DEFAULT_COURSES;
    clientCache.courses = list;
    clientCache.coursesTimestamp = now;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('admin_courses_list', JSON.stringify(DEFAULT_COURSES));
      } catch (e) {}
      revalidateCourses();
    }
  }

  return prepareCourses(list, locallyDeleted);
}

export async function createCourse(courseData) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const newCourse = {
    ...courseData,
    id: courseData.id || Date.now().toString(),
    status: courseData.status || 'Published',
    enrolled: 0,
    date: courseData.date || formattedDate
  };

  // 1. Immediately update localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('admin_courses_list') || JSON.stringify(DEFAULT_COURSES);
      let courses = JSON.parse(saved);
      courses = courses.filter(c => String(c.id) !== String(newCourse.id));
      courses.unshift(newCourse);
      localStorage.setItem('admin_courses_list', JSON.stringify(courses));
    } catch (e) {}
  }

  // 2. Persist to server API route (/api/courses)
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: newCourse })
      }).catch(err => console.warn('[createCourse] /api/courses save error:', err));
    } catch (e) {}
  }

  // 3. Broadcast update to all components and tabs
  invalidateCoursesCache();

  // 4. Background sync with Frappe if online (non-blocking)
  if (FRAPPE_URL) {
    (async () => {
      try {
        let inst = "Administrator";
        if (courseData.instructor && (courseData.instructor.includes("@") || courseData.instructor === "Administrator")) {
          inst = courseData.instructor;
        }
        const serializedDescription = JSON.stringify({
          description: courseData.description || "",
          pdf: courseData.pdf || ""
        });
        await frappeRestPost("LMS Course", {
          title: sanitizeTitle(courseData.title),
          published: newCourse.status === "Published" ? 1 : 0,
          instructors: [{ instructor: inst }],
          short_introduction: courseData.tagline || courseData.short_introduction || `${courseData.title} course introduction.`,
          description: serializedDescription,
          category: courseData.category || "Web Development",
          image: courseData.image || ""
        });
      } catch (e) {}
    })();
  }

  return newCourse;
}

export async function updateCourse(id, courseData) {
  const strId = String(id);
  const updatedCourse = { ...courseData, id: strId };

  // 1. Immediately update localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('admin_courses_list') || JSON.stringify(DEFAULT_COURSES);
      const courses = JSON.parse(saved);
      const updated = courses.map(c => String(c.id) === strId ? { ...c, ...courseData, id: strId } : c);
      localStorage.setItem('admin_courses_list', JSON.stringify(updated));
    } catch (e) {}
  }

  // 2. Persist to server API route
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: strId, course: courseData })
      }).catch(err => console.warn('[updateCourse] /api/courses error:', err));
    } catch (e) {}
  }

  // 3. Broadcast update
  invalidateCoursesCache();
  if (id) invalidateSyllabusCache(strId);

  // 4. Background sync with Frappe
  if (FRAPPE_URL) {
    (async () => {
      try {
        let inst = "Administrator";
        if (courseData.instructor && (courseData.instructor.includes("@") || courseData.instructor === "Administrator")) {
          inst = courseData.instructor;
        }
        const serializedDescription = JSON.stringify({
          description: courseData.description || "",
          pdf: courseData.pdf || ""
        });
        await frappeRestPut("LMS Course", id, {
          title: sanitizeTitle(courseData.title),
          published: (courseData.status === "Published" || courseData.status === "published") ? 1 : 0,
          category: courseData.category || undefined,
          instructors: [{ instructor: inst }],
          short_introduction: courseData.tagline || courseData.short_introduction || undefined,
          description: serializedDescription,
          image: courseData.image || ""
        });
      } catch (e) {}
    })();
  }

  return updatedCourse;
}

export async function deleteCourse(id) {
  const strId = String(id);

  // 1. Immediately remove from local storage state and mark deleted
  if (typeof window !== 'undefined') {
    try {
      const deleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String);
      if (!deleted.includes(strId)) {
        deleted.push(strId);
        localStorage.setItem('locally_deleted_courses', JSON.stringify(deleted));
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem('admin_courses_list') || JSON.stringify(DEFAULT_COURSES);
      const courses = JSON.parse(saved);
      const filtered = courses.filter(c => String(c.id) !== strId);
      localStorage.setItem('admin_courses_list', JSON.stringify(filtered));
    } catch (e) {}

    localStorage.removeItem(`admin_course_details_${strId}`);
    localStorage.removeItem(`cached_syllabus_${strId}`);
    localStorage.removeItem(`cached_syllabus_timestamp_${strId}`);
  }

  // 2. Persist delete to server API
  if (typeof window !== 'undefined') {
    try {
      fetch(`/api/courses?id=${encodeURIComponent(strId)}`, {
        method: 'DELETE'
      }).catch(err => console.warn('[deleteCourse] /api/courses error:', err));
    } catch (e) {}
  }

  // 3. Broadcast update to all tabs and listeners
  invalidateCoursesCache();
  if (id) invalidateSyllabusCache(strId);

  const isLocalCourseId = /^\d{10,}$/.test(strId) || strId.startsWith('local_') || strId.startsWith('course_');

  if (FRAPPE_URL && !isLocalCourseId) {
    try {
      // 1. Fetch and delete linked Enrollments to avoid LinkExistsError
      const enrollments = await frappeRestGet("LMS Enrollment", {
        filters: JSON.stringify([["course", "=", id]]),
        fields: JSON.stringify(["name"]),
        limit_page_length: 500
      }).catch(() => []);
      if (Array.isArray(enrollments)) {
        for (const enroll of enrollments) {
          await frappeRestDelete("LMS Enrollment", enroll.name).catch(err => {
            console.warn(`Could not delete linked LMS Enrollment ${enroll.name}:`, err);
          });
        }
      }

      // 2. Fetch and delete linked Quizzes
      const quizzes = await frappeRestGet("LMS Quiz", {
        filters: JSON.stringify([["course", "=", id]]),
        fields: JSON.stringify(["name"]),
        limit_page_length: 500
      }).catch(() => []);
      if (Array.isArray(quizzes)) {
        for (const q of quizzes) {
          await frappeRestDelete("LMS Quiz", q.name).catch(err => {
            console.warn(`Could not delete linked LMS Quiz ${q.name}:`, err);
          });
        }
      }

      // 3. Fetch and delete linked Assignments
      const assignments = await frappeRestGet("LMS Assignment", {
        filters: JSON.stringify([["course", "=", id]]),
        fields: JSON.stringify(["name"]),
        limit_page_length: 500
      }).catch(() => []);
      if (Array.isArray(assignments)) {
        for (const a of assignments) {
          await frappeRestDelete("LMS Assignment", a.name).catch(err => {
            console.warn(`Could not delete linked LMS Assignment ${a.name}:`, err);
          });
        }
      }

      // 4. Fetch and delete linked Batches
      const batches = await frappeRestGet("LMS Batch", {
        filters: JSON.stringify([["course", "=", id]]),
        fields: JSON.stringify(["name"]),
        limit_page_length: 500
      }).catch(() => []);
      if (Array.isArray(batches)) {
        for (const b of batches) {
          await frappeRestDelete("LMS Batch", b.name).catch(err => {
            console.warn(`Could not delete linked LMS Batch ${b.name}:`, err);
          });
        }
      }

      // 5. Fetch syllabus first to get chapter and lesson names
      const syllabus = await getCourseSyllabus(id).catch(() => null);
      if (syllabus && syllabus.modules) {
        // Step A: Unlink lessons from chapters
        for (const mod of syllabus.modules) {
          await frappeRestPut("Course Chapter", mod.id, { lessons: [] }).catch(err => {
            console.warn(`Failed to unlink lessons from chapter ${mod.id}:`, err);
          });
        }

        // Step B: Unlink chapters from course
        await frappeRestPut("LMS Course", id, { chapters: [] }).catch(err => {
          console.warn(`Failed to unlink chapters from course ${id}:`, err);
        });

        // Step C: Delete all Course Lessons
        for (const mod of syllabus.modules) {
          if (mod.lessons) {
            for (const les of mod.lessons) {
              await frappeRestDelete("Course Lesson", les.id).catch(err => {
                console.warn(`Could not delete Course Lesson ${les.id}:`, err);
              });
            }
          }
        }

        // Step D: Delete all Course Chapters
        for (const mod of syllabus.modules) {
          await frappeRestDelete("Course Chapter", mod.id).catch(err => {
            console.warn(`Could not delete Course Chapter ${mod.id}:`, err);
          });
        }
      }

      // Step E: Finally delete the LMS Course document itself
      await frappeRestDelete("LMS Course", id);
    } catch (e) {
      console.warn("Could not delete course via Frappe REST API (offline or unavailable). Deleted locally.", e);
    }
  }

  invalidateCoursesCache();
  return true;
}

export async function getCourseSyllabus(courseId, options = {}) {
  const forceRefresh = options.forceRefresh || (typeof window !== 'undefined' && window.location.pathname.includes('/admin'));
  const now = Date.now();

  // 1. Check in-memory cache first if not forced refresh
  if (!forceRefresh) {
    const cachedEntry = clientCache.syllabus[courseId];
    if (cachedEntry && (now - cachedEntry.timestamp < 300000)) { // 5 minutes TTL
      return cachedEntry.data;
    }
  }

  let syllabus = null;

  // 2. Check localStorage custom syllabus outlines (instant 0ms read)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`admin_course_details_${courseId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.modules) && parsed.modules.length > 0) {
          syllabus = parsed;
          clientCache.syllabus[courseId] = { data: syllabus, timestamp: now };
        }
      } catch (_) {}
    }
  }

  // Background server sync helper
  const revalidateSyllabus = async () => {
    if (typeof window === 'undefined') return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/syllabus`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.modules) && data.modules.length > 0) {
          clientCache.syllabus[courseId] = { data, timestamp: Date.now() };
          try {
            localStorage.setItem(`admin_course_details_${courseId}`, JSON.stringify(data));
          } catch (_) {}
        }
      }
    } catch (_) {}
  };

  // If already found in localStorage and not forceRefresh, return immediately and sync in background!
  if (syllabus && !forceRefresh) {
    revalidateSyllabus();
    return syllabus;
  }

  // 3. Try local server persistence API if forceRefresh or not found yet
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/syllabus`, { cache: 'no-store', signal: controller.signal });
      clearTimeout(timeoutId);
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.modules) && data.modules.length > 0) {
          syllabus = data;
          clientCache.syllabus[courseId] = { data: syllabus, timestamp: Date.now() };
          try {
            localStorage.setItem(`admin_course_details_${courseId}`, JSON.stringify(syllabus));
          } catch (_) {}
          return syllabus;
        }
      }
    } catch (_) {}
  }

  // 3. Try Frappe DocTypes if online and not a local ID
  const isLocalCourseId = /^\d{10,}$/.test(String(courseId)) || String(courseId).startsWith('local_') || String(courseId).startsWith('course_');
  if (!syllabus && FRAPPE_URL && !isLocalCourseId) {
    try {
      syllabus = await Promise.race([
        frappeGet("lms.lms.api.get_course_syllabus_optimized", { course_id: courseId }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);
      if (syllabus && syllabus.error) syllabus = null;
    } catch (_) {
      syllabus = null;
    }

    if (!syllabus) {
      try {
        const courseDoc = await frappeRestGet(`LMS Course/${courseId}`);
        const chapterRefs = courseDoc.chapters || [];

        const modules = await Promise.all((chapterRefs || []).map(async (ref) => {
          try {
            const chDoc = await frappeRestGet(`Course Chapter/${ref.chapter}`);
            const lessonRefs = chDoc.lessons || [];

            const lessons = await Promise.all((lessonRefs || []).map(async (lRef) => {
              try {
                const lDoc = await frappeRestGet(`Course Lesson/${lRef.lesson}`);
                let pts = [];
                let quizQuestions = [];
                let codingExercise = { hasExercise: false };
                let pdf = "";
                if (lDoc.instructor_notes) {
                  try {
                    const meta = JSON.parse(lDoc.instructor_notes);
                    if (Array.isArray(meta.pts)) pts = meta.pts;
                    if (Array.isArray(meta.quizQuestions)) quizQuestions = meta.quizQuestions;
                    if (meta.codingExercise) codingExercise = meta.codingExercise;
                    if (meta.pdf) pdf = meta.pdf;
                  } catch (e) {}
                }
                return {
                  id: lDoc.name,
                  title: lDoc.title || lRef.lesson,
                  dur: "10 min",
                  vid: lDoc.youtube || "",
                  overview: lDoc.body || "",
                  pts,
                  quizQuestions,
                  codingExercise,
                  pdf
                };
              } catch (e) {
                const cleanTitle = lRef.lesson
                  .replace(/^(lesson-|l-)/i, '')
                  .split(/[-_]/)
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return {
                  id: lRef.lesson,
                  title: cleanTitle,
                  dur: "10 min",
                  vid: "",
                  overview: "",
                  pts: [],
                  quizQuestions: [],
                  codingExercise: { hasExercise: false },
                  pdf: ""
                };
              }
            }));

            return {
              id: chDoc.name,
              title: chDoc.title,
              emoji: "📖",
              accent: "#5B8CF8",
              lessons
            };
          } catch (err) {
            return { id: ref.chapter, title: "Untitled Chapter", emoji: "📖", accent: "#5B8CF8", lessons: [] };
          }
        }));

        syllabus = {
          id: courseId,
          title: courseDoc.title,
          tagline: courseDoc.short_introduction || "",
          modules
        };
      } catch (_) {}
    }
  }

  // 4. Default outline if completely new course
  if (!syllabus) {
    syllabus = {
      id: courseId,
      title: "Course Syllabus Outline",
      tagline: "Define modules and lessons for students.",
      modules: [
        {
          id: `${courseId}_m1`,
          title: "Introduction",
          emoji: "🚀",
          accent: "#5B8CF8",
          lessons: [
            {
              id: `${courseId}_l1`,
              title: "What is this course?",
              dur: "5 min",
              vid: "",
              overview: "Welcome to the course. Here is a brief explanation of what we will cover.",
              pts: ["Course overview", "Course requirements"],
              quizQuestions: [],
              codingExercise: {
                hasExercise: false,
                language: 'python',
                instruction: '',
                starterCode: '',
                solutionCode: '',
                testCases: []
              },
              pdf: ""
            }
          ]
        }
      ]
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`admin_course_details_${courseId}`, JSON.stringify(syllabus));
      fetch(`/api/courses/${encodeURIComponent(courseId)}/syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus })
      }).catch(() => {});
    }
  }

  // Cache in memory and localStorage
  clientCache.syllabus[courseId] = {
    data: syllabus,
    timestamp: Date.now()
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`cached_syllabus_${courseId}`, JSON.stringify(syllabus));
      localStorage.setItem(`cached_syllabus_timestamp_${courseId}`, String(Date.now()));
    } catch (_) {}
  }

  return syllabus;
}

export function cleanYoutubeVid(input) {
  if (!input || typeof input !== 'string') return '';
  const str = input.trim();
  if (!str) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?.*v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) return match[1];
  try {
    const urlObj = new URL(str.startsWith('http') ? str : `https://${str}`);
    const vParam = urlObj.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;
  } catch (e) {}
  const tokenMatch = str.match(/([a-zA-Z0-9_-]{11})/);
  if (tokenMatch && tokenMatch[1]) return tokenMatch[1];
  return str;
}

export async function saveCourseSyllabus(courseId, syllabus) {
  // 1. Immediately persist to server API (permanent across browsers and reloads)
  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/courses/${encodeURIComponent(courseId)}/syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus }),
        cache: 'no-store'
      });
    } catch (apiErr) {
      console.warn("Failed to persist syllabus to server API:", apiErr);
    }

    // 2. Persist to localStorage
    localStorage.setItem(`admin_course_details_${courseId}`, JSON.stringify(syllabus));
    localStorage.setItem(`cached_syllabus_${courseId}`, JSON.stringify(syllabus));
    localStorage.setItem(`cached_syllabus_timestamp_${courseId}`, String(Date.now()));

    // Update lesson count in cached course list
    try {
      const saved = localStorage.getItem('admin_courses_list');
      if (saved) {
        const courses = JSON.parse(saved);
        const totalLessons = (syllabus.modules || []).reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0);
        const updated = courses.map(c => String(c.id) === String(courseId) ? { ...c, lessonsCount: totalLessons } : c);
        localStorage.setItem('admin_courses_list', JSON.stringify(updated));
      }
    } catch (_) {}
  }

  // 3. Update memory cache
  clientCache.syllabus[courseId] = {
    data: syllabus,
    timestamp: Date.now()
  };

  // 4. Try syncing to Frappe DocTypes in background (non-blocking, tolerant of 503)
  const isLocalCourseId = /^\d{10,}$/.test(String(courseId)) || String(courseId).startsWith('local_') || String(courseId).startsWith('course_');
  if (FRAPPE_URL && !isLocalCourseId) {
    (async () => {
      try {
        for (const chapter of syllabus.modules) {
          const lessonsList = [];
          for (const lesson of chapter.lessons || []) {
            const cleanVid = cleanYoutubeVid(lesson.vid);
            const notesStr = JSON.stringify({
              pts: lesson.pts || ["Key concept introduction."],
              quizQuestions: lesson.quizQuestions || [],
              codingExercise: lesson.codingExercise || { hasExercise: false },
              pdf: lesson.pdf || ""
            });

            const lRes = await Promise.race([
              frappePost("lms.lms.api.save_course_lesson_custom", {
                lesson_id: lesson.id,
                title: sanitizeTitle(lesson.title),
                chapter_id: chapter.id,
                youtube: cleanVid,
                body: lesson.overview,
                instructor_notes: notesStr,
                user_email: getActiveUserId()
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
            ]);

            if (lRes && lRes.status === "success" && lRes.name) {
              lessonsList.push(lRes.name);
            }
          }

          await Promise.race([
            frappePost("lms.lms.api.save_course_chapter_custom", {
              chapter_id: chapter.id,
              title: sanitizeTitle(chapter.title),
              course: courseId,
              lessons: lessonsList.map(lId => ({ lesson: lId })),
              user_email: getActiveUserId()
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
          ]);
        }
      } catch (e) {
        console.warn("Background Frappe sync skipped (Frappe offline/suspended).");
      }
    })();
  }

  return syllabus;
}
