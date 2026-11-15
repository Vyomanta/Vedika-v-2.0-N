'use client';
import * as featureStyleFunctions from '@/features/courses/styles/CoursePage.cdc9e805.styles.js';

import inlineStyles from '@/features/courses/styles/CoursePage.styles';


import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, Circle, Clock, Play, GraduationCap, ChevronRight, ChevronLeft, ArrowLeft, Users, Tag, BookOpen, Terminal, X, Award, Search, Grid, Layers
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { getCourseDetails } from '@/features/courses/domain/course-data';
import { getCourses, getCourseSyllabus } from '@/features/courses/api/client';
import { checkStudentEnrollment, enrollStudentInCourse, getStudentEnrollments } from '@/features/administration/api/collections';
import { saveProgressToRedis, getProgressFromRedis } from '@/features/progress/api/lms';
import { DEFAULT_COURSES } from '@/integrations/frappe/transport';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import dynamic from 'next/dynamic';
import PDFViewerModal from '@/components/PDFViewerModal';
import CourseEmotionsSlider from '@/components/CourseEmotionsSlider';
import PacmanPagination from '@/components/PacmanPagination';
import PracticePlaygroundModal from '@/components/PracticePlaygroundModal';
import { getSubjectArtwork } from '@/lib/artwork';
import { getMascotBridge } from '@/lib/mascotBridge';
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

const DECK_ROTATIONS = ['4deg', '-2deg', '-9deg', '7deg', '3deg', '-5deg', '6deg'];

const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
];

const CATEGORY_IMAGES = {
  'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Frontend': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Framework': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Programming': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Python Programming': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Data Structures & Algorithms': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Personal Development': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Artificial Intelligence': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600'
};

function CourseDeckWidget({
  mode = 'courses', // 'categories' | 'courses'
  items,
  activeDrilldownCategory,
  onSelectCategory,
  onBackToCategories,
  handleSelectCourse,
  handleEnrollFromCard,
  enrolledCourseIds = [],
  isMobile
}) {
  if (!items || items.length === 0) return null;

  if (mode === 'categories') {
    return (
      <div style={inlineStyles.s0}>
        {/* Category Carousel Title Pill */}
        <div style={featureStyleFunctions.s0({T})}>
          <span>📂 Course Categories</span>
          <span style={inlineStyles.s1}>•</span>
          <span>{items.length} {items.length === 1 ? 'Category' : 'Categories'} Available</span>
        </div>

        {/* 3D Geometric Looping Emotions Carousel for Categories */}
        <div style={inlineStyles.s2}>
          <CourseEmotionsSlider
            items={items}
            mode="categories"
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    );
  }

  // Course mode (when a category is selected or searching)
  return (
    <div style={inlineStyles.s3}>
      {/* Course Emotions 3D Geometric Interactive Slider */}
      <div style={inlineStyles.s4}>
        <CourseEmotionsSlider
          items={items}
          mode="courses"
          onSelectCourse={handleSelectCourse}
          onEnrollFromCard={handleEnrollFromCard}
          enrolledCourseIds={enrolledCourseIds}
        />
      </div>
    </div>
  );
}

