'use client';
import { getVoiceTicket } from '@/features/voice-tutor/api/ticket';
import * as featureStyleFunctions from '@/features/viva-interview/styles/View.8f5bc040.styles.js';

import inlineStyles from '@/features/viva-interview/styles/viva-interview-page.jsx.styles.js';


import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, FileText, ChevronRight, ChevronDown, HelpCircle, ArrowLeft, Send, 
  AlertCircle, ShieldAlert, CheckCircle, Volume2, VolumeX, RotateCcw, 
  BookOpen, Code, Brain, Settings, Loader2, FlaskConical, 
  Upload, Mic, MicOff, Check, RefreshCw, Printer, AlertTriangle, FileCheck,
  Edit3, ListFilter, Gauge, Zap, Search, Activity, BarChart2, Trash2,
  Radio, PhoneOff, Wifi, Lightbulb, Flag, Clock, Target, CheckCircle2, XCircle,
  Sparkles, Code2, Lock
} from 'lucide-react';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getJwtToken } from '@/lib/jwtCache';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const MathEquationRenderer = dynamic(() => import('@/components/labs/MathEquationRenderer'), { ssr: false });
import VedikaParticleBot from '@/components/VedikaParticleBot';

// Lazy loader for 4.7MB static questions pool to eliminate initial thread freeze and boost load speed
let _cachedAptitudeData = null;
async function getAptitudeData() {
  if (!_cachedAptitudeData) {
    try {
      const mod = await import('@/lib/aptitudeQuestions.json');
      _cachedAptitudeData = mod.default || mod;
    } catch (e) {
      _cachedAptitudeData = { questions: [] };
    }
  }
  return _cachedAptitudeData;
}

const STORAGE_SESSION_KEY = 'vyomanta_active_viva_session';

export const APTITUDE_CATEGORIES = {
  "Quantitative Aptitude": [
    "Number System", "Percentages", "Profit and Loss", "Simple & Compound Interest",
    "Ratio and Proportion", "Partnership", "Averages", "Mixtures and Allegations",
    "Time and Work", "Pipes and Cisterns", "Time, Speed and Distance", "Boats and Streams",
    "Problems on Ages", "Permutations and Combinations", "Probability", "Geometry",
    "Mensuration (2D & 3D)", "Algebra", "Logarithms", "Progressions (AP, GP)",
    "Data Interpretation", "Data Sufficiency"
  ],
  "Logical Reasoning": [
    "Coding-Decoding", "Blood Relations", "Direction Sense", "Seating Arrangement",
    "Puzzles", "Syllogisms", "Statement and Assumption", "Statement and Conclusion",
    "Cause and Effect", "Analogies", "Series (Number/Letter)", "Odd One Out",
    "Ranking and Order", "Clocks and Calendars", "Cubes and Dice", "Venn Diagrams"
  ],
  "Verbal Ability": [
    "Reading Comprehension", "Vocabulary", "Synonyms and Antonyms", "Sentence Correction",
    "Error Detection", "Fill in the Blanks", "Para Jumbles", "Sentence Completion",
    "Idioms and Phrases", "One-Word Substitution", "Active and Passive Voice",
    "Direct and Indirect Speech", "Grammar"
  ],
  "Non-Verbal Reasoning": [
    "Mirror Images", "Paper Folding", "Figure Series", "Pattern Completion",
    "Embedded Figures", "Image Rotation"
  ],
  "CS & Technical Fundamentals": [
    "Computer Fundamentals", "Pseudocode",
    "Basic Programming (C, C++, Java, Python)", "SQL", "Operating Systems",
    "DBMS", "Computer Networks", "Object-Oriented Programming (OOPs)"
  ]
};

export const PRIORITY_TOPICS = [
  "Percentages", "Profit and Loss", "Ratio and Proportion", "Time and Work",
  "Time, Speed and Distance", "Averages", "Data Interpretation", "Number System",
  "Seating Arrangement", "Puzzles", "Coding-Decoding", "Blood Relations",
  "Reading Comprehension", "Grammar", "Vocabulary", "Para Jumbles", "SQL"
];

