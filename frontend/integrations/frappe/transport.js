


export const FRAPPE_URL = '/api';
export function buildFrappeUrl(path) { return new URL(path, typeof window !== 'undefined' ? window.location.origin : (process.env.APP_URL || 'http://localhost:3000')); }
export function sanitizeTitle(title) {
  if (!title) return title;
  return title.replace(/#/g, 'No.');
}

export const DEFAULT_COURSES = [
  {
    id: "physics-mechanics-fundamentals",
    name: "physics-mechanics-fundamentals",
    title: "Physics: Mechanics & Energy",
    instructor: "Dr. Angela Thorne",
    category: "Physics",
    enrolled: 38,
    lessonsCount: 4,
    status: "Published",
    description: "Master classical mechanics, 1D motion, Newton's laws of motion, conservation of mechanical energy, and universal gravitation.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    date: "Aug 15, 2026"
  },
  {
    id: "calculus-advanced-mathematics",
    name: "calculus-advanced-mathematics",
    title: "Mathematics: Calculus & Analysis",
    instructor: "Prof. David Miller",
    category: "Maths",
    enrolled: 42,
    lessonsCount: 4,
    status: "Published",
    description: "Comprehensive journey through differential and integral calculus, limits, continuity, rate of change, and geometric area integrals.",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    date: "Aug 14, 2026"
  },
  {
    id: "general-physical-chemistry",
    name: "general-physical-chemistry",
    title: "Chemistry: Atoms, Bonds & Reactions",
    instructor: "Dr. Maya Lin",
    category: "Chemistry",
    enrolled: 35,
    lessonsCount: 4,
    status: "Published",
    description: "Investigate quantum electron orbitals, ionic and covalent bonding, stoichiometric reaction yields, and acid-base titration equilibria.",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    date: "Aug 12, 2026"
  },
  {
    id: "cellular-biology-genetics",
    name: "cellular-biology-genetics",
    title: "Biology: Cells & Molecular Genetics",
    instructor: "Dr. Sarah Jenkins",
    category: "Biology",
    enrolled: 40,
    lessonsCount: 4,
    status: "Published",
    description: "Explore living systems from cellular organelles and ATP cellular respiration to DNA replication, central dogma, and Mendelian inheritance.",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    date: "Aug 10, 2026"
  },
  {
    id: "python-programming-essentials",
    name: "python-programming-essentials",
    title: "Python Programming Essentials",
    instructor: "Alex Mercer",
    category: "Python",
    enrolled: 65,
    lessonsCount: 4,
    status: "Published",
    description: "From beginner syntax to structured programming: master dynamic typing, collections, conditionals, iteration, and reusable modular functions.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    date: "Jul 28, 2026"
  },
  {
    id: "modern-web-development-html-css",
    name: "modern-web-development-html-css",
    title: "Web Development: HTML & CSS",
    instructor: "Elena Rostova",
    category: "Web Development",
    enrolled: 52,
    lessonsCount: 4,
    status: "Published",
    description: "Learn fundamental front-end web engineering with semantic HTML5 elements, accessible forms, modern CSS box models, and responsive Flexbox.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    date: "Jul 25, 2026"
  }
];

export const clientCache = {
  courses: null,
  coursesTimestamp: 0,
  syllabus: {},         // Map of courseId -> { data, timestamp }
  quizzes: null,
  quizzesTimestamp: 0,
  assignments: null,
  assignmentsTimestamp: 0,
  quizSubmissions: null,
  quizSubmissionsTimestamp: 0,
  assignmentSubmissions: null,
  assignmentSubmissionsTimestamp: 0
};

export function getActiveUserId() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.email || parsed.name || 'anonymous';
      }
    } catch (e) {}
  }
  return 'anonymous';
}

export function invalidateCoursesCache() {
  clientCache.courses = null;
  clientCache.coursesTimestamp = 0;
  if (typeof window !== 'undefined') {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cached_courses_list_') || key.startsWith('cached_courses_timestamp_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('courses_updated_ts', Date.now().toString());
      window.dispatchEvent(new Event('courses_updated'));
    } catch (e) {}
  }
}

export function invalidateSyllabusCache(courseId) {
  if (courseId) {
    delete clientCache.syllabus[courseId];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cached_syllabus_${courseId}`);
      localStorage.removeItem(`cached_syllabus_timestamp_${courseId}`);
    }
  } else {
    clientCache.syllabus = {};
    if (typeof window !== 'undefined') {
      // Clear all cached read syllabuses from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cached_syllabus_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
}

export function invalidateQuizzesCache() {
  clientCache.quizzes = null;
  clientCache.quizzesTimestamp = 0;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('quizzes_updated'));
  }
}

export function invalidateAssignmentsCache() {
  clientCache.assignments = null;
  clientCache.assignmentsTimestamp = 0;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('assignments_updated'));
  }
}

export function invalidateSubmissionsCache() {
  clientCache.quizSubmissions = null;
  clientCache.quizSubmissionsTimestamp = 0;
  clientCache.assignmentSubmissions = null;
  clientCache.assignmentSubmissionsTimestamp = 0;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('submissions_updated'));
  }
}

export async function handleResponse(res, isRest = true) {
  if (!res.ok) {
    let errMsg = `HTTP Error ${res.status}`;
    try {
      const data = await res.json();
      if (data._server_messages) {
        try {
          const msgs = JSON.parse(data._server_messages);
          const parsed = msgs.map(m => {
            try {
              return JSON.parse(m).message;
            } catch (e) {
              return m;
            }
          }).join('\n');
          if (parsed) errMsg = parsed;
        } catch (e) {}
      } else if (data.exception) {
        errMsg = data.exception.split('\n').filter(Boolean).pop() || data.exception;
      } else if (data.exc) {
        try {
          const excList = JSON.parse(data.exc);
          if (excList.length > 0) errMsg = excList[0].split('\n').filter(Boolean).pop() || excList[0];
        } catch (e) {}
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  const data = await res.json();
  return isRest ? data.data : data.message;
}

export const promiseCache = new Map();

export function getCachedPromise(key, fetchFn) {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }
  const promise = fetchFn().catch(err => {
    promiseCache.delete(key);
    throw err;
  });
  promiseCache.set(key, promise);
  return promise;
}

export function clearApiCache() {
  promiseCache.clear();
}

export async function frappeGet(method, params = {}) {
  if (!FRAPPE_URL && typeof window === 'undefined') throw new Error("Frappe URL not configured");
  
  let sid = null;
  if (typeof window !== 'undefined') {
    sid = localStorage.getItem('frappe_sid');
  }
  
  const mergedParams = { ...params };
  if (sid && !mergedParams.sid) {
    mergedParams.sid = sid;
  }
  
  const cacheKey = `GET_METHOD:${method}:${JSON.stringify(mergedParams)}`;
  
  return getCachedPromise(cacheKey, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    try {
      const url = buildFrappeUrl(`/api/method/${method}`);
      Object.entries(mergedParams).forEach(([k, v]) => url.searchParams.set(k, v));
      const res = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          ...((typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('jwt'))) ? { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('jwt')}` } : {}),
          "Content-Type": "application/json",
          "X-User-Email": getActiveUserId()
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return handleResponse(res, false);
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  });
}

