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
export function useAssignmentWorkspace({router,isMobile,activeTab,setActiveTab,currentUser,setCurrentUser,courses,setCourses,loading,setLoading,loadError,setLoadError,getCourseName,getItemCategory,handleStartAttempt}) {
const isAssignmentsOpen = activeTab === 'assignments';

const [assignments, setAssignments] = useState([]);

const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);

const [selectedAssignmentCategory, setSelectedAssignmentCategory] = useState(null);

const [assignmentSearch, setAssignmentSearch] = useState('');

const [assignmentCourseFilter, setAssignmentCourseFilter] = useState('all');

const [assignmentChapterFilter, setAssignmentChapterFilter] = useState('all');

const [assignmentPage, setAssignmentPage] = useState(1);

const ASSIGNMENT_ITEMS_PER_PAGE = 3;

const [selectedAssignment, setSelectedAssignment] = useState(null);

const [isViewingAssignmentPrompt, setIsViewingAssignmentPrompt] = useState(false);

const [activeAssignmentQIdx, setActiveAssignmentQIdx] = useState(0);

const [assignmentAnswers, setAssignmentAnswers] = useState({});

const [submittingAssignment, setSubmittingAssignment] = useState(false);

const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState('');

const [isEditingSubmission, setIsEditingSubmission] = useState(false);

const existingUserSub = useMemo(() => {
    if (!selectedAssignment || !currentUser) return null;
    const curU = (currentUser.username || '').toLowerCase();
    const curE = (currentUser.email || '').toLowerCase();
    return assignmentSubmissions.find(
      (s) => s.assignment === selectedAssignment.id && 
      (s.member?.toLowerCase() === curU || s.member?.toLowerCase() === curE || (currentUser.name && s.member_name?.toLowerCase() === currentUser.name.toLowerCase()))
    ) || null;
  }, [selectedAssignment, currentUser, assignmentSubmissions]);

useEffect(() => {
    setAssignmentPage(1);
  }, [selectedAssignmentCategory, assignmentSearch, assignmentCourseFilter, assignmentChapterFilter]);

const getAssignmentStatus = (assignmentId) => {
    if (!currentUser) return { status: 'Not Submitted', graded: false };
    const sub = assignmentSubmissions.find(
      (s) => s.assignment === assignmentId && (s.member === currentUser.username || s.member === currentUser.email)
    );
    if (!sub) return { status: 'Not Submitted', graded: false };
    if (sub.grade !== undefined && sub.grade !== null && sub.grade !== '') {
      return { status: 'Graded', grade: sub.grade, score: sub.score, max_score: sub.max_score, graded: true };
    }
    return { status: 'Submitted (Pending Review)', graded: false };
  };

const assignmentCategoryShowcaseItems = useMemo(() => {
    const map = new Map();
    assignments.forEach((a) => {
      const cat = getItemCategory(a);
      if (!map.has(cat)) map.set(cat, { assignments: [], courseIds: new Set() });
      const entry = map.get(cat);
      entry.assignments.push(a);
      if (a.course) entry.courseIds.add(String(a.course));
    });
    return Array.from(map.entries()).map(([cat, val]) => ({
      category: cat,
      count: val.assignments.length,
      coursesCount: val.courseIds.size,
      artwork: cat.toLowerCase() === 'general' ? '/assignment-general-desk.jpg' : getSubjectArtwork(cat),
      assignments: val.assignments
    }));
  }, [assignments, courses, getItemCategory]);

const categoryFilteredCourses = useMemo(() => {
    if (!selectedAssignmentCategory) return courses;
    return courses.filter((c) => (c.category || 'General').toLowerCase() === selectedAssignmentCategory.toLowerCase());
  }, [courses, selectedAssignmentCategory]);

const uniqueChapters = useMemo(() => {
    const set = new Set();
    assignments.forEach((a) => {
      if (a.chapter) set.add(a.chapter);
    });
    return Array.from(set).sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return String(a).localeCompare(String(b));
    });
  }, [assignments]);

const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const cat = getItemCategory(a);
      if (selectedAssignmentCategory && cat.toLowerCase() !== selectedAssignmentCategory.toLowerCase()) {
        return false;
      }
      if (assignmentCourseFilter !== 'all' && String(a.course) !== String(assignmentCourseFilter)) {
        return false;
      }
      if (assignmentChapterFilter !== 'all' && String(a.chapter) !== String(assignmentChapterFilter)) {
        return false;
      }
      if (assignmentSearch.trim()) {
        const query = assignmentSearch.toLowerCase().trim();
        const titleMatch = a.title?.toLowerCase().includes(query);
        const courseMatch = getCourseName(a.course)?.toLowerCase().includes(query);
        const catMatch = cat.toLowerCase().includes(query);
        if (!titleMatch && !courseMatch && !catMatch) return false;
      }
      return true;
    });
  }, [assignments, selectedAssignmentCategory, assignmentCourseFilter, assignmentChapterFilter, assignmentSearch, courses, getCourseName, getItemCategory]);

const totalAssignmentPages = Math.max(1, Math.ceil(filteredAssignments.length / ASSIGNMENT_ITEMS_PER_PAGE));