export default function VivaInterviewPage() {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);

  const handleGoBack = () => {
    if (gameState !== 'setup' || aptSession.status === 'active' || aptSession.status === 'scorecard') {
      setGameState('setup');
      setSessionMode('aptitude');
      setAptSession({ status: 'setup', questions: [], currentIndex: 0, answers: {} });
      setCurrentAptQuestion(null);
      setSelectedAptOption(null);
      setShowAptSolution(false);
      setShowAptHint(false);
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('vedika_aptitude_active_session_v2');
        }
      } catch (e) {}
      return;
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/vedika-ai');
    }
  };

  // Configuration States
  const [sessionMode, setSessionMode] = useState('viva'); // 'viva' | 'interview' | 'aptitude'
  const [setupStep, setSetupStep] = useState(1); // 1: Topic, 2: Level & Scope, 3: Oral Engine, 4: Start
  const [interviewStep, setInterviewStep] = useState(1); // 1: Target Role, 2: Seniority & Stack, 3: Rigor & Mode, 4: Start
  const [maxUnlockedVivaStep, setMaxUnlockedVivaStep] = useState(1);
  const [maxUnlockedInterviewStep, setMaxUnlockedInterviewStep] = useState(1);
  const [enteringHeroViva, setEnteringHeroViva] = useState(1); // 1 on load: triggers Iron Man slow-mo flight entrance
  const [enteringHeroInterview, setEnteringHeroInterview] = useState(1);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('College'); // Viva: 'School' | 'College' | 'PG', Interview: 'Junior' | 'Mid-Level' | 'Senior'
  const [vivaFocus, setVivaFocus] = useState('Comprehensive Oral Voce');
  const [difficulty, setDifficulty] = useState('Medium'); // 'Easy' | 'Medium' | 'Hard'
  const [interviewFormat, setInterviewFormat] = useState('Interactive Live Screen');
  const [topic, setTopic] = useState('');
  const [activeSessionTopic, setActiveSessionTopic] = useState('');
  const [isMobileInfoExpanded, setIsMobileInfoExpanded] = useState(false);

  // Support direct mode selection via URL query param (?mode=interview | viva | aptitude) and live mascot navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyMode = (modeStr) => {
      const m = (modeStr || '').toLowerCase();
      if (m === 'interview' || m === 'technical') {
        setIsRightOpen(true);
        setSessionMode('interview');
      } else if (m === 'aptitude') {
        setIsRightOpen(false);
        setSessionMode('aptitude');
      } else if (m === 'viva' || m === 'oral') {
        setIsRightOpen(false);
        setSessionMode('viva');
      }
    };
    const params = new URLSearchParams(window.location.search);
    applyMode(params.get('mode'));

    const onModeEvent = (e) => applyMode(e?.detail?.mode);
    window.addEventListener('viva_mode_change', onModeEvent);
    return () => window.removeEventListener('viva_mode_change', onModeEvent);
  }, []);

  // Aptitude Mode States
  const [aptCategory, setAptCategory] = useState("Quantitative Aptitude");
  const [aptTopic, setAptTopic] = useState("Time and Work");
  const [aptCustomTopic, setAptCustomTopic] = useState("");
  const [aptDifficulty, setAptDifficulty] = useState('Medium'); // 'Easy' | 'Medium' | 'Difficult'
  const [aptTestMode, setAptTestMode] = useState('fixed'); // 'fixed' | 'adaptive'
  const [aptTopicDropdownOpen, setAptTopicDropdownOpen] = useState(false);
  const [vivaLevelDropdownOpen, setVivaLevelDropdownOpen] = useState(false);
  const [interviewLevelDropdownOpen, setInterviewLevelDropdownOpen] = useState(false);
  
  // 20-Question Test Session State
  const [aptSession, setAptSession] = useState({
    status: 'setup', // 'setup' | 'active' | 'scorecard'
    questions: [], // array of up to 20 question objects
    currentIndex: 0, // 0..19
    answers: {}, // { [qIndex]: selectedOptionIndex }
    isFetchingMore: false,
    startTime: null,
    endTime: null,
    topic: 'Time and Work',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium'
  });

  const [currentAptQuestion, setCurrentAptQuestion] = useState(null);
  const [selectedAptOption, setSelectedAptOption] = useState(null);
  const [showAptHint, setShowAptHint] = useState(false);
  const [showAptSolution, setShowAptSolution] = useState(false);
  const [aptTimer, setAptTimer] = useState(180);
  const [aptScore, setAptScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [generatingAiAptitude, setGeneratingAiAptitude] = useState(false);
  const [aptSessionRestoredAlert, setAptSessionRestoredAlert] = useState(false);
  
  // Custom Viva Setup States
  const [vivaSource, setVivaSource] = useState('custom');
  const [selectedExperiment, setSelectedExperiment] = useState('');
  const [customVivaTopic, setCustomVivaTopic] = useState('');

  // Topic Validation & Strike Counter States
  const [topicRejectionCount, setTopicRejectionCount] = useState(0);
  const [topicValidationAlert, setTopicValidationAlert] = useState('');

  // Interview Setup States
  const [programmingLanguage, setProgrammingLanguage] = useState('');
  const [jdText, setJdText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState('');
  const [resumeBlueprint, setResumeBlueprint] = useState(null);
  const [parsingResume, setParsingResume] = useState(false);

  // Runtime States
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'active' | 'analyzing' | 'summary'
  const [analysisStep, setAnalysisStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQuestionType, setCurrentQuestionType] = useState('main'); // 'main' | 'follow_up'
  const [currentProbedPoint, setCurrentProbedPoint] = useState('');
  const [currentAcknowledgment, setCurrentAcknowledgment] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  
  // Execution Engine & Dynamic Flow States
  const [executionMode, setExecutionMode] = useState('turn'); // 'turn' (Turn Guided 90s Rounds) | 'live' (Realtime Voice Examiner)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(900); // 15-minute global countdown (900 seconds)
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(90); // 90-second turn countdown for turn-mode
  const [currentStageInfo, setCurrentStageInfo] = useState({
    topicName: "Core Principles",
    questionType: "main",
    topicIndex: 1,
    followUpIndex: 0
  });

  // Gemini Live Runtime States (Identical to Voice Tutor)
  const [liveConnectionStatus, setLiveConnectionStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'tutor-speaking' | 'error'
  const [liveStatusMessage, setLiveStatusMessage] = useState('Tap start to begin your oral examination');
  const [liveConversation, setLiveConversation] = useState([]);
  const [liveIsMuted, setLiveIsMuted] = useState(false);
  
  // Realtime Voice Scratchpad & Captions Transcript States
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  
  // Voice & Audio States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'text'
  const [savedSessionFound, setSavedSessionFound] = useState(null);

  // Robust client token retrieval with local fallback to prevent authentication blocking
  const getSafeAuthToken = useCallback(async () => {
    try {
      const tok = await getJwtToken();
      if (tok) return tok;
    } catch (e) {
      console.warn('[Viva] getJwtToken fallback:', e);
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || localStorage.getItem('jwt') || '';
    }
    return '';
  }, []);
  
  // Superhero Entrance Animation & Step Unlock Timers (1.0s synchronized sequence)
  useEffect(() => {
    if (enteringHeroViva) {
      const timer = setTimeout(() => {
        setEnteringHeroViva(null);
      }, 1050);
      return () => clearTimeout(timer);
    }
  }, [enteringHeroViva]);

  useEffect(() => {
    if (enteringHeroInterview) {
      const timer = setTimeout(() => {
        setEnteringHeroInterview(null);
      }, 1050);
      return () => clearTimeout(timer);
    }
  }, [enteringHeroInterview]);

  const advanceVivaStep = (nextStep) => {
    setSetupStep(nextStep);
    setMaxUnlockedVivaStep((prev) => Math.max(prev, nextStep));
    setEnteringHeroViva(nextStep);
  };

  const advanceInterviewStep = (nextStep) => {
    setInterviewStep(nextStep);
    setMaxUnlockedInterviewStep((prev) => Math.max(prev, nextStep));
    setEnteringHeroInterview(nextStep);
  };
  
  // History & Scorecard
  const [history, setHistory] = useState([]);
  const [scorecard, setScorecard] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);
  const [turnStartTime, setTurnStartTime] = useState(Date.now());

  // Web Speech & MediaRecorder Refs
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isRecordingRef = useRef(false);
  const userAnswerRef = useRef('');
  const baseTextRef = useRef('');
  const sessionFinalRef = useRef('');
  const silenceTimeoutRef = useRef(null);
  const liveLastAudioTimeRef = useRef(Date.now());
  const globalTimerRef = useRef(null);
  const turnTimerRef = useRef(null);
  const isNewExaminerTurnRef = useRef(true);

  // Gemini Live Audio & WebSocket Refs (Identical to VoiceAgentView)
  const liveSessionRef = useRef(null);
  const liveWsRef = useRef(null);
  const liveAudioCtxRef = useRef(null);
  const liveProcessorRef = useRef(null);
  const liveSourceRef = useRef(null);
  const liveMicStreamRef = useRef(null);
  const liveNextPlayTimeRef = useRef(0);
  const liveAudioSourcesQueueRef = useRef([]);
  const liveIsMutedRef = useRef(false);
  const liveWsHadErrorRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);

  useEffect(() => {
    liveIsMutedRef.current = liveIsMuted;
  }, [liveIsMuted]);

  // Keep userAnswerRef synchronized with state for callbacks
  useEffect(() => {
    userAnswerRef.current = userAnswer;
  }, [userAnswer]);

  // Aptitude Question Loader & Session Engine
  const getSeenQuestionHashes = () => {
    try {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('vedika_aptitude_seen_hashes') || '[]');
      }
    } catch (e) {}
    return [];
  };

  const markQuestionAsSeen = (qText) => {
    try {
      if (typeof window !== 'undefined' && qText) {
        const hash = String(qText).toLowerCase().trim().replace(/\s+/g, ' ');
        const seen = getSeenQuestionHashes();
        if (!seen.includes(hash)) {
          const updated = [hash, ...seen].slice(0, 150);
          localStorage.setItem('vedika_aptitude_seen_hashes', JSON.stringify(updated));
        }
      }
    } catch (e) {}
  };

  const saveAptSessionToStorage = (sessionData) => {
    try {
      if (typeof window !== 'undefined' && sessionData) {
        localStorage.setItem('vedika_aptitude_active_session_v2', JSON.stringify(sessionData));
      }
    } catch (e) {}
  };

  // Restore Active Aptitude Session on Mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('vedika_aptitude_active_session_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.status === 'active' && parsed.questions?.length > 0) {
            const idx = parsed.currentIndex || 0;
            setAptSession(parsed);
            setCurrentAptQuestion(parsed.questions[idx] || parsed.questions[0]);
            setSelectedAptOption(parsed.answers?.[idx] ?? null);
            setAptSessionRestoredAlert(true);
            setGameState('active');
            setSessionMode('aptitude');
          }
        }
      }
    } catch (e) {}
  }, []);

  const topicAliasMap = {
    "Reading Comprehension": ["Theme Detection", "Critical Reasoning", "Reading Comprehension"],
    "Vocabulary": ["Theme Detection", "Critical Reasoning", "Vocabulary"],
    "Synonyms and Antonyms": ["Theme Detection", "Critical Reasoning"],
    "Sentence Correction": ["Statement and Conclusion", "Critical Reasoning"],
    "Error Detection": ["Statement and Conclusion", "Critical Reasoning"],
    "Fill in the Blanks": ["Statement and Inferences", "Critical Reasoning"],
    "Para Jumbles": ["Logical Problems", "Critical Reasoning"],
    "Sentence Completion": ["Statement and Inferences", "Critical Reasoning"],
    "Grammar": ["Statement and Conclusion", "Critical Reasoning"],
    "Mirror Images": ["Mirror and Water Images"],
    "Paper Folding": ["Paper Folding and Cutting"],
    "Figure Series": ["Completion of Incomplete Pattern", "Figure Matrix"],
    "Pattern Completion": ["Completion of Incomplete Pattern"],
    "Embedded Figures": ["Embedded Figures"],
    "Image Rotation": ["Image Analysis"],
    "Analogies": ["Analogy (Verbal & Non-Verbal)"],
    "Odd One Out": ["Classification / Odd One Out"],
    "Ranking and Order": ["Order and Ranking"],
    "Direction Sense": ["Direction Sense Test"],
    "Statement and Assumption": ["Statement and Assumptions"],
    "Syllogisms": ["Syllogism"],
    "Series (Number/Letter)": ["Logical Series Completion"],
    "Cubes and Dice": ["Matrix Reasoning"],
    "Puzzles": ["Logical Problems"],
    "SQL": ["Data Interpretation (Tables)", "Coding-Decoding"],
    "Operating Systems": ["Logical Problems", "Coding-Decoding"],
    "DBMS": ["Data Interpretation (Tables)", "Coding-Decoding"],
    "Computer Networks": ["Logical Problems"],
    "OOPs": ["Logical Problems", "Coding-Decoding"],
    "Basic Programming (C, C++, Java, Python)": ["Coding-Decoding", "Logical Problems"],
    "Basic Mathematics": ["Number System", "Simplification and Approximation"]
  };

  const isTechnicalCategory = (cat, top) => {
    if (cat === 'CS & Technical Fundamentals' || cat === 'Custom Topic') return true;
    const techTopics = [
      'Computer Fundamentals', 'Pseudocode',
      'Basic Programming (C, C++, Java, Python)', 'SQL', 'Operating Systems',
      'DBMS', 'Computer Networks', 'Object-Oriented Programming (OOPs)'
    ];
    return techTopics.some(t => String(top || '').toLowerCase().includes(t.toLowerCase()));
  };

  const fetchSingleAptitudeQuestion = async (top, cat, diff, existingQuestions = []) => {
    try {
      const avoidList = existingQuestions.map(q => String(q.question || '').slice(0, 80));
      const res = await fetch('/api/generate-aptitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: top,
          category: cat,
          difficulty: diff,
          avoidQuestions: avoidList
        })
      });
      const data = await res.json();
      if (data?.success && data?.question) {
        return data.question;
      }
    } catch (err) {
      console.warn('API question fetch error:', err);
    }
    return null;
  };

  const start20QuestionAptitudeSession = async (overrideTopic = null) => {
    const selectedTop = (overrideTopic || aptCustomTopic.trim() || aptTopic || 'General Aptitude').trim();
    const targetDiff = aptDifficulty;
    const cat = aptCategory;

    const isTech = isTechnicalCategory(cat, selectedTop);
    const aptData = await getAptitudeData();
    const staticList = aptData?.questions || [];
    let cachedList = [];
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('vedika_custom_aptitude_pool');
        if (stored) cachedList = JSON.parse(stored);
      }
    } catch (e) {}

    const combinedPool = [...staticList, ...cachedList];
    const seenHashes = new Set(getSeenQuestionHashes());

    // Normalize category mapping (e.g. Verbal Ability -> Verbal Reasoning, Non-Verbal Reasoning -> Non-Verbal Reasoning)
    const normalizedCat = (cat === 'Verbal Ability' ? 'Verbal' : cat === 'Non-Verbal Reasoning' ? 'Non-Verbal' : cat).toLowerCase();
    const topicAliases = topicAliasMap[selectedTop] || [selectedTop];

    // Filter matching questions from local pool
    let matching = combinedPool.filter(q => {
      const hash = String(q.question || '').toLowerCase().trim().replace(/\s+/g, ' ');
      if (seenHashes.has(hash)) return false;
      const qTop = String(q.topic || '').toLowerCase();
      return topicAliases.some(alias => qTop.includes(alias.toLowerCase()));
    });

    if (matching.length < 20 && !isTech) {
      const categoryMatches = combinedPool.filter(q => {
        const hash = String(q.question || '').toLowerCase().trim().replace(/\s+/g, ' ');
        if (seenHashes.has(hash)) return false;
        if (matching.some(m => m.id === q.id)) return false;
        return String(q.category || '').toLowerCase().includes(normalizedCat);
      });
      matching = [...matching, ...categoryMatches];
    }

    if (matching.length < 20 && !isTech) {
      const fallbackMatches = combinedPool.filter(q => !matching.some(m => m.id === q.id));
      matching = [...matching, ...fallbackMatches];
    }

    let initialQuestions = [];
    if (matching.length > 0 && !isTech) {
      const shuffled = [...matching].sort(() => 0.5 - Math.random());
      initialQuestions = shuffled.slice(0, 20);
    }

    // If technical category with no local questions, fetch Question 1 from AI immediately
    if (initialQuestions.length === 0 && isTech) {
      const pendingSession = {
        status: 'active',
        questions: [],
        currentIndex: 0,
        answers: {},
        isFetchingMore: false,
        startTime: Date.now(),
        topic: selectedTop,
        category: cat,
        difficulty: targetDiff
      };
      setAptSession(pendingSession);
      setGameState('active');
      setSessionMode('aptitude');
      setGeneratingAiAptitude(true);

      const firstQ = await fetchSingleAptitudeQuestion(selectedTop, cat, targetDiff, []);
      setGeneratingAiAptitude(false);

      const finalQs = firstQ ? [firstQ] : [combinedPool[Math.floor(Math.random() * matching.length ? matching : combinedPool)]];
      const updatedSession = { ...pendingSession, questions: finalQs };
      setAptSession(updatedSession);
      setCurrentAptQuestion(finalQs[0]);
      setSelectedAptOption(null);
      setShowAptHint(false);
      setShowAptSolution(false);
      const initialTime = targetDiff === 'Easy' ? 120 : targetDiff === 'Medium' ? 180 : 240;
      setAptTimer(initialTime);
      markQuestionAsSeen(finalQs[0].question);
      saveAptSessionToStorage(updatedSession);
      return;
    }

    const newSession = {
      status: 'active',
      questions: initialQuestions,
      currentIndex: 0,
      answers: {},
      isFetchingMore: false,
      startTime: Date.now(),
      topic: selectedTop,
      category: cat,
      difficulty: targetDiff
    };

    setAptSession(newSession);
    setGameState('active');
    setSessionMode('aptitude');

    if (initialQuestions.length > 0) {
      setCurrentAptQuestion(initialQuestions[0]);
      setSelectedAptOption(null);
      setShowAptHint(false);
      setShowAptSolution(false);
      const initialTime = targetDiff === 'Easy' ? 120 : targetDiff === 'Medium' ? 180 : 240;
      setAptTimer(initialTime);
      markQuestionAsSeen(initialQuestions[0].question);
    }

    saveAptSessionToStorage(newSession);
  };

  const handleSelectAptOption = (optIndex) => {
    if (selectedAptOption !== null || showAptSolution) return;
    setSelectedAptOption(optIndex);

    const cIdx = aptSession.currentIndex;
    const isCorrect = currentAptQuestion ? optIndex === currentAptQuestion.correct_option : false;

    setAptScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    setAptSession(prev => {
      const updatedAnswers = { ...prev.answers, [cIdx]: optIndex };
      const updated = { ...prev, answers: updatedAnswers };
      saveAptSessionToStorage(updated);
      return updated;
    });

    if (currentAptQuestion) {
      markQuestionAsSeen(currentAptQuestion.question);
    }
  };

  const handleNavigateAptSession = async (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= 20 || generatingAiAptitude) return;

    // 1. Target question already exists in questions array
    if (targetIndex < aptSession.questions.length) {
      const nextQ = aptSession.questions[targetIndex];
      setCurrentAptQuestion(nextQ);
      setSelectedAptOption(aptSession.answers[targetIndex] ?? null);
      setShowAptHint(false);
      setShowAptSolution(false);
      const initialTime = aptDifficulty === 'Easy' ? 120 : aptDifficulty === 'Medium' ? 180 : 240;
      setAptTimer(initialTime);

      setAptSession(prev => {
        const updated = { ...prev, currentIndex: targetIndex };
        saveAptSessionToStorage(updated);
        return updated;
      });
      return;
    }

    // 2. Target question needs to be generated via Gemini API on-demand (when clicking Next)
    if (targetIndex === aptSession.questions.length && targetIndex < 20) {
      setGeneratingAiAptitude(true);
      try {
        const newQ = await fetchSingleAptitudeQuestion(
          aptSession.topic,
          aptSession.category,
          aptSession.difficulty,
          aptSession.questions
        );

        const aptData = await getAptitudeData();
        const staticList = aptData?.questions || [];
        const fallbackQ = staticList.find(q => !aptSession.questions.some(existing => existing.id === q.id)) || staticList[0];
        const nextQ = newQ || fallbackQ;

        const updatedQuestions = [...aptSession.questions, nextQ];
        markQuestionAsSeen(nextQ.question);

        try {
          if (typeof window !== 'undefined' && newQ) {
            const cached = JSON.parse(localStorage.getItem('vedika_custom_aptitude_pool') || '[]');
            cached.push(newQ);
            localStorage.setItem('vedika_custom_aptitude_pool', JSON.stringify(cached));
          }
        } catch (e) {}

        const updatedSession = {
          ...aptSession,
          questions: updatedQuestions,
          currentIndex: targetIndex
        };

        setAptSession(updatedSession);
        setCurrentAptQuestion(nextQ);
        setSelectedAptOption(null);
        setShowAptHint(false);
        setShowAptSolution(false);
        const initialTime = aptDifficulty === 'Easy' ? 120 : aptDifficulty === 'Medium' ? 180 : 240;
        setAptTimer(initialTime);
        saveAptSessionToStorage(updatedSession);
      } catch (err) {
        console.warn('[On-demand generation error]:', err);
      } finally {
        setGeneratingAiAptitude(false);
      }
    }
  };

  const handleFinishAptSession = () => {
    setAptSession(prev => {
      const updated = { ...prev, status: 'scorecard', endTime: Date.now() };
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('vedika_aptitude_active_session_v2');
        }
      } catch (e) {}
      return updated;
    });
  };

  const handleAptGiveUp = () => {
    setShowAptSolution(true);
  };

  // Aptitude Active Timer Effect
  useEffect(() => {
    let timerId = null;
    if (sessionMode === 'aptitude' && currentAptQuestion && !showAptSolution && aptTimer > 0 && aptSession.status === 'active') {
      timerId = setInterval(() => {
        setAptTimer(prev => {
          if (prev <= 1) {
            setShowAptSolution(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [sessionMode, currentAptQuestion, showAptSolution, aptTimer, aptSession.status]);

  // Teardown all live audio playback
  const stopAllLiveAudioPlaybacks = () => {
    liveAudioSourcesQueueRef.current.forEach((src) => {
      try { src.stop(); } catch (e) {}
    });
    liveAudioSourcesQueueRef.current = [];
    liveNextPlayTimeRef.current = 0;
  };

  // Play 24kHz PCM chunk received from Gemini Live (Smooth Continuous Queue)
  const playLivePcmAudioChunk = (base64Data) => {
    if (liveIsMutedRef.current || !liveAudioCtxRef.current) return;
    try {
      const audioCtx = liveAudioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const binaryString = atob(base64Data);
      const buffer = new ArrayBuffer(binaryString.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < binaryString.length; i++) view[i] = binaryString.charCodeAt(i);
      const int16Samples = new Int16Array(buffer);
      const audioBuffer = audioCtx.createBuffer(1, int16Samples.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < int16Samples.length; i++) channelData[i] = int16Samples[i] / 32768.0;
      const bufferSource = audioCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(audioCtx.destination);
      liveAudioSourcesQueueRef.current.push(bufferSource);

      bufferSource.onended = () => {
        liveAudioSourcesQueueRef.current = liveAudioSourcesQueueRef.current.filter((src) => src !== bufferSource);
        if (liveAudioSourcesQueueRef.current.length === 0) {
          setLiveConnectionStatus('connected');
          setLiveStatusMessage('Examiner is listening... Feel free to speak.');
        }
      };

      const now = audioCtx.currentTime;
      if (liveNextPlayTimeRef.current < now) {
        liveNextPlayTimeRef.current = now + 0.05;
      }
      setLiveConnectionStatus('tutor-speaking');
      setLiveStatusMessage('Examiner is speaking...');
      bufferSource.start(liveNextPlayTimeRef.current);
      liveNextPlayTimeRef.current += audioBuffer.duration;
    } catch (err) {
      console.error('[Gemini Live Playback error]:', err);
    }
  };

  // Disconnect Gemini Live WebSocket & Release Audio (Identical to VoiceAgentView)
  const disconnectGeminiLive = (preserveMessage = false) => {
    if (liveSessionRef.current) {
      try { liveSessionRef.current.close(); } catch (e) {}
      liveSessionRef.current = null;
    }
    if (liveWsRef.current) {
      try { liveWsRef.current.close(); } catch (e) {}
      liveWsRef.current = null;
    }
    stopAllLiveAudioPlaybacks();
    if (liveAudioCtxRef.current) {
      try { liveAudioCtxRef.current.close(); } catch (e) {}
      liveAudioCtxRef.current = null;
    }
    if (liveProcessorRef.current) {
      try { liveProcessorRef.current.disconnect(); } catch (e) {}
      liveProcessorRef.current = null;
    }
    if (liveSourceRef.current) {
      try { liveSourceRef.current.disconnect(); } catch (e) {}
      liveSourceRef.current = null;
    }
    if (liveMicStreamRef.current) {
      liveMicStreamRef.current.getTracks().forEach((t) => t.stop());
      liveMicStreamRef.current = null;
    }
    setLiveConnectionStatus('disconnected');
    if (!preserveMessage) {
      setLiveStatusMessage('Oral examination ended. Press start to begin again.');
    }
  };

  // Setup Presets
  const subjects = ['Physics', 'Chemistry', 'Biology', 'Computer Science', 'Mathematics'];
  const experimentPresets = {
    'Physics': ["Ohm's Law & Circuit Resistance", "Young's Double Slit Experiment", "Compound Pendulum & Gravity g", "Hooke's Law & Elasticity"],
    'Chemistry': ["Acid-Base Titration & Molarity", "Qualitative Salt Analysis", "Volumetric Analysis", "Electrochemistry & EMF"],
    'Biology': ["Photosynthesis & Light Spectrum", "Cell Mitosis Observation", "Enzyme Kinetics & Temperature"],
    'Computer Science': ["Binary Search Trees & Traversal", "Sorting Algorithm Complexities", "TCP/IP 3-Way Handshake", "SQL Indexing & Joins"],
    'Mathematics': ["Differential Equations & Calculus", "Matrix Eigenvalues & Vectors", "Probability Distributions"]
  };
  const programmingLanguages = ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'Systems & Cloud Architecture', 'Fullstack Web'];

  // Check for Saved Session on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.history && parsed.history.length > 0 && parsed.currentQIndex < 5) {
          setSavedSessionFound(parsed);
        }
      }
    } catch (e) {
      console.warn('[Viva] Error reading saved session:', e);
    }
  }, []);

  // Teardown speech recognition and live voice
  const cleanupRecognition = () => {
    isRecordingRef.current = false;
    disconnectGeminiLive();
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  };

  // Global 15-Minute Session Countdown Timer (900s)
  useEffect(() => {
    if (gameState === 'active') {
      globalTimerRef.current = setInterval(() => {
        setSessionTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(globalTimerRef.current);
            // 15:00 Hard Cutoff
            if (executionMode === 'live') {
              handleFinishLiveExam();
            } else {
              handleFinalizeSession(history);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (globalTimerRef.current) clearInterval(globalTimerRef.current);
    }
    return () => {
      if (globalTimerRef.current) clearInterval(globalTimerRef.current);
    };
  }, [gameState, executionMode, history]);

  // Turn-Guided Mode 90s Per-Turn Countdown Timer
  useEffect(() => {
    if (gameState === 'active' && executionMode === 'turn') {
      setTurnTimeRemaining(90);
      turnTimerRef.current = setInterval(() => {
        setTurnTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(turnTimerRef.current);
            // 90s Turn Timeout -> Auto Skip
            handleSkipQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    }
    return () => {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    };
  }, [gameState, executionMode, currentQIndex, currentQuestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRecognition();
      if (globalTimerRef.current) clearInterval(globalTimerRef.current);
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech Output
  const speakText = (text) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[TTS] failed:', e);
      setIsSpeaking(false);
    }
  };

  // Re-speak or Rephrase Current Question without Penalty or Advancing Turn
  const handleRepeatQuestion = () => {
    if (!currentQuestion) return;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speakText(currentQuestion);
    setStatusMessage('Examiner is repeating the question...');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Start Web Speech API Recognition with incremental turn accumulation
  const startSpeechRecognition = (initialBaseText = '') => {
    if (typeof window === 'undefined') return;

    // Teardown any existing instance first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    baseTextRef.current = initialBaseText;
    sessionFinalRef.current = '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          isRecordingRef.current = true;
        };

        recognition.onresult = (event) => {
          let interim = '';
          let newlyFinalized = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            const transcript = res[0]?.transcript || '';
            if (res.isFinal) {
              newlyFinalized += transcript + ' ';
            } else {
              interim += transcript;
            }
          }

          // Intercept repeat voice commands so they don't get written into candidate's answer
          const latestSpoken = (newlyFinalized || interim).toLowerCase().trim();
          if (
            latestSpoken === 'repeat' ||
            latestSpoken === 'repeat it' ||
            latestSpoken === 'repeat question' ||
            latestSpoken === 'repeat the question' ||
            latestSpoken === 'can you repeat' ||
            latestSpoken === 'can you repeat the question' ||
            latestSpoken === 'could you repeat' ||
            latestSpoken === 'say again' ||
            latestSpoken === 'say that again' ||
            latestSpoken === 'pardon'
          ) {
            handleRepeatQuestion();
            return;
          }

          // Intercept skip voice commands
          if (
            latestSpoken === 'skip' ||
            latestSpoken === 'skip it' ||
            latestSpoken === 'skip question' ||
            latestSpoken === 'skip the question' ||
            latestSpoken === 'pass' ||
            latestSpoken === 'i don\'t know' ||
            latestSpoken === 'dont know'
          ) {
            handleSkipQuestion();
            return;
          }

          if (newlyFinalized) {
            sessionFinalRef.current = (sessionFinalRef.current + ' ' + newlyFinalized).replace(/\s+/g, ' ').trim();
          }

          const curFinal = sessionFinalRef.current;
          const curInterim = interim.trim();

          let speech = curFinal;
          if (curInterim) {
            speech = speech ? `${speech} ${curInterim}` : curInterim;
          }

          const base = (baseTextRef.current || '').trim();
          let combined = base;
          if (speech) {
            combined = base ? `${base} ${speech}` : speech;
          }

          setUserAnswer(combined);
        };

        recognition.onerror = (event) => {
          if (event.error === 'no-speech' || event.error === 'aborted') {
            return;
          }
          console.warn('[SpeechRecognition] error:', event.error);
          if (event.error === 'not-allowed') {
            setIsRecording(false);
            isRecordingRef.current = false;
          }
        };

        recognition.onend = () => {
          // If the user hasn't explicitly stopped, restart seamlessly on silence timeout
          if (isRecordingRef.current) {
            baseTextRef.current = userAnswerRef.current;
            sessionFinalRef.current = '';

            try {
              recognition.start();
            } catch (err) {
              setTimeout(() => {
                if (isRecordingRef.current) {
                  startSpeechRecognition(userAnswerRef.current);
                }
              }, 250);
            }
          } else {
            setIsRecording(false);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
        isRecordingRef.current = true;
      } catch (e) {
        console.warn('[SpeechRecognition] startup failed, falling back:', e);
        startMediaRecorderFallback();
      }
    } else {
      startMediaRecorderFallback();
    }
  };

  // Fallback MediaRecorder for unsupported browsers
  const startMediaRecorderFallback = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Speech recognition is not supported in this browser. Please type your answer or use Google Chrome / Microsoft Edge.");
      setIsRecording(false);
      isRecordingRef.current = false;
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const token = await getSafeAuthToken();
            const res = await fetch('/api/viva-interview', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                action: 'transcribe-audio',
                audioBase64: reader.result,
                audioMimeType: 'audio/webm'
              })
            });
            const data = await res.json();
            if (data.text) {
              const base = baseTextRef.current ? baseTextRef.current.trim() : '';
              const newText = base ? `${base} ${data.text.trim()}` : data.text.trim();
              setUserAnswer(newText);
              baseTextRef.current = newText;
            }
          } catch (err) {
            console.error('[Audio Transcribe Error]:', err);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      isRecordingRef.current = true;
    } catch (err) {
      console.warn('[MediaRecorder Error]:', err);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  // Toggle Microphone (Start / Stop Recording)
  const toggleRecording = () => {
    if (isRecording || isRecordingRef.current) {
      cleanupRecognition();
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      startSpeechRecognition(userAnswer);
    }
  };

  // Handle manual textarea edits & sync with recognition accumulator
  const handleUserAnswerChange = (e) => {
    const newVal = e.target.value;
    setUserAnswer(newVal);
    baseTextRef.current = newVal;
    sessionFinalRef.current = '';

    // If user cleared the text completely while recording, restart recognition so browser buffer resets
    if (newVal.trim() === '' && isRecordingRef.current) {
      startSpeechRecognition('');
    }
  };

  // Handle clear answer button click
  const handleClearAnswer = () => {
    setUserAnswer('');
    baseTextRef.current = '';
    sessionFinalRef.current = '';
    if (isRecordingRef.current) {
      startSpeechRecognition('');
    }
  };

  // Handle Resume File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setParsingResume(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setResumeBase64(base64Data);

      try {
        const token = await getSafeAuthToken();
        const res = await fetch('/api/viva-interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'parse-resume',
            resumeBase64: base64Data,
            resumeMimeType: file.type || 'application/pdf'
          })
        });
        const data = await res.json();
        if (data.blueprint) {
          setResumeBlueprint(data.blueprint);
          if (data.blueprint.targetRole) {
            setTopic(data.blueprint.targetRole);
          }
        }
      } catch (err) {
        console.error('[Resume Parse Error]:', err);
      } finally {
        setParsingResume(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process real-time agent speech transcription chunks
  const handleAgentTranscriptionChunk = (textChunk) => {
    if (!textChunk) return;
    
    if (/next\s+key\s+topic|move\s+to\s+our\s+next\s+topic/i.test(textChunk)) {
      setCurrentStageInfo((prev) => ({
        ...prev,
        topicIndex: prev.topicIndex + 1,
        questionType: 'main',
        followUpIndex: 0
      }));
    }

    if (/(write\s+(a\s+)?(program|code|function|query|script|algorithm)|in\s+the\s+scratchpad|open\s+the\s+scratchpad)/i.test(textChunk)) {
      setIsScratchpadOpen(true);
    }

    const isConclusion = /concludes\s+your\s+oral\s+examination|scorecard\s+report\s+is\s+ready/i.test(textChunk);
    if (isConclusion) {
      setTimeout(() => {
        handleFinishLiveExam();
      }, 3500);
    }

    setLiveConversation((prev) => {
      if (!isNewExaminerTurnRef.current && prev.length > 0 && prev[prev.length - 1].sender === 'examiner') {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: (updated[updated.length - 1].text ? updated[updated.length - 1].text + ' ' : '') + textChunk
        };
        return updated;
      }
      isNewExaminerTurnRef.current = false;
      return [...prev, { id: Math.random().toString(36).slice(2), sender: 'examiner', text: textChunk, timestamp: new Date() }];
    });
  };

  // Process candidate speech transcription chunks
  const handleUserTranscriptionChunk = (userText) => {
    if (!userText?.trim()) return;
    isNewExaminerTurnRef.current = true;
    setLiveConversation((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), sender: 'candidate', text: userText, timestamp: new Date() }
    ]);
  };

  // Configure continuous 16kHz PCM audio stream processor
  const setupLiveMicProcessor = (stream, audioCtx, onChunk) => {
    if (liveProcessorRef.current) {
      try { liveProcessorRef.current.disconnect(); } catch {}
      liveProcessorRef.current = null;
    }
    if (liveSourceRef.current) {
      try { liveSourceRef.current.disconnect(); } catch {}
      liveSourceRef.current = null;
    }
    const source = audioCtx.createMediaStreamSource(stream);
    liveSourceRef.current = source;
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    liveProcessorRef.current = processor;

    const silentGain = audioCtx.createGain();
    silentGain.gain.value = 0;
    source.connect(processor);
    processor.connect(silentGain);
    silentGain.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      if (
        liveIsMutedRef.current || 
        liveAudioSourcesQueueRef.current.length > 0
      ) return;

      const float32Data = e.inputBuffer.getChannelData(0);
      const pcmBuffer = new ArrayBuffer(float32Data.length * 2);
      const dataView = new DataView(pcmBuffer);
      let offset = 0;
      for (let i = 0; i < float32Data.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, float32Data[i]));
        dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
      let binary = '';
      const bytes = new Uint8Array(pcmBuffer);
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      onChunk(btoa(binary));
    };
  };

  // Direct Browser-to-Gemini-Live Connection (Zero-Latency WebSockets for Cloud / Vercel Deployments)
  const reportVoiceUnavailable = async () => {
    disconnectGeminiLive(true);
    setLiveConnectionStatus('error');
    setLiveStatusMessage('The secure voice server is unavailable. Please retry or ask your administrator to configure it.');
  };

  const startGeminiLiveSession = async (activeTopic, activeSubject, activeDifficulty, activeLevel, isReconnect = false, forcePort = null) => {
    try {
      setLiveConnectionStatus('connecting');
      setLiveStatusMessage(isReconnect ? 'Re-establishing live session with history replay...' : 'Initializing audio environment and connecting...');
      
      if (!isReconnect) {
        stopAllLiveAudioPlaybacks();
        setLiveConversation([]);
        reconnectAttemptsRef.current = 0;
      }
      setGameState('active');

      const stream = liveMicStreamRef.current || await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      liveMicStreamRef.current = stream;
      
      const audioCtx = liveAudioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      liveAudioCtxRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch (e) {}
      }

      const isLocalHost = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]'
      );

      // Dual-Port Strategy: Try dedicated voice port 5001 first, fallback to current window host (port 3000)
      const primaryWsHost = process.env.NEXT_PUBLIC_VOICE_WS_URL || process.env.NEXT_PUBLIC_WS_URL || (
        isLocalHost
          ? 'ws://localhost:5001'
          : `${typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${typeof window !== 'undefined' ? window.location.host : 'localhost'}`
      );

      const fallbackWsHost = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
      const targetWsHost = forcePort || primaryWsHost;

      const voiceSid = 'viva-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const voiceTicket = await getVoiceTicket(voiceSid);
      let wsUrl = `${targetWsHost}/api/ws?mode=${sessionMode}&topic=${encodeURIComponent(activeTopic || '')}&difficulty=${activeDifficulty || 'Medium'}&level=${activeLevel || 'College'}&programmingLanguage=${encodeURIComponent(programmingLanguage || '')}&sessionId=${voiceSid}`;
      wsUrl += `&ticket=${encodeURIComponent(voiceTicket)}`;
      if (isReconnect) wsUrl += `&reconnect=true`;

      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      const connTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          liveWsHadErrorRef.current = true;
          try { ws.close(); } catch {}
          if (!forcePort && targetWsHost !== fallbackWsHost) {
            console.warn('[WS] Primary port 5001 timed out. Falling back to port 3000...');
            startGeminiLiveSession(activeTopic, activeSubject, activeDifficulty, activeLevel, isReconnect, fallbackWsHost);
            return;
          }
          console.warn('[WS] Dedicated WebSocket unreachable. Connecting directly to Gemini Live API...');
          reportVoiceUnavailable(activeTopic, activeSubject, activeDifficulty, activeLevel);
        }
      }, 3000);

      ws.onopen = () => {
        clearTimeout(connTimeout);
        liveWsHadErrorRef.current = false;
        setLiveConnectionStatus('connected');
        setLiveStatusMessage(isReconnect ? 'Reconnected! Examiner is resuming examination...' : 'AI Examiner connected! Oral examination starting...');
        
        // Transmit history replay via WebSocket message (prevents URL length caps and log exposure)
        if (isReconnect && liveConversation.length > 0) {
          try {
            ws.send(JSON.stringify({
              type: 'reconnect-history',
              history: liveConversation.slice(-10)
            }));
          } catch (e) {
            console.warn('[WS] History replay send warning:', e);
          }
        }

        setupLiveMicProcessor(stream, audioCtx, (base64Data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'audio', data: base64Data }));
          }
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'status') {
            setLiveStatusMessage(message.message);
          } else if (message.type === 'error') {
            setLiveStatusMessage(message.message);
            setLiveConnectionStatus('error');
          } else if (message.type === 'audio') {
            playLivePcmAudioChunk(message.data);
          } else if (message.type === 'interrupted') {
            stopAllLiveAudioPlaybacks();
            setLiveConnectionStatus('connected');
            setLiveStatusMessage('Examiner was interrupted. Listening now...');
            isNewExaminerTurnRef.current = true;
          } else if (message.type === 'flow-update') {
            setCurrentStageInfo({
              topicName: message.topicName || activeTopic,
              questionType: message.questionType || 'main',
              topicIndex: message.topicIndex || 1,
              followUpIndex: message.followUpIndex || 0
            });
            isNewExaminerTurnRef.current = true;
          } else if (message.type === 'agent-transcription') {
            handleAgentTranscriptionChunk(message.text || '');
          } else if (message.type === 'user-transcription') {
            handleUserTranscriptionChunk(message.text || '');
          }
        } catch (err) {
          console.error('[WS] Message parse error:', err);
        }
      };

      ws.onclose = () => {
        clearTimeout(connTimeout);
        // Auto-reconnect if session dropped unexpectedly during an active exam
        if (!liveWsHadErrorRef.current && liveConversation.length > 0 && reconnectAttemptsRef.current < 2 && gameState === 'active') {
          reconnectAttemptsRef.current += 1;
          console.warn(`[WS] Mid-session WebSocket drop. Auto-reconnecting (attempt ${reconnectAttemptsRef.current}/2)...`);
          setLiveStatusMessage(`Reconnecting to AI Examiner (Attempt ${reconnectAttemptsRef.current}/2)...`);
          setTimeout(() => {
            startGeminiLiveSession(activeTopic, activeSubject, activeDifficulty, activeLevel, true, forcePort);
          }, 1500);
        } else if (!liveWsHadErrorRef.current) {
          disconnectGeminiLive(false);
        }
      };

      ws.onerror = () => {
        clearTimeout(connTimeout);
        liveWsHadErrorRef.current = true;
        try { ws.close(); } catch {}
        // Dual-port fallback on error if we haven't tried host port yet
        if (!forcePort && targetWsHost !== fallbackWsHost) {
          console.warn('[WS] Primary port error. Falling back to host port...');
          startGeminiLiveSession(activeTopic, activeSubject, activeDifficulty, activeLevel, isReconnect, fallbackWsHost);
          return;
        }
        console.warn('[WS] Dedicated WebSocket server unreachable. Connecting directly to Gemini Live API...');
        reportVoiceUnavailable(activeTopic, activeSubject, activeDifficulty, activeLevel);
      };
    } catch (err) {
      setLiveConnectionStatus('error');
      setLiveStatusMessage(`Unable to access mic: ${err.message || err}. Please permit microphone access.`);
    }
  };

  // Attach Scratchpad Notes/Code to candidate's answer
  const handleAttachScratchpadToAnswer = () => {
    if (scratchpadText.trim()) {
      const codeBlock = `\n[Candidate Written Code/Notes]:\n${scratchpadText.trim()}`;
      setLiveConversation((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].sender === 'candidate') {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: updated[updated.length - 1].text + codeBlock
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: Math.random().toString(36).slice(2),
            sender: 'candidate',
            text: codeBlock.trim(),
            timestamp: new Date()
          }
        ];
      });
      setScratchpadText('');
    }
    setIsScratchpadOpen(false);
  };

  // Complete Live Exam and generate Scorecard from conversation
  const handleFinishLiveExam = async () => {
    disconnectGeminiLive(true);

    const isRepeatClarification = (txt) => {
      const t = (txt || '').toLowerCase().trim();
      return (
        t === 'repeat' ||
        t === 'repeat it' ||
        t === 'repeat please' ||
        t === 'repeat the question' ||
        t === 'can you repeat' ||
        t === 'can you repeat the question' ||
        t === 'could you repeat that' ||
        t === 'say again' ||
        t === 'say that again' ||
        t === 'pardon' ||
        t === 'i didn\'t understand' ||
        t === 'i dont understand'
      );
    };

    // Consolidate consecutive messages from the same sender
    const consolidated = [];
    liveConversation.forEach((msg) => {
      const txt = (msg.text || '').trim();
      if (!txt) return;
      if (consolidated.length > 0 && consolidated[consolidated.length - 1].sender === msg.sender) {
        consolidated[consolidated.length - 1].text += ' ' + txt;
      } else {
        consolidated.push({ sender: msg.sender, text: txt });
      }
    });

    const parsedTurns = [];
    let currentQuestion = '';
    let currentAnswer = '';

    consolidated.forEach((item) => {
      const txt = item.text.trim();
      if (!txt) return;

      if (item.sender === 'examiner') {
        const isConclusion = /conclude|scorecard|official evaluation report|thank you for your responses/i.test(txt);
        if (!isConclusion) {
          if (currentQuestion && currentAnswer.trim()) {
            parsedTurns.push({
              question: currentQuestion.trim(),
              answer: currentAnswer.trim(),
              durationSec: 45
            });
            currentQuestion = txt;
            currentAnswer = '';
          } else if (!currentQuestion) {
            currentQuestion = txt;
          } else {
            currentQuestion += ' ' + txt;
          }
        }
      } else if (item.sender === 'candidate') {
        if (!isRepeatClarification(txt)) {
          currentAnswer = (currentAnswer ? currentAnswer + ' ' : '') + txt;
        }
      }
    });

    if (currentQuestion) {
      parsedTurns.push({
        question: currentQuestion.trim(),
        answer: currentAnswer.trim() || 'Candidate participated orally during live session.',
        durationSec: 45
      });
    }

    // Group parsed turns into TopicUnits (Main question + follow-ups)
    const topicUnits = [];
    let currentUnit = null;

    parsedTurns.forEach((turn, idx) => {
      const isFollowUp = /follow-up|probe|clarify|furthermore|specifically|elaborate/i.test(turn.question);
      if (!currentUnit || (!isFollowUp && currentUnit.turns.length > 0)) {
        if (currentUnit) topicUnits.push(currentUnit);
        currentUnit = {
          topicIndex: topicUnits.length + 1,
          topicName: `${sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (topic || programmingLanguage)} - Topic ${topicUnits.length + 1}`,
          turns: []
        };
      }
      currentUnit.turns.push({
        questionType: isFollowUp ? 'follow_up' : 'main',
        question: turn.question,
        answer: turn.answer,
        durationSec: turn.durationSec
      });
    });

    if (currentUnit && currentUnit.turns.length > 0) {
      topicUnits.push(currentUnit);
    }

    await handleFinalizeSession(parsedTurns, topicUnits);
  };

  // Start Fresh Session (Live Voice or Turn Guided)
  const handleStartSession = async () => {
    let resolvedTopic = '';

    if (sessionMode === 'viva') {
      if (vivaSource === 'preset') {
        if (!selectedExperiment) {
          alert("Please select a lab experiment from the presets before starting.");
          return;
        }
        resolvedTopic = selectedExperiment;
      } else {
        if (!customVivaTopic.trim()) {
          setCustomVivaTopic('Database Management Systems (DBMS)');
          resolvedTopic = 'Database Management Systems (DBMS)';
        } else {
          resolvedTopic = customVivaTopic.trim();
        }
      }
    } else {
      resolvedTopic = topic.trim() || programmingLanguage || 'Full Stack Web Development';
    }

    const activeTopic = resolvedTopic;
    const activeSubject = resolvedTopic;
    setActiveSessionTopic(activeTopic);

    cleanupRecognition();
    setHistory([]);
    setCurrentQIndex(0);
    setUserAnswer('');
    baseTextRef.current = '';
    sessionFinalRef.current = '';
    setScorecard(null);
    setSavedSessionFound(null);

    setLoading(true);
    setStatusMessage(`Examiner is evaluating topic and preparing your session...`);

    const recentQ1s = (() => {
      try {
        const raw = localStorage.getItem('VEDIKA_RECENT_Q1_CACHE');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed[activeTopic]) ? parsed[activeTopic] : [];
      } catch { return []; }
    })();

    try {
      const token = await getSafeAuthToken();
      const response = await fetch('/api/viva-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'question',
          type: sessionMode,
          subject: activeSubject,
          topic: activeTopic,
          level,
          difficulty,
          experimentName: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: [],
          questionIndex: 0,
          recentQ1s
        })
      });

      const data = await response.json();

      // Check Joint Topic Validation Result
      if (response.ok && data.isValidTopic === false) {
        setTopicRejectionCount((prev) => prev + 1);
        setTopicValidationAlert(
          data.rejectionReason || `"${activeTopic}" does not appear to be a valid academic subject or technical topic. Please specify a valid topic.`
        );
        setLoading(false);
        setStatusMessage('');
        return;
      }

      // Topic is Valid (or Fail-Open fallback)
      setTopicValidationAlert('');
      setTopicRejectionCount(0);
      setSessionTimeRemaining(900);
      setTurnTimeRemaining(90);
      setCurrentStageInfo({
        topicName: activeTopic,
        questionType: 'main',
        topicIndex: 1,
        followUpIndex: 0
      });

      if (response.ok && data.question) {
        // Save opening question into anti-repetition cache
        try {
          const raw = localStorage.getItem('VEDIKA_RECENT_Q1_CACHE');
          const parsed = raw ? JSON.parse(raw) : {};
          const existing = Array.isArray(parsed[activeTopic]) ? parsed[activeTopic] : [];
          parsed[activeTopic] = [data.question, ...existing.filter(q => q !== data.question)].slice(0, 5);
          localStorage.setItem('VEDIKA_RECENT_Q1_CACHE', JSON.stringify(parsed));
        } catch {}

        setCurrentQuestionType(data.questionType || 'main');
        setCurrentProbedPoint(data.probedPoint || '');
        setCurrentAcknowledgment(data.acknowledgment || 'Welcome to your examination. Let us begin.');
        setCurrentQuestion(data.question);
        setTurnStartTime(Date.now());

        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({
          sessionMode,
          subject: activeSubject,
          level,
          difficulty,
          topic: activeTopic,
          activeSessionTopic: activeTopic,
          selectedExperiment: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: [],
          currentQIndex: 0,
          currentQuestion: data.question,
          currentQuestionType: data.questionType || 'main',
          currentProbedPoint: data.probedPoint || '',
          currentAcknowledgment: data.acknowledgment
        }));

        if (executionMode === 'live') {
          await startGeminiLiveSession(activeTopic, activeSubject, difficulty, level);
        } else {
          speakText(`${data.acknowledgment || ''} ${data.question}`);
          setGameState('active');
        }
      } else {
        alert(data.error || "Failed to initialize interview.");
      }
    } catch (e) {
      console.error(e);
      if (executionMode === 'live') {
        await startGeminiLiveSession(activeTopic, activeSubject, difficulty, level);
      } else {
        alert(e?.message || "Failed to initialize examination session. Please check your connection.");
      }
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  const startVoiceSession = handleStartSession;

  // Submit Answer & Move to Next Question or Final Evaluation
  const handleAnswerSubmit = async () => {
    const rawAnswer = (userAnswer || sessionFinalRef.current || '').trim();
    if (!rawAnswer) {
      const msg = '⚠️ Please provide an answer before submitting. Speak into your microphone or type your response below.';
      setStatusMessage(msg);
      if (typeof window !== 'undefined') {
        alert('⚠️ Please provide an answer before submitting. Speak into your microphone or type your response.');
      }
      return;
    }

    cleanupRecognition();

    const submittedAnswer = rawAnswer;
    const durationSec = Math.max(1, Math.round((Date.now() - turnStartTime) / 1000));
    const newHistory = [
      ...history,
      {
        question: currentQuestion,
        answer: submittedAnswer,
        durationSec,
        questionType: currentQuestionType,
        probedPoint: currentProbedPoint
      }
    ];

    setHistory(newHistory);
    setUserAnswer('');
    baseTextRef.current = '';
    sessionFinalRef.current = '';

    if (currentQIndex >= 4) {
      await handleFinalizeSession(newHistory);
      return;
    }

    const nextIdx = currentQIndex + 1;
    setCurrentQIndex(nextIdx);
    setLoading(true);
    setStatusMessage('Examiner is evaluating your answer and formulating the next follow-up question...');

    try {
      const token = await getSafeAuthToken();
      const activeTopic = activeSessionTopic || (sessionMode === 'viva' 
        ? (vivaSource === 'preset' ? selectedExperiment : customVivaTopic.trim()) 
        : (topic.trim() || programmingLanguage));

      const activeSubject = activeTopic;

      const response = await fetch('/api/viva-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'question',
          type: sessionMode,
          subject: activeSubject,
          topic: activeTopic,
          level,
          difficulty,
          experimentName: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: newHistory,
          questionIndex: nextIdx
        })
      });

      const data = await response.json();
      if (response.ok && data.question) {
        setCurrentQuestionType(data.questionType || 'follow_up');
        setCurrentProbedPoint(data.probedPoint || '');
        setCurrentAcknowledgment(data.acknowledgment || 'Understood. Let us proceed.');
        setCurrentQuestion(data.question);
        setTurnStartTime(Date.now());
        speakText(`${data.acknowledgment || ''} ${data.question}`);

        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({
          sessionMode,
          subject: activeSubject,
          level,
          difficulty,
          topic: activeTopic,
          activeSessionTopic: activeTopic,
          selectedExperiment: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: newHistory,
          currentQIndex: nextIdx,
          currentQuestion: data.question,
          currentQuestionType: data.questionType || 'follow_up',
          currentProbedPoint: data.probedPoint || '',
          currentAcknowledgment: data.acknowledgment
        }));
      } else {
        alert(data.error || "Failed to fetch next question.");
      }
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to fetch next question. Please try again.");
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  // Skip Question (candidate passes or doesn't know answer)
  const handleSkipQuestion = async () => {
    cleanupRecognition();
    const durationSec = Math.max(1, Math.round((Date.now() - turnStartTime) / 1000));
    const newHistory = [
      ...history,
      {
        question: currentQuestion,
        answer: 'Candidate skipped the question and provided no answer.',
        durationSec,
        questionType: currentQuestionType,
        probedPoint: currentProbedPoint
      }
    ];

    setHistory(newHistory);
    setUserAnswer('');
    baseTextRef.current = '';
    sessionFinalRef.current = '';

    if (currentQIndex >= 4) {
      await handleFinalizeSession(newHistory);
      return;
    }

    const nextIdx = currentQIndex + 1;
    setCurrentQIndex(nextIdx);
    setLoading(true);
    setStatusMessage('Examiner is proceeding to the next question...');

    try {
      const token = await getSafeAuthToken();
      const activeTopic = activeSessionTopic || (sessionMode === 'viva' 
        ? (vivaSource === 'preset' ? selectedExperiment : customVivaTopic.trim()) 
        : (topic.trim() || programmingLanguage));

      const activeSubject = activeTopic;

      const response = await fetch('/api/viva-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'question',
          type: sessionMode,
          subject: activeSubject,
          topic: activeTopic,
          level,
          difficulty,
          experimentName: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: newHistory,
          questionIndex: nextIdx
        })
      });

      const data = await response.json();
      if (response.ok && data.question) {
        setCurrentQuestionType(data.questionType || 'follow_up');
        setCurrentProbedPoint(data.probedPoint || '');
        setCurrentAcknowledgment(data.acknowledgment || 'Understood. Let us proceed.');
        setCurrentQuestion(data.question);
        setTurnStartTime(Date.now());
        speakText(`${data.acknowledgment || ''} ${data.question}`);

        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({
          sessionMode,
          subject: activeSubject,
          level,
          difficulty,
          topic: activeTopic,
          activeSessionTopic: activeTopic,
          selectedExperiment: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: newHistory,
          currentQIndex: nextIdx,
          currentQuestion: data.question,
          currentQuestionType: data.questionType || 'follow_up',
          currentProbedPoint: data.probedPoint || '',
          currentAcknowledgment: data.acknowledgment
        }));
      } else {
        alert(data.error || "Failed to fetch next question.");
      }
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to advance question. Please try again.");
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  // Finalize Session & Generate Holistic Scorecard with Fast Responsive Loading
  const handleFinalizeSession = async (finalHistory, topicUnits = []) => {
    // Transition to dedicated analyzing loading screen
    setGameState('analyzing');
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 350);

    try {
      const token = await getSafeAuthToken();
      const activeTopic = activeSessionTopic || (sessionMode === 'viva' 
        ? (vivaSource === 'preset' ? selectedExperiment : customVivaTopic.trim()) 
        : (topic.trim() || programmingLanguage));

      const activeSubject = activeTopic;

      const response = await fetch('/api/viva-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'evaluate-session',
          type: sessionMode,
          subject: activeSubject,
          topic: activeTopic,
          level,
          difficulty,
          experimentName: activeTopic,
          programmingLanguage,
          jdText,
          resumeBlueprint,
          history: finalHistory,
          topicUnits
        })
      });

      const scorecardData = await response.json();
      clearInterval(stepInterval);
      setAnalysisStep(4);

      if (response.ok) {
        setTimeout(() => {
          setScorecard(scorecardData);
          setGameState('summary');
          localStorage.removeItem(STORAGE_SESSION_KEY);
        }, 200);
      } else {
        alert(scorecardData.error || "Failed to generate evaluation scorecard.");
        setGameState('active');
      }
    } catch (e) {
      clearInterval(stepInterval);
      console.error(e);
      alert("Scorecard evaluation error.");
      setGameState('active');
    }
  };

  // Resume Saved Session
  const resumeSavedSession = () => {
    if (!savedSessionFound) return;
    cleanupRecognition();
    setSessionMode(savedSessionFound.sessionMode || 'viva');
    setSubject(savedSessionFound.subject || 'Physics');
    setLevel(savedSessionFound.level || 'College');
    setDifficulty(savedSessionFound.difficulty || 'Medium');
    setTopic(savedSessionFound.topic || '');
    setSelectedExperiment(savedSessionFound.selectedExperiment || '');
    setProgrammingLanguage(savedSessionFound.programmingLanguage || 'Python');
    setJdText(savedSessionFound.jdText || '');
    setResumeBlueprint(savedSessionFound.resumeBlueprint || null);
    setHistory(savedSessionFound.history || []);
    setCurrentQIndex(savedSessionFound.currentQIndex || 0);
    setCurrentQuestion(savedSessionFound.currentQuestion || '');
    setCurrentQuestionType(savedSessionFound.currentQuestionType || (savedSessionFound.currentQIndex > 0 ? 'follow_up' : 'main'));
    setCurrentProbedPoint(savedSessionFound.currentProbedPoint || '');
    setCurrentAcknowledgment(savedSessionFound.currentAcknowledgment || 'Welcome back.');
    setUserAnswer('');
    baseTextRef.current = '';
    sessionFinalRef.current = '';
    setSavedSessionFound(null);
    setGameState('active');
    setTurnStartTime(Date.now());
    speakText(savedSessionFound.currentQuestion);
  };

  if (gameState === 'setup') {
    const curTopic = sessionMode === 'viva' ? customVivaTopic : (sessionMode === 'aptitude' ? aptTopic : topic);
    const isTopicReady = Boolean(curTopic && curTopic.trim());

    return (
      <div style={inlineStyles.s0}>
        {/* User Defined Box Container Sliding Layout */}
        <style>{featureStyleFunctions.s0({isMobile})}</style>

        <div className={`box-container ${isRightOpen ? 'right-open' : ''}`}>
          {/* ============================================================== */}
          {/* BOX 1 CONTENT: LARGER PANEL (FLEX: 4) - ACADEMIC VIVA          */}
          {/* ============================================================== */}
          <div className="box1-content" style={inlineStyles.s1}>
            {/* Top Bar: Back Button */}
            <div style={featureStyleFunctions.s1({isMobile})}>
              <button
                type="button"
                onClick={handleGoBack}
                style={inlineStyles.s2}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
            </div>

            {/* Saved Session Restore Alert (if exists) */}
            {savedSessionFound && (
              <div style={inlineStyles.s3}>
                <div style={inlineStyles.s4}>
                  <AlertCircle size={16} color="#A78BFA" />
                  <span style={inlineStyles.s5}>
                    Active {savedSessionFound.sessionMode === 'viva' ? 'Viva' : 'Interview'} in progress ({savedSessionFound.history?.length || 0}/5 answered • {savedSessionFound.difficulty || 'Medium'})
                  </span>
                </div>
                <div style={inlineStyles.s6}>
                  <button
                    type="button"
                    onClick={resumeSavedSession}
                    style={inlineStyles.s7}
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem(STORAGE_SESSION_KEY);
                      setSavedSessionFound(null);
                    }}
                    style={inlineStyles.s8}
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            {/* HORIZONTAL 4-STEP PROGRESS STEPPER (SUPERHERO VEDIKA BOTS) */}
            <div className="step-progress-wrapper">
              <div className="step-progress-container">
                <div
                  className="step-progress-bar viva-bar"
                  style={featureStyleFunctions.s2({setupStep})}
                />
                {[
                  { step: 1, caption: 'Topic', hero: 'Iron Man', heroKey: 'ironman', icon: '/vedika-bot-ironman-icon.png' },
                  { step: 2, caption: 'Level', hero: 'Batman', heroKey: 'batman', icon: '/vedika-bot-batman-icon.png' },
                  { step: 3, caption: 'Oral Engine', hero: 'Doctor Strange', heroKey: 'doctorstrange', icon: '/vedika-bot-doctorstrange-icon.png' },
                  { step: 4, caption: 'Start', hero: 'Superman', heroKey: 'superman', icon: '/vedika-bot-superman-icon.png' }
                ].map((item) => {
                  const isRevealed = item.step <= maxUnlockedVivaStep;
                  const isPassed = setupStep >= item.step;
                  const isCurrent = setupStep === item.step;
                  const isEntering = enteringHeroViva === item.step;

                  if (!isRevealed) {
                    return (
                      <div
                        key={item.step}
                        className="step-circle locked-circle"
                        onClick={() => {
                          if (!customVivaTopic.trim()) {
                            setCustomVivaTopic('Database Management Systems (DBMS)');
                            setVivaSource('custom');
                          }
                          advanceVivaStep(item.step);
                        }}
                        style={inlineStyles.s9}
                        title={`Step ${item.step}: ${item.caption} (Click to jump to Step ${item.step})`}
                      >
                        <Lock size={8} color="#64748B" />
                        <div className="step-caption locked-caption">
                          {item.caption}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.step}
                      className={`step-circle viva-circle ${isPassed ? 'active' : ''}`}
                      onClick={() => {
                        if (!customVivaTopic.trim()) {
                          setCustomVivaTopic('Database Management Systems (DBMS)');
                          setVivaSource('custom');
                        }
                        advanceVivaStep(item.step);
                      }}
                      title={`Step ${item.step}: ${item.caption} (${item.hero})`}
                    >
                      {/* Superhero Realistic Sprite Sheet Sequence Actor (clean shadow, no colored glow) */}
                      <div
                        className={`hero-actor-container ${item.heroKey} ${isEntering ? 'entering' : 'idle'}`}
                        style={inlineStyles.s10}
                      >
                        <div
                          className={`hero-sprite-frame ${item.heroKey} ${isEntering ? 'playing' : 'settled'}`}
                        />
                      </div>

                      <div
                        className="step-caption"
                        style={featureStyleFunctions.s3({isCurrent,isPassed})}
                      >
                        {item.caption}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="steps-scroll-area" style={featureStyleFunctions.s4({isMobile})}>
              {/* STEP 1: CHOOSE TOPIC */}
              {setupStep === 1 && (
              <div style={featureStyleFunctions.s5({isMobile})}>
                <div>
                  <h1 style={featureStyleFunctions.s6({isMobile})}>
                    Choose your topic
                  </h1>
                  <p style={inlineStyles.s11}>
                    Enter an academic subject or engineering topic for your oral defense.
                  </p>

                  {/* Search Input */}
                  <div style={inlineStyles.s12}>
                    <Search
                      size={18}
                      color="#94A3B8"
                      style={inlineStyles.s13}
                    />
                    <input
                      type="text"
                      value={customVivaTopic}
                      onChange={(e) => {
                        setCustomVivaTopic(e.target.value);
                        setVivaSource('custom');
                      }}
                      placeholder="e.g., DBMS, Operating Systems, Organic Chemistry, Fluid Mechanics..."
                      style={inlineStyles.s14}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7C3AED';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(124, 58, 237, 0.35)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Adaptive Oral Defense Guidance Card (Collapsible on Mobile) */}
                  <div
                    style={featureStyleFunctions.s7({isMobile})}
                    onClick={() => {
                      if (isMobile) setIsMobileInfoExpanded(!isMobileInfoExpanded);
                    }}
                  >
                    <div style={inlineStyles.s15}>
                      <div style={inlineStyles.s16}>
                        <Sparkles size={15} color="#A855F7" />
                        <span>Adaptive Oral Defense Engine</span>
                      </div>
                      {isMobile && (
                        <div style={inlineStyles.s17}>
                          <span>{isMobileInfoExpanded ? 'Hide' : 'Details'}</span>
                          {isMobileInfoExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </div>
                      )}
                    </div>

                    {(!isMobile || isMobileInfoExpanded) && (
                      <>
                        <p style={inlineStyles.s18}>
                          Vedika dynamically formulates oral viva questions targeting textbook theorems, fundamental principles, practical edge cases, and oral proofs based on your topic.
                        </p>
                        <div style={inlineStyles.s19}>
                          <span style={inlineStyles.s20}>
                            <CheckCircle2 size={12} color="#A855F7" /> Rigorous Viva Questions
                          </span>
                          <span style={inlineStyles.s21}>
                            <CheckCircle2 size={12} color="#A855F7" /> Real-time Speech Evaluation
                          </span>
                          <span style={inlineStyles.s22}>
                            <CheckCircle2 size={12} color="#A855F7" /> Scoring & Conceptual Feedback
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC LEVEL & SYLLABUS DEPTH */}
            {setupStep === 2 && (
              <div style={featureStyleFunctions.s8({isMobile})}>
                <div>
                  <h1 style={featureStyleFunctions.s9({isMobile})}>
                    Academic Level & Syllabus Depth
                  </h1>
                  <p style={featureStyleFunctions.s10({isMobile})}>
                    Customize your examination tier and syllabus defense focus.
                  </p>

                  <div style={inlineStyles.s23}>
                    {/* Setting 1: Academic Level */}
                    <div>
                      <label style={inlineStyles.s24}>
                        Academic Tier
                      </label>
                      <div style={featureStyleFunctions.s11({isMobile})}>
                        {[
                          { id: 'School', title: isMobile ? 'School' : 'School Level', desc: isMobile ? 'Grades 9-12' : 'Grades 9-12 fundamentals & core definitions' },
                          { id: 'College', title: isMobile ? 'Undergrad' : 'Undergraduate', desc: isMobile ? 'B.Tech / College' : 'College / B.Tech engineering coursework' },
                          { id: 'PG', title: isMobile ? 'Postgrad' : 'Postgraduate', desc: isMobile ? "Master's & PhD" : "Master's & Ph.D research level depth" }
                        ].map((item) => {
                          const isSelected = level === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setLevel(item.id)}
                              style={featureStyleFunctions.s12({isMobile,isSelected})}
                            >
                              <div style={featureStyleFunctions.s13({isMobile,isSelected})}>
                                {item.title}
                              </div>
                              <div style={featureStyleFunctions.s14({isMobile})}>
                                {item.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Setting 2: Examination Focus / Depth */}
                    <div>
                      <label style={inlineStyles.s25}>
                        Syllabus Defense Focus
                      </label>
                      <div style={featureStyleFunctions.s15({isMobile})}>
                        {[
                          { id: 'Core Theory & Proofs', title: isMobile ? 'Core Theory' : 'Core Theory & Proofs', desc: isMobile ? 'Theorems & Proofs' : 'Textbook theorems, derivations & definitions' },
                          { id: 'Applied Lab Experiments', title: isMobile ? 'Lab Applied' : 'Applied Lab Experiments', desc: isMobile ? 'Apparatus & Errors' : 'Apparatus, readings, error sources & observations' },
                          { id: 'Comprehensive Oral Voce', title: isMobile ? 'Comprehensive' : 'Comprehensive Viva Voce', desc: isMobile ? 'Theory + Practical' : 'Balanced combination of theory and application' }
                        ].map((item) => {
                          const isSelected = vivaFocus === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setVivaFocus(item.id)}
                              style={featureStyleFunctions.s16({isMobile,isSelected})}
                            >
                              <div style={featureStyleFunctions.s17({isMobile,isSelected})}>
                                {item.title}
                              </div>
                              <div style={featureStyleFunctions.s18({isMobile})}>
                                {item.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ORAL VIVA ENGINE & DIFFICULTY */}
            {setupStep === 3 && (
              <div style={featureStyleFunctions.s19({isMobile})}>
                <div>
                  <h1 style={featureStyleFunctions.s20({isMobile})}>
                    Oral Engine & Rigor
                  </h1>
                  <p style={featureStyleFunctions.s21({isMobile})}>
                    Select conversational speech engine and examination difficulty level.
                  </p>

                  <div style={inlineStyles.s26}>
                    {/* Setting 1: Oral Engine Mode */}
                    <div>
                      <label style={inlineStyles.s27}>
                        Conversational Voice Engine
                      </label>
                      <div style={featureStyleFunctions.s22({isMobile})}>
                        <div
                          onClick={() => setExecutionMode('live')}
                          style={featureStyleFunctions.s23({isMobile,executionMode})}
                        >
                          <div style={featureStyleFunctions.s24({isMobile})}>
                            <Zap size={15} color="#A78BFA" />
                            <span>Realtime Voice</span>
                          </div>
                          <div style={featureStyleFunctions.s25({isMobile})}>
                            Live Gemini audio streaming with instant interruption.
                          </div>
                        </div>

                        <div
                          onClick={() => setExecutionMode('turn')}
                          style={featureStyleFunctions.s26({isMobile,executionMode})}
                        >
                          <div style={featureStyleFunctions.s27({isMobile})}>
                            <Clock size={15} color="#A78BFA" />
                            <span>Turn-by-Turn</span>
                          </div>
                          <div style={featureStyleFunctions.s28({isMobile})}>
                            Structured 90s countdown evaluation rounds.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Setting 2: Difficulty */}
                    <div>
                      <label style={inlineStyles.s28}>
                        Examination Rigor Tier
                      </label>
                      <div style={featureStyleFunctions.s29({isMobile})}>
                        {[
                          { id: 'Easy', title: isMobile ? 'Easy' : 'Easy Tier', desc: isMobile ? 'Core Basics' : 'Core definitions & standard principles' },
                          { id: 'Medium', title: isMobile ? 'Medium' : 'Medium Tier', desc: isMobile ? 'Analytical' : 'Analytical viva probes & derivations' },
                          { id: 'Hard', title: isMobile ? 'Hard' : 'Hard / Bar Raiser', desc: isMobile ? 'Deep Edge' : 'Deep architectural edge cases & proofs' }
                        ].map((tier) => {
                          const isSelected = difficulty === tier.id;
                          return (
                            <div
                              key={tier.id}
                              onClick={() => setDifficulty(tier.id)}
                              style={featureStyleFunctions.s30({isMobile,isSelected})}
                            >
                              <div style={featureStyleFunctions.s31({isMobile,isSelected})}>
                                {tier.title}
                              </div>
                              <div style={featureStyleFunctions.s32({isMobile})}>
                                {tier.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & START */}
            {setupStep === 4 && (
              <div style={featureStyleFunctions.s33({isMobile})}>
                <div>
                  <h1 style={featureStyleFunctions.s34({isMobile})}>
                    Ready for Examination
                  </h1>
                  <p style={featureStyleFunctions.s35({isMobile})}>
                    Review your configuration and launch your AI viva session.
                  </p>

                  {/* Summary Card */}
                  <div style={featureStyleFunctions.s36({isMobile})}>
                    <div style={inlineStyles.s29}>
                      Session Summary
                    </div>

                    <div style={featureStyleFunctions.s37({isMobile})}>
                      <div>
                        <span style={inlineStyles.s30}>Track</span>
                        <span style={featureStyleFunctions.s38({isMobile})}>
                          Academic Lab Viva
                        </span>
                      </div>

                      <div>
                        <span style={inlineStyles.s31}>Topic</span>
                        <span style={featureStyleFunctions.s39({isMobile})}>
                          {customVivaTopic || 'DBMS'}
                        </span>
                      </div>

                      <div>
                        <span style={inlineStyles.s32}>Academic Tier</span>
                        <span style={featureStyleFunctions.s40({isMobile})}>
                          {level} Level
                        </span>
                      </div>

                      <div>
                        <span style={inlineStyles.s33}>Difficulty</span>
                        <span style={featureStyleFunctions.s41({difficulty})}>
                          {difficulty}
                        </span>
                      </div>

                      <div style={inlineStyles.s34}>
                        <span style={inlineStyles.s35}>Focus Depth</span>
                        <span style={featureStyleFunctions.s42({isMobile})}>
                          {vivaFocus}
                        </span>
                      </div>

                      <div style={inlineStyles.s36}>
                        <span style={inlineStyles.s37}>Oral Engine</span>
                        <span style={featureStyleFunctions.s43({isMobile})}>
                          {executionMode === 'live' ? '⚡ Realtime Voice Examiner' : '⏱ Turn-by-Turn Guided Viva'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Readiness Checklist */}
                  <div style={featureStyleFunctions.s44({isMobile})}>
                    <div style={featureStyleFunctions.s45({isMobile})}>
                      <CheckCircle2 size={12} color="#10B981" />
                      <span>Microphone will activate when examination starts</span>
                    </div>
                    <div style={featureStyleFunctions.s46({isMobile})}>
                      <CheckCircle2 size={12} color="#10B981" />
                      <span>5 core examination questions with adaptive follow-up</span>
                    </div>
                    <div style={featureStyleFunctions.s47({isMobile})}>
                      <CheckCircle2 size={12} color="#10B981" />
                      <span>Detailed scorecard with rubric evaluation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Mobile Fixed Particle Bot: Academic Viva Examiner */}
            {isMobile && (
              <div className="mobile-particle-stage fixed-stage">
                <div className="mobile-particle-aura" style={inlineStyles.s38} />
                <VedikaParticleBot
                  src="/vedika-bot-school.png"
                  width={240}
                  height={185}
                  inline={true}
                  colorMode="vibrant"
                  particleStep={2}
                />
              </div>
            )}

            {/* Fixed Bottom Action Bar */}
            <div className="setup-bottom-bar" style={featureStyleFunctions.s48({isMobile})}>
              <div style={featureStyleFunctions.s49({setupStep})}>
                {setupStep > 1 && (
                  <button
                    type="button"
                    className="step-btn prev-btn"
                    onClick={() => setSetupStep(prev => Math.max(1, prev - 1))}
                  >
                    ← Prev
                  </button>
                )}
                {setupStep < 4 ? (
                  <button
                    type="button"
                    className="step-btn viva-btn"
                    onClick={() => {
                      if (setupStep === 1 && !customVivaTopic.trim()) {
                        setCustomVivaTopic('Database Management Systems (DBMS)');
                        setVivaSource('custom');
                      }
                      advanceVivaStep(setupStep + 1);
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (!customVivaTopic.trim()) {
                        setCustomVivaTopic('Database Management Systems (DBMS)');
                        setVivaSource('custom');
                      }
                      startVoiceSession();
                    }}
                    className="step-btn viva-btn"
                    style={inlineStyles.s39}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Initializing Examiner...</span>
                      </>
                    ) : (
                      <>
                        <Mic size={16} />
                        <span>Start Voice Viva Examination</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isMobile && (
                <button
                  type="button"
                  className="mobile-mode-switch-btn interview-style"
                  onClick={() => {
                    setIsRightOpen(true);
                    setSessionMode('interview');
                    if (!topic) setTopic('Full Stack Web Development');
                  }}
                >
                  <span>Technical Interview</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

      {/* ============================================================== */}
      {/* BOX 1 SIDE: VEDIKA BOT IN SCHOOL UNIFORM (SMALLER PANEL: 2)    */}
      {/* ============================================================== */}
      <div className="box1-side">
        {/* Top Status */}
        <div style={inlineStyles.s40}>
          <span style={inlineStyles.s41} />
          <span>Academic Viva Examiner</span>
        </div>

        {/* Middle: Interactive Particle Bot (Academic Viva Examiner) */}
        <div style={inlineStyles.s42}>
          <VedikaParticleBot
            src="/vedika-bot-school.png"
            width={220}
            height={295}
            inline={true}
            colorMode="vibrant"
            particleStep={2}
          />
        </div>

        {/* Bottom: Switch to Technical Interview Button */}
        <div style={inlineStyles.s43}>
          <button
            type="button"
            onClick={() => {
              setIsRightOpen(true);
              setSessionMode('interview');
              if (!topic) setTopic('Full Stack Web Development');
            }}
            style={inlineStyles.s44}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(14, 165, 233, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.45)';
            }}
          >
            <span>Technical Interview Mode</span>
            <span>➔</span>
          </button>

          <div style={inlineStyles.s45}>
            <span>📚 Syllabus Driven</span>
            <span>•</span>
            <span>🎙️ Spoken Defense</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOX 2 SIDE: VEDIKA BOT IN SUIT (SMALLER PANEL: FLEX 2)          */}
      {/* ============================================================== */}
      <div className="box2-side">
        {/* Top Status */}
        <div style={inlineStyles.s46}>
          <span style={inlineStyles.s47} />
          <span>Technical Interviewer</span>
        </div>

        {/* Middle: Interactive Particle Bot (Technical Interviewer) */}
        <div style={inlineStyles.s48}>
          <VedikaParticleBot
            src="/vedika-bot-suit.png"
            width={220}
            height={295}
            inline={true}
            colorMode="vibrant"
            particleStep={2}
          />
        </div>

        {/* Bottom: Switch to Academic Viva Button */}
        <div style={inlineStyles.s49}>
          <button
            type="button"
            onClick={() => {
              setIsRightOpen(false);
              setSessionMode('viva');
              if (!customVivaTopic) setCustomVivaTopic('Database Management Systems (DBMS)');
            }}
            style={inlineStyles.s50}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 58, 237, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.45)';
            }}
          >
            <span>← Academic Viva Mode</span>
          </button>

          <div style={inlineStyles.s51}>
            <span>⚙️ System Architecture</span>
            <span>•</span>
            <span>💻 Live Tech Screen</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOX 2 CONTENT: TECHNICAL INTERVIEW WORKBENCH (LARGER: FLEX 4)  */}
      {/* ============================================================== */}
      <div className="box2-content" style={inlineStyles.s52}>
        {/* Top Header / Spacer */}
        {isMobile ? (
          <div style={inlineStyles.s53}>
            <button
              type="button"
              onClick={handleGoBack}
              style={inlineStyles.s54}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          </div>
        ) : (
          /* Top Spacer matching Box 1 Back Button height to keep steppers aligned on desktop */
          <div style={inlineStyles.s55} />
        )}

        {/* HORIZONTAL 4-STEP PROGRESS STEPPER (SUPERHERO VEDIKA BOTS) */}
        <div className="step-progress-wrapper">
          <div className="step-progress-container">
            <div
              className="step-progress-bar interview-bar"
              style={featureStyleFunctions.s50({interviewStep})}
            />
            {[
              { step: 1, caption: 'Target Role', hero: 'Iron Man', heroKey: 'ironman', icon: '/vedika-bot-ironman-icon.png' },
              { step: 2, caption: 'Seniority', hero: 'Batman', heroKey: 'batman', icon: '/vedika-bot-batman-icon.png' },
              { step: 3, caption: 'Rigor & Mode', hero: 'Doctor Strange', heroKey: 'doctorstrange', icon: '/vedika-bot-doctorstrange-icon.png' },
              { step: 4, caption: 'Start', hero: 'Superman', heroKey: 'superman', icon: '/vedika-bot-superman-icon.png' }
            ].map((item) => {
              const isRevealed = item.step <= maxUnlockedInterviewStep;
              const isPassed = interviewStep >= item.step;
              const isCurrent = interviewStep === item.step;
              const isEntering = enteringHeroInterview === item.step;

              if (!isRevealed) {
                return (
                  <div
                    key={item.step}
                    className="step-circle locked-circle"
                    onClick={() => {
                      if (!topic.trim()) {
                        setTopic('Full Stack Web Development');
                      }
                      advanceInterviewStep(item.step);
                    }}
                    style={inlineStyles.s56}
                    title={`Step ${item.step}: ${item.caption} (Click to jump to Step ${item.step})`}
                  >
                    <Lock size={8} color="#64748B" />
                    <div className="step-caption locked-caption">
                      {item.caption}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.step}
                  className={`step-circle interview-circle ${isPassed ? 'active' : ''}`}
                  onClick={() => {
                    if (!topic.trim()) {
                      setTopic('Full Stack Web Development');
                    }
                    advanceInterviewStep(item.step);
                  }}
                  title={`Step ${item.step}: ${item.caption} (${item.hero})`}
                >
                      {/* Superhero Realistic Sprite Sheet Sequence Actor (clean shadow, no colored glow) */}
                      <div
                        className={`hero-actor-container ${item.heroKey} ${isEntering ? 'entering' : 'idle'}`}
                        style={inlineStyles.s57}
                      >
                        <div
                          className={`hero-sprite-frame ${item.heroKey} ${isEntering ? 'playing' : 'settled'}`}
                        />
                      </div>

                  <div
                    className="step-caption"
                    style={featureStyleFunctions.s51({isCurrent,isPassed})}
                  >
                    {item.caption}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="steps-scroll-area" style={featureStyleFunctions.s52({isMobile})}>
        {/* STEP 1: TARGET ROLE */}
        {interviewStep === 1 && (
          <div style={featureStyleFunctions.s53({isMobile})}>
            <div>
              <h1 style={featureStyleFunctions.s54({isMobile})}>
                Choose your target role
              </h1>
              <p style={featureStyleFunctions.s55({isMobile})}>
                Select an engineering discipline or customize your target tech stack.
              </p>

              {/* Search Input Bar */}
              <div style={inlineStyles.s58}>
                <Search
                  size={18}
                  color="#38BDF8"
                  style={inlineStyles.s59}
                />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Full Stack Web, Backend Go/Java, React..."
                  style={inlineStyles.s60}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0EA5E9';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(14, 165, 233, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.35)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Technical Screening Intelligence Banner (Collapsible on Mobile) */}
              <div
                style={featureStyleFunctions.s56({isMobile})}
                onClick={() => {
                  if (isMobile) setIsMobileInfoExpanded(!isMobileInfoExpanded);
                }}
              >
                <div style={inlineStyles.s61}>
                  <div style={inlineStyles.s62}>
                    <Code2 size={15} color="#0EA5E9" />
                    <span>Role-Specific Technical Probing</span>
                  </div>
                  {isMobile && (
                    <div style={inlineStyles.s63}>
                      <span>{isMobileInfoExpanded ? 'Hide' : 'Details'}</span>
                      {isMobileInfoExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </div>
                  )}
                </div>

                {(!isMobile || isMobileInfoExpanded) && (
                  <>
                    <p style={inlineStyles.s64}>
                      Vedika evaluates software architecture, production edge cases, API designs, algorithmic problem-solving, and system trade-offs tailored precisely to your role.
                    </p>
                    <div style={inlineStyles.s65}>
                      <span style={inlineStyles.s66}>
                        <CheckCircle2 size={12} color="#0EA5E9" /> System Architecture
                      </span>
                      <span style={inlineStyles.s67}>
                        <CheckCircle2 size={12} color="#0EA5E9" /> Real-time Voice Screen
                      </span>
                      <span style={inlineStyles.s68}>
                        <CheckCircle2 size={12} color="#0EA5E9" /> Engineering Trade-off Probes
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SENIORITY & TECH STACK */}
        {interviewStep === 2 && (
          <div style={featureStyleFunctions.s57({isMobile})}>
            <div>
              <h1 style={featureStyleFunctions.s58({isMobile})}>
                Seniority & Tech Stack
              </h1>
              <p style={featureStyleFunctions.s59({isMobile})}>
                Select your target seniority level and primary programming language or framework.
              </p>

              <div style={inlineStyles.s69}>
                {/* Seniority Level */}
                <div>
                  <label style={inlineStyles.s70}>
                    Target Seniority Level
                  </label>
                  <div style={featureStyleFunctions.s60({isMobile})}>
                    {[
                      { id: 'Junior', title: isMobile ? 'Junior' : 'Junior / Fresher', desc: isMobile ? '0 - 2 Yrs' : '0 - 2 Years experience • Core syntax & basic algorithms' },
                      { id: 'Mid-Level', title: isMobile ? 'Mid-Level' : 'Mid-Level Engineer', desc: isMobile ? '2 - 5 Yrs' : '2 - 5 Years hands-on • System design & feature ownership' },
                      { id: 'Senior', title: isMobile ? 'Senior' : 'Senior / Staff', desc: isMobile ? '5+ Yrs' : '5+ Years architecture • High scale & team technical leadership' }
                    ].map((s) => {
                      const isSel = level === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setLevel(s.id)}
                          style={featureStyleFunctions.s61({isMobile,isSel})}
                        >
                          <div style={featureStyleFunctions.s62({isMobile,isSel})}>
                            {s.title}
                          </div>
                          <div style={featureStyleFunctions.s63({isMobile})}>
                            {s.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Programming Language */}
                <div>
                  <label style={inlineStyles.s71}>
                    Primary Programming Language / Stack
                  </label>
                  <div style={inlineStyles.s72}>
                    {['JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'C++', 'SQL', 'Rust'].map((lang) => {
                      const isSel = programmingLanguage === lang;
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setProgrammingLanguage(lang)}
                          style={featureStyleFunctions.s64({isMobile,isSel})}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RIGOR & INTERVIEW MODE */}
        {interviewStep === 3 && (
          <div style={featureStyleFunctions.s65({isMobile})}>
            <div>
              <h1 style={featureStyleFunctions.s66({isMobile})}>
                Interview Rigor & Format
              </h1>
              <p style={featureStyleFunctions.s67({isMobile})}>
                Set candidate evaluation standards and voice interaction mode.
              </p>

              <div style={inlineStyles.s73}>
                {/* Interview Rigor */}
                <div>
                  <label style={inlineStyles.s74}>
                    Interview Rigor / Bar
                  </label>
                  <div style={featureStyleFunctions.s68({isMobile})}>
                    {[
                      { id: 'Easy', title: isMobile ? 'Standard' : 'Standard Screening', desc: isMobile ? 'Fundamentals' : 'Fundamentals, logic verification & clean code basics' },
                      { id: 'Medium', title: isMobile ? 'In-Depth' : 'In-Depth Technical', desc: isMobile ? 'Architecture' : 'Architecture trade-offs, concurrency & edge cases' },
                      { id: 'Hard', title: isMobile ? 'Bar Raiser' : 'FAANG Bar Raiser', desc: isMobile ? 'Distributed' : 'Large scale distributed systems & architectural rigor' }
                    ].map((d) => {
                      const isSel = difficulty === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setDifficulty(d.id)}
                          style={featureStyleFunctions.s69({isMobile,isSel})}
                        >
                          <div style={featureStyleFunctions.s70({isMobile,isSel})}>
                            {d.title}
                          </div>
                          <div style={featureStyleFunctions.s71({isMobile})}>
                            {d.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Interaction Format */}
                <div>
                  <label style={inlineStyles.s75}>
                    Interview Format
                  </label>
                  <div style={featureStyleFunctions.s72({isMobile})}>
                    <div
                      onClick={() => setExecutionMode('live')}
                      style={featureStyleFunctions.s73({isMobile,executionMode})}
                    >
                      <div style={featureStyleFunctions.s74({isMobile})}>
                        <Zap size={15} color="#38BDF8" />
                        <span>Realtime Voice</span>
                      </div>
                      <div style={featureStyleFunctions.s75({isMobile})}>
                        Live Gemini voice screen with instant banter.
                      </div>
                    </div>

                    <div
                      onClick={() => setExecutionMode('turn')}
                      style={featureStyleFunctions.s76({isMobile,executionMode})}
                    >
                      <div style={featureStyleFunctions.s77({isMobile})}>
                        <Clock size={15} color="#38BDF8" />
                        <span>Turn-by-Turn</span>
                      </div>
                      <div style={featureStyleFunctions.s78({isMobile})}>
                        Structured 90s timed technical rounds.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & START INTERVIEW */}
        {interviewStep === 4 && (
          <div style={featureStyleFunctions.s79({isMobile})}>
            <div>
              <h1 style={featureStyleFunctions.s80({isMobile})}>
                Ready for your interview?
              </h1>
              <p style={featureStyleFunctions.s81({isMobile})}>
                Review your setup summary and launch your technical interview round.
              </p>

              {/* Summary Box */}
              <div style={featureStyleFunctions.s82({isMobile})}>
                <div style={featureStyleFunctions.s83({isMobile})}>
                  <div>
                    <span style={inlineStyles.s76}>Target Track</span>
                    <span style={featureStyleFunctions.s84({isMobile})}>
                      {topic || 'Full Stack Web'}
                    </span>
                  </div>
                  <div>
                    <span style={inlineStyles.s77}>Seniority</span>
                    <span style={featureStyleFunctions.s85({isMobile})}>
                      {level} Level
                    </span>
                  </div>
                  <div>
                    <span style={inlineStyles.s78}>Primary Language</span>
                    <span style={featureStyleFunctions.s86({isMobile})}>
                      {programmingLanguage}
                    </span>
                  </div>
                  <div>
                    <span style={inlineStyles.s79}>Interview Rigor</span>
                    <span style={inlineStyles.s80}>
                      {difficulty}
                    </span>
                  </div>
                  <div style={inlineStyles.s81}>
                    <span style={inlineStyles.s82}>Interaction Engine</span>
                    <span style={featureStyleFunctions.s87({isMobile})}>
                      {executionMode === 'live' ? '⚡ Realtime Voice Screen' : '⏱ Turn-by-Turn Guided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Readiness Checklist */}
              <div style={featureStyleFunctions.s88({isMobile})}>
                <div style={featureStyleFunctions.s89({isMobile})}>
                  <CheckCircle2 size={13} color="#0EA5E9" />
                  <span>Live microphone activation for spoken engineering responses</span>
                </div>
                <div style={featureStyleFunctions.s90({isMobile})}>
                  <CheckCircle2 size={13} color="#0EA5E9" />
                  <span>5 architectural questions with adaptive deep probes</span>
                </div>
                <div style={featureStyleFunctions.s91({isMobile})}>
                  <CheckCircle2 size={13} color="#0EA5E9" />
                  <span>FAANG-calibrated scorecard with trade-off analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Mobile Fixed Particle Bot: Technical Interviewer */}
        {isMobile && (
          <div className="mobile-particle-stage fixed-stage">
            <div className="mobile-particle-aura" style={inlineStyles.s83} />
            <VedikaParticleBot
              src="/vedika-bot-suit.png"
              width={240}
              height={185}
              inline={true}
              colorMode="vibrant"
              particleStep={2}
            />
          </div>
        )}

        {/* PERMANENT FIXED BOTTOM NAVIGATION BAR FOR INTERVIEW */}
        <div className="setup-bottom-bar" style={inlineStyles.s84}>
          <div style={inlineStyles.s85}>
            {interviewStep > 1 ? (
              <button
                type="button"
                className="step-btn prev-btn"
                onClick={() => setInterviewStep((s) => Math.max(1, s - 1))}
              >
                ← Prev
              </button>
            ) : (
              <div style={inlineStyles.s86} />
            )}

            {interviewStep < 4 ? (
              <button
                type="button"
                className="step-btn interview-btn"
                onClick={() => {
                  if (interviewStep === 1 && !topic.trim()) setTopic('Full Stack Web Development');
                  advanceInterviewStep(interviewStep + 1);
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (!topic.trim()) setTopic('Full Stack Web Development');
                  startVoiceSession();
                }}
                className="step-btn interview-btn"
                style={inlineStyles.s87}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Launching Technical Interviewer...</span>
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    <span>Start Voice Technical Interview</span>
                  </>
                )}
              </button>
            )}
          </div>

          {isMobile && (
            <button
              type="button"
              className="mobile-mode-switch-btn viva-style"
              onClick={() => {
                setIsRightOpen(false);
                setSessionMode('viva');
              }}
            >
              <span>Academic Viva</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

  // Active Gameplay, Analyzing & Scorecard Views
  return (
    <div style={featureStyleFunctions.s92({isMobile})}>
      <div style={inlineStyles.s88}>
        
        {/* HEADER BAR */}
        <div style={featureStyleFunctions.s93({})}>
          <div style={inlineStyles.s89}>
            <button 
              type="button"
              onClick={handleGoBack} 
              style={featureStyleFunctions.s94({})}
              title="Go back to previous page"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={featureStyleFunctions.s95({isMobile})}>
                <Brain size={24} style={inlineStyles.s90} />
                Vyomanta AI Viva & Interview Hub
              </h1>
              <p style={inlineStyles.s91}>
                Rigorous Voice-Driven Academic Viva Examiner & Technical Job Interview System
              </p>
            </div>
          </div>

          {/* ACTIVE SESSION TIMER & STAGE BADGE */}
          {gameState === 'active' && (
            <div style={inlineStyles.s92}>
              {/* Dynamic Topic Stage Badge */}
              <div style={inlineStyles.s93}>
                <BookOpen size={14} />
                <span>Topic {currentStageInfo.topicIndex}: {currentStageInfo.topicName}</span>
                {currentStageInfo.questionType === 'follow_up' && (
                  <span style={inlineStyles.s94}> (Probe {currentStageInfo.followUpIndex})</span>
                )}
              </div>

              {/* 15-Minute Session Timer Badge */}
              <div style={featureStyleFunctions.s96({sessionTimeRemaining})}>
                <Activity size={16} style={featureStyleFunctions.s97({sessionTimeRemaining})} />
                <span>{Math.floor(sessionTimeRemaining / 60)}:{(sessionTimeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* APTITUDE ACTIVE CHALLENGE VIEW & SCORECARD */}
        {/* ============================================================== */}
        {gameState === 'active' && sessionMode === 'aptitude' && (
          <div style={inlineStyles.s95}>

            {/* RESTORED SESSION ALERT BANNER */}
            {aptSessionRestoredAlert && (
              <div style={inlineStyles.s96}>
                <div style={inlineStyles.s97}>
                  <RotateCcw size={16} style={inlineStyles.s98} />
                  <span>Restored active 20-question session on topic "{aptSession.topic}" (Question {aptSession.currentIndex + 1} of {aptSession.questions.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAptSessionRestoredAlert(false)}
                  style={inlineStyles.s99}
                >
                  ✕
                </button>
              </div>
            )}

            {/* SCORECARD VIEW */}
            {aptSession.status === 'scorecard' ? (
              <div style={featureStyleFunctions.s98({isMobile})}>
                {/* HEADER SUMMARY */}
                <div style={inlineStyles.s100}>
                  <div>
                    <h2 style={inlineStyles.s101}>
                      <Award size={28} style={inlineStyles.s102} /> Test Session Scorecard
                    </h2>
                    <p style={inlineStyles.s103}>
                      Topic: <strong>{aptSession.topic}</strong> • Category: <strong>{aptSession.category}</strong>
                    </p>
                  </div>

                  <div style={inlineStyles.s104}>
                    {(() => {
                      const totalQ = aptSession.questions.length || 1;
                      const correctCount = aptSession.questions.filter((q, idx) => aptSession.answers[idx] === q.correct_option).length;
                      const accuracy = Math.round((correctCount / totalQ) * 100);
                      return (
                        <>
                          <div style={inlineStyles.s105}>
                            <div style={inlineStyles.s106}>{correctCount} / {totalQ}</div>
                            <div style={inlineStyles.s107}>FINAL SCORE</div>
                          </div>
                          <div style={inlineStyles.s108}>
                            <div style={featureStyleFunctions.s99({accuracy})}>{accuracy}%</div>
                            <div style={inlineStyles.s109}>ACCURACY</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* REVIEW QUESTIONS LIST */}
                <div>
                  <h3 style={inlineStyles.s110}>
                    <BookOpen size={18} style={inlineStyles.s111} /> Complete Question Review & Solutions
                  </h3>
                  <div style={inlineStyles.s112}>
                    {aptSession.questions.map((q, qIdx) => {
                      const userAns = aptSession.answers[qIdx];
                      const isUnanswered = userAns === undefined || userAns === null;
                      const isCorrect = !isUnanswered && userAns === q.correct_option;

                      return (
                        <div
                          key={qIdx}
                          style={featureStyleFunctions.s100({isCorrect,isUnanswered})}
                        >
                          <div style={inlineStyles.s113}>
                            <span style={inlineStyles.s114}>
                              Question {qIdx + 1} of {aptSession.questions.length} • Difficulty: {q.difficulty}
                            </span>
                            <span style={featureStyleFunctions.s101({isCorrect,isUnanswered})}>
                              {isCorrect ? '✓ Correct' : isUnanswered ? 'Skipped' : '✕ Incorrect'}
                            </span>
                          </div>

                          <div style={inlineStyles.s115}>
                            <MathEquationRenderer content={q.question} />
                          </div>

                          {/* OPTIONS SUMMARY */}
                          <div style={featureStyleFunctions.s102({isMobile})}>
                            {q.options.map((opt, oIdx) => {
                              const isUserPick = userAns === oIdx;
                              const isCorrectOpt = oIdx === q.correct_option;

                              let bg = 'var(--s1)';
                              let color = 'var(--text)';
                              let border = 'var(--border)';

                              if (isCorrectOpt) {
                                bg = 'rgba(16, 185, 129, 0.15)';
                                color = '#10B981';
                                border = '#10B981';
                              } else if (isUserPick && !isCorrectOpt) {
                                bg = 'rgba(239, 68, 68, 0.15)';
                                color = '#EF4444';
                                border = '#EF4444';
                              }

                              return (
                                <div
                                  key={oIdx}
                                  style={featureStyleFunctions.s103({bg,border,color})}
                                >
                                  <span>{String.fromCharCode(65 + oIdx)}. <MathEquationRenderer content={opt} /></span>
                                  {isCorrectOpt && <CheckCircle2 size={14} style={inlineStyles.s116} />}
                                  {isUserPick && !isCorrectOpt && <XCircle size={14} style={inlineStyles.s117} />}
                                </div>
                              );
                            })}
                          </div>

                          {/* SOLUTION DRAWER */}
                          <div style={inlineStyles.s118}>
                            <strong style={inlineStyles.s119}>Step-by-Step Explanation:</strong>
                            <MathEquationRenderer content={q.explanation} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SCORECARD ACTIONS */}
                <div style={inlineStyles.s120}>
                  <button
                    type="button"
                    onClick={() => start20QuestionAptitudeSession(aptSession.topic)}
                    style={inlineStyles.s121}
                  >
                    <RotateCcw size={16} /> Retake 20-Question Test ({aptSession.topic})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGameState('setup');
                      setAptSession({ status: 'setup', questions: [], currentIndex: 0, answers: {} });
                    }}
                    style={inlineStyles.s122}
                  >
                    <Target size={16} /> Select New Topic
                  </button>
                </div>
              </div>
            ) : currentAptQuestion ? (
              <>
                {/* TOP ACTION & TIMER BAR */}
                <div style={featureStyleFunctions.s104({})}>
                  <div style={inlineStyles.s123}>
                    <span style={featureStyleFunctions.s105({currentAptQuestion})}>
                      {currentAptQuestion.difficulty}
                    </span>
                    <span style={inlineStyles.s124}>
                      Question {aptSession.currentIndex + 1} of {aptSession.questions.length}
                    </span>
                    <span style={inlineStyles.s125}>
                      • Topic: {currentAptQuestion.topic || aptSession.topic}
                    </span>
                    {aptSession.isFetchingMore && (
                      <span style={inlineStyles.s126}>
                        <Loader2 size={12} className="animate-spin" /> Fetching set in background...
                      </span>
                    )}
                  </div>

                  {/* TIMER & STATS */}
                  <div style={inlineStyles.s127}>
                    {/* Countdown Timer */}
                    <div style={featureStyleFunctions.s106({aptTimer})}>
                      <Clock size={16} style={featureStyleFunctions.s107({aptTimer})} />
                      <span>{Math.floor(aptTimer / 60)}:{(aptTimer % 60).toString().padStart(2, '0')}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFinishAptSession()}
                      style={inlineStyles.s128}
                    >
                      Finish Test
                    </button>
                  </div>
                </div>

                {/* 20-QUESTION NAV GRID */}
                <div style={inlineStyles.s129}>
                  {Array.from({ length: Math.max(20, aptSession.questions.length) }).map((_, qIdx) => {
                    const exists = qIdx < aptSession.questions.length;
                    const isCurrent = qIdx === aptSession.currentIndex;
                    const isAnswered = aptSession.answers[qIdx] !== undefined;

                    let bg = 'var(--s2)';
                    let color = 'var(--muted)';
                    let border = 'var(--border)';

                    if (isCurrent) {
                      bg = 'var(--purple)';
                      color = '#FFFFFF';
                      border = 'var(--purple)';
                    } else if (isAnswered) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      color = '#10B981';
                      border = '#10B981';
                    }

                    return (
                      <button
                        key={qIdx}
                        type="button"
                        disabled={!exists}
                        onClick={() => handleNavigateAptSession(qIdx)}
                        style={featureStyleFunctions.s108({bg,color,border,exists})}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* QUESTION CARD */}
                <div style={featureStyleFunctions.s109({isMobile})}>
                  <div style={inlineStyles.s130}>
                    <MathEquationRenderer content={currentAptQuestion.question} />
                  </div>

                  {/* OPTIONS GRID */}
                  <div style={featureStyleFunctions.s110({isMobile})}>
                    {currentAptQuestion.options.map((optText, optIdx) => {
                      const isSelected = selectedAptOption === optIdx;
                      const isCorrectOption = optIdx === currentAptQuestion.correct_option;
                      const isAnswerRevealed = selectedAptOption !== null || showAptSolution;

                      let btnBg = 'var(--s2)';
                      let btnBorder = 'var(--border)';
                      let btnColor = 'var(--text)';

                      if (isAnswerRevealed) {
                        if (isCorrectOption) {
                          btnBg = 'rgba(16, 185, 129, 0.15)';
                          btnBorder = '#10B981';
                          btnColor = '#10B981';
                        } else if (isSelected && !isCorrectOption) {
                          btnBg = 'rgba(239, 68, 68, 0.15)';
                          btnBorder = '#EF4444';
                          btnColor = '#EF4444';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswerRevealed}
                          onClick={() => handleSelectAptOption(optIdx)}
                          style={featureStyleFunctions.s111({btnBg,btnBorder,btnColor,isAnswerRevealed})}
                        >
                          <div style={inlineStyles.s131}>
                            <span style={featureStyleFunctions.s112({btnBorder})}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <MathEquationRenderer content={optText} />
                          </div>
                          {isAnswerRevealed && isCorrectOption && <CheckCircle2 size={18} style={inlineStyles.s132} />}
                          {isAnswerRevealed && isSelected && !isCorrectOption && <XCircle size={18} style={inlineStyles.s133} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTION BAR: HINT, GIVE UP, PREV, NEXT */}
                  <div style={featureStyleFunctions.s113({})}>
                    <div style={inlineStyles.s134}>
                      {/* Hint Button */}
                      <button
                        type="button"
                        onClick={() => setShowAptHint(prev => !prev)}
                        style={featureStyleFunctions.s114({showAptHint})}
                      >
                        <Lightbulb size={16} style={inlineStyles.s135} />
                        {showAptHint ? 'Hide Hint' : '💡 Get Hint'}
                      </button>

                      {/* Give Up Button */}
                      <button
                        type="button"
                        onClick={handleAptGiveUp}
                        disabled={showAptSolution}
                        style={featureStyleFunctions.s115({showAptSolution})}
                      >
                        <Flag size={16} style={inlineStyles.s136} />
                        {showAptSolution ? 'Solution Revealed' : '🏳️ Give Up'}
                      </button>
                    </div>

                    {/* NAVIGATION BUTTONS */}
                    <div style={inlineStyles.s137}>
                      <button
                        type="button"
                        disabled={aptSession.currentIndex === 0}
                        onClick={() => handleNavigateAptSession(aptSession.currentIndex - 1)}
                        style={featureStyleFunctions.s116({aptSession})}
                      >
                        Previous
                      </button>

                      {aptSession.currentIndex < 19 ? (
                        <button
                          type="button"
                          disabled={generatingAiAptitude}
                          onClick={() => handleNavigateAptSession(aptSession.currentIndex + 1)}
                          style={featureStyleFunctions.s117({generatingAiAptitude})}
                        >
                          {generatingAiAptitude ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              <span>Generating Question {aptSession.currentIndex + 2} with AI...</span>
                            </>
                          ) : (
                            <>
                              <span>Next Question</span> <ChevronRight size={16} />
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishAptSession}
                          style={inlineStyles.s138}
                        >
                          Submit & View Scorecard <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* HINT DRAWER */}
                  {showAptHint && (
                    <div style={inlineStyles.s139}>
                      <div style={inlineStyles.s140}>
                        <Lightbulb size={14} /> HINT
                      </div>
                      <MathEquationRenderer content={currentAptQuestion.hint} />
                    </div>
                  )}

                  {/* STEP-BY-STEP EXPLANATION (REVEALED ON SELECTION OR GIVE UP) */}
                  {(showAptSolution || selectedAptOption !== null) && (
                    <div style={inlineStyles.s141}>
                      <div style={inlineStyles.s142}>
                        <Brain size={16} /> Step-by-Step Explanation & Solution
                      </div>
                      <div style={inlineStyles.s143}>
                        <MathEquationRenderer content={currentAptQuestion.explanation} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={inlineStyles.s144}>
                <div style={inlineStyles.s145}>
                  <Zap size={32} />
                </div>

                <div>
                  <h3 style={inlineStyles.s146}>
                    Generating Technical Question 1 with AI...
                  </h3>
                  <p style={inlineStyles.s147}>
                    Vedika AI is tailoring a fresh question for topic <strong style={inlineStyles.s148}>"{aptSession.topic}"</strong> ({aptSession.difficulty} Difficulty).
                  </p>
                </div>

                <div style={inlineStyles.s149}>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Preparing your test session...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ACTIVE SESSION VIEW (GEMINI LIVE REAL-TIME OR GUIDED TURN) */}
        {/* ============================================================== */}
        {gameState === 'active' && sessionMode !== 'aptitude' && executionMode === 'live' && (
          <div style={inlineStyles.s150}>
            
            {/* LIVE EXAMINER HUD CARD */}
            <div style={featureStyleFunctions.s118({isMobile})}>
              {/* TOP STATUS BAR */}
              <div style={featureStyleFunctions.s119({})}>
                <div style={inlineStyles.s151}>
                  <div style={featureStyleFunctions.s120({liveConnectionStatus})} />
                  <span style={featureStyleFunctions.s121({liveConnectionStatus})}>
                    {liveConnectionStatus === 'tutor-speaking' && '🎙️ AI Examiner Speaking...'}
                    {liveConnectionStatus === 'connected' && '👂 AI Examiner Listening (Speak in English)...'}
                    {liveConnectionStatus === 'connecting' && 'Connecting to Live Gemini Examiner...'}
                    {liveConnectionStatus === 'disconnected' && 'Live Examiner Offline'}
                    {liveConnectionStatus === 'error' && (
                      <span style={inlineStyles.s152}>
                        <span>Connection Error</span>
                        <button
                          onClick={() => {
                            const activeTopic = activeSessionTopic || (sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (topic || programmingLanguage));
                            const activeSubject = sessionMode === 'viva' ? (vivaSource === 'custom' ? 'Custom Academic Topic' : subject) : 'Technical Engineering';
                            startGeminiLiveSession(activeTopic, activeSubject, difficulty, level);
                          }}
                          style={inlineStyles.s153}
                        >
                          <RefreshCw size={11} /> Retry
                        </button>
                      </span>
                    )}
                  </span>
                </div>

                <div style={inlineStyles.s154}>
                  <button
                    onClick={() => setIsScratchpadOpen((prev) => !prev)}
                    style={featureStyleFunctions.s122({isScratchpadOpen})}
                  >
                    <Code size={13} />
                    <span>{isScratchpadOpen ? 'Hide Scratchpad' : '📝 Code Scratchpad'}</span>
                  </button>

                  <button
                    onClick={() => setIsTranscriptOpen((prev) => !prev)}
                    style={featureStyleFunctions.s123({isTranscriptOpen})}
                  >
                    <FileText size={13} />
                    <span>{isTranscriptOpen ? 'CC Captions On' : 'CC Captions Off'}</span>
                  </button>

                  <span style={featureStyleFunctions.s124({difficulty})}>
                    {difficulty} Difficulty
                  </span>
                  <span style={inlineStyles.s155}>
                    • {sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (topic || programmingLanguage)}
                  </span>
                </div>
              </div>

              {/* FLOATING PLAIN TEXTAREA SCRATCHPAD FOR CODE / NOTES */}
              {isScratchpadOpen && (
                <div style={inlineStyles.s156}>
                  <div style={inlineStyles.s157}>
                    <div style={inlineStyles.s158}>
                      <Code size={15} style={inlineStyles.s159} />
                      <span style={inlineStyles.s160}>
                        Code & Notes Scratchpad
                      </span>
                    </div>
                    <span style={inlineStyles.s161}>
                      Type plain code/notes below • Speak your thoughts simultaneously
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    placeholder="Type your code, query, or notes here... (e.g. Python / Java / SQL)"
                    value={scratchpadText}
                    onChange={(e) => setScratchpadText(e.target.value)}
                    style={inlineStyles.s162}
                  />

                  <div style={inlineStyles.s163}>
                    <button
                      onClick={() => setIsScratchpadOpen(false)}
                      style={inlineStyles.s164}
                    >
                      Close
                    </button>

                    <button
                      onClick={handleAttachScratchpadToAnswer}
                      disabled={!scratchpadText.trim()}
                      style={featureStyleFunctions.s125({scratchpadText})}
                    >
                      <Check size={13} />
                      <span>Attach Code to Answer</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MAIN STAGE CONTENT (PET CENTER CONSTANT + OPTIONAL CC SIDE TRANSCRIPT) */}
              <div style={featureStyleFunctions.s126({isTranscriptOpen,isMobile})}>
                {/* CENTER CONSTANT STAGE WITH PET & SPEECH BUBBLE POPUP */}
                <div style={featureStyleFunctions.s127({isMobile})}>
                  {/* DYNAMIC SPEECH / THINKING BUBBLE POPUP */}
                  <div style={featureStyleFunctions.s128({isMobile,liveConnectionStatus,isSpeaking,isRecording})}>
                    <div style={inlineStyles.s165}>
                      <span style={inlineStyles.s166}>
                        🎙️ AI EXAMINER QUESTION
                      </span>
                    </div>

                    <p style={featureStyleFunctions.s129({isMobile})}>
                      {(() => {
                        const examinerMsg = liveConversation.slice().reverse().find(m => m.sender === 'examiner')?.text;
                        return examinerMsg || liveStatusMessage || 'AI Examiner is ready! Oral examination starting...';
                      })()}
                    </p>

                    {liveConnectionStatus === 'error' && (
                      <div style={inlineStyles.s167}>
                        <button
                          onClick={() => {
                            const activeTopic = activeSessionTopic || (sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (topic || programmingLanguage));
                            const activeSubject = sessionMode === 'viva' ? (vivaSource === 'custom' ? 'Custom Academic Topic' : subject) : 'Technical Engineering';
                            startGeminiLiveSession(activeTopic, activeSubject, difficulty, level);
                          }}
                          style={inlineStyles.s168}
                        >
                          <RefreshCw size={14} /> Retry Connection
                        </button>
                      </div>
                    )}

                    {/* Speech bubble pointer pointing down to Pet Mascot */}
                    <div style={inlineStyles.s169} />
                  </div>

                  {/* AUDIO EXAMINER INDICATOR */}
                  <div 
                    onClick={() => {
                      if (liveConnectionStatus === 'error' || liveConnectionStatus === 'disconnected') {
                        const activeTopic = activeSessionTopic || (sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (topic || programmingLanguage));
                        const activeSubject = sessionMode === 'viva' ? (vivaSource === 'custom' ? 'Custom Academic Topic' : subject) : 'Technical Engineering';
                        startGeminiLiveSession(activeTopic, activeSubject, difficulty, level);
                      }
                    }}
                    style={featureStyleFunctions.s130({isMobile,liveConnectionStatus})}
                  >
                    <Mic size={48} color={liveConnectionStatus === 'error' ? 'var(--red, #ef4444)' : (liveConnectionStatus === 'connected' ? '#10B981' : 'var(--purple, #8b5cf6)')} />
                  </div>

                  <span style={featureStyleFunctions.s131({liveConnectionStatus})}>
                    {liveConnectionStatus === 'error' ? 'Click microphone to retry connection' : 'AI Voice Examiner • Speak naturally through your microphone'}
                  </span>
                </div>

                {/* SIDE CC TRANSCRIPT WINDOW (TOGGLED VIA CC CAPTIONS BUTTON) */}
                {isTranscriptOpen && (
                  <div style={inlineStyles.s170}>
                    <div style={inlineStyles.s171}>
                      <span style={inlineStyles.s172}>
                        📜 CC Live Transcript History
                      </span>
                      <button
                        onClick={() => setIsTranscriptOpen(false)}
                        style={inlineStyles.s173}
                      >
                        Close
                      </button>
                    </div>

                    {liveConversation.length === 0 ? (
                      <span style={inlineStyles.s174}>
                        Transcript history will stream here as you speak.
                      </span>
                    ) : (
                      liveConversation.map((msg) => {
                        const isCandidate = msg.sender === 'candidate';
                        return (
                          <div key={msg.id} style={inlineStyles.s175}>
                            <span style={featureStyleFunctions.s132({isCandidate})}>
                              {isCandidate ? 'You:' : 'Examiner:'}
                            </span>
                            <div style={featureStyleFunctions.s133({isCandidate})}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div style={featureStyleFunctions.s134({})}>
                <span style={inlineStyles.s176}>
                  {liveStatusMessage}
                </span>

                <div style={inlineStyles.s177}>
                  <button
                    onClick={handleFinishLiveExam}
                    style={inlineStyles.s178}
                  >
                    <Award size={16} />
                    <span>Finish Exam & View Scorecard</span>
                  </button>

                  <button
                    onClick={() => {
                      disconnectGeminiLive();
                      setGameState('setup');
                    }}
                    style={featureStyleFunctions.s135({})}
                  >
                    <PhoneOff size={15} />
                    <span>Exit</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {gameState === 'active' && sessionMode !== 'aptitude' && executionMode === 'turn' && (
          <div style={inlineStyles.s179}>
            
            {/* EXAMINER QUESTION CARD */}
            <div style={featureStyleFunctions.s136({isMobile})}>
              <div style={featureStyleFunctions.s137({})}>
                <div style={inlineStyles.s180}>
                  <span style={featureStyleFunctions.s138({currentQuestionType})}>
                    QUESTION {currentQIndex + 1} OF 5
                  </span>
                  {currentQuestionType === 'follow_up' && (
                    <span style={inlineStyles.s181}>
                      <Sparkles size={11} />
                      Follow-up Probe
                    </span>
                  )}
                  <span style={featureStyleFunctions.s139({difficulty})}>
                    {difficulty}
                  </span>
                  <span style={featureStyleFunctions.s140({turnTimeRemaining})}>
                    • Turn Timer: {turnTimeRemaining}s remaining {turnTimeRemaining < 20 && '⏱️'}
                  </span>
                </div>

                <div style={inlineStyles.s182}>
                  <button
                    onClick={handleRepeatQuestion}
                    style={featureStyleFunctions.s141({})}
                    title="Ask Examiner to Repeat or Rephrase Question"
                  >
                    <RotateCcw size={13} />
                    <span>Repeat Question</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = !ttsEnabled;
                      setTtsEnabled(next);
                      if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                      } else if (next) {
                        speakText(currentQuestion);
                      }
                    }}
                    style={featureStyleFunctions.s142({ttsEnabled})}
                  >
                    {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    <span>{isSpeaking ? 'Speaking...' : ttsEnabled ? 'Voice On' : 'Muted'}</span>
                  </button>
                </div>
              </div>

              {/* 90s TURN TIMER PROGRESS BAR */}
              <div style={inlineStyles.s183}>
                <div style={featureStyleFunctions.s143({turnTimeRemaining})} />
              </div>

              {/* EXAMINER ACKNOWLEDGMENT BUBBLE */}
              {currentAcknowledgment && (
                <div style={inlineStyles.s184}>
                  <span>💬 Examiner:</span>
                  <span>"{currentAcknowledgment}"</span>
                </div>
              )}

              {/* PROBED CONCEPT BADGE */}
              {currentQuestionType === 'follow_up' && currentProbedPoint && (
                <div style={featureStyleFunctions.s144({})}>
                  <span style={inlineStyles.s185}>🔍 Probing Your Point:</span>
                  <span style={inlineStyles.s186}>"{currentProbedPoint}"</span>
                </div>
              )}

              {/* QUESTION DISPLAY */}
              <h2 style={featureStyleFunctions.s145({isMobile})}>
                "{currentQuestion}"
              </h2>
            </div>

            {/* CANDIDATE VOICE / ANSWER CONSOLE */}
            <div style={featureStyleFunctions.s146({isMobile})}>
              <div style={inlineStyles.s187}>
                <div style={inlineStyles.s188}>
                  <label style={inlineStyles.s189}>
                    Candidate Response
                  </label>
                  {isRecording && (
                    <span style={inlineStyles.s190}>
                      <span style={inlineStyles.s191} />
                      Live Recording
                    </span>
                  )}
                </div>
                <div style={inlineStyles.s192}>
                  {userAnswer && (
                    <button
                      onClick={handleClearAnswer}
                      style={inlineStyles.s193}
                      title="Clear Answer Text"
                    >
                      <Trash2 size={13} />
                      <span>Clear</span>
                    </button>
                  )}
                  <button
                    onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
                    style={inlineStyles.s194}
                  >
                    {inputMode === 'voice' ? 'Switch to Typing' : 'Switch to Voice Mic'}
                  </button>
                </div>
              </div>

              {/* TAP-TO-SPEAK MIC BUTTON */}
              {inputMode === 'voice' && (
                <div style={featureStyleFunctions.s147({isRecording})}>
                  <button
                    onClick={toggleRecording}
                    style={featureStyleFunctions.s148({isRecording})}
                  >
                    {isRecording ? <MicOff size={30} /> : <Mic size={30} />}
                  </button>
                  <div style={inlineStyles.s195}>
                    <span style={featureStyleFunctions.s149({isRecording})}>
                      {isRecording ? 'Recording active... Tap when finished speaking' : 'Tap Microphone to Speak Answer'}
                    </span>
                    <p style={inlineStyles.s196}>
                      Speak in clear English. Your speech is transcribed in real-time below.
                    </p>
                  </div>
                </div>
              )}

              {/* TRANSCRIPT / ANSWER TEXT DISPLAY */}
              <div>
                <textarea
                  rows={4}
                  placeholder={inputMode === 'voice' ? "Your spoken answer will appear here in real time..." : "Type your answer clearly..."}
                  value={userAnswer}
                  onChange={handleUserAnswerChange}
                  style={featureStyleFunctions.s150({})}
                />
              </div>

              {/* SUBMIT & SKIP BUTTONS */}
              <div style={inlineStyles.s197}>
                <span style={featureStyleFunctions.s151({statusMessage})}>
                  {statusMessage || (loading ? 'Examiner is evaluating your answer...' : '')}
                </span>

                <div style={inlineStyles.s198}>
                  {currentQIndex < 4 && (
                    <button
                      onClick={handleSkipQuestion}
                      disabled={loading}
                      style={featureStyleFunctions.s152({loading})}
                    >
                      Skip Question
                    </button>
                  )}

                  <button
                    onClick={handleAnswerSubmit}
                    disabled={loading}
                    style={featureStyleFunctions.s153({currentQIndex,loading})}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : currentQIndex >= 4 ? (
                      <Award size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{currentQIndex >= 4 ? '🎉 Finish Exam & View Scorecard' : 'Submit & Next Question'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* RESPONSIVE ANALYZING & EVALUATION LOADING VIEW */}
        {/* ============================================================== */}
        {gameState === 'analyzing' && (
          <div style={featureStyleFunctions.s154({isMobile})}>
            
            {/* GLOWING ANIMATED RADAR / BRAIN ICON */}
            <div style={inlineStyles.s199}>
              <div style={inlineStyles.s200} />
              <div style={inlineStyles.s201}>
                <Brain size={38} className="animate-pulse" />
              </div>
            </div>

            <div>
              <div style={inlineStyles.s202}>
                <span style={inlineStyles.s203}>
                  AI EXAMINER COMMITTEE
                </span>
                <span style={featureStyleFunctions.s155({difficulty})}>
                  {difficulty} Difficulty
                </span>
              </div>
              <h2 style={featureStyleFunctions.s156({isMobile})}>
                Analyzing Performance & Compiling Scorecard
              </h2>
              <p style={inlineStyles.s204}>
                Vedika AI is conducting a multi-dimension rubric audit on your 5 recorded answers for <strong style={inlineStyles.s205}>{sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (programmingLanguage || 'Technical Stack')}</strong>.
              </p>
            </div>

            {/* PROGRESS BAR */}
            <div style={inlineStyles.s206}>
              <div style={featureStyleFunctions.s157({analysisStep})} />
            </div>

            {/* STEP-BY-STEP CHECKLIST CARDS */}
            <div style={inlineStyles.s207}>
              {[
                { label: 'Ingesting & normalizing 5 transcript turns & speech durations', icon: Activity },
                { label: 'Evaluating Technical Accuracy & Scientific / Coding Principles', icon: Search },
                { label: 'Performing Conceptual Gap & Misconception Analysis', icon: ShieldAlert },
                { label: 'Synthesizing 4-Dimension Rubric & Targeted Study Roadmap', icon: BarChart2 }
              ].map((st, sIdx) => {
                const isDone = analysisStep > sIdx;
                const isCurrent = analysisStep === sIdx;
                const Icon = st.icon;

                return (
                  <div
                    key={sIdx}
                    style={featureStyleFunctions.s158({isCurrent,isDone,sIdx,analysisStep})}
                  >
                    <div style={inlineStyles.s208}>
                      <Icon size={18} style={featureStyleFunctions.s159({isDone,isCurrent})} />
                      <span style={featureStyleFunctions.s160({isCurrent})}>
                        {st.label}
                      </span>
                    </div>

                    <div>
                      {isDone ? (
                        <CheckCircle size={18} style={inlineStyles.s209} />
                      ) : isCurrent ? (
                        <Loader2 className="animate-spin" size={18} style={inlineStyles.s210} />
                      ) : (
                        <div style={inlineStyles.s211} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* SUMMARY SCORECARD DASHBOARD VIEW */}
        {/* ============================================================== */}
        {gameState === 'summary' && scorecard && (
          <div style={inlineStyles.s212}>
            
            {/* SCORECARD HERO CARD */}
            <div style={featureStyleFunctions.s161({isMobile})}>
              <Award size={56} style={inlineStyles.s213} />
              <div>
                <div style={inlineStyles.s214}>
                  <span style={inlineStyles.s215}>
                    OFFICIAL EVALUATION SCORECARD
                  </span>
                  <span style={featureStyleFunctions.s162({difficulty})}>
                    {difficulty} DIFFICULTY
                  </span>
                </div>
                <h2 style={inlineStyles.s216}>
                  Performance Report: {sessionMode === 'viva' ? (vivaSource === 'custom' ? customVivaTopic : selectedExperiment) : (programmingLanguage || 'Technical Interview')}
                </h2>
              </div>

              {/* SCORE BADGES */}
              <div style={inlineStyles.s217}>
                <div style={featureStyleFunctions.s163({})}>
                  <div style={featureStyleFunctions.s164({scorecard})}>
                    {scorecard.overallScore} / 100
                  </div>
                  <span style={inlineStyles.s218}>OVERALL SCORE</span>
                </div>

                <div style={featureStyleFunctions.s165({})}>
                  <div style={featureStyleFunctions.s166({scorecard})}>
                    Grade {scorecard.letterGrade}
                  </div>
                  <span style={inlineStyles.s219}>EVALUATION GRADE</span>
                </div>

                <div style={featureStyleFunctions.s167({})}>
                  <div style={inlineStyles.s220}>
                    {scorecard.totalQuestionsAsked || (scorecard.perTopicAnalysis?.length || 0)} Qs
                  </div>
                  <span style={inlineStyles.s221}>
                    {scorecard.nTopics || (scorecard.perTopicAnalysis?.length || 0)} TOPICS ATTEMPTED
                  </span>
                </div>
              </div>

              {/* SYSTEM WARNING BANNER (IF ANY TOPICS WERE UNSCORED) */}
              {scorecard.systemErrorWarning && (
                <div style={inlineStyles.s222}>
                  ⚠️ {scorecard.systemErrorWarning}
                </div>
              )}

              {/* SUMMARY CRITIQUE */}
              <p style={featureStyleFunctions.s168({})}>
                "{scorecard.summaryCritique}"
              </p>
            </div>

            {/* 3-DIMENSION RUBRIC BREAKDOWN GRID */}
            <div style={featureStyleFunctions.s169({isMobile})}>
              {Object.entries(scorecard.rubricBreakdown || {}).map(([dimKey, dimVal]) => {
                const labels = {
                  technicalAccuracy: { title: 'Technical Accuracy & Depth', weight: '50%' },
                  problemSolving: { title: 'Problem Solving & Adaptability', weight: '30%' },
                  communicationClarity: { title: 'Communication Clarity', weight: '20%' }
                };
                const info = labels[dimKey] || { title: dimKey, weight: '' };
                const isUnscored = dimVal.score === null || dimVal.score === undefined;

                return (
                  <div key={dimKey} style={featureStyleFunctions.s170({})}>
                    <div style={inlineStyles.s223}>
                      <span style={inlineStyles.s224}>
                        {info.title} {info.weight && <span style={inlineStyles.s225}>({info.weight})</span>}
                      </span>
                      <span style={featureStyleFunctions.s171({isUnscored})}>
                        {isUnscored ? 'N/A' : `${dimVal.score} / 10`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={inlineStyles.s226}>
                      <div style={featureStyleFunctions.s172({isUnscored,dimVal})} />
                    </div>

                    <p style={inlineStyles.s227}>
                      {dimVal.feedback}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* TURN-BY-TURN / QUESTION-BY-QUESTION DIAGNOSTIC REPORT */}
            {scorecard.turnByTurnAnalysis && scorecard.turnByTurnAnalysis.length > 0 && (
              <div style={inlineStyles.s228}>
                <div style={inlineStyles.s229}>
                  <div>
                    <h3 style={inlineStyles.s230}>
                      <FileCheck size={22} style={inlineStyles.s231} />
                      <span>Turn-by-Turn Diagnostic Analysis</span>
                    </h3>
                    <p style={inlineStyles.s232}>
                      Comprehensive question-by-question breakdown comparing your responses, what went well, missing concepts, best model answers, and tips for the next round.
                    </p>
                  </div>
                  <span style={inlineStyles.s233}>
                    {scorecard.turnByTurnAnalysis.length} Exam Questions Evaluated
                  </span>
                </div>

                <div style={inlineStyles.s234}>
                  {scorecard.turnByTurnAnalysis.map((turn, tIdx) => {
                    const isFollowUp = turn.questionType === 'follow_up';
                    const score = typeof turn.scoreOutOfTen === 'number' ? turn.scoreOutOfTen : 0;
                    const scoreColor = score >= 8 ? '#10B981' : score >= 5 ? 'var(--accent)' : '#EF4444';
                    const scoreBg = score >= 8 ? 'rgba(16, 185, 129, 0.12)' : score >= 5 ? 'rgba(79, 131, 246, 0.12)' : 'rgba(239, 68, 68, 0.12)';

                    return (
                      <div
                        key={tIdx}
                        style={featureStyleFunctions.s173({isMobile})}
                      >
                        {/* TURN HEADER */}
                        <div style={featureStyleFunctions.s174({})}>
                          <div style={inlineStyles.s235}>
                            <span style={featureStyleFunctions.s175({isFollowUp})}>
                              {isFollowUp ? `Q${tIdx + 1} • FOLLOW-UP PROBE` : `Q${tIdx + 1} • CORE FOUNDATION`}
                            </span>
                            {turn.probedPoint && (
                              <span style={featureStyleFunctions.s176({})}>
                                Probed: <strong style={inlineStyles.s236}>"{turn.probedPoint}"</strong>
                              </span>
                            )}
                          </div>

                          <div style={featureStyleFunctions.s177({scoreBg,scoreColor})}>
                            <span>Score:</span>
                            <span>{score} / 10</span>
                          </div>
                        </div>

                        {/* QUESTION BOX */}
                        <div>
                          <label style={inlineStyles.s237}>
                            Examiner Question
                          </label>
                          <div style={inlineStyles.s238}>
                            "{turn.question}"
                          </div>
                        </div>

                        {/* CANDIDATE ANSWER BOX */}
                        <div style={featureStyleFunctions.s178({})}>
                          <div style={inlineStyles.s239}>
                            <Edit3 size={13} style={inlineStyles.s240} />
                            <span style={inlineStyles.s241}>
                              Your Answer
                            </span>
                          </div>
                          <div style={featureStyleFunctions.s179({turn})}>
                            "{turn.candidateAnswer}"
                          </div>
                        </div>

                        {/* TWO-COLUMN FEEDBACK (STRENGTHS VS IMPROVEMENT) */}
                        <div style={featureStyleFunctions.s180({isMobile})}>
                          {/* WHAT WENT WELL */}
                          <div style={inlineStyles.s242}>
                            <div style={inlineStyles.s243}>
                              <CheckCircle size={15} />
                              <span>What Went Well & Strengths</span>
                            </div>
                            <p style={inlineStyles.s244}>
                              {turn.whatWentWell}
                            </p>
                          </div>

                          {/* WHAT CAN BE IMPROVED */}
                          <div style={inlineStyles.s245}>
                            <div style={inlineStyles.s246}>
                              <AlertCircle size={15} />
                              <span>Areas for Improvement & Gaps</span>
                            </div>
                            <p style={inlineStyles.s247}>
                              {turn.whatCanBeImproved}
                            </p>
                          </div>
                        </div>

                        {/* BEST MODEL ANSWER CARD */}
                        {turn.bestModelAnswer && (
                          <div style={inlineStyles.s248}>
                            <div style={inlineStyles.s249}>
                              <Sparkles size={16} />
                              <span>🌟 Best Model Answer (Gold Standard)</span>
                            </div>
                            <div style={inlineStyles.s250}>
                              <MathEquationRenderer text={turn.bestModelAnswer} />
                            </div>
                          </div>
                        )}

                        {/* TIP FOR NEXT ROUND */}
                        {turn.keyImprovementTip && (
                          <div style={inlineStyles.s251}>
                            <Lightbulb size={16} style={inlineStyles.s252} />
                            <div>
                              <strong style={inlineStyles.s253}>Actionable Tip for Next Round: </strong>
                              <span style={inlineStyles.s254}>{turn.keyImprovementTip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STRENGTHS & ACTIONABLE PREPARATION ROADMAP */}
            <div style={featureStyleFunctions.s181({isMobile})}>
              {/* STRENGTHS */}
              <div style={featureStyleFunctions.s182({})}>
                <h4 style={inlineStyles.s255}>
                  <CheckCircle size={18} />
                  <span>Demonstrated Strengths</span>
                </h4>
                <ul style={inlineStyles.s256}>
                  {(scorecard.strengths || []).map((st, sIdx) => (
                    <li key={sIdx}>{st}</li>
                  ))}
                </ul>
              </div>

              {/* ROADMAP / IMPROVEMENT */}
              <div style={featureStyleFunctions.s183({})}>
                <h4 style={inlineStyles.s257}>
                  <Target size={18} />
                  <span>Targeted Study Roadmap</span>
                </h4>
                <ul style={inlineStyles.s258}>
                  {(scorecard.recommendedStudyTopics || []).map((tp, tIdx) => (
                    <li key={tIdx}>{tp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={inlineStyles.s259}>
              <button
                onClick={() => {
                  setGameState('setup');
                  setScorecard(null);
                  setHistory([]);
                }}
                style={inlineStyles.s260}
              >
                <RotateCcw size={16} />
                <span>Start Another Session</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                style={featureStyleFunctions.s184({})}
              >
                <Printer size={16} />
                <span>Print Scorecard</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
