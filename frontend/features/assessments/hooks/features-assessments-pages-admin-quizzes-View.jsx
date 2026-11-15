'use client';

import inlineStyles from '@/features/assessments/styles/admin-quizzes-page.jsx.styles.js';
import { useState, useEffect, useMemo } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, X, GraduationCap, CheckCircle, ClipboardList, Clock, Folder } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from '@/features/assessments/api/client';
import { getCourses } from '@/features/courses/api/client';
import { getCourseDetails } from '@/features/courses/domain/course-data';

export function useAdminQuizzesPageModel() {

  const isMobile = useMediaQuery(isMobileMQ);

  // States
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  // Available lessons for selection based on course
  const [availableLessons, setAvailableLessons] = useState([]);

  const [currentQuiz, setCurrentQuiz] = useState({
    id: '',
    title: '',
    course: '',
    lesson: '',
    max_attempts: 3,
    passing_percentage: 70,
    total_marks: 10,
    duration: '10 mins',
    questions: []
  });

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach(c => { if (c.category) set.add(c.category.trim()); });
    quizzes.forEach(q => { if (q.category) set.add(q.category.trim()); });
    return ['All', ...Array.from(set)];
  }, [courses, quizzes]);

  const getQuizCategory = (quiz) => {
    if (quiz.category) return quiz.category;
    const match = courses.find(c => String(c.id) === String(quiz.course));
    return match?.category || 'General';
  };

  const filteredQuizzes = quizzes.filter(q => {
    if (selectedCategory === 'All') return true;
    return getQuizCategory(q).toLowerCase() === selectedCategory.toLowerCase();
  });

  // Load quizzes and courses
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [quizList, courseList] = await Promise.all([getQuizzes(), getCourses()]);
        setQuizzes(quizList);
        setCourses(courseList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync available lessons when currentQuiz.course changes
  useEffect(() => {
    if (!currentQuiz.course) {
      setAvailableLessons([]);
      return;
    }
    const matchedCourse = courses.find(c => c.id === currentQuiz.course);
    if (matchedCourse) {
      const details = getCourseDetails(matchedCourse);
      if (details && details.modules) {
        const lessons = details.modules.flatMap(m => m.lessons.map(l => ({ id: l.id, title: l.title })));
        setAvailableLessons(lessons);
      } else {
        setAvailableLessons([]);
      }
    } else {
      setAvailableLessons([]);
    }
  }, [currentQuiz.course, courses]);

  const updateChecklist = (newList) => {
    const savedChecklist = localStorage.getItem('admin_getting_started');
    if (savedChecklist) {
      try {
        const checklist = JSON.parse(savedChecklist);
        if (newList.length > 0 && !checklist.quiz) {
          checklist.quiz = true;
          localStorage.setItem('admin_getting_started', JSON.stringify(checklist));
          window.dispatchEvent(new Event('admin_checklist_update'));
        }
      } catch (e) {}
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    const defaultCourseId = courses[0]?.id || '';
    setCurrentQuiz({
      id: '',
      title: '',
      course: defaultCourseId,
      lesson: '',
      max_attempts: 3,
      passing_percentage: 70,
      total_marks: 10,
      duration: '10 mins',
      questions: [
        { question: 'Who created Python?', options: ['Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling'], correct: 0 }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quiz, e) => {
    e.stopPropagation();
    setModalMode('edit');
    setCurrentQuiz({
      ...quiz,
      questions: quiz.questions && quiz.questions.length > 0 ? quiz.questions : [
        { question: 'Who created Python?', options: ['Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling'], correct: 0 }
      ]
    });
    setIsModalOpen(true);
  };

  const [saving, setSaving] = useState(false);

  const handleDeleteQuiz = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        const success = await deleteQuiz(id);
        if (success) {
          const fresh = await getQuizzes();
          setQuizzes(fresh);
          updateChecklist(fresh);
        }
      } catch (err) {
        console.warn("Notice: Delete quiz fallback handled:", err);
      }
    }
  };

  const handleSaveQuizSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuiz.title.trim() || saving) return;

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await createQuiz(currentQuiz);
      } else {
        await updateQuiz(currentQuiz.id, currentQuiz);
      }

      const fresh = await getQuizzes();
      setQuizzes(fresh);
      updateChecklist(fresh);
      setIsModalOpen(false);
    } catch (err) {
      console.warn("Notice: Saved quiz locally with error handled:", err);
      const fresh = await getQuizzes();
      setQuizzes(fresh);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const addQuestionField = () => {
    setCurrentQuiz({
      ...currentQuiz,
      questions: [...currentQuiz.questions, { question: '', options: ['', '', '', ''], correct: 0 }]
    });
  };

  const removeQuestionField = (index) => {
    const updated = currentQuiz.questions.filter((_, idx) => idx !== index);
    setCurrentQuiz({ ...currentQuiz, questions: updated });
  };

  const updateQuestionText = (index, val) => {
    const updated = [...currentQuiz.questions];
    updated[index].question = val;
    setCurrentQuiz({ ...currentQuiz, questions: updated });
  };

  const updateOptionText = (qIndex, oIndex, val) => {
    const updated = [...currentQuiz.questions];
    updated[qIndex].options[oIndex] = val;
    setCurrentQuiz({ ...currentQuiz, questions: updated });
  };

  const updateCorrectOption = (qIndex, oIndex) => {
    const updated = [...currentQuiz.questions];
    updated[qIndex].correct = oIndex;
    setCurrentQuiz({ ...currentQuiz, questions: updated });
  };

  const getCourseTitle = (courseId) => {
    return courses.find(c => c.id === courseId)?.title || 'Unassigned Course';
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';
  const gridColumns = isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))';

  
return {isMobile,quizzes,setQuizzes,courses,setCourses,loading,setLoading,isModalOpen,setIsModalOpen,modalMode,setModalMode,availableLessons,setAvailableLessons,currentQuiz,setCurrentQuiz,selectedCategory,setSelectedCategory,categories,getQuizCategory,filteredQuizzes,updateChecklist,handleOpenCreateModal,handleOpenEditModal,saving,setSaving,handleDeleteQuiz,handleSaveQuizSubmit,addQuestionField,removeQuestionField,updateQuestionText,updateOptionText,updateCorrectOption,getCourseTitle,containerPadding,gridColumns};
}