const paginatedAssignments = filteredAssignments.slice(
    (assignmentPage - 1) * ASSIGNMENT_ITEMS_PER_PAGE,
    assignmentPage * ASSIGNMENT_ITEMS_PER_PAGE
  );

const handleOpenAssignmentPrompt = (ass) => {
    const resolvedQuestions = parseQuestionsList(ass.question || '', ass.questions, ass.answer);
    const targetAss = { ...ass, questions: resolvedQuestions };
    setSelectedAssignment(targetAss);
    setAssignmentSuccessMsg('');
    setActiveAssignmentQIdx(0);
    const curU = (currentUser?.username || '').toLowerCase();
    const curE = (currentUser?.email || '').toLowerCase();
    const existingSub = assignmentSubmissions.find(
      (s) => s.assignment === ass.id && 
      (s.member?.toLowerCase() === curU || s.member?.toLowerCase() === curE || (currentUser?.name && s.member_name?.toLowerCase() === currentUser?.name?.toLowerCase()))
    );
    const initialAns = {};
    if (existingSub && existingSub.answer) {
      const text = existingSub.answer;
      if (resolvedQuestions.length > 1 && text.includes('[Question 1]')) {
        resolvedQuestions.forEach((_, idx) => {
          const tag = `[Question ${idx + 1}]`;
          const nextTag = `[Question ${idx + 2}]`;
          const sIdx = text.indexOf(tag);
          if (sIdx !== -1) {
            const afterTag = sIdx + tag.length;
            const eIdx = text.indexOf(nextTag, afterTag);
            initialAns[idx] = (eIdx !== -1 ? text.substring(afterTag, eIdx) : text.substring(afterTag)).trim();
          }
        });
      } else {
        initialAns[0] = existingSub.answer;
      }
      setIsEditingSubmission(false); // Open in read-only View Work mode
    } else {
      setIsEditingSubmission(true); // Open in Solve mode
    }
    setAssignmentAnswers(initialAns);
    setIsViewingAssignmentPrompt(true);
  };

const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !currentUser) return;
    const qList = parseQuestionsList(selectedAssignment.question || '', selectedAssignment.questions, selectedAssignment.answer);
    const minChars = selectedAssignment.min_char_count !== undefined ? selectedAssignment.min_char_count : 20;

    for (let i = 0; i < qList.length; i++) {
      const text = (assignmentAnswers[i] || '').trim();
      if (selectedAssignment.type === 'Text') {
        if (text.length < minChars) {
          alert(`Question ${i + 1} requires at least ${minChars} characters before submitting. Currently: ${text.length} characters.`);
          setActiveAssignmentQIdx(i);
          return;
        }
      } else {
        if (!text) {
          alert(`Please provide a response for Question ${i + 1}.`);
          setActiveAssignmentQIdx(i);
          return;
        }
      }
    }

    const fullAnswerText = qList.map((q, idx) => {
      const ans = (assignmentAnswers[idx] || '').trim();
      return qList.length > 1 ? `[Question ${idx + 1}]\n${ans}` : ans;
    }).join('\n\n');

    setSubmittingAssignment(true);
    setAssignmentSuccessMsg('');
    try {
      const subPayload = {
        id: existingUserSub?.id || undefined,
        assignment: selectedAssignment.id,
        assignment_title: selectedAssignment.title,
        type: selectedAssignment.type || 'Text',
        member: currentUser.username || currentUser.email,
        member_name: currentUser.name || currentUser.username || 'Student',
        answer: fullAnswerText,
        course: selectedAssignment.course,
        question: typeof selectedAssignment.question === 'string' && selectedAssignment.question
          ? selectedAssignment.question
          : (typeof qList[0]?.prompt === 'string' ? qList[0].prompt : '')
      };
      await submitAssignmentResponse(subPayload);
      setAssignmentSuccessMsg(existingUserSub ? 'Assignment submission updated successfully! Your updated work has been recorded.' : 'Assignment submitted successfully! An instructor will review and grade your work.');
      const freshSubs = await getAssignmentSubmissions();
      setAssignmentSubmissions(freshSubs || []);
      setIsEditingSubmission(false);
    } catch (e) {
      console.error(e);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmittingAssignment(false);
    }
  };
return {isAssignmentsOpen,assignments,setAssignments,assignmentSubmissions,setAssignmentSubmissions,selectedAssignmentCategory,setSelectedAssignmentCategory,assignmentSearch,setAssignmentSearch,assignmentCourseFilter,setAssignmentCourseFilter,assignmentChapterFilter,setAssignmentChapterFilter,assignmentPage,setAssignmentPage,ASSIGNMENT_ITEMS_PER_PAGE,selectedAssignment,setSelectedAssignment,isViewingAssignmentPrompt,setIsViewingAssignmentPrompt,activeAssignmentQIdx,setActiveAssignmentQIdx,assignmentAnswers,setAssignmentAnswers,submittingAssignment,setSubmittingAssignment,assignmentSuccessMsg,setAssignmentSuccessMsg,isEditingSubmission,setIsEditingSubmission,existingUserSub,getAssignmentStatus,assignmentCategoryShowcaseItems,categoryFilteredCourses,uniqueChapters,filteredAssignments,totalAssignmentPages,paginatedAssignments,handleOpenAssignmentPrompt,handleAssignmentSubmit};
}
