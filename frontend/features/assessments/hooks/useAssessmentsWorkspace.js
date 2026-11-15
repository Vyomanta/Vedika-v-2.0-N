'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award, FileText, Clock, CheckCircle, X, ChevronRight, HelpCircle,
  ArrowLeft, Search, Send, AlertCircle, Filter, Sparkles, BookOpen, Check,
  Edit2, RotateCcw
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getQuizzes, getQuizSubmissions, submitQuizResponse, getAssignments, getAssignmentSubmissions, submitAssignmentResponse } from '@/features/assessments/api/client';
import { getCourses } from '@/features/courses/api/client';
import { parseQuestionsList, DEFAULT_QUIZZES, DEFAULT_ASSIGNMENTS } from '@/features/assessments/domain/legacy-formats';
import { DEFAULT_COURSES } from '@/integrations/frappe/transport';
import { getSubjectArtwork } from '@/lib/artwork';
import CategoryShowcaseCarousel from '@/components/CategoryShowcaseCarousel';
import PacmanPagination from '@/components/PacmanPagination';
import VedikaParticleBot from '@/components/VedikaParticleBot';
import ReactMarkdown from 'react-markdown';
import {useQuizWorkspace} from '@/features/assessments/quizzes/hooks/useQuizWorkspace';
import {useAssignmentWorkspace} from '@/features/assessments/assignments/hooks/useAssignmentWorkspace';

export function useAssessmentsWorkspace(initialMode) {
const router = useRouter();

const isMobile = useMediaQuery(isMobileMQ);

const [activeTab, setActiveTab] = useState(initialMode);

const [currentUser, setCurrentUser] = useState(null);

const [courses, setCourses] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('admin_courses_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_COURSES;
  });

const [loading, setLoading] = useState(false);

const [loadError, setLoadError] = useState('');

useEffect(() => {
    const stored = localStorage.getItem('frappe_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setLoadError('');
      const update = setter => data => { if (isMounted && Array.isArray(data)) setter(data); };
      // Course metadata can have a separate backend latency; it must not block assessments.
      getCourses().then(update(setCourses)).catch(error => console.warn('Course metadata unavailable:', error.message));
      const results = await Promise.allSettled([
        getQuizzes().then(update(setQuizzes)),
        getAssignments().then(update(setAssignments)),
        getQuizSubmissions().then(update(setQuizSubmissions)),
        getAssignmentSubmissions().then(update(setAssignmentSubmissions)),
      ]);
      if (isMounted) {
        const failed = results.find(result => result.status === 'rejected');
        if (failed) setLoadError(failed.reason.message || 'Some assessments could not be loaded. Please retry.');
        setLoading(false);
      }
    }
    loadData();

    // Live update listeners
    const handleQuizzesUpdated = () => getQuizzes().then(q => { if (isMounted && q) setQuizzes(q); }).catch(error => { if (isMounted) setLoadError(error.message); });
    const handleAssignmentsUpdated = () => getAssignments().then(a => { if (isMounted && a) setAssignments(a); }).catch(error => { if (isMounted) setLoadError(error.message); });
    const handleCoursesUpdated = () => getCourses().then(c => { if (isMounted && c) setCourses(c); }).catch(error => console.warn(error.message));
    const handleSubmissionsUpdated = () => {
      getQuizSubmissions().then(qs => { if (isMounted && qs) setQuizSubmissions(qs); }).catch(error => { if (isMounted) setLoadError(error.message); });
      getAssignmentSubmissions().then(as => { if (isMounted && as) setAssignmentSubmissions(as); }).catch(error => { if (isMounted) setLoadError(error.message); });
    };

    window.addEventListener('quizzes_updated', handleQuizzesUpdated);
    window.addEventListener('assignments_updated', handleAssignmentsUpdated);
    window.addEventListener('courses_updated', handleCoursesUpdated);
    window.addEventListener('submissions_updated', handleSubmissionsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('quizzes_updated', handleQuizzesUpdated);
      window.removeEventListener('assignments_updated', handleAssignmentsUpdated);
      window.removeEventListener('courses_updated', handleCoursesUpdated);
      window.removeEventListener('submissions_updated', handleSubmissionsUpdated);
    };
  }, [currentUser]);

const getCourseName = useCallback((courseId) => {
    return courses.find((c) => String(c.id) === String(courseId))?.title || 'Course Topic';
  }, [courses]);

const getItemCategory = useCallback((item) => {
    if (item.category) return item.category;
    const match = courses.find((c) => String(c.id) === String(item.course));
    return match?.category || 'General';
  }, [courses]);

const handleStartAttempt = (quiz) => {
    setQuizAttemptId(crypto.randomUUID());
    setSelectedQuiz(quiz);
    setQuizAnswers(new Array(quiz.questions?.length || 0).fill(null));
    setCurrentQuizQIdx(0);
    setQuizScore(null);
    setIsAttemptingQuiz(true);
  };
const {quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,quizAttemptId,setQuizAttemptId,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleSelectQuizOption,handleQuizSubmit}=useQuizWorkspace({router,isMobile,activeTab,setActiveTab,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,loadError,setLoadError,getCourseName,getItemCategory,handleStartAttempt});
const {isAssignmentsOpen,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit}=useAssignmentWorkspace({router,isMobile,activeTab,setActiveTab,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,loadError,setLoadError,getCourseName,getItemCategory,handleStartAttempt});
return {router,isMobile,activeTab,setActiveTab,isAssignmentsOpen,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,loadError,setLoadError,quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,quizAttemptId,setQuizAttemptId,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getCourseName,getItemCategory,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleStartAttempt,handleSelectQuizOption,handleQuizSubmit,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit};
}
