'use client';

import inlineStyles from '@/features/assessments/styles/admin-assignments-page.jsx.styles.js';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Clock, CheckCircle, X, ChevronRight, HelpCircle, ArrowLeft, 
  Send, AlertCircle, Filter, Plus, Edit2, Trash2, Award, Folder,
  ClipboardList, User, Loader2, Brain, Star, RotateCcw
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment, getAssignmentSubmissions, gradeAssignmentSubmission } from '@/features/assessments/api/client';
import { getCourses, getCourseSyllabus } from '@/features/courses/api/client';
import { parseQuestionsList } from '@/features/assessments/domain/legacy-formats';
import { getCourseDetails } from '@/features/courses/domain/course-data';

export function useAdminAssignmentsPageModel() {

  const isMobile = useMediaQuery(isMobileMQ);

  // States
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'submissions'
  
  // Category & Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterChapter, setFilterChapter] = useState('all');

  // Chapter loading state for modal
  const [courseChapters, setCourseChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentAssignment, setCurrentAssignment] = useState({
    id: '',
    title: '',
    course: '',
    courseTitle: '',
    chapter: '',
    chapterTitle: '',
    type: 'Text',
    question: '',
    show_answer: false,
    answer: '',
    evaluation_criteria: [
      'Function/solution correctly implements requested logic',
      'Handles edge cases and valid input boundaries',
      'Clean structure, readability, and formatting'
    ],
    pass_threshold: 70
  });

  // Grading Modal
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingForm, setGradingForm] = useState({
    status: 'Pass',
    comments: '',
    evaluator: 'Administrator',
    score: 80,
    ai_evaluation: null
  });
  const [evaluatingId, setEvaluatingId] = useState(null);

  // Load assignments, courses, submissions
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [assList, courseList, subList] = await Promise.all([
          getAssignments(),
          getCourses(),
          getAssignmentSubmissions()
        ]);
        setAssignments(assList);
        setCourses(courseList);
        setSubmissions(subList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshSubmissions = async () => {
    try {
      const fresh = await getAssignmentSubmissions();
      setSubmissions(fresh || []);
    } catch (e) {
      console.error('Failed to refresh submissions:', e);
    }
  };

  useEffect(() => {
    const handleSubmissionsUpdated = () => {
      refreshSubmissions();
    };

    window.addEventListener('assignment_submissions_updated', handleSubmissionsUpdated);
    window.addEventListener('storage', handleSubmissionsUpdated);
    return () => {
      window.removeEventListener('assignment_submissions_updated', handleSubmissionsUpdated);
      window.removeEventListener('storage', handleSubmissionsUpdated);
    };
  }, []);

  const updateChecklist = (newList) => {
    const savedChecklist = localStorage.getItem('admin_getting_started');
    if (savedChecklist) {
      try {
        const checklist = JSON.parse(savedChecklist);
        if (newList.length > 0 && !checklist.chapter) {
          checklist.chapter = true;
          localStorage.setItem('admin_getting_started', JSON.stringify(checklist));
          window.dispatchEvent(new Event('admin_checklist_update'));
        }
      } catch (e) {}
    }
  };

  const handleCourseSelect = async (val) => {
    if (val === 'CUSTOM') {
      setCourseChapters([]);
      setCurrentAssignment(prev => ({
        ...prev,
        course: 'CUSTOM',
        courseTitle: 'Custom Course',
        chapter: '',
        chapterTitle: '',
        custom_course_title: prev.custom_course_title || 'Custom Module Topic'
      }));
      return;
    }

    const matchedCourse = courses.find(c => String(c.id) === String(val));
    const cTitle = matchedCourse ? matchedCourse.title : val;
    setLoadingChapters(true);
    let modules = [];
    try {
      const syl = await getCourseSyllabus(val);
      modules = syl?.modules || [];
    } catch (_) {}
    setCourseChapters(modules);
    setLoadingChapters(false);

    setCurrentAssignment(prev => ({
      ...prev,
      course: val,
      courseTitle: cTitle,
      chapter: modules[0]?.id || '',
      chapterTitle: modules[0]?.title || '',
      custom_course_title: ''
    }));
  };

  const handleOpenCreateModal = async () => {
    setModalMode('create');
    const defaultCourse = courses[0] || { id: '1', title: 'Python Fundamentals' };
    const defaultCourseId = defaultCourse.id;
    const defaultCourseTitle = defaultCourse.title;

    setLoadingChapters(true);
    let modules = [];
    try {
      const syl = await getCourseSyllabus(defaultCourseId);
      modules = syl?.modules || [];
    } catch (_) {}
    setCourseChapters(modules);
    setLoadingChapters(false);

    setCurrentAssignment({
      id: '',
      title: '',
      course: defaultCourseId,
      courseTitle: defaultCourseTitle,
      chapter: modules[0]?.id || '',
      chapterTitle: modules[0]?.title || '',
      custom_course_title: '',
      type: 'Text',
      question: '',
      show_answer: false,
      answer: '',
      questions: [{ id: 1, prompt: '', sample_answer: '' }],
      evaluation_criteria: [
        'Function/solution correctly implements requested logic',
        'Handles edge cases and valid input boundaries',
        'Clean structure, readability, and formatting'
      ],
      pass_threshold: 70,
      min_char_count: 20
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (ass, e) => {
    e.stopPropagation();
    setModalMode('edit');

    let modules = [];
    if (ass.course && ass.course !== 'CUSTOM') {
      setLoadingChapters(true);
      try {
        const syl = await getCourseSyllabus(ass.course);
        modules = syl?.modules || [];
      } catch (_) {}
      setLoadingChapters(false);
    }
    setCourseChapters(modules);

    setCurrentAssignment({
      ...ass,
      course: ass.course || '',
      courseTitle: ass.courseTitle || '',
      chapter: ass.chapter || (modules[0]?.id || ''),
      chapterTitle: ass.chapterTitle || (modules[0]?.title || ''),
      custom_course_title: ass.custom_course_title || '',
      questions: Array.isArray(ass.questions) && ass.questions.length > 0
        ? ass.questions.map(q => ({ ...q }))
        : [{ id: 1, prompt: ass.question || '', sample_answer: ass.answer || '' }],
      evaluation_criteria: Array.isArray(ass.evaluation_criteria) && ass.evaluation_criteria.length > 0
        ? [...ass.evaluation_criteria]
        : ['Core requirements met accurately', 'Edge cases covered'],
      pass_threshold: ass.pass_threshold || 70,
      min_char_count: ass.min_char_count !== undefined ? ass.min_char_count : 20
    });
    setIsModalOpen(true);
  };

  const handleAddCriterion = () => {
    setCurrentAssignment(prev => ({
      ...prev,
      evaluation_criteria: [...(prev.evaluation_criteria || []), '']
    }));
  };

  const handleRemoveCriterion = (index) => {
    setCurrentAssignment(prev => ({
      ...prev,
      evaluation_criteria: prev.evaluation_criteria.filter((_, i) => i !== index)
    }));
  };

  const handleCriterionChange = (index, value) => {
    setCurrentAssignment(prev => {
      const updated = [...(prev.evaluation_criteria || [])];
      updated[index] = value;
      return { ...prev, evaluation_criteria: updated };
    });
  };

  const handleAddQuestion = () => {
    setCurrentAssignment(prev => ({
      ...prev,
      questions: [...(prev.questions || []), { id: Date.now(), prompt: '', sample_answer: '' }]
    }));
  };

  const handleRemoveQuestion = (index) => {
    setCurrentAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setCurrentAssignment(prev => {
      const updated = [...(prev.questions || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const [saving, setSaving] = useState(false);

  const handleDeleteAssignment = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        const success = await deleteAssignment(id);
        if (success) {
          const fresh = await getAssignments();
          setAssignments(fresh);
          updateChecklist(fresh);
        }
      } catch (err) {
        console.warn("Notice: Delete assignment fallback handled:", err);
      }
    }
  };

  const handleSaveAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!currentAssignment.title.trim() || saving) return;

    try {
      setSaving(true);
      let cTitle = currentAssignment.courseTitle;
      if (!cTitle) {
        const match = courses.find(c => String(c.id) === String(currentAssignment.course));
        cTitle = match ? match.title : (currentAssignment.custom_course_title || 'General Course');
      }

      const payload = {
        ...currentAssignment,
        courseTitle: cTitle,
        chapter: currentAssignment.chapter || 'General',
        chapterTitle: currentAssignment.chapterTitle || 'General',
        questions: (currentAssignment.questions || []).filter(q => q.prompt && q.prompt.trim()),
        evaluation_criteria: (currentAssignment.evaluation_criteria || []).filter(c => c.trim())
      };

      if (modalMode === 'create') {
        await createAssignment(payload);
      } else {
        await updateAssignment(currentAssignment.id, payload);
      }

      const fresh = await getAssignments();
      setAssignments(fresh);
      updateChecklist(fresh);
      setIsModalOpen(false);
    } catch (err) {
      console.warn("Notice: Saved assignment locally with error handled:", err);
      const fresh = await getAssignments();
      setAssignments(fresh);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenGradingModal = (sub) => {
    setSelectedSubmission(sub);
    setGradingForm({
      status: sub.status === 'Not Graded' ? 'Pass' : sub.status,
      comments: sub.comments || '',
      evaluator: sub.evaluator || 'Administrator',
      score: sub.score !== undefined ? sub.score : 80,
      ai_evaluation: sub.ai_evaluation || null
    });
    setIsGradingOpen(true);
  };

  const handleEvaluateWithAI = async (sub, e) => {
    if (e) e.stopPropagation();
    try {
      setEvaluatingId(sub.id);
      const targetAss = assignments.find(a => a.id === sub.assignment);
      const res = await fetch('/api/evaluate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sub.assignment_title,
          question: sub.question || targetAss?.question || '',
          answer: sub.answer || '',
          evaluation_criteria: targetAss?.evaluation_criteria || [],
          sample_answer: targetAss?.answer || '',
          pass_threshold: targetAss?.pass_threshold || 70
        })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setSelectedSubmission(sub);
        setGradingForm({
          status: data.evaluation.suggested_status || 'Pass',
          comments: data.evaluation.summary_feedback || '',
          evaluator: 'Vedika AI + Admin',
          score: data.evaluation.overall_score !== undefined ? data.evaluation.overall_score : 80,
          ai_evaluation: data.evaluation
        });
        setIsGradingOpen(true);
      } else {
        alert(data.error || 'Failed to evaluate submission using AI.');
      }
    } catch (err) {
      console.error('AI evaluation error:', err);
      alert('Error connecting to AI evaluation service.');
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleSaveGrading = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    await gradeAssignmentSubmission(selectedSubmission.id, gradingForm);
    const fresh = await getAssignmentSubmissions();
    setSubmissions(fresh);
    setIsGradingOpen(false);
  };

  const getCourseTitle = (courseId, customTitle) => {
    if (customTitle) return customTitle;
    const match = courses.find(c => c.id === courseId);
    if (match) return match.title;
    return courseId || 'Unassigned Course';
  };

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach(c => { if (c.category) set.add(c.category.trim()); });
    assignments.forEach(a => { if (a.category) set.add(a.category.trim()); });
    return ['All', ...Array.from(set)];
  }, [courses, assignments]);

  const getAssignmentCategory = (ass) => {
    if (ass.category) return ass.category;
    const match = courses.find(c => String(c.id) === String(ass.course));
    return match?.category || 'General';
  };

  const filteredAssignments = assignments.filter(ass => {
    if (selectedCategory !== 'All' && getAssignmentCategory(ass).toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (filterCourse !== 'all' && String(ass.course) !== String(filterCourse)) return false;
    if (filterChapter !== 'all' && String(ass.chapter) !== String(filterChapter)) return false;
    return true;
  });

  const availableFilterChapters = Array.from(
    new Map(
      assignments
        .filter(a => filterCourse === 'all' || String(a.course) === String(filterCourse))
        .filter(a => a.chapter)
        .map(a => [a.chapter, a.chapterTitle || a.chapter])
    ).entries()
  );

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  
return {isMobile,assignments,setAssignments,courses,setCourses,submissions,setSubmissions,loading,setLoading,activeTab,setActiveTab,selectedCategory,setSelectedCategory,filterCourse,setFilterCourse,filterChapter,setFilterChapter,courseChapters,setCourseChapters,loadingChapters,setLoadingChapters,isModalOpen,setIsModalOpen,modalMode,setModalMode,currentAssignment,setCurrentAssignment,isGradingOpen,setIsGradingOpen,selectedSubmission,setSelectedSubmission,gradingForm,setGradingForm,evaluatingId,setEvaluatingId,refreshSubmissions,updateChecklist,handleCourseSelect,handleOpenCreateModal,handleOpenEditModal,handleAddCriterion,handleRemoveCriterion,handleCriterionChange,handleAddQuestion,handleRemoveQuestion,handleQuestionChange,saving,setSaving,handleDeleteAssignment,handleSaveAssignmentSubmit,handleOpenGradingModal,handleEvaluateWithAI,handleSaveGrading,getCourseTitle,categories,getAssignmentCategory,filteredAssignments,availableFilterChapters,containerPadding};
}