export async function frappePost(method, body = {}) {
  if (!FRAPPE_URL && typeof window === 'undefined') throw new Error("Frappe URL not configured");
  
  promiseCache.clear();
  
  let sid = null;
  if (typeof window !== 'undefined') {
    sid = localStorage.getItem('frappe_sid');
  }
  
  const url = buildFrappeUrl(`/api/method/${method}`);
  if (sid) {
    url.searchParams.set('sid', sid);
  }
  
  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    headers: {
          ...((typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('jwt'))) ? { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('jwt')}` } : {}),
      "Content-Type": "application/json",
      "X-User-Email": getActiveUserId()
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res, false);
}

export async function frappeRestGet(resource, params = {}) {
  if (!FRAPPE_URL && typeof window === 'undefined') throw new Error("Frappe URL not configured");
  
  let sid = null;
  if (typeof window !== 'undefined') {
    sid = localStorage.getItem('frappe_sid');
  }
  
  const mergedParams = { ...params };
  if (sid && !mergedParams.sid) {
    mergedParams.sid = sid;
  }
  
  const cacheKey = `GET_REST:${resource}:${JSON.stringify(mergedParams)}`;
  
  return getCachedPromise(cacheKey, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    try {
      const encodedSegments = resource.split('/').map(segment => encodeURIComponent(segment)).join('/');
      const url = buildFrappeUrl(`/api/resource/${encodedSegments}`);
      Object.entries(mergedParams).forEach(([k, v]) => url.searchParams.set(k, v));
      const res = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          ...((typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('jwt'))) ? { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('jwt')}` } : {}),
          "Content-Type": "application/json",
          "X-User-Email": getActiveUserId()
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return handleResponse(res, true);
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  });
}

export async function frappeRestPost(resource, body = {}) {
  if (!FRAPPE_URL && typeof window === 'undefined') throw new Error("Frappe URL not configured");
  
  promiseCache.clear();
  
  const encodedSegments = resource.split('/').map(segment => encodeURIComponent(segment)).join('/');
  
  let sid = null;
  if (typeof window !== 'undefined') {
    sid = localStorage.getItem('frappe_sid');
  }
  
  const url = buildFrappeUrl(`/api/resource/${encodedSegments}`);
  if (sid) {
    url.searchParams.set('sid', sid);
  }
  
  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    headers: {
          ...((typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('jwt'))) ? { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('jwt')}` } : {}),
      "Content-Type": "application/json",
      "X-User-Email": getActiveUserId()
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res, true);
}

export async function frappeRestPut(resource, name, body = {}) {
  if (!FRAPPE_URL && typeof window === 'undefined') throw new Error("Frappe URL not configured");
  
  promiseCache.clear();
  
  const encodedResource = resource.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const encodedName = encodeURIComponent(name);
  
  let sid = null;
  if (typeof window !== 'undefined') {
    sid = localStorage.getItem('frappe_sid');
  }
  
  const url = buildFrappeUrl(`/api/resource/${encodedResource}/${encodedName}`);
  if (sid) {
    url.searchParams.set('sid', sid);
  }
  
  const res = await fetch(url.toString(), {
    method: "PUT",
    credentials: "include",
    headers: {
          ...((typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('jwt'))) ? { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('jwt')}` } : {}),
      "Content-Type": "application/json",
      "X-User-Email": getActiveUserId()
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res, true);
}

export async function frappeRestDelete(resource, name) {
  if (!FRAPPE_URL && typeof window === 'undefined') throw new Error("Frappe URL not configured");
  
  promiseCache.clear();
  
  const encodedResource = resource.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const encodedName = encodeURIComponent(name);
  
  let sid = null;
  if (typeof window !== 'undefined') {
    sid = localStorage.getItem('frappe_sid');
  }
  
  const url = buildFrappeUrl(`/api/resource/${encodedResource}/${encodedName}`);
  if (sid) {
    url.searchParams.set('sid', sid);
  }
  
  const res = await fetch(url.toString(), {
    method: "DELETE",
    credentials: "include",
    headers: {
          ...((typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('jwt'))) ? { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('jwt')}` } : {}), "Content-Type": "application/json" },
  });
  return handleResponse(res, true);
}