export default function CoursePage() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTabletOrSmallDesktop = useMediaQuery('(max-width: 1150px)');
  const rPad = isMobile ? 16 : 36;
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const outerStyle = { padding: isMobile ? '20px 16px' : '32px 36px', fontFamily: 'var(--font-outfit), sans-serif' };

  // Instant synchronous course hydration (0ms load time)
  const [courses, setCourses] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('admin_courses_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let locallyDeleted = [];
            try { locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String); } catch (_) {}
            return parsed.filter(c => c && !locallyDeleted.includes(String(c.id)));
          }
        }
      } catch (_) {}
    }
    return DEFAULT_COURSES;
  });
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [completed, setCompleted] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  // Category, Search, Carousel & Modal States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeDrilldownCategory, setActiveDrilldownCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('deck'); // 'deck' or 'grid'
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedPdfResource, setSelectedPdfResource] = useState(null);
  const carouselRef = useRef(null);
  const categoriesContainerRef = useRef(null);

  // Group published courses into category cards for the initial Category Carousel
  const categoryDeckItems = useMemo(() => {
    const map = new Map();
    courses.forEach((c) => {
      if (!c) return;
      let locallyDeleted = [];
      try { locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String); } catch (e) { }
      if (locallyDeleted.includes(String(c.id))) return;

      const cat = (c.category || 'General').trim();
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat).push(c);
    });

    const list = [];
    let idx = 0;
    map.forEach((catCourses, catName) => {
      const totalLessons = catCourses.reduce((sum, c) => sum + ((c && (c.lessonsCount || (c.lessons ? c.lessons.length : 0))) || 0), 0);
      const instructors = new Set(catCourses.map(c => c?.instructor).filter(Boolean));
      const thumb = catCourses.find(c => c?.image)?.image || getSubjectArtwork(catName);

      list.push({
        id: `cat-${catName}`,
        title: catName,
        category: 'Category',
        badge: `${catCourses.length} ${catCourses.length === 1 ? 'Course' : 'Courses'}`,
        thumbnail: thumb,
        courses: catCourses,
        totalLessons,
        instructorsCount: instructors.size,
        tagline: `Explore ${catCourses.length} ${catCourses.length === 1 ? 'specialized course' : 'specialized courses'} in ${catName} with comprehensive modules and hands-on practice.`
      });
      idx++;
    });
    return list;
  }, [courses]);

  // Dynamic unique categories list for pill navigation
  const allCategories = useMemo(() => {
    const set = new Set();
    courses.forEach(c => {
      if (!c) return;
      let locallyDeleted = [];
      try { locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String); } catch (e) { }
      if (locallyDeleted.includes(String(c.id))) return;
      if (c.category) set.add(String(c.category).trim());
    });
    return ['All', ...Array.from(set)];
  }, [courses]);

  const handleScrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const [canScrollCategories, setCanScrollCategories] = useState(false);

  const checkCategoriesScroll = useCallback(() => {
    if (categoriesContainerRef.current) {
      const { scrollWidth, clientWidth } = categoriesContainerRef.current;
      setCanScrollCategories(scrollWidth > clientWidth + 4);
    }
  }, []);

  useEffect(() => {
    checkCategoriesScroll();
    window.addEventListener('resize', checkCategoriesScroll);
    return () => window.removeEventListener('resize', checkCategoriesScroll);
  }, [allCategories, checkCategoriesScroll]);

  const handleScrollCategories = (dir) => {
    if (!categoriesContainerRef.current) return;
    categoriesContainerRef.current.scrollBy({
      left: dir === 'left' ? -260 : 260,
      behavior: 'smooth'
    });
  };

  const handleCategorySelection = useCallback((catName) => {
    if (!catName) return;
    const target = catName.trim().toLowerCase();
    let matched = allCategories.find(c => c.toLowerCase() === target);
    if (!matched) {
      matched = allCategories.find(c => c.toLowerCase().includes(target) || target.includes(c.toLowerCase()));
    }
    const finalCat = matched || catName;
    setSelectedCourse(null);
    setSelectedCategory(finalCat);
    setActiveDrilldownCategory(finalCat);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ inCategory: true, category: finalCat }, '', `/courses?category=${encodeURIComponent(finalCat)}`);
      } catch (_) {}
      setTimeout(() => {
        const el = document.getElementById('courses-section') || document.getElementById('all-courses-grid') || categoriesContainerRef.current;
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [allCategories]);

  // Sync category & course from URL query params and Desktop Mascot bridge commands
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseParams = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        handleCategorySelection(cat);
      }
      const courseId = params.get('course') || params.get('courseId');
      if (courseId) {
        const targetCourse = courses.find(c => String(c.id) === String(courseId) || String(c.name) === String(courseId));
        if (targetCourse) handleSelectCourse(targetCourse);
      }
    };

    parseParams();

    const handleCustomCatEvent = (e) => {
      const cat = e?.detail?.category;
      if (cat) handleCategorySelection(cat);
    };
    window.addEventListener('change_course_category', handleCustomCatEvent);

    const handleSelectCourseById = (e) => {
      const cId = e?.detail?.courseId;
      if (!cId) return;
      const targetCourse = courses.find(c =>
        String(c.id).toLowerCase() === String(cId).toLowerCase() ||
        String(c.name).toLowerCase() === String(cId).toLowerCase() ||
        (c.title && c.title.toLowerCase().includes(String(cId).toLowerCase()))
      );
      if (targetCourse) handleSelectCourse(targetCourse);
    };
    window.addEventListener('select_course_by_id', handleSelectCourseById);

    let unsubBridge = () => {};
    try {
      const bridge = getMascotBridge();
      unsubBridge = bridge.onAction((action, target) => {
        if (action === 'select_category' || action === 'filter_category') {
          if (target) handleCategorySelection(target);
        } else if (action === 'select_course' || action === 'open_course') {
          if (target) {
            const found = courses.find(c =>
              String(c.id).toLowerCase() === target.toLowerCase() ||
              (c.title && c.title.toLowerCase().includes(target.toLowerCase()))
            );
            if (found) handleSelectCourse(found);
          }
        }
      });
    } catch (_) {}

    return () => {
      window.removeEventListener('change_course_category', handleCustomCatEvent);
      window.removeEventListener('select_course_by_id', handleSelectCourseById);
      unsubBridge();
    };
  }, [handleCategorySelection, courses]);

  // Fetch courses and load completion progress
  useEffect(() => {
    let email = '';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.email) {
            email = user.email;
            setUserEmail(user.email);
          }
        } catch (e) { }
      }
    }

    async function loadData() {
      try {
        const [list, enrollments] = await Promise.all([
          getCourses(),
          email ? getStudentEnrollments(email) : Promise.resolve([])
        ]);
        let locallyDeleted = [];
        try {
          locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String);
        } catch (e) {}

        // Students see Published courses and newly created local courses
        const isCourseVisible = (c) => {
          if (!c) return false;
          if (locallyDeleted.includes(String(c.id))) return false;
          if (c.status === 'Published' || c.status === 'published' || !c.status) return true;
          if (/^\d{10,}$/.test(String(c.id)) || String(c.id).startsWith('local_') || String(c.id).startsWith('course_') || String(c.id).startsWith('ch_')) return true;
          return false;
        };
        const published = list.filter(isCourseVisible);
        setCourses(published);
        setEnrolledCourseIds(enrollments || []);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Listen for reset courses view event (e.g. from navbar clicks)
    const handleResetCoursesView = () => {
      setSelectedCourse(null);
      setActiveDrilldownCategory(null);
      setSelectedCategory('All');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selected_course_id');
      }
    };
    window.addEventListener('reset_courses_view', handleResetCoursesView);

    // Browser back/forward navigation support
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const cId = params.get('course') || params.get('courseId');
      const cat = params.get('category');
      if (cId) {
        const targetCourse = courses.find(c => String(c.id) === String(cId) || String(c.name) === String(cId));
        if (targetCourse) {
          handleSelectCourse(targetCourse);
          return;
        }
      }
      setSelectedCourse(null);
      if (cat) {
        setActiveDrilldownCategory(cat);
        setSelectedCategory(cat);
      } else {
        setActiveDrilldownCategory(null);
        setSelectedCategory('All');
      }
      localStorage.removeItem('selected_course_id');
    };
    window.addEventListener('popstate', handlePopState);

    // Step-by-step back navigation event (from mascot NAVIGATE_BACK or custom back triggers)
    const handleStepwiseBack = () => {
      if (selectedCourse) {
        setSelectedCourse(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('selected_course_id');
          const catParam = activeDrilldownCategory ? `?category=${encodeURIComponent(activeDrilldownCategory)}` : '';
          window.history.pushState({}, '', `/courses${catParam}`);
        }
      } else if (activeDrilldownCategory) {
        setActiveDrilldownCategory(null);
        setSelectedCategory('All');
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/courses');
        }
      } else {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          window.history.back();
        }
      }
    };
    window.addEventListener('courses_navigate_back_step', handleStepwiseBack);

    // Listen for cross-tab or cross-component course updates
    const handleCoursesUpdated = () => {
      loadData();
    };
    window.addEventListener('courses_updated', handleCoursesUpdated);
    window.addEventListener('storage', handleCoursesUpdated);
    window.addEventListener('focus', handleCoursesUpdated);

    let key = 'completed_lessons';
    if (email) {
      key = `completed_lessons_${email}`;
    }
    const savedCompleted = localStorage.getItem(key);
    let localCompleted = {};
    if (savedCompleted) {
      try {
        localCompleted = JSON.parse(savedCompleted);
        setCompleted(localCompleted);
      } catch (e) { }
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

    return () => {
      window.removeEventListener('reset_courses_view', handleResetCoursesView);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('courses_navigate_back_step', handleStepwiseBack);
      window.removeEventListener('courses_updated', handleCoursesUpdated);
      window.removeEventListener('storage', handleCoursesUpdated);
      window.removeEventListener('focus', handleCoursesUpdated);
    };
  }, []);

  async function handleSelectCourse(course) {
    setSelectedCourse(course);
    if (typeof window !== 'undefined' && course) {
      localStorage.setItem('selected_course_id', course.id);
      try {
        window.history.pushState({ inCourse: true, courseId: course.id }, '', `/courses?course=${encodeURIComponent(course.id)}`);
      } catch (e) {}
    }

    // Instant local syllabus population (0ms delay)
    const instantDetails = getCourseDetails(course);
    if (instantDetails) {
      setCourseDetails(instantDetails);
    } else {
      setDetailsLoading(true);
    }

    try {
      // Retrieve stored user email directly in case it changed
      let email = userEmail;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('frappe_user');
        if (stored) {
          try {
            const user = JSON.parse(stored);
            if (user && user.email) {
              email = user.email;
              setUserEmail(user.email);
            }
          } catch (e) { }
        }
      }

      const enrolledStatus = enrolledCourseIds.includes(course.id) || await checkStudentEnrollment(course.id, email);
      setIsEnrolled(enrolledStatus);

      const details = await getCourseSyllabus(course.id);
      if (details) {
        setCourseDetails(details);
      }
    } catch (e) {
      console.error("Failed to load course details", e);
    } finally {
      setDetailsLoading(false);
    }
  }

  const handleEnroll = async () => {
    if (!selectedCourse || !userEmail) return;
    setIsEnrolling(true);
    try {
      await enrollStudentInCourse(selectedCourse.id, userEmail);
      setIsEnrolled(true);
      // Refresh enrollments list
      const enrollments = await getStudentEnrollments(userEmail);
      setEnrolledCourseIds(enrollments || []);
    } catch (e) {
      console.error("Failed to enroll student", e);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleEnrollFromCard = async (courseId, e) => {
    e.stopPropagation(); // Prevent opening the outline page
    if (!userEmail) return;
    try {
      await enrollStudentInCourse(courseId, userEmail);
      // Refresh enrollments list
      const enrollments = await getStudentEnrollments(userEmail);
      setEnrolledCourseIds(enrollments || []);
    } catch (err) {
      console.error("Failed to enroll student from card", err);
    }
  };

  if (loading) {
    return (
      <div style={inlineStyles.s5}>
        <div style={inlineStyles.s6}>
          <div style={inlineStyles.s7} />
          <div style={inlineStyles.s8}>Loading courses...</div>
        </div>
      </div>
    );
  }

  if (detailsLoading) {
    return (
      <div style={inlineStyles.s9}>
        <div style={inlineStyles.s10}>
          <div style={inlineStyles.s11} />
          <div style={inlineStyles.s12}>Loading course syllabus...</div>
        </div>
      </div>
    );
  }

  // Render course outline if a specific course is selected
  if (selectedCourse && courseDetails) {
    const details = courseDetails;
    const modules = details.modules || [];

    // Compile all lessons in this course
    const courseLessons = modules.flatMap(m => ((m && m.lessons) ? m.lessons : []).map(l => ({ ...l, module: m })));
    const total = courseLessons.length;
    const done = courseLessons.filter(l => completed[l.id]).length;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
      <div
        className="no-scrollbar"
        style={featureStyleFunctions.s1({isMobile,T})}
      >
        <div style={featureStyleFunctions.s2({isMobile})} className="no-scrollbar">
          <div style={inlineStyles.s13}>
            {/* Back button */}
            <button
              onClick={() => {
                setSelectedCourse(null);
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('selected_course_id');
                  const catParam = activeDrilldownCategory ? `?category=${encodeURIComponent(activeDrilldownCategory)}` : '';
                  window.history.pushState({}, '', `/courses${catParam}`);
                }
              }}
              style={featureStyleFunctions.s3({T})}
              onMouseEnter={(e) => e.currentTarget.style.color = T.text}
              onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
            >
              <ArrowLeft size={15} /> Back to Courses
            </button>

            <button
              data-practice-trigger="true"
              onClick={(e) => {
                if (typeof window !== 'undefined') {
                  const r = e.currentTarget.getBoundingClientRect();
                  window.__lastPracticeTriggerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
                }
                setIsPlaygroundOpen(!isPlaygroundOpen);
              }}
              style={featureStyleFunctions.s4({isPlaygroundOpen,T})}
            >
              <Terminal size={14} />
              {isPlaygroundOpen ? 'Close Playground' : 'Practice Playground'}
            </button>
          </div>

          {/* Course Detail Header */}
          <div style={inlineStyles.s14}>
            <div style={inlineStyles.s15}>
              <span style={featureStyleFunctions.s5({T})}>
                {selectedCourse.category}
              </span>
              <span style={featureStyleFunctions.s6({T})}>
                By {selectedCourse.instructor}
              </span>
            </div>

            <h2 style={featureStyleFunctions.s7({T})}>
              {details.title}
            </h2>

            <p style={featureStyleFunctions.s8({T})}>
              {details.tagline}
            </p>

            {selectedCourse.pdf && (
              <div style={inlineStyles.s16}>
                <button
                  onClick={() => {
                    setSelectedPdfResource({ file_link: selectedCourse.pdf, name: `${selectedCourse.title} Reference Materials` });
                    setIsPdfViewerOpen(true);
                  }}
                  style={featureStyleFunctions.s9({T})}
                >
                  📄 View Course PDF Materials
                </button>
              </div>
            )}
          </div>

          {/* Enrollment CTA Card or Outline List */}
          {!isEnrolled ? (
            <div style={featureStyleFunctions.s10({T})}>
              <div style={featureStyleFunctions.s11({T})}>
                <GraduationCap size={30} color="#fff" />
              </div>
              <h3 style={featureStyleFunctions.s12({T})}>Enroll in Course</h3>
              <p style={featureStyleFunctions.s13({T})}>
                Enroll now to gain complete access to modules, lesson transcripts, hands-on assignments, and start learning with your personalized AI tutor!
              </p>
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                style={featureStyleFunctions.s14({isEnrolling,T})}
              >
                {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </div>
          ) : (
            <div>
              {progressPercent === 100 && (
                <div style={featureStyleFunctions.s15({T})}>
                  <div style={inlineStyles.s17}>🏆</div>
                  <h3 style={featureStyleFunctions.s16({T})}>Congratulations! You completed the course!</h3>
                  <p style={featureStyleFunctions.s17({T})}>
                    You have successfully completed all lessons in this course. You can now view and download your verified completion certificate!
                  </p>
                  <button
                    onClick={() => setIsCertModalOpen(true)}
                    style={featureStyleFunctions.s18({T})}
                  >
                    View Completion Certificate
                  </button>
                </div>
              )}

              <div style={inlineStyles.s18}>
                <div style={featureStyleFunctions.s19({T})}>
                  <span>Progress: {done}/{total} lessons completed</span>
                  <span style={featureStyleFunctions.s20({T})}>{progressPercent}% Complete</span>
                </div>

                <div style={featureStyleFunctions.s21({T})}>
                  <div style={featureStyleFunctions.s22({T,progressPercent})} />
                </div>
              </div>

              {/* Modules list */}
              <div style={inlineStyles.s19}>
                {modules.map((mod, mi) => {
                  const modDone = mod.lessons.filter(l => completed[l.id]).length;
                  return (
                    <div key={mod.id} style={featureStyleFunctions.s23({T})}>
                      {/* Module header */}
                      <div style={featureStyleFunctions.s24({T})}>
                        <div style={inlineStyles.s20}>
                          <div style={featureStyleFunctions.s25({mod,T})}>{mod.emoji}</div>
                          <div>
                            <div style={featureStyleFunctions.s26({T})}>{mi + 1}. {mod.title}</div>
                            <div style={featureStyleFunctions.s27({T})}>{mod.lessons.length} lessons · {modDone} completed</div>
                          </div>
                        </div>
                        {/* Circular progress */}
                        <div style={inlineStyles.s21}>
                          <svg width="36" height="36" style={inlineStyles.s22}>
                            <circle cx="18" cy="18" r="14" fill="none" stroke={T.s3} strokeWidth="3" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke={mod.accent || T.accent} strokeWidth="3"
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${2 * Math.PI * 14 * (1 - (mod.lessons.length > 0 ? modDone / mod.lessons.length : 0))}`}
                              strokeLinecap="round" />
                          </svg>
                          <span style={featureStyleFunctions.s28({mod,T})}>
                            {mod.lessons.length > 0 ? Math.round((modDone / mod.lessons.length) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      {/* Lessons */}
                      <div>
                        {mod.lessons.map((lesson, li) => (
                          <a
                            key={lesson.id}
                            href={`/lesson/${lesson.id}`}
                            style={featureStyleFunctions.s29({li,mod,T})}
                            onMouseEnter={e => e.currentTarget.style.background = T.s2}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={inlineStyles.s23}>
                              {completed[lesson.id]
                                ? <CheckCircle size={16} color={T.green} />
                                : <Circle size={16} color={T.dim} />}
                              <div>
                                <div style={featureStyleFunctions.s30({T})}>{lesson.title}</div>
                                <div style={featureStyleFunctions.s31({T})}>
                                  <Clock size={11} />{lesson.dur}
                                </div>
                              </div>
                            </div>
                            <div style={inlineStyles.s24}>
                              {completed[lesson.id] && (
                                <span style={featureStyleFunctions.s32({T})}>Done</span>
                              )}
                              <Play size={14} color={T.muted} />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <PracticePlaygroundModal
            isOpen={isPlaygroundOpen}
            onClose={() => setIsPlaygroundOpen(false)}
            title={`Practice: ${selectedCourse.title}`}
            badge={selectedCourse.category || 'Python'}
            initialCode={`# Practice for: ${selectedCourse.title}\n# Write your code here\n\n`}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={featureStyleFunctions.s33({isMobile,T})}>
      <div style={featureStyleFunctions.s34({isMobile})} className="no-scrollbar">
        {/* Compact Top Action Toolbar: Back, Search & Practice Playground */}
        <div style={inlineStyles.s25}>
          <div style={featureStyleFunctions.s35({isMobile})}>
            <button
              type="button"
              onClick={() => {
                if (activeDrilldownCategory) {
                  setActiveDrilldownCategory(null);
                  setSelectedCategory('All');
                  if (typeof window !== 'undefined') window.history.pushState({}, '', '/courses');
                } else {
                  router.push('/');
                }
              }}
              style={featureStyleFunctions.s36({T})}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
              title={activeDrilldownCategory ? "Back to all categories" : "Back to Dashboard"}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

          {/* Real-Time Course Search Bar */}
          <div style={featureStyleFunctions.s37({isMobile})}>
            <Search size={15} style={featureStyleFunctions.s38({T})} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, instructors, tags..."
              style={featureStyleFunctions.s39({T})}
              onFocus={(e) => e.target.style.borderColor = T.accent}
              onBlur={(e) => e.target.style.borderColor = T.border}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={featureStyleFunctions.s40({T})}
              >
                <X size={13} />
              </button>
            )}
          </div>
          </div>

          {/* Practice Playground Launch Button */}
          <button
            data-practice-trigger="true"
            onClick={(e) => {
              if (typeof window !== 'undefined') {
                const r = e.currentTarget.getBoundingClientRect();
                window.__lastPracticeTriggerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
              }
              setIsPlaygroundOpen(!isPlaygroundOpen);
            }}
            style={featureStyleFunctions.s41({isPlaygroundOpen,T,isMobile})}
          >
            <Terminal size={13} />
            {isPlaygroundOpen ? 'Close Playground' : 'Practice Playground'}
          </button>
        </div>

        {/* 100% Width Category Pills Carousel */}
        <div style={inlineStyles.s26}>
          {activeDrilldownCategory && (
            <button
              type="button"
              onClick={() => {
                setActiveDrilldownCategory(null);
                setSelectedCategory('All');
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/courses');
                }
              }}
              style={featureStyleFunctions.s42({T})}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${T.accent}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.s2; }}
              title="Back to all categories"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {canScrollCategories && (
            <button
              onClick={() => handleScrollCategories('left')}
              style={featureStyleFunctions.s43({T})}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
            >
              <ChevronLeft size={16} />
            </button>
          )}

          <div
            ref={categoriesContainerRef}
            style={inlineStyles.s27}
            className="no-scrollbar"
          >
            {allCategories.map(cat => {
              const isSelected = (!activeDrilldownCategory && selectedCategory === cat) || (activeDrilldownCategory === cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat === 'All') {
                      setActiveDrilldownCategory(null);
                    } else {
                      setActiveDrilldownCategory(cat);
                    }
                  }}
                  style={featureStyleFunctions.s44({isSelected,T})}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {canScrollCategories && (
            <button
              onClick={() => handleScrollCategories('right')}
              style={featureStyleFunctions.s45({T})}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Dynamic Category / Course Carousel Drilldown Presentation */}
        {(() => {
          // If searching: show filtered courses directly matching search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const searchResults = courses.filter(c => {
              let locallyDeleted = [];
              try { locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String); } catch (e) { }
              if (locallyDeleted.includes(String(c.id))) return false;

              return (
                c.title?.toLowerCase().includes(q) ||
                c.category?.toLowerCase().includes(q) ||
                c.instructor?.toLowerCase().includes(q) ||
                c.tagline?.toLowerCase().includes(q)
              );
            });

            if (searchResults.length === 0) {
              return (
                <div style={featureStyleFunctions.s46({T})}>
                  <div style={inlineStyles.s28}>🔍</div>
                  <h3 style={featureStyleFunctions.s47({T})}>No matching courses found</h3>
                  <p style={featureStyleFunctions.s48({T})}>
                    No courses match "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    style={featureStyleFunctions.s49({T})}
                  >
                    Clear Search
                  </button>
                </div>
              );
            }

            return (
              <div>
                <CourseDeckWidget
                  mode="courses"
                  items={searchResults}
                  handleSelectCourse={handleSelectCourse}
                  handleEnrollFromCard={handleEnrollFromCard}
                  enrolledCourseIds={enrolledCourseIds}
                  isMobile={isMobile}
                />
              </div>
            );
          }

          // If student has selected a specific category: show that category's courses carousel with breadcrumbs
          if (activeDrilldownCategory) {
            const categoryCourses = courses.filter(c => {
              if (!c) return false;
              let locallyDeleted = [];
              try { locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]').map(String); } catch (e) { }
              if (locallyDeleted.includes(String(c.id))) return false;

              return (c.category || 'General').trim().toLowerCase() === (activeDrilldownCategory || '').trim().toLowerCase();
            });

            if (categoryCourses.length === 0) {
              return (
                <div style={featureStyleFunctions.s50({T})}>
                  <div style={inlineStyles.s29}>📁</div>
                  <h3 style={featureStyleFunctions.s51({T})}>No courses in {activeDrilldownCategory} yet</h3>
                  <p style={featureStyleFunctions.s52({T})}>
                    No published courses are currently assigned to this category.
                  </p>
                  <button
                    onClick={() => { setActiveDrilldownCategory(null); setSelectedCategory('All'); }}
                    style={featureStyleFunctions.s53({T})}
                  >
                    ← Back to All Courses
                  </button>
                </div>
              );
            }

            return (
              <div>
                <CourseDeckWidget
                  mode="courses"
                  items={categoryCourses}
                  activeDrilldownCategory={activeDrilldownCategory}
                  onBackToCategories={() => {
                    setActiveDrilldownCategory(null);
                    setSelectedCategory('All');
                  }}
                  handleSelectCourse={handleSelectCourse}
                  handleEnrollFromCard={handleEnrollFromCard}
                  enrolledCourseIds={enrolledCourseIds}
                  isMobile={isMobile}
                />
              </div>
            );
          }

          // Initial Landing: Show Category Carousel (grouped categories with CourseEmotionsSlider)
          if (categoryDeckItems.length === 0) {
            return (
              <div style={featureStyleFunctions.s54({T})}>
                <div style={inlineStyles.s30}>📚</div>
                <h3 style={featureStyleFunctions.s55({T})}>No categories available</h3>
                <p style={featureStyleFunctions.s56({T})}>
                  There are currently no published courses or categories to display.
                </p>
              </div>
            );
          }

          return (
            <div>
              <CourseDeckWidget
                mode="categories"
                items={categoryDeckItems}
                onSelectCategory={(catName) => {
                  setActiveDrilldownCategory(catName);
                  setSelectedCategory(catName);
                }}
                handleSelectCourse={handleSelectCourse}
                handleEnrollFromCard={handleEnrollFromCard}
                enrolledCourseIds={enrolledCourseIds}
                isMobile={isMobile}
              />
            </div>
          );
        })()}
        <PracticePlaygroundModal
          isOpen={isPlaygroundOpen}
          onClose={() => setIsPlaygroundOpen(false)}
          title="Python Practice Playground"
          badge="Interactive Sandbox"
          initialCode={`# General Coding Playground\n# Write your code here\n\n`}
        />
      </div>

      {/* Course Completion Certificate Modal */}
      {isCertModalOpen && (
        <div style={inlineStyles.s31}>
          <div style={inlineStyles.s32}>
            {/* Close Button */}
            <button
              onClick={() => setIsCertModalOpen(false)}
              style={inlineStyles.s33}
            >
              <X size={20} />
            </button>

            {/* Certificate Content */}
            <div style={inlineStyles.s34}>
              <div style={inlineStyles.s35}>
                Certificate of Completion
              </div>
              <div style={inlineStyles.s36}>
                This is proudly presented to
              </div>
              <div style={inlineStyles.s37}>
                {userEmail ? (userEmail.split('@')[0].replace(/\d+/g, '').replace(/[\._]/g, ' ').toUpperCase()) : 'AARAV MEHTA'}
              </div>
              <div style={inlineStyles.s38}>
                for successfully fulfilling all requirements and completing the certified curriculum for the course
                <div style={inlineStyles.s39}>
                  {selectedCourse?.title}
                </div>
              </div>

              {/* Signatures & Date */}
              <div style={inlineStyles.s40}>
                <div style={inlineStyles.s41}>
                  <div style={inlineStyles.s42}>AI Tutor Academy</div>
                  <div style={inlineStyles.s43}>Authorized Entity</div>
                </div>
                <div style={inlineStyles.s44}>
                  Issued on: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={inlineStyles.s45}>
                  <div style={inlineStyles.s46}>Seshu Yashu</div>
                  <div style={inlineStyles.s47}>Lead Instructor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => { setIsPdfViewerOpen(false); setSelectedPdfResource(null); }}
        pdfResource={selectedPdfResource}
      />

    </div>
  );
}
