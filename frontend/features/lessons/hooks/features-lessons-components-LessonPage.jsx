'use client';

import inlineStyles from '@/features/lessons/styles/LessonPage.styles';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain, CheckCircle, Circle, ChevronRight, ChevronDown, ChevronUp, Clock,
  Loader2, Sparkles, RotateCcw, ArrowLeft, Send,
  FileText, Award, AlertCircle, ThumbsUp, HelpCircle, Terminal,
  BookOpen, Bot, MessageSquare, Mic, MicOff, BookMarked,
  Trash2, Plus, Play, Download, Bell, Megaphone, X, Check
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { COURSE, getCourseDetails } from '@/features/courses/domain/course-data';
import { geminiCall } from '@/features/tutoring/api/gemini';
import { buildQuizPrompt } from '@/features/tutoring/domain/prompts';
import { parseQuizOutput } from '@/features/tutoring/domain/parsers';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import dynamic from 'next/dynamic';
import { getCourses } from '@/features/courses/api/client';
import { getQuizzes, submitQuizResponse, getQuizSubmissions, getAssignments, submitAssignmentResponse, getAssignmentSubmissions } from '@/features/assessments/api/client';
import { getNotifications } from '@/features/administration/api/collections';
import PDFViewerModal from '@/components/PDFViewerModal';
import VideoPlayerWithAI from '@/components/VideoPlayerWithAI';
import VideoAIExplainerCard from '@/components/VideoAIExplainerCard';
import PracticePlaygroundModal from '@/components/PracticePlaygroundModal';
import CompanionTabs, { TABS } from '@/components/CompanionTabs';
import OverviewModal from '@/components/OverviewModal';
import { getMascotBridge } from '@/lib/mascotBridge';
import '@/features/lessons/styles/LessonPage.css';
import {formatTimestamp,extractYoutubeId,renderCleanFormattedText,renderFormattedChatMessage} from '@/features/lessons/components/features-lessons-components-LessonPage.support.jsx';

