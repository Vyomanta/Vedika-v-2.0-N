'use client';

import inlineStyles from '@/features/lessons/styles/lesson-id-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCourses, getCourseSyllabus } from '@/features/courses/api/client';
import { frappeRestGet, DEFAULT_COURSES } from '@/integrations/frappe/transport';
import { saveProgressToRedis, getProgressFromRedis } from '@/features/progress/api/lms';
import { getCourseDetails } from '@/features/courses/domain/course-data';
import LessonPage from '@/components/LessonPage';

// Instant local lesson resolver (< 1ms execution time)
function normalizeLesson(l, m, details, defaultCourse) {
  if (!l) return null;
  const rawVid = l.vid || l.youtube || "";
  let resolvedVid = rawVid;
  if (!/^[a-zA-Z0-9_-]{11}$/.test(rawVid)) {
    const match = String(rawVid || l.content || "").match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    resolvedVid = match ? match[1] : (rawVid || "_uQrJ0TkZlc");
  }
  return {
    ...l,
    vid: resolvedVid,
    youtube: resolvedVid,
    moduleTitle: m?.title || l.moduleTitle || '',
    courseTitle: details?.title || defaultCourse?.title || l.courseTitle || '',
    courseId: details?.id || defaultCourse?.id || l.courseId || '',
    module: m
  };
}

