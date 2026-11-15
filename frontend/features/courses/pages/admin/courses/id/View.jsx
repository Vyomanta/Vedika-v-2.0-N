'use client';
import * as featureStyleFunctions from '@/features/courses/styles/View.e8922216.styles.js';

import inlineStyles from '@/features/courses/styles/admin-courses-id-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Plus, Edit2, Trash2, ChevronRight, ChevronDown, BookOpen, Settings,
  Layers, Video, HelpCircle, Save, ArrowLeft, CheckCircle2, X
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { getCourses, getCourseSyllabus, saveCourseSyllabus } from '@/features/courses/api/client';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseOutlinePage() {
  const params = useParams();
  const id = decodeURIComponent(params.id);
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);

  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState({ modules: [] });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' or 'settings'

  // Expanded chapters state
  const [expandedChapters, setExpandedChapters] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  // Modals / Editors state
  const [chapterModal, setChapterModal] = useState({ open: false, mode: 'create', chapterId: '', title: '', description: '', emoji: '📖', accent: '#5B8CF8' });
  const [activeLessonTab, setActiveLessonTab] = useState('basic');
  const [lessonModal, setLessonModal] = useState({
    open: false,
    mode: 'create',
    chapterId: '',
    lessonId: '',
    title: '',
    dur: '10 min',
    vid: '',
    overview: '',
    ptsInput: '', // newline-separated key points
    quizQuestions: [], // quiz questions list
    hasExercise: false,
    exerciseLanguage: 'python',
    exerciseInstruction: '',
    exerciseStarterCode: '# Write your code here\n',
    exerciseSolutionCode: '',
    exerciseTestCases: '',
    pdf: ''
  });

  // Current editing quiz question modal/form
  const [quizForm, setQuizForm] = useState({
    open: false,
    question: '',
    opt1: '', opt2: '', opt3: '', opt4: '',
    correct: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const list = await getCourses();
        const found = list.find(c => c.id === id);
        setCourse(found);

        const outline = await getCourseSyllabus(id);
        setSyllabus(outline);

        // Expand all chapters by default
        const expand = {};
        outline.modules.forEach(m => {
          expand[m.id] = true;
        });
        setExpandedChapters(expand);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const handleSaveSyllabus = async (updatedSyllabus) => {
    setSaveLoading(true);
    try {
      const saved = await saveCourseSyllabus(id, updatedSyllabus || syllabus);
      setSyllabus(saved);
      setToastMsg('Syllabus outline successfully synchronized.');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (e) {
      alert('Failed to save syllabus: ' + e.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // --- Chapter Operations ---

  const openAddChapter = () => {
    setChapterModal({ open: true, mode: 'create', chapterId: '', title: '', description: '', emoji: '📖', accent: '#5B8CF8' });
  };

  const openEditChapter = (m) => {
    setChapterModal({
      open: true,
      mode: 'edit',
      chapterId: m.id,
      title: m.title,
      description: m.description || '',
      emoji: m.emoji || '📖',
      accent: m.accent || '#5B8CF8'
    });
  };

  const handleDeleteChapter = (chapterId) => {
    if (confirm('Are you sure you want to delete this chapter and all its lessons?')) {
      const updated = {
        ...syllabus,
        modules: syllabus.modules.filter(m => m.id !== chapterId)
      };
      setSyllabus(updated);
      handleSaveSyllabus(updated);
    }
  };

  const handleChapterSubmit = (e) => {
    e.preventDefault();
    if (!chapterModal.title.trim()) return;

    let updatedModules = [...syllabus.modules];

    if (chapterModal.mode === 'create') {
      const newChapter = {
        id: `ch_${Date.now()}`,
        title: chapterModal.title,
        description: chapterModal.description || '',
        emoji: chapterModal.emoji || '📖',
        accent: chapterModal.accent || '#5B8CF8',
        lessons: []
      };
      updatedModules.push(newChapter);
      setExpandedChapters(prev => ({ ...prev, [newChapter.id]: true }));
    } else {
      updatedModules = updatedModules.map(m =>
        m.id === chapterModal.chapterId ? {
          ...m,
          title: chapterModal.title,
          description: chapterModal.description || '',
          emoji: chapterModal.emoji || '📖',
          accent: chapterModal.accent || '#5B8CF8'
        } : m
      );
    }

    const updated = { ...syllabus, modules: updatedModules };
    setSyllabus(updated);
    handleSaveSyllabus(updated);
    setChapterModal({ open: false, mode: 'create', chapterId: '', title: '', description: '', emoji: '📖', accent: '#5B8CF8' });
  };

  // --- Lesson Operations ---

  const openAddLesson = (chapterId) => {
    setActiveLessonTab('basic');
    setLessonModal({
      open: true,
      mode: 'create',
      chapterId,
      lessonId: '',
      title: '',
      dur: '10 min',
      vid: '',
      overview: '',
      ptsInput: '',
      quizQuestions: [],
      hasExercise: false,
      exerciseLanguage: 'python',
      exerciseInstruction: '',
      exerciseStarterCode: '# Write your code here\n',
      exerciseSolutionCode: '',
      exerciseTestCases: '',
      pdf: ''
    });
  };

  const openEditLesson = (chapterId, lesson) => {
    setActiveLessonTab('basic');
    const coding = lesson.codingExercise || {
      hasExercise: false,
      language: 'python',
      instruction: '',
      starterCode: '',
      solutionCode: '',
      testCases: []
    };
    const testCasesStr = Array.isArray(coding.testCases) ? coding.testCases.join('\n') : (coding.testCases || '');

    setLessonModal({
      open: true,
      mode: 'edit',
      chapterId,
      lessonId: lesson.id,
      title: lesson.title,
      dur: lesson.dur,
      vid: lesson.vid,
      overview: lesson.overview || '',
      ptsInput: (lesson.pts || []).join('\n'),
      quizQuestions: lesson.quizQuestions || [],
      hasExercise: coding.hasExercise || false,
      exerciseLanguage: coding.language || 'python',
      exerciseInstruction: coding.instruction || '',
      exerciseStarterCode: coding.starterCode || '',
      exerciseSolutionCode: coding.solutionCode || '',
      exerciseTestCases: testCasesStr,
      pdf: lesson.pdf || ''
    });
  };

  const handleDeleteLesson = (chapterId, lessonId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      const updatedModules = syllabus.modules.map(m => {
        if (m.id === chapterId) {
          return {
            ...m,
            lessons: m.lessons.filter(l => l.id !== lessonId)
          };
        }
        return m;
      });

      const updated = { ...syllabus, modules: updatedModules };
      setSyllabus(updated);
      handleSaveSyllabus(updated);
    }
  };

  const handleLessonSubmit = (e) => {
    e.preventDefault();
    if (!lessonModal.title.trim()) return;

    const points = lessonModal.ptsInput
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const testCasesArr = lessonModal.exerciseTestCases
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const codingObj = {
      hasExercise: lessonModal.hasExercise || false,
      language: lessonModal.exerciseLanguage || 'python',
      instruction: lessonModal.exerciseInstruction || '',
      starterCode: lessonModal.exerciseStarterCode || '',
      solutionCode: lessonModal.exerciseSolutionCode || '',
      testCases: testCasesArr
    };

    const updatedModules = syllabus.modules.map(m => {
      if (m.id === lessonModal.chapterId) {
        let updatedLessons = [...m.lessons];

        if (lessonModal.mode === 'create') {
          const newLesson = {
            id: `les_${Date.now()}`,
            title: lessonModal.title,
            dur: lessonModal.dur,
            vid: lessonModal.vid || 'rfscVS0vtbw',
            overview: lessonModal.overview,
            pts: points.length > 0 ? points : ['Key concept introduction.'],
            quizQuestions: lessonModal.quizQuestions,
            codingExercise: codingObj,
            pdf: lessonModal.pdf || ''
          };
          updatedLessons.push(newLesson);
        } else {
          updatedLessons = updatedLessons.map(l =>
            l.id === lessonModal.lessonId
              ? {
                  ...l,
                  title: lessonModal.title,
                  dur: lessonModal.dur,
                  vid: lessonModal.vid,
                  overview: lessonModal.overview,
                  pts: points,
                  quizQuestions: lessonModal.quizQuestions,
                  codingExercise: codingObj,
                  pdf: lessonModal.pdf || ''
                }
              : l
          );
        }

        return { ...m, lessons: updatedLessons };
      }
      return m;
    });

    const updated = { ...syllabus, modules: updatedModules };
    setSyllabus(updated);
    handleSaveSyllabus(updated);
    setLessonModal({
      open: false,
      mode: 'create',
      chapterId: '',
      lessonId: '',
      title: '',
      dur: '10 min',
      vid: '',
      overview: '',
      ptsInput: '',
      quizQuestions: [],
      hasExercise: false,
      exerciseLanguage: 'python',
      exerciseInstruction: '',
      exerciseStarterCode: '# Write your code here\n',
      exerciseSolutionCode: '',
      exerciseTestCases: '',
      pdf: ''
    });
  };

  // --- Quiz Management inside Lesson Editor ---

  const handleAddQuizQuestion = (e) => {
    e.preventDefault();
    if (!quizForm.question.trim() || !quizForm.opt1.trim() || !quizForm.opt2.trim()) {
      alert('Please fill out the question and at least two options.');
      return;
    }

    const options = [quizForm.opt1.trim(), quizForm.opt2.trim()];
    if (quizForm.opt3.trim()) options.push(quizForm.opt3.trim());
    if (quizForm.opt4.trim()) options.push(quizForm.opt4.trim());

    const newQuestion = {
      question: quizForm.question.trim(),
      options,
      correct: Number(quizForm.correct)
    };

    setLessonModal(prev => ({
      ...prev,
      quizQuestions: [...prev.quizQuestions, newQuestion]
    }));

    setQuizForm({ open: false, question: '', opt1: '', opt2: '', opt3: '', opt4: '', correct: 0 });
  };

  const handleRemoveQuizQuestion = (qIdx) => {
    setLessonModal(prev => ({
      ...prev,
      quizQuestions: prev.quizQuestions.filter((_, idx) => idx !== qIdx)
    }));
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={inlineStyles.s1}>
          <div style={inlineStyles.s2} />
          <div style={inlineStyles.s3}>Loading syllabus builder...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      
      {/* Header Back Button */}
      <button
        onClick={() => router.push('/admin/courses')}
        style={featureStyleFunctions.s1({T})}
      >
        <ArrowLeft size={15} /> Back to Courses
      </button>

      {/* Course Title and Status */}
      <div style={inlineStyles.s4}>
        <div>
          <span style={featureStyleFunctions.s2({T})}>
            {course?.category}
          </span>
          <h1 style={featureStyleFunctions.s3({T})}>
            {course?.title}
          </h1>
          <p style={featureStyleFunctions.s4({T})}>
            Headless Syllabus Outline Editor
          </p>
        </div>

        <div style={inlineStyles.s5}>
          <button
            onClick={() => handleSaveSyllabus()}
            disabled={saveLoading}
            style={featureStyleFunctions.s5({T})}
          >
            <Save size={15} /> {saveLoading ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={featureStyleFunctions.s6({T})}>
        <button
          onClick={() => setActiveTab('syllabus')}
          style={featureStyleFunctions.s7({activeTab,T})}
        >
          Syllabus Outline ({syllabus.modules.length} Chapters)
        </button>
      </div>

      {/* Chapters list */}
      {activeTab === 'syllabus' && (
        <div style={inlineStyles.s6}>
          
          {syllabus.modules.length === 0 ? (
            <div style={featureStyleFunctions.s8({T})}>
              <div style={inlineStyles.s7}>📚</div>
              <h3 style={featureStyleFunctions.s9({T})}>No chapters created yet</h3>
              <p style={featureStyleFunctions.s10({T})}>
                Start structure planning by creating your first chapter.
              </p>
              <button
                onClick={openAddChapter}
                style={featureStyleFunctions.s11({T})}
              >
                <Plus size={14} /> Create Chapter
              </button>
            </div>
          ) : (
            <>
              {syllabus.modules.map((chapter, index) => {
                const expanded = expandedChapters[chapter.id];
                return (
                  <div key={chapter.id} style={featureStyleFunctions.s12({T})}>
                    
                    {/* Chapter Header row */}
                    <div style={featureStyleFunctions.s13({T})}>
                      <div style={inlineStyles.s8} onClick={() => toggleChapter(chapter.id)}>
                        <div style={featureStyleFunctions.s14({T})}>
                          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                        <div>
                          <span style={featureStyleFunctions.s15({T})}>Chapter {index + 1}</span>
                          <h3 style={featureStyleFunctions.s16({T})}>{chapter.title}</h3>
                        </div>
                      </div>

                      <div style={inlineStyles.s9}>
                        <button
                          onClick={() => openAddLesson(chapter.id)}
                          style={featureStyleFunctions.s17({T})}
                        >
                          <Plus size={12} color={T.accent} /> Add Lesson
                        </button>
                        <button
                          onClick={() => openEditChapter(chapter)}
                          style={featureStyleFunctions.s18({T})}
                          title="Edit Chapter Title"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          style={featureStyleFunctions.s19({T})}
                          title="Delete Chapter"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Lessons list */}
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          style={inlineStyles.s10}
                        >
                          <div style={inlineStyles.s11}>
                            {chapter.lessons.length === 0 ? (
                              <div style={featureStyleFunctions.s20({T})}>
                                No lessons in this chapter. Click "Add Lesson" to populate content.
                              </div>
                            ) : (
                              chapter.lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson.id}
                                  style={featureStyleFunctions.s21({lIdx,chapter,T})}
                                >
                                  <div style={inlineStyles.s12}>
                                    <div style={featureStyleFunctions.s22({T})} />
                                    <div>
                                      <h4 style={featureStyleFunctions.s23({T})}>{lesson.title}</h4>
                                      <div style={featureStyleFunctions.s24({T})}>
                                        <span>⏱️ {lesson.dur}</span>
                                        <span>•</span>
                                        <span>📺 Video: {lesson.vid || 'None'}</span>
                                        {lesson.pdf && (
                                          <>
                                            <span>•</span>
                                            <span style={featureStyleFunctions.s25({T})}>📄 PDF Attached</span>
                                          </>
                                        )}
                                        {lesson.quizQuestions?.length > 0 && (
                                          <>
                                            <span>•</span>
                                            <span style={featureStyleFunctions.s26({T})}>📝 {lesson.quizQuestions.length} Quiz Questions</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div style={inlineStyles.s13}>
                                    <button
                                      onClick={() => openEditLesson(chapter.id, lesson)}
                                      style={featureStyleFunctions.s27({T})}
                                      title="Edit Lesson Outline & Quizzes"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                      style={featureStyleFunctions.s28({T})}
                                      title="Delete Lesson"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Add Chapter Row button */}
              <button
                onClick={openAddChapter}
                style={featureStyleFunctions.s29({T})}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
              >
                <Plus size={14} /> Add New Chapter
              </button>
            </>
          )}

        </div>
      )}

      {/* CHAPTER MODAL */}
      {chapterModal.open && (
        <div style={inlineStyles.s14}>
          <form onSubmit={handleChapterSubmit} style={featureStyleFunctions.s30({T})}>
            <h3 style={featureStyleFunctions.s31({T})}>
              {chapterModal.mode === 'create' ? 'Create Chapter' : 'Edit Chapter Title'}
            </h3>
            
            <div style={inlineStyles.s15}>
              <label htmlFor="chapterTitle" style={featureStyleFunctions.s32({T})}>Chapter Title</label>
              <input
                id="chapterTitle"
                type="text"
                value={chapterModal.title}
                onChange={(e) => setChapterModal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Getting Started with variables"
                required
                style={featureStyleFunctions.s33({T})}
              />
            </div>

            {/* Chapter Emoji & Accent Color Grid */}
            <div style={inlineStyles.s16}>
              <div style={inlineStyles.s17}>
                <label style={featureStyleFunctions.s34({T})}>Chapter Emoji</label>
                <input
                  type="text"
                  value={chapterModal.emoji || ''}
                  onChange={(e) => setChapterModal(prev => ({ ...prev, emoji: e.target.value }))}
                  placeholder="e.g. 📖, 🐍, 💻"
                  style={featureStyleFunctions.s35({T})}
                />
              </div>
              <div style={inlineStyles.s18}>
                <label style={featureStyleFunctions.s36({T})}>Accent Color (HEX)</label>
                <input
                  type="text"
                  value={chapterModal.accent || ''}
                  onChange={(e) => setChapterModal(prev => ({ ...prev, accent: e.target.value }))}
                  placeholder="e.g. #9B6EF8"
                  style={featureStyleFunctions.s37({T})}
                />
              </div>
            </div>

            {/* Chapter Description */}
            <div style={inlineStyles.s19}>
              <label style={featureStyleFunctions.s38({T})}>Description</label>
              <textarea
                value={chapterModal.description || ''}
                onChange={(e) => setChapterModal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief introduction for this chapter..."
                rows="2"
                style={featureStyleFunctions.s39({T})}
              />
            </div>

            <div style={inlineStyles.s20}>
              <button
                type="button"
                onClick={() => setChapterModal(prev => ({ ...prev, open: false }))}
                style={featureStyleFunctions.s40({T})}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={featureStyleFunctions.s41({T})}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LESSON MODAL (Rich Lesson Outline & Quiz Form) */}
      {lessonModal.open && (
        <div style={inlineStyles.s21}>
          <form onSubmit={handleLessonSubmit} style={featureStyleFunctions.s42({T})}>
            <h3 style={featureStyleFunctions.s43({T})}>
              <Video size={16} color={T.accent} /> {lessonModal.mode === 'create' ? 'Add Lesson Outline' : 'Edit Lesson Details'}
            </h3>

            {/* Tab Selectors */}
            <div style={featureStyleFunctions.s44({T})}>
              {[
                { id: 'basic', label: 'Basic Info' },
                { id: 'content', label: 'Overview Content' },
                { id: 'coding', label: 'Coding Exercise' },
                { id: 'quiz', label: 'Practice Quiz' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLessonTab(tab.id)}
                  style={featureStyleFunctions.s45({activeLessonTab,tab,T})}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: BASIC INFO */}
            {activeLessonTab === 'basic' && (
              <div>
                <div style={featureStyleFunctions.s46({isMobile})}>
                  {/* Title */}
                  <div style={inlineStyles.s22}>
                    <label htmlFor="lessonTitle" style={featureStyleFunctions.s47({T})}>Lesson Title</label>
                    <input
                      id="lessonTitle"
                      type="text"
                      value={lessonModal.title}
                      onChange={(e) => setLessonModal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Dynamic Typing"
                      required
                      style={featureStyleFunctions.s48({T})}
                    />
                  </div>

                  {/* Duration */}
                  <div style={inlineStyles.s23}>
                    <label htmlFor="lessonDur" style={featureStyleFunctions.s49({T})}>Duration</label>
                    <input
                      id="lessonDur"
                      type="text"
                      value={lessonModal.dur}
                      onChange={(e) => setLessonModal(prev => ({ ...prev, dur: e.target.value }))}
                      placeholder="e.g. 10 min"
                      required
                      style={featureStyleFunctions.s50({T})}
                    />
                  </div>
                </div>

                {/* Video ID */}
                <div style={inlineStyles.s24}>
                  <label htmlFor="lessonVid" style={featureStyleFunctions.s51({T})}>YouTube Video ID (or URL suffix)</label>
                  <input
                    id="lessonVid"
                    type="text"
                    value={lessonModal.vid}
                    onChange={(e) => setLessonModal(prev => ({ ...prev, vid: e.target.value }))}
                    placeholder="e.g. rfscVS0vtbw"
                    style={featureStyleFunctions.s52({T})}
                  />
                </div>

                {/* PDF Reference URL */}
                <div style={inlineStyles.s25}>
                  <label htmlFor="lessonPdf" style={featureStyleFunctions.s53({T})}>Lesson PDF Resource URL (optional)</label>
                  <input
                    id="lessonPdf"
                    type="text"
                    value={lessonModal.pdf || ''}
                    onChange={(e) => setLessonModal(prev => ({ ...prev, pdf: e.target.value }))}
                    placeholder="e.g. Google Drive link or static PDF URL"
                    style={featureStyleFunctions.s54({T})}
                  />
                </div>

                {/* Key Points */}
                <div style={inlineStyles.s26}>
                  <label htmlFor="lessonPoints" style={featureStyleFunctions.s55({T})}>Key Study Points (one per line)</label>
                  <textarea
                    id="lessonPoints"
                    rows="3"
                    value={lessonModal.ptsInput}
                    onChange={(e) => setLessonModal(prev => ({ ...prev, ptsInput: e.target.value }))}
                    placeholder="Define variables&#10;Explore floating integers&#10;Dynamically reassign labels"
                    style={featureStyleFunctions.s56({T})}
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: RICH TEXT OVERVIEW */}
            {activeLessonTab === 'content' && (
              <div style={inlineStyles.s27}>
                <label htmlFor="lessonOverview" style={featureStyleFunctions.s57({T})}>Lesson Content Overview (Markdown Supported)</label>
                <textarea
                  id="lessonOverview"
                  rows="8"
                  value={lessonModal.overview}
                  onChange={(e) => setLessonModal(prev => ({ ...prev, overview: e.target.value }))}
                  placeholder="Welcome to this lesson! Today we will learn about..."
                  style={featureStyleFunctions.s58({T})}
                />
              </div>
            )}

            {/* TAB CONTENT: CODING EXERCISE */}
            {activeLessonTab === 'coding' && (
              <div>
                <div style={inlineStyles.s28}>
                  <input
                    id="hasExercise"
                    type="checkbox"
                    checked={lessonModal.hasExercise}
                    onChange={(e) => setLessonModal(prev => ({ ...prev, hasExercise: e.target.checked }))}
                    style={inlineStyles.s29}
                  />
                  <label htmlFor="hasExercise" style={featureStyleFunctions.s59({T})}>
                    Enable Coding Exercise for this Lesson
                  </label>
                </div>

                {lessonModal.hasExercise && (
                  <div style={featureStyleFunctions.s60({T})}>
                    {/* Language */}
                    <div style={inlineStyles.s30}>
                      <label htmlFor="exerciseLanguage" style={featureStyleFunctions.s61({T})}>Programming Language</label>
                      <select
                        id="exerciseLanguage"
                        value={lessonModal.exerciseLanguage}
                        onChange={(e) => setLessonModal(prev => ({ ...prev, exerciseLanguage: e.target.value }))}
                        style={featureStyleFunctions.s62({T})}
                      >
                        <option value="python">Python 3 (WASM Pyodide)</option>
                        <option value="javascript">JavaScript (Client Eval)</option>
                      </select>
                    </div>

                    {/* Instructions */}
                    <div style={inlineStyles.s31}>
                      <label htmlFor="exerciseInstruction" style={featureStyleFunctions.s63({T})}>Exercise Instructions (Markdown supported)</label>
                      <textarea
                        id="exerciseInstruction"
                        rows="3"
                        value={lessonModal.exerciseInstruction}
                        onChange={(e) => setLessonModal(prev => ({ ...prev, exerciseInstruction: e.target.value }))}
                        placeholder="Write a function `add(a, b)` that returns their sum."
                        style={featureStyleFunctions.s64({T})}
                      />
                    </div>

                    {/* Starter Code */}
                    <div style={inlineStyles.s32}>
                      <label htmlFor="exerciseStarter" style={featureStyleFunctions.s65({T})}>Starter Code Template</label>
                      <textarea
                        id="exerciseStarter"
                        rows="4"
                        value={lessonModal.exerciseStarterCode}
                        onChange={(e) => setLessonModal(prev => ({ ...prev, exerciseStarterCode: e.target.value }))}
                        placeholder="def add(a, b):&#10;    # Write code here&#10;    pass"
                        style={featureStyleFunctions.s66({T})}
                      />
                    </div>

                    {/* Solution Code */}
                    <div style={inlineStyles.s33}>
                      <label htmlFor="exerciseSolution" style={featureStyleFunctions.s67({T})}>Reference Solution Code (Optional)</label>
                      <textarea
                        id="exerciseSolution"
                        rows="4"
                        value={lessonModal.exerciseSolutionCode}
                        onChange={(e) => setLessonModal(prev => ({ ...prev, exerciseSolutionCode: e.target.value }))}
                        placeholder="def add(a, b):&#10;    return a + b"
                        style={featureStyleFunctions.s68({T})}
                      />
                    </div>

                    {/* Test Cases / Assertions */}
                    <div style={inlineStyles.s34}>
                      <label htmlFor="exerciseTests" style={featureStyleFunctions.s69({T})}>Test Cases / Assertions (One Python assertion statement per line)</label>
                      <textarea
                        id="exerciseTests"
                        rows="4"
                        value={lessonModal.exerciseTestCases}
                        onChange={(e) => setLessonModal(prev => ({ ...prev, exerciseTestCases: e.target.value }))}
                        placeholder="assert add(2, 3) == 5, 'add(2, 3) must equal 5'&#10;assert add(-1, 1) == 0, 'add(-1, 1) must equal 0'"
                        style={featureStyleFunctions.s70({T})}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PRACTICE QUIZ */}
            {activeLessonTab === 'quiz' && (
              <div>
                <div style={featureStyleFunctions.s71({T})}>
                  <div style={inlineStyles.s35}>
                    <span style={featureStyleFunctions.s72({T})}>
                      <HelpCircle size={14} color={T.purple} /> Practice Quiz Questions ({lessonModal.quizQuestions.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuizForm(prev => ({ ...prev, open: true }))}
                      style={featureStyleFunctions.s73({T})}
                    >
                      <Plus size={12} /> Add Question
                    </button>
                  </div>

                  {/* Quiz form details */}
                  {quizForm.open && (
                    <div style={featureStyleFunctions.s74({T})}>
                      <div style={inlineStyles.s36}>
                        <span style={featureStyleFunctions.s75({T})}>New Practice Question</span>
                        <button type="button" onClick={() => setQuizForm(prev => ({ ...prev, open: false }))} style={featureStyleFunctions.s76({T})}>
                          <X size={14} />
                        </button>
                      </div>
                      
                      <div style={inlineStyles.s37}>
                        <input
                          type="text"
                          placeholder="Enter quiz question..."
                          value={quizForm.question}
                          onChange={(e) => setQuizForm(prev => ({ ...prev, question: e.target.value }))}
                          style={featureStyleFunctions.s77({T})}
                        />
                        
                        <div style={inlineStyles.s38}>
                          <input
                            type="text"
                            placeholder="Option A (Required)"
                            value={quizForm.opt1}
                            onChange={(e) => setQuizForm(prev => ({ ...prev, opt1: e.target.value }))}
                            style={featureStyleFunctions.s78({T})}
                          />
                          <input
                            type="text"
                            placeholder="Option B (Required)"
                            value={quizForm.opt2}
                            onChange={(e) => setQuizForm(prev => ({ ...prev, opt2: e.target.value }))}
                            style={featureStyleFunctions.s79({T})}
                          />
                          <input
                            type="text"
                            placeholder="Option C (Optional)"
                            value={quizForm.opt3}
                            onChange={(e) => setQuizForm(prev => ({ ...prev, opt3: e.target.value }))}
                            style={featureStyleFunctions.s80({T})}
                          />
                          <input
                            type="text"
                            placeholder="Option D (Optional)"
                            value={quizForm.opt4}
                            onChange={(e) => setQuizForm(prev => ({ ...prev, opt4: e.target.value }))}
                            style={featureStyleFunctions.s81({T})}
                          />
                        </div>

                        <div style={inlineStyles.s39}>
                          <label htmlFor="quizCorrect" style={featureStyleFunctions.s82({T})}>Correct Answer Index:</label>
                          <select
                            id="quizCorrect"
                            value={quizForm.correct}
                            onChange={(e) => setQuizForm(prev => ({ ...prev, correct: Number(e.target.value) }))}
                            style={featureStyleFunctions.s83({T})}
                          >
                            <option value="0">Option A</option>
                            <option value="1">Option B</option>
                            {quizForm.opt3 && <option value="2">Option C</option>}
                            {quizForm.opt4 && <option value="3">Option D</option>}
                          </select>

                          <button
                            type="button"
                            onClick={handleAddQuizQuestion}
                            style={featureStyleFunctions.s84({T})}
                          >
                            Insert
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questions list display */}
                  <div style={inlineStyles.s40}>
                    {lessonModal.quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} style={featureStyleFunctions.s85({T})}>
                        <div style={featureStyleFunctions.s86({T})}>
                          <strong>Q{qIdx + 1}:</strong> {q.question} <span style={featureStyleFunctions.s87({T})}>({q.options.length} options, Ans: {String.fromCharCode(65 + q.correct)})</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveQuizQuestion(qIdx)} style={featureStyleFunctions.s88({T})} title="Remove question">
                          <Trash2 size={13} color={T.red} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={featureStyleFunctions.s89({T})}>
              <button
                type="button"
                onClick={() => setLessonModal(prev => ({ ...prev, open: false }))}
                style={featureStyleFunctions.s90({T})}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={featureStyleFunctions.s91({T})}
              >
                Save Lesson
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Sync Toast Notification */}
      {toastMsg && (
        <div style={featureStyleFunctions.s92({T})}>
          {toastMsg}
        </div>
      )}

    </div>
  );
}
