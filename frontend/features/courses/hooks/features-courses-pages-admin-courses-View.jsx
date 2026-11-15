'use client';

import inlineStyles from '@/features/courses/styles/admin-courses-page.jsx.styles.js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, GraduationCap, BookOpen, Upload, Download } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/features/courses/api/client';

export function useAdminCoursesPageModel() {

  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  
  // State variables
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentCourse, setCurrentCourse] = useState({ id: '', title: '', instructor: '', category: 'Web Development', enrolled: 0, status: 'Draft', date: '', description: '', image: '', pdf: '' });

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importResult, setImportResult] = useState(null);

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportLoading(false);
    setImportError('');
    setImportResult(null);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    setImportLoading(true);
    setImportError('');
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const res = await fetch('/api/admin/courses/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to import CSV syllabus.');
      }

      if (data.success) {
        if (data.localFallback) {
          // Parse JSON and write to localStorage fallback
          const importedCourses = data.data;
          
          const savedCoursesList = localStorage.getItem('admin_courses_list') || JSON.stringify([]);
          let coursesList = JSON.parse(savedCoursesList);

          const today = new Date();
          const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          const results = [];

          for (const course of importedCourses) {
            const courseId = Date.now().toString() + '_' + Math.floor(Math.random() * 10000);
            
            // Add Course Header
            const newCourseHeader = {
              id: courseId,
              title: course.title,
              instructor: 'Administrator',
              category: course.category,
              enrolled: 0,
              status: course.status,
              date: formattedDate
            };
            coursesList.unshift(newCourseHeader);

            // Construct and Save Syllabus Details
            const syllabus = {
              id: courseId,
              title: course.title,
              tagline: course.short_introduction || `${course.title} tagline.`,
              modules: course.chapters.map((ch, chIdx) => {
                const chapterId = `ch_${courseId}_${chIdx}`;
                return {
                  id: chapterId,
                  title: ch.title,
                  emoji: '📖',
                  accent: '#5B8CF8',
                  lessons: ch.lessons.map((les, lesIdx) => {
                    const lessonId = `les_${chapterId}_${lesIdx}`;
                    return {
                      id: lessonId,
                      title: les.title,
                      dur: les.dur,
                      vid: les.vid,
                      overview: les.overview,
                      pts: les.pts,
                      quizQuestions: []
                    };
                  })
                };
              })
            };
            localStorage.setItem(`admin_course_details_${courseId}`, JSON.stringify(syllabus));

            results.push({
              id: courseId,
              title: course.title,
              chaptersCount: course.chapters.length,
              lessonsCount: course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)
            });
          }

          localStorage.setItem('admin_courses_list', JSON.stringify(coursesList));
          
          // Trigger updates checklist
          updateChecklist(coursesList);
          
          setImportResult({
            localFallback: true,
            imported: results
          });
        } else {
          setImportResult({
            localFallback: false,
            imported: data.imported
          });
        }

        // Reload courses on the page
        getCourses().then(setCourses);
      }
    } catch (err) {
      setImportError(err.message || 'An error occurred during import.');
    } finally {
      setImportLoading(false);
    }
  };

  // Load courses via unified API client
  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  const updateChecklist = (newList) => {
    // Update Getting Started checklist 'course' step automatically if list is not empty
    const savedChecklist = localStorage.getItem('admin_getting_started');
    if (savedChecklist) {
      try {
        const checklist = JSON.parse(savedChecklist);
        if (newList.length > 0 && !checklist.course) {
          checklist.course = true;
          localStorage.setItem('admin_getting_started', JSON.stringify(checklist));
          window.dispatchEvent(new Event('admin_checklist_update'));
        }
      } catch (e) {}
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setCurrentCourse({ id: '', title: '', instructor: 'Administrator', category: 'Web Development', enrolled: 0, status: 'Draft', date: formattedDate, description: '', image: '', pdf: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setModalMode('edit');
    setCurrentCourse({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      category: course.category,
      enrolled: course.enrolled,
      status: course.status,
      date: course.date,
      description: course.description || '',
      image: course.image || '',
      pdf: course.pdf || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    // 1. Immediately remove from local state
    setCourses(prev => prev.filter(c => c.id !== id));

    // 2. Write to local storage deleted cache to hide on student side instantly
    try {
      const locallyDeleted = JSON.parse(localStorage.getItem('locally_deleted_courses') || '[]');
      if (!locallyDeleted.includes(id)) {
        locallyDeleted.push(id);
        localStorage.setItem('locally_deleted_courses', JSON.stringify(locallyDeleted));
      }
    } catch (e) {
      console.error('Failed to update locally_deleted_courses:', e);
    }

    // 3. Delete in background
    deleteCourse(id).then(success => {
      if (success) {
        getCourses().then(fresh => {
          updateChecklist(fresh);
        });
      } else {
        console.error('Failed to delete course from DB in background');
      }
    }).catch(e => {
      console.error('Error during background course deletion:', e);
    });
  };

  const handleSaveCourseSubmit = async (e) => {
    e.preventDefault();
    if (!currentCourse.title.trim()) return;

    if (modalMode === 'create') {
      await createCourse(currentCourse);
    } else {
      await updateCourse(currentCourse.id, currentCourse);
    }
    
    const fresh = await getCourses();
    setCourses(fresh);
    updateChecklist(fresh);
    setIsModalOpen(false);
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || course.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination setup
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  
return {router,isMobile,courses,setCourses,searchTerm,setSearchTerm,selectedCategory,setSelectedCategory,selectedStatus,setSelectedStatus,currentPage,setCurrentPage,isModalOpen,setIsModalOpen,modalMode,setModalMode,currentCourse,setCurrentCourse,isImportModalOpen,setIsImportModalOpen,importFile,setImportFile,importLoading,setImportLoading,importError,setImportError,importResult,setImportResult,handleCloseImportModal,handleImportSubmit,updateChecklist,handleOpenCreateModal,handleOpenEditModal,handleDeleteCourse,handleSaveCourseSubmit,filteredCourses,itemsPerPage,totalPages,paginatedCourses,containerPadding};
}