export function useLessonPageModel({ lesson, completed = {}, onComplete }) {

  const router  = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const isStackedLayout = isMobile;
  const [next, setNext] = useState(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedPdfResource, setSelectedPdfResource] = useState(null);

  // Video & AI states
  const [videoSeekTime, setVideoSeekTime] = useState(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [aiExplainerData, setAiExplainerData] = useState(null);
  const [explainerLoading, setExplainerLoading] = useState(false);
  const [activeCompanionTab, setActiveCompanionTab] = useState('ask_vedika'); // 'ask_vedika' | 'notes' | 'qa' | 'quiz'
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 90-10 collapsed by default, 50-50 when expanded
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false); // Collapsed initially until user clicks

  // Tab & Color definitions at component scope
  const currentTab = TABS.find(t => t.id === activeCompanionTab) || TABS[0];
  const panelColor = currentTab?.color || '#A855F7';
  const notesTabColor = TABS.find(t => t.id === 'notes')?.color || '#00D4FF';

  // Q&A Chat states
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Personal Notes states
  const [notes, setNotes] = useState([]);
  const [allCourseNotes, setAllCourseNotes] = useState([]);
  const [noteFilter, setNoteFilter] = useState('lesson'); // 'lesson' | 'course'
  const [recentNoteAlert, setRecentNoteAlert] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isPointsSaved, setIsPointsSaved] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [forcePause, setForcePause] = useState(false);
  const recognitionRef = useRef(null);
  const dictationBaseTextRef = useRef('');
  const isExplainingRef = useRef(false);

  // Course Announcements state
  const [announcements, setAnnouncements] = useState([]);

  // Resolve module
  const mod = lesson.module || COURSE.modules.find(m => m.lessons.some(l => l.id === lesson.id)) || COURSE.modules[0];

  // System states
  const [currentUser, setCurrentUser] = useState(null);
  const isTabletOrSmallDesktop = useMediaQuery('(max-width: 1150px)');
  const rPad = isMobile ? 16 : 32;

  // AI Practice Quiz states
  const [aiQuiz,    setAiQuiz]    = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr,     setAiErr]     = useState('');
  const [aiQuizIdx, setAiQuizIdx] = useState(0);
  const [aiQuizAns, setAiQuizAns] = useState(null);

  // Official Quizzes & Assignments states
  const [officialQuiz, setOfficialQuiz] = useState(null);
  const [officialAssignment, setOfficialAssignment] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [assignmentSub, setAssignmentSub] = useState(null);
  
  // Official Quiz Attempt State
  const [isOfficialQuizActive, setIsOfficialQuizActive] = useState(false);
  const [officialQuizIdx, setOfficialQuizIdx] = useState(0);
  const [officialQuizAnswers, setOfficialQuizAnswers] = useState([]);
  const [officialQuizScore, setOfficialQuizScore] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Official Assignment Submission State
  const [assignmentText, setAssignmentText] = useState('');
  const [submittingAss, setSubmittingAss] = useState(false);
  const [assSuccessMsg, setAssSuccessMsg] = useState('');

  // 24/7 Desktop Mascot Connection State & Realtime Study Notes Sync
  const [isMascotConnected, setIsMascotConnected] = useState(false);

  // Helper to ensure every note has a strict 1-based sequential noteNumber (oldest = #1, ..., newest = #N, zero gaps)
  const ensureNumberedNotes = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    // Deduplicate by note id or clientId while preserving display order
    const seenIds = new Set();
    const uniqueList = [];
    for (const item of list) {
      if (!item) continue;
      const key = String(item.id || item.clientId || `${item.createdAt}_${item.noteText}`);
      if (!seenIds.has(key)) {
        seenIds.add(key);
        uniqueList.push(item);
      }
    }
    // Chronological order (oldest -> newest) for deterministic 1..N sequential numbering
    const chronological = [...uniqueList].sort((a, b) => {
      const tA = a?.createdAt ? new Date(a.createdAt).getTime() : NaN;
      const tB = b?.createdAt ? new Date(b.createdAt).getTime() : NaN;
      if (!Number.isNaN(tA) && !Number.isNaN(tB) && tA !== tB) return tA - tB;
      const idA = Number(a?.id);
      const idB = Number(b?.id);
      if (!Number.isNaN(idA) && !Number.isNaN(idB) && idA !== idB) return idA - idB;
      return 0;
    });
    const idToNum = new Map();
    chronological.forEach((item, index) => {
      const key = String(item?.id || item?.clientId || index);
      idToNum.set(key, index + 1);
    });
    return uniqueList.map((item, idx) => ({
      ...item,
      noteNumber: idToNum.get(String(item?.id || item?.clientId || idx)) || (uniqueList.length - idx)
    }));
  };

  // Keep Desktop Mascot informed of active lesson & live video timestamp
  const lastReportedTimeRef = useRef(-1);
  useEffect(() => {
    if (typeof window === 'undefined' || !lesson?.id) return;
    const sec = Math.floor(videoCurrentTime || 0);
    if (lastReportedTimeRef.current !== -1 && Math.abs(sec - lastReportedTimeRef.current) < 3) return;
    lastReportedTimeRef.current = sec;
    try {
      const bridge = getMascotBridge();
      bridge.sendActivityUpdate('video_lesson', {
        page: `/lesson/${lesson.id}`,
        courseId: lesson?.courseId || '',
        courseTitle: lesson?.courseTitle || COURSE?.title || '',
        chapterTitle: mod?.title || '',
        lessonId: lesson?.id || '',
        lessonTitle: lesson?.title || '',
        videoId: extractYoutubeId(lesson?.vid || lesson?.youtube),
        timestampSeconds: sec,
        timestampFormatted: formatTimestamp(sec),
        topic: lesson?.title || ''
      });
    } catch (_) {}
  }, [lesson?.id, lesson?.courseId, lesson?.title, lesson?.vid, videoCurrentTime]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bridge = getMascotBridge();
    const unsubStatus = bridge.onStatusChange((status) => {
      setIsMascotConnected(status);
      if (status) {
        // Sync study notes from desktop pet SQLite store upon connection
        try {
          bridge.getStudyNotes({
            courseId: lesson?.courseId || '',
            lessonId: lesson?.id || ''
          });
        } catch (_) {}
      }
    });

    // Request initial notes sync
    try {
      bridge.getStudyNotes({
        courseId: lesson?.courseId || '',
        lessonId: lesson?.id || ''
      });
    } catch (_) {}

    const unsubMsg = bridge.subscribe((msg) => {
      if (!msg) return;
      const type = msg.type || msg.event;
      if (type === 'STUDY_NOTE_ADDED' || type === 'STUDY_NOTE_UPDATED') {
        const rawNote = msg.payload;
        if (!rawNote) return;

        const note = {
          ...rawNote,
          lessonId: rawNote.lessonId || lesson?.id || '',
          lessonTitle: rawNote.lessonTitle || lesson?.title || '',
          courseId: rawNote.courseId || lesson?.courseId || 'general'
        };

        // Automatically open the Personal Notes companion panel so the user sees the note render immediately
        setIsExpanded(true);
        setActiveCompanionTab('notes');

        setNotes((prev) => {
          let idx = -1;
          if (type === 'STUDY_NOTE_ADDED') {
            // For new notes, match ONLY by exact note id or echoed clientId — never overwrite another note at the same timestamp!
            idx = prev.findIndex((n) =>
              String(n.id) === String(note.id) ||
              (note.clientId && String(n.id) === String(note.clientId))
            );
          } else {
            // For STUDY_NOTE_UPDATED (same note or target Note #N), match by id or noteNumber
            idx = prev.findIndex((n) =>
              String(n.id) === String(note.id) ||
              (note.noteNumber && Number(n.noteNumber) === Number(note.noteNumber))
            );
          }

          let updated;
          if (idx !== -1) {
            const mergedNote = {
              ...prev[idx],
              ...note,
              noteNumber: prev[idx].noteNumber || (prev.length - idx)
            };
            // Place updated note at the top of the visible list while preserving its permanent Note #N badge
            const rest = prev.filter((_, i) => i !== idx);
            updated = ensureNumberedNotes([mergedNote, ...rest]);
          } else {
            const nextNum = prev.length + 1;
            updated = ensureNumberedNotes([{ ...note, noteNumber: nextNum }, ...prev]);
          }
          const matchedInUpdated = updated.find((n) => String(n.id) === String(note.id) || (note.clientId && String(n.id) === String(note.clientId))) || updated[0];
          if (matchedInUpdated) {
            setRecentNoteAlert({ ...matchedInUpdated, isUpdated: type === 'STUDY_NOTE_UPDATED' });
          }
          try {
            localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });

        setAllCourseNotes((prev) => {
          let idx = -1;
          if (type === 'STUDY_NOTE_ADDED') {
            idx = prev.findIndex((n) =>
              String(n.id) === String(note.id) ||
              (note.clientId && String(n.id) === String(note.clientId))
            );
          } else {
            idx = prev.findIndex((n) =>
              String(n.id) === String(note.id) ||
              (note.noteNumber && Number(n.noteNumber) === Number(note.noteNumber))
            );
          }
          let updated;
          if (idx !== -1) {
            const mergedNote = {
              ...prev[idx],
              ...note,
              noteNumber: note.noteNumber || prev[idx].noteNumber
            };
            const rest = prev.filter((_, i) => i !== idx);
            updated = ensureNumberedNotes([mergedNote, ...rest]);
          } else {
            const nextNum = note.noteNumber || (prev.reduce((max, n) => Math.max(max, Number(n.noteNumber) || 0), prev.length) + 1);
            updated = ensureNumberedNotes([{ ...note, noteNumber: nextNum }, ...prev]);
          }
          try {
            localStorage.setItem(`vedika_course_notes_${lesson?.courseId || 'general'}`, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });

        // recentNoteAlert is already set with sequential noteNumber inside setNotes above
        setTimeout(() => {
          setRecentNoteAlert((cur) => (String(cur?.id) === String(note.id) ? null : cur));
        }, 6000);
      } else if (type === 'STUDY_NOTES_LIST') {
        const list = msg.payload?.notes || (Array.isArray(msg.payload) ? msg.payload : []);
        if (Array.isArray(list) && list.length > 0) {
          // Display newest notes at the top while keeping 1-based chronological noteNumber (#1 = oldest, #N = newest)
          const numberedAll = ensureNumberedNotes([...list].reverse());
          setAllCourseNotes(numberedAll);
          const lessonNotes = numberedAll.filter((n) =>
            !n.lessonId ||
            n.lessonId === lesson?.id ||
            n.lessonId === lesson?.title ||
            n.lessonTitle === lesson?.title ||
            (lesson?.vid && n.videoId === lesson.vid)
          );
          if (lessonNotes.length > 0) {
            const numberedLesson = ensureNumberedNotes(lessonNotes);
            setNotes(numberedLesson);
            try {
              localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(numberedLesson));
            } catch (_) {}
          }
        }
      } else if (type === 'STUDY_NOTE_DELETED') {
        const deletedId = msg.payload?.id;
        if (deletedId) {
          setNotes((prev) => {
            const updated = ensureNumberedNotes(prev.filter((n) => String(n.id) !== String(deletedId)));
            try {
              localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });
          setAllCourseNotes((prev) => ensureNumberedNotes(prev.filter((n) => String(n.id) !== String(deletedId))));
        }
      }
    });

    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, [lesson?.id, lesson?.courseId, lesson?.title, lesson?.vid]);

  // Load current user & notes
  useEffect(() => {
    const stored = localStorage.getItem('frappe_user');
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch (e) {}
    }

    // Load notes from localStorage
    try {
      const lessonKey = `vedika_notes_${lesson?.id || 'general'}`;
      const savedLessonNotes = localStorage.getItem(lessonKey);
      if (savedLessonNotes) setNotes(ensureNumberedNotes(JSON.parse(savedLessonNotes)));

      const courseKey = `vedika_course_notes_${lesson?.courseId || 'general'}`;
      const savedCourseNotes = localStorage.getItem(courseKey);
      if (savedCourseNotes) setAllCourseNotes(ensureNumberedNotes(JSON.parse(savedCourseNotes)));
    } catch (e) {
      console.warn("Could not load notes:", e);
    }

    // Load Announcements / Notifications
    getNotifications().then(notifs => {
      const courseAlerts = (notifs || []).filter(n => 
        !lesson.courseId || n.course === lesson.courseId || n.category === 'Enrollment' || n.category === 'System'
      );
      setAnnouncements(courseAlerts.slice(0, 3));
    }).catch(() => {
      // Offline fallback announcements
      setAnnouncements([
        {
          id: 'ann-1',
          title: `Welcome to ${lesson.title}`,
          content: 'Remember to complete both the Practice Quiz and Official Assignment to track your progress score.',
          timestamp: 'Recently'
        }
      ]);
    });
  }, [lesson?.id, lesson?.courseId]);

  // Dynamically load next lesson
  useEffect(() => {
    async function loadNext() {
      try {
        const courses = await getCourses();
        const allLessons = [];
        courses.forEach(course => {
          const details = getCourseDetails(course);
          if (details && details.modules) {
            details.modules.forEach(m => {
              m.lessons.forEach(l => {
                allLessons.push(l);
              });
            });
          }
        });
        const allIds = allLessons.map(l => l.id);
        const idx = allIds.indexOf(lesson.id);
        if (idx !== -1 && idx < allLessons.length - 1) {
          setNext(allLessons[idx + 1]);
        } else {
          setNext(null);
        }
      } catch (e) {
        console.error("Error loading next lesson:", e);
      }
    }
    loadNext();
  }, [lesson?.id]);

  // Fetch official quizzes, assignments, and student submissions
  useEffect(() => {
    if (!currentUser) return;

    async function loadOfficialLmsData() {
      try {
        const [quizzes, assignments, quizSubs, assSubs] = await Promise.all([
          getQuizzes(),
          getAssignments(),
          getQuizSubmissions(),
          getAssignmentSubmissions()
        ]);

        const linkedQuiz = quizzes.find(q => q.lesson === lesson.id || (q.course === lesson.courseId && !q.lesson));
        setOfficialQuiz(linkedQuiz || null);

        const linkedAss = assignments.find(a => a.course === lesson.courseId);
        setOfficialAssignment(linkedAss || null);

        if (linkedQuiz) {
          setQuizAttempts(quizSubs.filter(s => s.quiz === linkedQuiz.id && s.member === currentUser.username));
        }

        if (linkedAss) {
          setAssignmentSub(assSubs.find(s => s.assignment === linkedAss.id && s.member === currentUser.username));
        }
      } catch (e) {
        console.error("Failed to load official quiz data:", e);
      }
    }

    loadOfficialLmsData();
  }, [lesson?.id, lesson?.courseId, currentUser]);

  // --------------------------------------------------------------------------
  // TAB 1: ASK VEDIKA HANDLER
  // --------------------------------------------------------------------------
  const handleExplainMoment = async (optionalSecs) => {
    if (explainerLoading || isExplainingRef.current) {
      console.log('[LessonPage] Ask Vedika explain moment already in flight, debouncing.');
      return;
    }
    isExplainingRef.current = true;
    setForcePause(true);
    setTimeout(() => setForcePause(false), 400);

    const targetSecs = typeof optionalSecs === 'number' ? optionalSecs : Math.floor(videoCurrentTime || 0);
    const vId = extractYoutubeId(lesson?.vid || lesson?.youtube);
    setExplainerLoading(true);

    try {
      const jwtToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
      const headers = { 'Content-Type': 'application/json' };
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      // 1. Query explain API for structured in-depth breakdown at exact timestamp
      const res = await fetch('/api/youtube/explain', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          videoId: vId,
          timestamp: targetSecs,
          title: lesson?.title || '',
          courseTitle: lesson?.courseTitle || COURSE?.title || '',
          moduleTitle: mod?.title || '',
          overview: lesson?.overview || '',
          keyPoints: lesson?.pts || []
        })
      });

      let explainedData = null;
      if (res.ok) {
        explainedData = await res.json();
        setAiExplainerData(explainedData);
      } else {
        throw new Error('Explain request failed');
      }

      // 2. Dispatch verified timeline moment to Desktop Mascot via local WebSocket bridge
      try {
        const bridge = getMascotBridge();
        const isMascotAlive = bridge.isMascotConnected();
        setIsMascotConnected(isMascotAlive);

        const verifiedTopic = explainedData?.topic || explainedData?.chapterTitle || lesson?.title || '';
        const verifiedConcept = explainedData?.coreExplanation || explainedData?.summary || '';
        const verifiedSnippet = explainedData?.transcriptSnippet || '';

        bridge.sendVideoMoment({
          videoId: vId,
          timestampSeconds: targetSecs,
          timestampFormatted: formatTimestamp(targetSecs),
          courseId: lesson?.courseId || lesson?.course || '',
          lessonId: lesson?.id || '',
          lessonTitle: lesson?.title || '',
          chapterTitle: explainedData?.chapterTitle || lesson?.chapterTitle || lesson?.chapter || lesson?.moduleTitle || '',
          courseTitle: lesson?.courseTitle || '',
          topic: verifiedTopic,
          overview: verifiedConcept,
          conceptSummary: verifiedConcept,
          transcriptSnippet: verifiedSnippet,
          keyTakeaways: explainedData?.keyTakeaways || []
        });
      } catch (mascotErr) {
        console.warn('[MascotBridge] Video moment dispatch notice:', mascotErr);
      }
    } catch (err) {
      console.warn('Explain moment fallback:', err);
      // Gemini fallback
      try {
        const gemRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are Vedika, an expert AI tutor for the lesson "${lesson?.title}". Explain the key concept at timestamp ${formatTimestamp(targetSecs)} clearly with key takeaways. Ground strictly on the lesson and video. Do not treat mid-lecture as introduction.`,
            user: `Explain the concept being taught at ${formatTimestamp(targetSecs)} in ${lesson?.title}. Overview: ${lesson?.overview || ''}`
          })
        });
        if (gemRes.ok) {
          const gemData = await gemRes.json();
          const fallbackData = {
            timestamp: formatTimestamp(targetSecs),
            coreExplanation: gemData.text || 'Key learning moment.',
            keyTakeaways: [lesson.overview?.slice(0, 80) || 'Core conceptual point.'],
            transcriptSnippet: `Video paused at ${formatTimestamp(targetSecs)}.`
          };
          setAiExplainerData(fallbackData);
          try {
            const bridge = getMascotBridge();
            bridge.sendVideoMoment({
              videoId: vId,
              timestampSeconds: targetSecs,
              timestampFormatted: formatTimestamp(targetSecs),
              courseId: lesson?.courseId || '',
              lessonId: lesson?.id || '',
              lessonTitle: lesson?.title || '',
              topic: lesson?.title || '',
              overview: fallbackData.coreExplanation,
              conceptSummary: fallbackData.coreExplanation
            });
          } catch (_) {}
        }
      } catch (e) {}
    } finally {
      setExplainerLoading(false);
      setTimeout(() => {
        isExplainingRef.current = false;
      }, 2500);
    }
  };

  // --------------------------------------------------------------------------
  // TAB 2: PERSONAL NOTES HANDLERS
  // --------------------------------------------------------------------------
  const handleSaveQuickNote = (noteText, timeFormatted) => {
    if (!noteText || !noteText.trim()) return;
    const cleanText = noteText.replace(/\*\*/g, '').trim();
    const formattedTime = timeFormatted || formatTimestamp(videoCurrentTime);
    const timeSec = Math.floor(videoCurrentTime || 0);
    const clientId = Date.now().toString();

    let noteObj;
    setNotes((prev) => {
      const nextNum = prev.length + 1;
      noteObj = {
        id: clientId,
        noteNumber: nextNum,
        lessonId: lesson?.id || '',
        lessonTitle: lesson?.title || '',
        courseId: lesson?.courseId || 'general',
        courseTitle: lesson?.courseTitle || COURSE?.title || 'Course',
        noteText: cleanText.startsWith('•') || cleanText.startsWith('-') ? cleanText : `• ${cleanText}`,
        timestampSeconds: timeSec,
        timestampFormatted: formattedTime,
        source: 'ai_explainer',
        createdAt: new Date().toISOString()
      };
      const updated = ensureNumberedNotes([noteObj, ...prev]);
      try {
        localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(updated));
        const courseKey = `vedika_course_notes_${lesson?.courseId || 'general'}`;
        const curCourseNotes = JSON.parse(localStorage.getItem(courseKey) || '[]');
        const updatedCourse = ensureNumberedNotes([noteObj, ...curCourseNotes.filter(n => String(n.id) !== String(noteObj.id))]);
        localStorage.setItem(courseKey, JSON.stringify(updatedCourse));
        setAllCourseNotes(updatedCourse);
      } catch (err) {}
      return updated;
    });

    setIsPointsSaved(true);
    setTimeout(() => setIsPointsSaved(false), 2500);
    if (noteObj) {
      setRecentNoteAlert(noteObj);
      setTimeout(() => {
        setRecentNoteAlert(cur => cur?.id === noteObj.id ? null : cur);
      }, 4500);
    }
    try {
      const bridge = getMascotBridge();
      bridge.send({
        type: 'SAVE_STUDY_NOTE',
        payload: {
          clientId,
          createNew: true,
          noteText: cleanText,
          courseId: lesson?.courseId || '',
          courseTitle: lesson?.courseTitle || '',
          lessonId: lesson?.id || '',
          lessonTitle: lesson?.title || '',
          videoId: lesson?.vid || '',
          timestampSeconds: timeSec,
          timestampFormatted: formattedTime,
          topic: lesson?.title || '',
          source: 'webapp_summary'
        }
      });
    } catch (_) {}
  };

  const handleSaveManualNote = (e) => {
    if (e) e.preventDefault();
    if (!newNoteText.trim()) return;

    const rawInput = newNoteText.trim();
    const targetMatch = rawInput.match(/^(?:note\s*#?(\d+)|#(\d+))\s*[:\-]\s*(.+)$/i);
    const targetNoteNumber = targetMatch ? Number(targetMatch[1] || targetMatch[2]) : null;
    const cleanNoteBody = targetMatch ? targetMatch[3].trim() : rawInput;
    const clientId = Date.now().toString();

    if (targetNoteNumber && targetNoteNumber > 0) {
      const existingIdx = notes.findIndex((n) => Number(n.noteNumber) === targetNoteNumber);
      if (existingIdx !== -1) {
        const targetNote = notes[existingIdx];
        const bulletPoint = cleanNoteBody.startsWith('•') || cleanNoteBody.startsWith('-') ? cleanNoteBody : `• ${cleanNoteBody}`;
        const updatedNote = {
          ...targetNote,
          noteText: `${targetNote.noteText}\n${bulletPoint}`
        };
        const rest = notes.filter((_, i) => i !== existingIdx);
        const updated = ensureNumberedNotes([updatedNote, ...rest]);
        setNotes(updated);
        try {
          localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(updated));
        } catch (_) {}
        setNewNoteText('');
        setRecentNoteAlert({ ...updatedNote, isUpdated: true });
        setTimeout(() => {
          setRecentNoteAlert(cur => String(cur?.id) === String(updatedNote.id) ? null : cur);
        }, 4500);
        try {
          const bridge = getMascotBridge();
          bridge.send({
            type: 'SAVE_STUDY_NOTE',
            payload: {
              createNew: false,
              noteNumber: targetNoteNumber,
              noteText: cleanNoteBody,
              courseId: lesson?.courseId || '',
              courseTitle: lesson?.courseTitle || COURSE?.title || '',
              lessonId: lesson?.id || '',
              lessonTitle: lesson?.title || '',
              videoId: lesson?.vid || '',
              timestampSeconds: Math.floor(videoCurrentTime || 0),
              timestampFormatted: formatTimestamp(videoCurrentTime),
              topic: lesson?.title || '',
              source: isDictating ? 'dictated' : 'manual'
            }
          });
        } catch (_) {}
        return;
      }
    }

    const nextNum = notes.length + 1;
    const noteObj = {
      id: clientId,
      noteNumber: nextNum,
      lessonId: lesson?.id || '',
      lessonTitle: lesson?.title || '',
      courseId: lesson?.courseId || 'general',
      courseTitle: lesson?.courseTitle || COURSE?.title || 'Course',
      noteText: cleanNoteBody.startsWith('•') || cleanNoteBody.startsWith('-') ? cleanNoteBody : `• ${cleanNoteBody}`,
      timestampSeconds: Math.floor(videoCurrentTime || 0),
      timestampFormatted: formatTimestamp(videoCurrentTime),
      source: isDictating ? 'dictated' : 'manual',
      createdAt: new Date().toISOString()
    };

    const updated = ensureNumberedNotes([noteObj, ...notes]);
    setNotes(updated);
    try {
      localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(updated));
      const courseKey = `vedika_course_notes_${lesson?.courseId || 'general'}`;
      const curCourseNotes = JSON.parse(localStorage.getItem(courseKey) || '[]');
      const updatedCourse = ensureNumberedNotes([noteObj, ...curCourseNotes.filter(n => String(n.id) !== String(noteObj.id))]);
      localStorage.setItem(courseKey, JSON.stringify(updatedCourse));
      setAllCourseNotes(updatedCourse);
    } catch (err) {}

    setNewNoteText('');
    setRecentNoteAlert(noteObj);
    setTimeout(() => {
      setRecentNoteAlert(cur => cur?.id === noteObj.id ? null : cur);
    }, 4500);
    try {
      const bridge = getMascotBridge();
      bridge.send({
        type: 'SAVE_STUDY_NOTE',
        payload: {
          clientId,
          createNew: true,
          noteText: noteObj.noteText,
          courseId: lesson?.courseId || '',
          courseTitle: lesson?.courseTitle || COURSE?.title || '',
          lessonId: lesson?.id || '',
          lessonTitle: lesson?.title || '',
          videoId: lesson?.vid || '',
          timestampSeconds: Math.floor(videoCurrentTime || 0),
          timestampFormatted: formatTimestamp(videoCurrentTime),
          topic: lesson?.title || '',
          source: isDictating ? 'dictated' : 'manual'
        }
      });
    } catch (_) {}
  };

  const handleDeleteNoteById = (id) => {
    const updated = ensureNumberedNotes(notes.filter(n => String(n.id) !== String(id)));
    setNotes(updated);
    try {
      localStorage.setItem(`vedika_notes_${lesson?.id || 'general'}`, JSON.stringify(updated));
      const courseKey = `vedika_course_notes_${lesson?.courseId || 'general'}`;
      const curCourseNotes = JSON.parse(localStorage.getItem(courseKey) || '[]');
      const updatedCourse = ensureNumberedNotes(curCourseNotes.filter(n => String(n.id) !== String(id)));
      localStorage.setItem(courseKey, JSON.stringify(updatedCourse));
      setAllCourseNotes(updatedCourse);
    } catch (err) {}
    try {
      const bridge = getMascotBridge();
      bridge.deleteStudyNote(id);
    } catch (_) {}
  };

  const handleDownloadNote = (note) => {
    const content = `Lesson: ${note.lessonTitle || lesson?.title}\nTimestamp: ${note.timestampFormatted}\nDate: ${note.createdAt}\nSource: ${note.source}\n\nNote:\n${note.noteText}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Note_${note.timestampFormatted.replace(':', '-')}_${lesson?.title || 'Lesson'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllNotes = (noteList) => {
    const content = noteList.map((n, i) => `[${i + 1}] Timestamp: ${n.timestampFormatted} (${n.lessonTitle || 'Lesson'})\n${n.noteText}\n`).join('\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Notes_${lesson?.title || 'Course'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleDictation = () => {
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isDictating) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsDictating(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        dictationBaseTextRef.current = newNoteText;

        recognition.onstart = () => setIsDictating(true);
        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text) {
            setNewNoteText((dictationBaseTextRef.current ? dictationBaseTextRef.current + ' ' : '') + text);
          }
        };
        recognition.onerror = () => setIsDictating(false);
        recognition.onend = () => setIsDictating(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsDictating(true);
      } catch (err) {
        setIsDictating(false);
      }
    }
  };

  // --------------------------------------------------------------------------
  // TAB 3: LESSON Q&A HANDLER
  // --------------------------------------------------------------------------
  const handleAskQuestion = async (qText) => {
    if (!qText.trim() || chatLoading) return;
    const userText = qText.trim();
    const vId = extractYoutubeId(lesson?.vid || lesson?.youtube);
    const newHist = [...chatHistory, { role: 'user', text: userText }];
    setChatHistory(newHist);
    setChatQuestion('');
    setChatLoading(true);

    try {
      const jwtToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
      const headers = { 'Content-Type': 'application/json' };
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }
      const res = await fetch('/api/youtube/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          videoId: vId,
          title: lesson?.title || '',
          question: userText,
          timestamp: Math.floor(videoCurrentTime || 0),
          currentTime: Math.floor(videoCurrentTime || 0),
          history: newHist.slice(-6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory([...newHist, { role: 'ai', text: data.answer || data.reply || data.text || 'Explanation provided.' }]);
      } else {
        throw new Error('Chat failed');
      }
    } catch (err) {
      // Direct Gemini fallback
      try {
        const gemRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are Vedika, an expert AI tutor answering student questions regarding the lesson "${lesson.title}". Lesson Overview: ${lesson.overview}`,
            user: userText
          })
        });
        if (gemRes.ok) {
          const gemData = await gemRes.json();
          setChatHistory([...newHist, { role: 'ai', text: gemData.text || 'Here is the answer based on the lesson curriculum.' }]);
        }
      } catch (e) {
        setChatHistory([...newHist, { role: 'ai', text: 'Could not connect to AI. Please try again in a moment.' }]);
      }
    } finally {
      setChatLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // TAB 4: PRACTICE QUIZ HANDLER
  // --------------------------------------------------------------------------
  const handleGeneratePracticeQuiz = async () => {
    setAiLoading(true);
    setAiErr('');
    setAiQuizAns(null);
    setAiQuizIdx(0);
    try {
      const topicTitle = lesson?.title || 'This Lesson';
      const courseTitle = lesson?.courseTitle || COURSE?.title || 'Course';
      const prompt = `Create 4 multiple-choice practice quiz questions on "${topicTitle}" in the course "${courseTitle}".
Overview: "${lesson?.overview || ''}".
Key Syllabus Points: "${(lesson?.pts || []).join(', ')}".

Return ONLY a pure valid JSON array with NO markdown, NO code fences, and NO extra text:
[
  { "q": "Question text here?", "opts": ["Option A", "Option B", "Option C", "Option D"], "ans": 0 }
]
"ans" is the 0-based integer index of the correct option.`;

      const res = await geminiCall(
        "You are an expert academic tutor. Output ONLY a valid JSON array of 4 multiple-choice quiz questions based on the lesson.",
        prompt,
        2000
      );

      let parsedQuestions = [];
      try {
        const clean = (res || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        const jsonMatch = clean.match(/\[[\s\S]*\]/);
        const data = JSON.parse(jsonMatch ? jsonMatch[0] : clean);
        if (Array.isArray(data)) {
          parsedQuestions = data.map(item => ({
            q: item.q || item.question || 'Question',
            opts: Array.isArray(item.opts) ? item.opts : (Array.isArray(item.options) ? item.options : ['A', 'B', 'C', 'D']),
            ans: typeof item.ans === 'number' ? item.ans : (typeof item.correct === 'number' ? item.correct : 0)
          }));
        }
      } catch (parseErr) {
        console.warn("Direct JSON quiz parse failed, using fallback parsing:", parseErr);
        const fb = parseQuizOutput(res);
        if (Array.isArray(fb) && fb.length > 0) {
          parsedQuestions = fb.map(item => ({
            q: item.question || item.q,
            opts: item.options || item.opts,
            ans: item.correct ?? item.ans ?? 0
          }));
        }
      }

      if (parsedQuestions.length === 0) {
        parsedQuestions = [
          {
            q: `What is the primary conceptual focus of "${topicTitle}"?`,
            opts: [
              lesson?.overview?.slice(0, 50) || 'Understanding foundational mechanisms and practical implementation',
              'Memorizing irrelevant historical trivia',
              'Ignoring error handling and type verification',
              'Skipping core algorithmic principles entirely'
            ],
            ans: 0
          },
          {
            q: `Which approach is considered best practice when working on ${topicTitle}?`,
            opts: [
              'Writing modular, readable, and well-structured solutions',
              'Hardcoding arbitrary values and omitting unit tests',
              'Combining all logic into an unbounded single block',
              'Ignoring documentation and input validation rules'
            ],
            ans: 0
          }
        ];
      }

      setAiQuiz({ questions: parsedQuestions });
    } catch (err) {
      console.error("Practice quiz generation error:", err);
      setAiErr(err.message || 'Could not generate quiz. Please retry.');
    } finally {
      setAiLoading(false);
    }
  };

  // Official Quiz Submission
  const handleOfficialQuizSubmit = async (e) => {
    e.preventDefault();
    if (!officialQuiz || !currentUser) return;
    setSubmittingQuiz(true);

    try {
      let correctCount = 0;
      officialQuiz.questions.forEach((q, idx) => {
        if (officialQuizAnswers[idx] === q.correct) correctCount++;
      });

      const totalQuestions = officialQuiz.questions.length;
      const percentage = Math.round((correctCount / totalQuestions) * 100);

      const subData = {
        quiz: officialQuiz.id,
        quiz_title: officialQuiz.title,
        course: lesson.courseId || officialQuiz.course,
        member: currentUser.username,
        member_name: currentUser.name || 'Student',
        score: correctCount,
        score_out_of: totalQuestions,
        percentage,
        passing_percentage: officialQuiz.passing_percentage || 70
      };

      await submitQuizResponse(subData);
      setOfficialQuizScore({
        score: correctCount,
        total: totalQuestions,
        percentage,
        passed: percentage >= (officialQuiz.passing_percentage || 70)
      });

      const subs = await getQuizSubmissions();
      setQuizAttempts(subs.filter(s => s.quiz === officialQuiz.id && s.member === currentUser.username));
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Official Assignment Submission
  const handleOfficialAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!officialAssignment || !currentUser || !assignmentText.trim()) return;
    setSubmittingAss(true);
    setAssSuccessMsg('');

    const subData = {
      assignment: officialAssignment.id,
      assignment_title: officialAssignment.title,
      type: officialAssignment.type,
      member: currentUser.username,
      member_name: currentUser.name || 'Student',
      answer: assignmentText,
      course: lesson.courseId || officialAssignment.course,
      question: officialAssignment.question
    };

    try {
      await submitAssignmentResponse(subData);
      setAssSuccessMsg('Assignment submitted successfully! Your submission is saved and ready for instructor review.');
      const subs = await getAssignmentSubmissions();
      setAssignmentSub(subs.find(s => s.assignment === officialAssignment.id && s.member === currentUser.username));
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingAss(false);
    }
  };

  
return {router,isMobile,isTablet,isStackedLayout,next,setNext,isPlaygroundOpen,setIsPlaygroundOpen,isPdfViewerOpen,setIsPdfViewerOpen,selectedPdfResource,setSelectedPdfResource,videoSeekTime,setVideoSeekTime,videoCurrentTime,setVideoCurrentTime,aiExplainerData,setAiExplainerData,explainerLoading,setExplainerLoading,activeCompanionTab,setActiveCompanionTab,isOverviewModalOpen,setIsOverviewModalOpen,isExpanded,setIsExpanded,isSummaryExpanded,setIsSummaryExpanded,currentTab,panelColor,notesTabColor,chatQuestion,setChatQuestion,chatHistory,setChatHistory,chatLoading,setChatLoading,notes,setNotes,allCourseNotes,setAllCourseNotes,noteFilter,setNoteFilter,recentNoteAlert,setRecentNoteAlert,newNoteText,setNewNoteText,isPointsSaved,setIsPointsSaved,isDictating,setIsDictating,forcePause,setForcePause,recognitionRef,dictationBaseTextRef,isExplainingRef,announcements,setAnnouncements,mod,currentUser,setCurrentUser,isTabletOrSmallDesktop,rPad,aiQuiz,setAiQuiz,aiLoading,setAiLoading,aiErr,setAiErr,aiQuizIdx,setAiQuizIdx,aiQuizAns,setAiQuizAns,officialQuiz,setOfficialQuiz,officialAssignment,setOfficialAssignment,quizAttempts,setQuizAttempts,assignmentSub,setAssignmentSub,isOfficialQuizActive,setIsOfficialQuizActive,officialQuizIdx,setOfficialQuizIdx,officialQuizAnswers,setOfficialQuizAnswers,officialQuizScore,setOfficialQuizScore,submittingQuiz,setSubmittingQuiz,assignmentText,setAssignmentText,submittingAss,setSubmittingAss,assSuccessMsg,setAssSuccessMsg,isMascotConnected,setIsMascotConnected,ensureNumberedNotes,lastReportedTimeRef,handleExplainMoment,handleSaveQuickNote,handleSaveManualNote,handleDeleteNoteById,handleDownloadNote,handleDownloadAllNotes,handleToggleDictation,handleAskQuestion,handleGeneratePracticeQuiz,handleOfficialQuizSubmit,handleOfficialAssignmentSubmit};
}