function findLocalLesson(lessonId) {
  if (!lessonId) return null;

  // 1. Check all stored course details in localStorage
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('admin_course_details_'));
      for (const k of keys) {
        try {
          const syl = JSON.parse(localStorage.getItem(k));
          if (syl && Array.isArray(syl.modules)) {
            for (const m of syl.modules) {
              const l = (m.lessons || []).find(x => x.id === lessonId);
              if (l) {
                return normalizeLesson(l, m, syl, null);
              }
            }
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  // 2. Check DEFAULT_COURSES and built-in course details
  for (const c of DEFAULT_COURSES) {
    const details = getCourseDetails(c);
    if (details && Array.isArray(details.modules)) {
      for (const m of details.modules) {
        const l = (m.lessons || []).find(x => x.id === lessonId);
        if (l) {
          return normalizeLesson(l, m, details, c);
        }
      }
    }
  }

  return null;
}

export default function LessonRoute() {
  const params = useParams();
  const id = decodeURIComponent(params.id);
  const router = useRouter();
  const [completed, setCompleted] = useState({});

  // Instant synchronous lesson hydration (0ms load)
  const [lesson, setLesson] = useState(() => findLocalLesson(id));
  const [loading, setLoading] = useState(() => !findLocalLesson(id));

  // Sync completion states
  useEffect(() => {
    let key = 'completed_lessons';
    let email = '';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.email) {
            key = `completed_lessons_${user.email}`;
            email = user.email;
          }
        } catch (e) {}
      }
      const saved = localStorage.getItem(key);
      let localCompleted = {};
      if (saved) {
        try {
          localCompleted = JSON.parse(saved);
          setCompleted(localCompleted);
        } catch (e) {}
      }

      if (email) {
        getProgressFromRedis(email).then(async (remoteCompleted) => {
          if (remoteCompleted) {
            const merged = { ...localCompleted, ...remoteCompleted };
            setCompleted(merged);
            localStorage.setItem(`completed_lessons_${email}`, JSON.stringify(merged));
            
            const remoteKeys = Object.keys(remoteCompleted).length;
            const mergedKeys = Object.keys(merged).length;
            if (mergedKeys > remoteKeys) {
              await saveProgressToRedis(email, merged);
            }
          }
        }).catch(err => console.error("Error synchronizing progress:", err));
      }
    }
  }, []);

  // Fetch courses dynamically and compile/revalidate the lesson list
  useEffect(() => {
    let isMounted = true;
    async function loadLesson() {
      let found = findLocalLesson(id);
      if (found) {
        setLesson(found);
        setLoading(false);
      }

      try {
        const FRAPPE_URL = process.env.NEXT_PUBLIC_FRAPPE_URL || process.env.FRAPPE_URL;

        if (FRAPPE_URL && (!found || found.lazyLoad)) {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 1800);
            const lDoc = await frappeRestGet(`Course Lesson/${id}`);
            clearTimeout(timer);
            if (lDoc && lDoc.course) {
              const syllabus = await getCourseSyllabus(lDoc.course);
              if (syllabus && syllabus.modules) {
                const lessonsInCourse = [];
                syllabus.modules.forEach(m => {
                  m.lessons.forEach(l => {
                    lessonsInCourse.push({
                      ...l,
                      moduleTitle: m.title,
                      courseTitle: syllabus.title,
                      courseId: syllabus.id,
                      module: m
                    });
                  });
                });
                const remoteFound = lessonsInCourse.find(l => l.id === id);
                if (remoteFound) {
                  let pts = remoteFound.pts || ["Key concept introduction."];
                  let quizQuestions = remoteFound.quizQuestions || [];
                  let codingExercise = remoteFound.codingExercise || {
                    hasExercise: false,
                    language: 'python',
                    instruction: '',
                    starterCode: '',
                    solutionCode: '',
                    testCases: []
                  };
                  let pdf = remoteFound.pdf || "";
                  if (lDoc.instructor_notes) {
                    try {
                      const meta = JSON.parse(lDoc.instructor_notes);
                      if (Array.isArray(meta.pts)) pts = meta.pts;
                      if (Array.isArray(meta.quizQuestions)) quizQuestions = meta.quizQuestions;
                      if (meta.codingExercise) codingExercise = meta.codingExercise;
                      if (meta.pdf) pdf = meta.pdf;
                    } catch (e) {}
                  }
                  
                  found = {
                    ...remoteFound,
                    title: lDoc.title || remoteFound.title,
                    dur: lDoc.duration || remoteFound.dur || "10 min",
                    vid: lDoc.youtube || remoteFound.vid || remoteFound.youtube || "_uQrJ0TkZlc",
                    youtube: lDoc.youtube || remoteFound.vid || remoteFound.youtube || "_uQrJ0TkZlc",
                    overview: lDoc.body || remoteFound.overview || "",
                    pts,
                    quizQuestions,
                    codingExercise,
                    pdf,
                    lazyLoad: false
                  };
                  if (isMounted) setLesson(found);
                }
              }
            }
          } catch (_) {
            // Background sync error handled gracefully
          }
        }

        // Parallel fallback across all courses if not found
        if (!found) {
          const courses = await getCourses();
          const syllabuses = await Promise.all(
            courses.map(course => getCourseSyllabus(course.id).catch(() => null))
          );
          const allLessons = [];
          courses.forEach((course, idx) => {
            const syllabus = syllabuses[idx];
            const details = (syllabus && syllabus.modules?.length > 0) ? syllabus : getCourseDetails(course);
            if (details && details.modules) {
              details.modules.forEach(m => {
                m.lessons.forEach(l => {
                  allLessons.push(normalizeLesson(l, m, details, course));
                });
              });
            }
          });
          found = allLessons.find(l => l.id === id);
          if (found && isMounted) {
            setLesson(found);
          }
        }
      } catch (e) {
        console.error("Error during background lesson lookup:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onComplete = async (lessonId) => {
    let key = 'completed_lessons';
    let email = '';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.email) {
            key = `completed_lessons_${user.email}`;
            email = user.email;
          }
        } catch (e) {}
      }
    }
    const updated = { ...completed, [lessonId]: true };
    setCompleted(updated);
    localStorage.setItem(key, JSON.stringify(updated));

    if (email) {
      try {
        await saveProgressToRedis(email, updated);
      } catch (err) {
        console.error("Failed to sync completed lesson to Redis:", err);
      }
    }
  };

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={inlineStyles.s1}>
          <div style={inlineStyles.s2} />
          <div style={inlineStyles.s3}>Loading lesson...</div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={inlineStyles.s4}>
        <h2>Lesson not found</h2>
        <button onClick={() => router.push('/courses')}
          style={inlineStyles.s5}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <LessonPage
      lesson={lesson}
      completed={completed}
      onComplete={onComplete}
    />
  );
}
