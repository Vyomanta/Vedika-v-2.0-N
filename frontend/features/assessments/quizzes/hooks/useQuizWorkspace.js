'use client';
import { useState, useEffect, useMemo } from 'react';
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
export function useQuizWorkspace({router,isMobile,activeTab,setActiveTab,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,loadError,setLoadError,getCourseName,getItemCategory,handleStartAttempt}) {
const [quizzes, setQuizzes] = useState([]);

const [quizSubmissions, setQuizSubmissions] = useState([]);

const [selectedQuizCategory, setSelectedQuizCategory] = useState(null);

const [quizSearch, setQuizSearch] = useState('');

const [quizPage, setQuizPage] = useState(1);

const QUIZ_ITEMS_PER_PAGE = 3;

const [quizAttemptId, setQuizAttemptId] = useState(null);

const [selectedQuiz, setSelectedQuiz] = useState(null);

const [isAttemptingQuiz, setIsAttemptingQuiz] = useState(false);

const [currentQuizQIdx, setCurrentQuizQIdx] = useState(0);

const [quizAnswers, setQuizAnswers] = useState([]);

const [submittingQuiz, setSubmittingQuiz] = useState(false);

const [quizScore, setQuizScore] = useState(null);

useEffect(() => {
    setQuizPage(1);
  }, [selectedQuizCategory, quizSearch]);

const getQuizStatus = (quizId) => {
    if (!currentUser) return { status: 'Not Attempted', percentage: null };
    const attempts = quizSubmissions.filter(
      (s) => s.quiz === quizId && (s.member === currentUser.username || s.member === currentUser.email)
    );
    if (attempts.length === 0) return { status: 'Not Attempted', percentage: null };
    const passed = attempts.some((a) => a.percentage >= (a.passing_percentage || 70));
    const highestAttempt = [...attempts].sort((a, b) => b.percentage - a.percentage)[0];
    return {
      status: passed ? 'Passed' : 'Failed',
      percentage: highestAttempt.percentage,
      score: highestAttempt.score,
      total: highestAttempt.score_out_of
    };
  };

const quizCategoryShowcaseItems = useMemo(() => {
    const map = new Map();
    quizzes.forEach((q) => {
      const cat = getItemCategory(q);
      if (!map.has(cat)) map.set(cat, { quizzes: [], courseIds: new Set() });
      const entry = map.get(cat);
      entry.quizzes.push(q);
      if (q.course) entry.courseIds.add(String(q.course));
    });
    return Array.from(map.entries()).map(([cat, val]) => ({
      category: cat,
      count: val.quizzes.length,
      coursesCount: val.courseIds.size,
      artwork: getSubjectArtwork(cat),
      quizzes: val.quizzes
    }));
  }, [quizzes, courses, getItemCategory]);

const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const cat = getItemCategory(q);
      if (selectedQuizCategory && cat.toLowerCase() !== selectedQuizCategory.toLowerCase()) {
        return false;
      }
      if (quizSearch.trim()) {
        const query = quizSearch.toLowerCase().trim();
        const titleMatch = q.title?.toLowerCase().includes(query);
        const courseMatch = getCourseName(q.course)?.toLowerCase().includes(query);
        const catMatch = cat.toLowerCase().includes(query);
        if (!titleMatch && !courseMatch && !catMatch) return false;
      }
      return true;
    });
  }, [quizzes, selectedQuizCategory, quizSearch, courses, getCourseName, getItemCategory]);

const totalQuizPages = Math.max(1, Math.ceil(filteredQuizzes.length / QUIZ_ITEMS_PER_PAGE));

const paginatedQuizzes = filteredQuizzes.slice(
    (quizPage - 1) * QUIZ_ITEMS_PER_PAGE,
    quizPage * QUIZ_ITEMS_PER_PAGE
  );

const handleSelectQuizOption = (oIdx) => {
    const updated = [...quizAnswers];
    updated[currentQuizQIdx] = oIdx;
    setQuizAnswers(updated);
  };

const handleQuizSubmit = async () => {
    if (!selectedQuiz || !currentUser) return;
    setSubmittingQuiz(true);
    try {
      const result = await submitQuizResponse({ quiz: selectedQuiz.id, answers: quizAnswers, request_id: quizAttemptId });
      setQuizScore({ score: result.score, total: result.score_out_of, percentage: result.percentage, passed: result.passed });
      const freshSubs = await getQuizSubmissions();
      setQuizSubmissions(freshSubs || []);
    } catch (e) {
      console.error(e);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmittingQuiz(false);
    }
  };
return {quizzes,setQuizzes,quizSubmissions,setQuizSubmissions,selectedQuizCategory,setSelectedQuizCategory,quizSearch,setQuizSearch,quizPage,setQuizPage,QUIZ_ITEMS_PER_PAGE,quizAttemptId,setQuizAttemptId,selectedQuiz,setSelectedQuiz,isAttemptingQuiz,setIsAttemptingQuiz,currentQuizQIdx,setCurrentQuizQIdx,quizAnswers,setQuizAnswers,submittingQuiz,setSubmittingQuiz,quizScore,setQuizScore,getQuizStatus,quizCategoryShowcaseItems,filteredQuizzes,totalQuizPages,paginatedQuizzes,handleSelectQuizOption,handleQuizSubmit};
}
