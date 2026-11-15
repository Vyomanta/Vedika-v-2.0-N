'use client';
import * as featureStyleFunctions from '@/features/general-tutor/styles/GeneralTutor.3d15faeb.styles.js';
import dynamic from 'next/dynamic';

import inlineStyles from '@/features/general-tutor/styles/GeneralTutor.styles';
import '@/features/general-tutor/styles/GeneralTutor.css';


import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Brain, Loader2, ChevronRight, ChevronDown, Lock, FlipHorizontal,
  Paperclip, Mic, Image, HelpCircle, Send, AlignLeft, Sparkles, ChevronLeft,
  BookOpen, Code2, BarChart3, Home, Zap, Award, FileText, FolderOpen, Briefcase,
  Trash, History, X, Plus, Pin, Search, Check, PanelLeft, Type, Waves
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { geminiCall } from '@/features/tutoring/api/gemini';
import { classifyIntent, evaluateMath, getGreetingResponse, getThanksResponse, detectPromptInjection } from '@/features/tutoring/domain/intents';
import { buildChatPrompt, buildFeaturePrompt, TUTOR_SYSTEM, QUIZ_SYSTEM, FLASHCARD_SYSTEM, INFOGRAPHIC_SYSTEM, SIMPLER_SYSTEM, EXAMPLES_SYSTEM, MAX_TOKENS } from '@/features/tutoring/domain/prompts';
import { parseQuizOutput, parseFlashcardsOutput, parseInfographicOutput } from '@/features/tutoring/domain/parsers';
import { generateInfographic } from '@/lib/infographicEngine';
const InfographicCanvas = dynamic(() => import('@/components/infographic/InfographicCanvas').then(module => module.InfographicCanvas), { ssr: false });
import { generateDynamicInfographic } from '@/lib/infographic/client';
const VoiceAgentView = dynamic(() => import('@/components/voice-tutor/VoiceAgentView'), { ssr: false });
const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), { ssr: false });
import { getJwtToken } from '@/lib/jwtCache';
import MobileNav from '@/components/MobileNav';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import GlacierBackground from '@/components/GlacierBackground';
import UserBlobAvatar from '@/components/UserBlobAvatar';

const MODES = ['Beginner', 'Exam', 'Interview', 'Revision'];
const LENGTHS = ['Short', 'Medium', 'Deep'];
const modeColors = { Beginner: T.green, Exam: T.accent, Interview: T.amber, Revision: T.purple };

const NAV = [
  { id: '/',              Icon: Home,          label: 'Dashboard'     },
  { id: '/courses',       Icon: BookOpen,      label: 'Courses'       },
  { id: '/quizzes',       Icon: Award,         label: 'Quizzes'       },
  { id: '/assignments',   Icon: FileText,      label: 'Assignments'   },
  { id: '/resources',     Icon: FolderOpen,    label: 'Resources'     },
  { id: '/general-tutor', Icon: Brain,         label: 'Ask your AI Tutor' },
  { id: '/coding-tutor',  Icon: Code2,         label: 'Code with AI Tutor'  },
  { id: '/jobs',          Icon: Briefcase,     label: 'Jobs'          },
  { id: '/progress',      Icon: BarChart3,     label: 'Progress'      },
];

const SUGGESTIONS = [
  { id: 'quiz', label: 'Quiz', Icon: HelpCircle, color: T.accent },
  { id: 'flashcards', label: 'Flashcards', Icon: FlipHorizontal, color: T.purple },
  { id: 'infographic', label: 'Visual Summary', Icon: Image, color: T.amber },
  { id: 'simpler', label: 'Explain Simpler', Icon: AlignLeft, color: T.green },
  { id: 'examples', label: 'Examples', Icon: Sparkles, color: T.accent },
];

const cleanMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**')
    .replace(/\*\*\s+([^*]+?)\*\*/g, '**$1**')
    .replace(/\*\*([^*]+?)\s+\*\*/g, '**$1**');
};

export default function GeneralTutor() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isJustSent, setIsJustSent] = useState(false);
  const typingTimerRef = useRef(null);
  const [mode, setMode] = useState('Beginner');
  const [length, setLength] = useState('Short');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [generating, setGenerating] = useState({ msgIdx: null, type: null });
  const [streamingText, setStreamingText] = useState('');
  const streamElRef = useRef(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'voice'
  const [textSessions, setTextSessions] = useState([]);
  const [voiceSessions, setVoiceSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [voiceSessionToRestore, setVoiceSessionToRestore] = useState(null);
  const [historySearch, setHistorySearch] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // FeralUI Fluid Background Themes: 'aurora' (Northern lights), 'glacier' (Deep Ocean), 'pastel' (Opal)
  const BG_THEMES = useMemo(() => [
    {
      id: 'aurora',
      name: 'Aurora Flow',
      shortLabel: 'Aurora',
      emoji: '🌌',
      desc: 'Ghost light · Luminous Ray & Night Sky',
      gradient: 'linear-gradient(135deg, #F4F8FF 0%, #BFD4EE 35%, #5C749A 65%, #232E4A 100%)',
      color: '#BFD4EE',
      border: 'rgba(191, 212, 238, 0.5)',
      bg: 'rgba(191, 212, 238, 0.12)'
    },
    {
      id: 'glacier',
      name: 'Glacier Flow',
      shortLabel: 'Glacier',
      emoji: '❄️',
      desc: 'Deep Ocean · Lapis & Hanada',
      gradient: 'linear-gradient(135deg, #65BED0 0%, #277EA3 50%, #183F60 100%)',
      color: '#65BED0',
      border: 'rgba(101, 190, 208, 0.45)',
      bg: 'rgba(101, 190, 208, 0.12)'
    },
    {
      id: 'pastel',
      name: 'Pastel Flow',
      shortLabel: 'Pastel',
      emoji: '🌸',
      desc: 'Opal · Lavender & Sakura Pink',
      gradient: 'linear-gradient(135deg, #9BE0E8 0%, #C4B5F7 50%, #F8B8D9 100%)',
      color: '#D8B4FE',
      border: 'rgba(192, 132, 252, 0.45)',
      bg: 'rgba(192, 132, 252, 0.12)'
    },
    {
      id: 'waves',
      name: 'Cyber Waves',
      shortLabel: 'Waves',
      emoji: '🌊',
      desc: 'Cybernetic Neon Waves · Slow Flowing Ribbon',
      gradient: 'linear-gradient(135deg, #14B1AB 0%, #F9D56E 50%, #E8505B 100%)',
      color: '#14B1AB',
      border: 'rgba(20, 177, 171, 0.45)',
      bg: 'rgba(20, 177, 171, 0.12)'
    },
    {
      id: 'black',
      name: 'Complete Black',
      shortLabel: 'Black',
      emoji: '⬛',
      desc: 'Complete Black · Minimalist & Distraction-Free',
      gradient: 'linear-gradient(135deg, #000000 0%, #080808 50%, #000000 100%)',
      color: '#CBD5E1',
      border: 'rgba(255, 255, 255, 0.25)',
      bg: 'rgba(255, 255, 255, 0.08)'
    }
  ], []);

  const [bgTheme, setBgTheme] = useState('aurora');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const themeDropdownRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vedika_tutor_bg_theme');
      if (saved === 'aurora' || saved === 'glacier' || saved === 'pastel' || saved === 'waves' || saved === 'black' || saved === 'pure-black') {
        setBgTheme(saved === 'pure-black' ? 'black' : saved);
      }
    }
  }, []);

  const selectBgTheme = (themeId) => {
    setBgTheme(themeId);
    setShowThemeDropdown(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vedika_tutor_bg_theme', themeId);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setShowThemeDropdown(false);
      }
    };
    if (showThemeDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showThemeDropdown]);

  const activeThemeConfig = BG_THEMES.find(t => t.id === bgTheme) || BG_THEMES[0];

  // Floating Glassmorphic Left Page Navbar state & shortcut
  const [showLeftNav, setShowLeftNav] = useState(false);
  const [leftNavView, setLeftNavView] = useState('menu'); // 'menu' | 'history'
  const leftNavRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('frappe_user');
        if (stored) setCurrentUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const userInitials = (currentUser?.name || currentUser?.full_name || 'Aarav')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AM';
  const userName = currentUser?.name?.split(' ')[0] || currentUser?.full_name?.split(' ')[0] || 'Aarav';

  // Global Keyboard Shortcut: Ctrl+B or Cmd+B toggles Left Page Navbar, Escape closes it
  useEffect(() => {
    const handleKeyShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setShowLeftNav(prev => {
          if (!prev) setLeftNavView('menu');
          return !prev;
        });
      } else if (e.key === 'Escape' && showLeftNav) {
        setShowLeftNav(false);
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);
    return () => window.removeEventListener('keydown', handleKeyShortcut);
  }, [showLeftNav]);

  // Click outside listener for Left Page Navbar
  useEffect(() => {
    const handleLeftNavOutside = (e) => {
      if (
        leftNavRef.current &&
        !leftNavRef.current.contains(e.target) &&
        !e.target.closest('[data-leftnav-toggle]')
      ) {
        setShowLeftNav(false);
      }
    };
    if (showLeftNav) {
      document.addEventListener('mousedown', handleLeftNavOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleLeftNavOutside);
    };
  }, [showLeftNav]);
  
  const [jwtToken, setJwtToken] = useState(null);
  const [authenticating, setAuthenticating] = useState(true);
  const [sessionDocs, setSessionDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileInputRef = useRef(null);
  const sessionDocsRef = useRef([]);
  
  useEffect(() => {
    sessionDocsRef.current = sessionDocs;
  }, [sessionDocs]);

  const [showAtMenu, setShowAtMenu] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [menuFilter, setMenuFilter] = useState('');
  const [atMenuIndex, setAtMenuIndex] = useState(0);

  const fetchAvailableDocs = useCallback(async () => {
    if (!jwtToken) return;
    const sid = currentSessionId || '';
    try {
      const res = await fetch(`/api/documents/list?sessionId=${sid}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableDocs(data.documents || []);
      }
    } catch (e) {
      console.error("Failed to fetch available docs:", e);
    }
  }, [jwtToken, currentSessionId]);

  useEffect(() => {
    if (jwtToken) {
      fetchAvailableDocs();
    }
  }, [jwtToken, fetchAvailableDocs]);

  const handleTextareaChange = (e) => {
    const val = e.target.value;
    setTopic(val);
    
    if (val.trim()) {
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    } else {
      setIsTyping(false);
    }
    
    const selectionStart = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, selectionStart);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1 && !textBeforeCursor.slice(atIndex).includes(' ')) {
      const query = textBeforeCursor.slice(atIndex + 1);
      setMenuFilter(query);
      setShowAtMenu(true);
      setAtMenuIndex(0);
      if (query === '') {
        fetchAvailableDocs();
      }
    } else {
      setShowAtMenu(false);
    }
  };

  const filteredDocs = useMemo(() => {
    if (!menuFilter) return availableDocs;
    return availableDocs.filter(d => d.name.toLowerCase().includes(menuFilter.toLowerCase()));
  }, [availableDocs, menuFilter]);

  const handleAttachDoc = async (doc) => {
    const sid = currentSessionId || Date.now().toString(36);
    if (!currentSessionId) setCurrentSessionId(sid);
    
    setUploading(true);
    setUploadErr('');
    setShowAtMenu(false);
    
    try {
      const res = await fetch('/api/documents/attach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          file_name: doc.name,
          file_key: doc.file_key,
          sessionId: sid
        })
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to attach document');
      }
      
      const data = await res.json();
      const newDoc = { id: data.documentId, name: doc.name, status: data.status };
      
      setSessionDocs(prev => {
        const updated = [...prev, newDoc];
        setTimeout(() => saveSession(messages, sid), 100);
        return updated;
      });
      
      if (inputRef.current) {
        const val = topic;
        const selectionStart = inputRef.current.selectionStart;
        const textBeforeCursor = val.slice(0, selectionStart);
        const atIndex = textBeforeCursor.lastIndexOf('@');
        if (atIndex !== -1) {
          const newVal = val.slice(0, atIndex) + val.slice(selectionStart);
          setTopic(newVal);
          setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.selectionStart = atIndex;
            inputRef.current.selectionEnd = atIndex;
          }, 50);
        }
      }
    } catch (e) {
      console.error("Attach error:", e);
      setUploadErr(e.message || 'Error attaching document');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const token = await getJwtToken();
        setJwtToken(token);
        console.warn("[GeneralTutor] Successfully retrieved JWT token.");
      } catch (e) {
        console.error("Failed to load JWT token:", e);
      } finally {
        setAuthenticating(false);
      }
    };
    fetchJwt();
  }, []);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const textSessKey = 'general-tutor-sessions';
  const voiceSessKey = 'voice-tutor-sessions';

  const [userId] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const u = parsed.email || parsed.name;
        if (u) return u;
      }
    } catch {}
    let id = localStorage.getItem('lms-user-id');
    if (!id) { id = 'user-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); localStorage.setItem('lms-user-id', id); }
    return id;
  });

  const isMobile = useMediaQuery(isMobileMQ);
  const rPad = isMobile ? 14 : 28;
  const rGap = isMobile ? 8 : 12;
  const msgMaxW = '100%';
  const bubbleMaxW = isMobile ? '100%' : 'min(760px, 86%)';
  const fCol = isMobile ? '1fr' : '1fr 1fr';

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputPinned, setIsInputPinned] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const configDropdownRef = useRef(null);

  const handleChatScroll = useCallback(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 140);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (configDropdownRef.current && !configDropdownRef.current.contains(e.target)) {
        setIsConfigOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function getDateLabel(dateStr) {
    if (!dateStr) return 'Older';
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    if (date >= today) return 'Today';
    if (date >= yesterday) return 'Yesterday';
    if (date >= weekStart) return 'This Week';
    return 'Older';
  }

  // Load sessions from DB and LocalStorage, and restore active session if present
  useEffect(() => {
    let isMounted = true;
    const loadSessions = async () => {
      let localText = [];
      try {
        const raw1 = localStorage.getItem(textSessKey);
        if (raw1) {
          localText = JSON.parse(raw1);
          setTextSessions(localText);
        }
        const raw2 = localStorage.getItem(voiceSessKey);
        if (raw2) setVoiceSessions(JSON.parse(raw2));

        // Prefill query if coming from the dashboard quick-ask box
        const prefill = localStorage.getItem('tutor_prefill_query');
        if (prefill) {
          setTopic(prefill);
          localStorage.removeItem('tutor_prefill_query');
        }
      } catch (e) {
        console.error("Failed to parse local sessions:", e);
      }

      // Restore active session only within the same active tab session via sessionStorage
      try { localStorage.removeItem('current-general-tutor-session-id'); sessionStorage.removeItem('current-general-tutor-session-id'); } catch {}
      const activeSid = typeof window !== 'undefined' ? sessionStorage.getItem('current-general-tutor-session-id') : null;
      if (activeSid && localText.length > 0) {
        const active = localText.find(s => s.id === activeSid);
        if (active && active.messages && active.messages.length > 0) {
          const msgs = (active.messages || []).map(m => ({ ...m, features: m.features || {}, activeFeature: null }));
          setMessages(msgs);
          setMode(active.mode || 'Beginner');
          setLength(active.length || 'Short');
          setCurrentSessionId(active.id);
          setSessionDocs(active.documents || []);
        }
      }

      // Authoritative database sync
      if (userId) {
        setIsLoadingHistory(true);
        try {
          let token = jwtToken || await getJwtToken().catch(() => null);
          if (token && !jwtToken) setJwtToken(token);
          const headers = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const res = await fetch(`/api/tutor/history?userId=${encodeURIComponent(userId)}&type=general`, { headers });
          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.sessions) {
              const dbSessions = data.sessions;
              const combined = [...dbSessions];
              for (const ls of localText) {
                if (!combined.some(ds => ds.id === ls.id)) {
                  combined.push(ls);
                }
              }
              combined.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
              setTextSessions(combined);
              try { localStorage.setItem(textSessKey, JSON.stringify(combined)); } catch {}

              // Only restore if activeSid exists in this session; do not auto-restore previous chat on fresh visit
              const targetSid = activeSid;
              if (targetSid) {
                const target = combined.find(s => s.id === targetSid);
                if (target && target.messages && target.messages.length > 0) {
                  const msgs = (target.messages || []).map(m => ({ ...m, features: m.features || {}, activeFeature: null }));
                  setMessages(msgs);
                  setMode(target.mode || 'Beginner');
                  setLength(target.length || 'Short');
                  setCurrentSessionId(target.id);
                  setSessionDocs(target.documents || []);
                }
              }
            }
          }
        } catch (err) {
          console.error("Failed to load sessions from DB:", err);
        } finally {
          if (isMounted) setIsLoadingHistory(false);
        }
      }
    };

    loadSessions();
    return () => { isMounted = false; };
  }, [userId, textSessKey, voiceSessKey]);

  // Auto-resize the input textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [topic]);

  // Save currentSessionId to sessionStorage (scoped to active tab session only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentSessionId) {
        sessionStorage.setItem('current-general-tutor-session-id', currentSessionId);
      } else {
        sessionStorage.removeItem('current-general-tutor-session-id');
      }
    }
  }, [currentSessionId]);

  // Synchronize state with Sidebar.jsx
  useEffect(() => {
    const event = new CustomEvent('tutor-state-update', {
      detail: {
        currentSessionId,
        textSessions,
        voiceSessions,
        type: 'general-tutor'
      }
    });
    window.dispatchEvent(event);
  }, [currentSessionId, textSessions, voiceSessions]);

  const mergedSessions = useMemo(() => {
    const text = (textSessions || []).map(s => ({ ...s, type: 'text' }));
    const voice = (voiceSessions || []).map(s => ({ ...s, type: 'voice' }));
    const all = [...text, ...voice];
    all.sort((a, b) => {
      const ta = new Date(a.timestamp || a.startedAt || 0).getTime();
      const tb = new Date(b.timestamp || b.startedAt || 0).getTime();
      return tb - ta;
    });
    return all;
  }, [textSessions, voiceSessions]);

  const filteredSessions = useMemo(() => {
    if (!historySearch.trim()) return mergedSessions;
    const q = historySearch.toLowerCase();
    return mergedSessions.filter(s =>
      (s.label && s.label.toLowerCase().includes(q)) ||
      (s.topic && s.topic.toLowerCase().includes(q)) ||
      (s.messages && s.messages.some(m => m.content && m.content.toLowerCase().includes(q)))
    );
  }, [mergedSessions, historySearch]);

  const sessionGroups = useMemo(() => {
    const groups = { 'Today': [], 'Yesterday': [], 'This Week': [], 'Older': [] };
    for (const s of filteredSessions) {
      const label = getDateLabel(s.timestamp || s.startedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(s);
    }
    return groups;
  }, [filteredSessions]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, streamingText]);

  const handleSelectSession = useCallback((session) => {
    if (session.type === 'voice') {
      setVoiceSessionToRestore(session);
      setActiveTab('voice');
      return;
    }
    const msgs = (session.messages || []).map(m => ({
      ...m,
      features: m.features || {},
      activeFeature: null,
    }));
    setMessages(msgs);
    setMode(session.mode || 'Beginner');
    setLength(session.length || 'Short');
    setCurrentSessionId(session.id);
    setSessionDocs(session.documents || []);
    setErr(''); setTopic(''); setUploadErr('');
    setShowLeftNav(false);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setSessionDocs([]);
    setTopic('');
    setErr('');
    setUploadErr('');
    setActiveTab('text');
    setVoiceSessionToRestore(null);
    try { localStorage.removeItem('current-general-tutor-session-id'); } catch {}
    setShowLeftNav(false);
  }, []);

  // Handle click outside to close open feature cards (excluding Visual Summary which only closes on explicit close)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        e.target.closest('[data-feature-container="true"]') ||
        e.target.closest('[data-feature-button="true"]') ||
        e.target.closest('.mermaid-modal-backdrop') ||
        e.target.closest('.mermaid-modal-window') ||
        e.target.closest('.mermaid-container')
      ) {
        return;
      }
      setMessages(prev => {
        if (!prev.some(m => m.activeFeature && m.activeFeature !== 'infographic')) return prev;
        return prev.map(m => (m.activeFeature && m.activeFeature !== 'infographic') ? { ...m, activeFeature: null } : m);
      });
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Listen to events from the sidebar
  useEffect(() => {
    const handleSelect = (e) => {
      handleSelectSession(e.detail);
    };

    const handleNew = () => {
      handleNewChat();
    };

    window.addEventListener('select-general-tutor-session', handleSelect);
    window.addEventListener('new-general-tutor-session', handleNew);

    return () => {
      window.removeEventListener('select-general-tutor-session', handleSelect);
      window.removeEventListener('new-general-tutor-session', handleNew);
    };
  }, [handleSelectSession, handleNewChat]);

  const saveSession = useCallback(async (msgs, overrideSid) => {
    if (!msgs || !msgs.some(m => m.role === 'ai')) return;
    const lastUserMsg = [...msgs].reverse().find(m => m.role === 'user');
    const label = lastUserMsg ? lastUserMsg.content.slice(0, 45) : 'Untitled';
    const sid = overrideSid || currentSessionId || Date.now().toString(36);
    // Sanitize activeFeature so feature drawers like Visual Summary are never persisted open across reloads
    const sanitizedMsgs = msgs.map(m => ({ ...m, activeFeature: null }));
    const session = {
      id: sid,
      label,
      topic: label,
      mode,
      length,
      messages: sanitizedMsgs,
      documents: sessionDocsRef.current || [],
      timestamp: new Date().toISOString(),
      type: 'general'
    };
    const updated = [session, ...textSessions.filter(s => s.id !== sid)];
    setTextSessions(updated);
    setCurrentSessionId(sid);
    try {
      localStorage.setItem(textSessKey, JSON.stringify(updated));
      sessionStorage.setItem('current-general-tutor-session-id', sid);
    } catch {}

    if (userId) {
      try {
        let token = jwtToken || await getJwtToken().catch(() => null);
        if (token && !jwtToken) setJwtToken(token);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch('/api/tutor/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({ userId, session })
        });
      } catch (err) {
        console.error("Failed to sync session to DB:", err);
      }
    }
  }, [mode, length, textSessions, currentSessionId, textSessKey, userId]);

  const handleDeleteSession = useCallback(async (sid, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat session?')) return;

    const updated = textSessions.filter(s => s.id !== sid);
    setTextSessions(updated);
    try { localStorage.setItem(textSessKey, JSON.stringify(updated)); } catch {}

    if (currentSessionId === sid) {
      setMessages([]);
      setCurrentSessionId(null);
      setSessionDocs([]);
      setTopic('');
      try { localStorage.removeItem('current-general-tutor-session-id'); sessionStorage.removeItem('current-general-tutor-session-id'); } catch {}
    }

    if (userId) {
      try {
        let token = jwtToken || await getJwtToken().catch(() => null);
        if (token && !jwtToken) setJwtToken(token);
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch(`/api/tutor/history?id=${encodeURIComponent(sid)}&userId=${encodeURIComponent(userId)}`, {
          method: 'DELETE',
          headers
        });
      } catch (err) {
        console.error("Failed to delete session from DB:", err);
      }
    }
  }, [textSessions, currentSessionId, textSessKey, userId]);

  const FEATURE_SYSTEMS = {
    quiz: QUIZ_SYSTEM, flashcards: FLASHCARD_SYSTEM, infographic: INFOGRAPHIC_SYSTEM,
    simpler: SIMPLER_SYSTEM, examples: EXAMPLES_SYSTEM,
  };

  // Construct a specialized academic feature system prompt that enforces educational constraints
  const getAcademicFeatureSystem = (type) => {
    const baseSystem = FEATURE_SYSTEMS[type] || TUTOR_SYSTEM;
    return `${baseSystem}\n\nCRITICAL ACADEMIC RESTRICTION: You are Vedika, an academic tutor. You must ONLY generate learning materials (quizzes, flashcards, infographics, simplifications, examples) for academic, educational, or curricular concepts (Science, Math, History, Literature, Computer Science, Economics, etc.). If the requested topic is completely non-academic (e.g. celebrity gossip, gaming, pop culture, entertainment), you must return an empty response (or if returning JSON, return an empty array []).`;
  };

  const FEATURE_LABELS = {
    quiz: 'Quiz', flashcards: 'Flashcards', infographic: 'Visual Summary',
    simpler: 'Simplified Explanation', examples: 'Examples',
  };

  const trackStatusStream = useCallback((docId, token) => {
    const sseUrl = `/api/documents/status-stream?documentId=${docId}&token=${encodeURIComponent(token)}`;
    const sse = new EventSource(sseUrl);
    
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const status = data.status;
        
        setSessionDocs(prev => {
          const updated = prev.map(d => d.id === docId ? { ...d, status } : d);
          setTimeout(() => {
            const raw = localStorage.getItem(textSessKey);
            if (raw) {
              const sessions = JSON.parse(raw);
              const sid = currentSessionId || (typeof window !== 'undefined' ? sessionStorage.getItem('current-general-tutor-session-id') : null);
              const sessIdx = sessions.findIndex(s => s.id === sid);
              if (sessIdx !== -1) {
                sessions[sessIdx].documents = updated;
                localStorage.setItem(textSessKey, JSON.stringify(sessions));
                setTextSessions(sessions);
              }
            }
          }, 100);
          return updated;
        });
        
        if (status === 'completed' || status === 'failed') {
          sse.close();
        }
      } catch (e) {
        console.error("[SSE Status] Error parsing status event:", e);
      }
    };
    
    sse.onerror = () => {
      sse.close();
    };
  }, [currentSessionId, textSessKey]);

  useEffect(() => {
    if (jwtToken && sessionDocs.length > 0) {
      sessionDocs.forEach(d => {
        if (d.status === 'pending_ingestion' || d.status === 'processing') {
          trackStatusStream(d.id, jwtToken);
        }
      });
    }
  }, [jwtToken, sessionDocs.length]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadErr('Only PDF files are allowed.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setUploadErr('File size cannot exceed 10MB.');
      return;
    }
    
    setUploading(true);
    setUploadErr('');
    
    const sid = currentSessionId || Date.now().toString(36);
    if (!currentSessionId) setCurrentSessionId(sid);
    
    try {
      let token = jwtToken || await getJwtToken().catch(() => null);
      if (token && !jwtToken) setJwtToken(token);
      
      if (!token) {
        throw new Error("Unable to obtain authenticated token. Please refresh.");
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sid);
      formData.append('courseId', 'general');
      
      const res = await fetch('/api/documents/upload', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token}`
         },
         body: formData
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload document.');
      }
      
      const data = await res.json();
      const newDoc = { id: data.documentId, name: file.name, status: data.status };
      
      setSessionDocs(prev => {
        const updated = [...prev, newDoc];
        setTimeout(() => saveSession(messages, sid), 100);
        return updated;
      });
      
      trackStatusStream(data.documentId, token);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadErr(err.message || 'Error uploading document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = async (docId) => {
    const sid = currentSessionId;
    if (!sid) return;
    
    try {
      let token = jwtToken || await getJwtToken().catch(() => null);
      if (token && !jwtToken) setJwtToken(token);
      
      const res = await fetch('/api/documents/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ documentId: docId, sessionId: sid })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete document.');
      }
      
      setSessionDocs(prev => {
        const updated = prev.filter(d => d.id !== docId);
        setTimeout(() => saveSession(messages, sid), 100);
        return updated;
      });
    } catch (err) {
      console.error("Delete error:", err);
      setUploadErr(err.message || 'Error deleting document.');
    }
  };

  const handleLibraryDelete = async (docId) => {
    try {
      let token = jwtToken || await getJwtToken().catch(() => null);
      if (token && !jwtToken) setJwtToken(token);
      
      const res = await fetch('/api/documents/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ documentId: docId, sessionId: currentSessionId || 'general' })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      
      setAvailableDocs(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      console.error("Library delete error:", err);
      setUploadErr(err.message || 'Error deleting from library');
    }
  };

  const handleSend = async () => {
    const raw = topic.trim();
    if (!raw) return;
    setIsJustSent(true);
    setTimeout(() => setIsJustSent(false), 2200);
    setTopic(''); setErr('');
    setIsTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    const sid = currentSessionId || Date.now().toString(36);
    if (!currentSessionId) setCurrentSessionId(sid);

    const intent = classifyIntent(raw);
    const blobMoods = ['happy', 'curious', 'surprised', 'love', 'sideEye', 'hmm', 'shy', 'wave'];
    const blobMood = blobMoods[Math.floor(Math.random() * blobMoods.length)];
    const userMsg = { id: Date.now().toString(36), role: 'user', content: raw, mode, length, documents: [...sessionDocs], blobMood };
    const msgsWithUser = [...messages, userMsg];
    setSessionDocs([]);

    if (detectPromptInjection(raw)) {
      const aiMsg = { 
        id: (Date.now() + 1).toString(36), 
        role: 'ai', 
        content: "⚠️ **Security Notice**: Your input was flagged as a potential prompt injection attempt or policy violation. To protect our academic learning environment, please enter academic or curriculum-related queries.", 
        local: true, 
        features: {} 
      };
      const next = [...msgsWithUser, aiMsg];
      setMessages(next); saveSession(next, sid);
      return;
    }

    if (intent.type === 'greeting') {
      const aiMsg = { id: (Date.now() + 1).toString(36), role: 'ai', content: getGreetingResponse(), local: true, features: {} };
      const next = [...msgsWithUser, aiMsg];
      setMessages(next); saveSession(next, sid);
      return;
    }

    if (intent.type === 'thanks') {
      const aiMsg = { id: (Date.now() + 1).toString(36), role: 'ai', content: getThanksResponse(), local: true, features: {} };
      const next = [...msgsWithUser, aiMsg];
      setMessages(next); saveSession(next, sid);
      return;
    }

    if (intent.type === 'math') {
      const result = evaluateMath(intent.expression);
      const aiMsg = { id: (Date.now() + 1).toString(36), role: 'ai', content: `**${intent.expression}** = ${result}`, local: true, features: {} };
      const next = [...msgsWithUser, aiMsg];
      setMessages(next); saveSession(next, sid);
      return;
    }

    if (intent.type === 'feature') {
      setMessages(msgsWithUser);
      setLoading(true);
      try {
        const tokens = MAX_TOKENS[length.toLowerCase()] || 2000;
        const prompt = buildFeaturePrompt(intent.feature, intent.topic, mode);
        const system = getAcademicFeatureSystem(intent.feature);
        const text = await geminiCall(system, prompt, tokens, { sessionId: sid, userId });
        if (!text.trim() || text.trim() === '[]') throw new Error('I can only generate learning materials for academic and curriculum-related topics. Please try an academic topic.');
        const features = {};
        if (intent.feature === 'quiz') features.quiz = { questions: parseQuizOutput(text), currentIdx: 0, currentAnswer: null };
        else if (intent.feature === 'flashcards') features.flashcards = { cards: parseFlashcardsOutput(text), currentIdx: 0, flipped: false };
        else if (intent.feature === 'infographic') {
          let parsed = null;
          try {
            parsed = await generateDynamicInfographic({
              response: text || intent.topic,
              question: intent.topic,
              subject: 'General',
            });
          } catch (err) {
            console.warn('[GeneralTutor] Infographic intent generation notice:', err);
          }
          if (!parsed || !parsed.scene) {
            const localResult = generateInfographic(intent.topic || text);
            parsed = {
              points: localResult.points,
              mermaid: localResult.mermaid,
              diagramType: localResult.diagramType || 'flowchart'
            };
          }
          features.infographic = parsed;
        }
        else if (intent.feature === 'simpler') features.simpler = { text };
        else if (intent.feature === 'examples') features.examples = { text };
        const label = FEATURE_LABELS[intent.feature] || 'response';
        const aiMsg = { id: (Date.now() + 1).toString(36), role: 'ai', content: `Here's a ${label} on ${intent.topic}:`, features, activeFeature: intent.feature };
        const next = [...msgsWithUser, aiMsg];
        setMessages(next); saveSession(next, sid);
      } catch (e) {
        setErr(e.message || 'Error generating feature.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setMessages(msgsWithUser);
    setStreamingText(' ');
    setLoading(true);

    try {
      const tokens = MAX_TOKENS[length.toLowerCase()] || 800;
      const prompt = buildChatPrompt(raw, mode, length);
      let token = jwtToken || await getJwtToken().catch(() => null);
      if (token && !jwtToken) setJwtToken(token);
      const targetEndpoint = token ? '/api/tutor/chat/stream' : '/api/gemini/stream';
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(targetEndpoint, {
        method: 'POST',
        headers,
        // When authenticated via JWT, omit userId from body — server extracts user identity from the token.
        // Sending a mismatched localStorage userId causes a 403 Forbidden response.
        body: JSON.stringify({ system: TUTOR_SYSTEM, user: prompt, maxOutputTokens: tokens, sessionId: sid, ...(token ? {} : { userId }), courseId: 'general' }),
      });
      let fullText = '';
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          if (streamElRef.current) {
            streamElRef.current.textContent = fullText;
          }
        }
      }
      
      // Resilient fallback to reliable non-streaming endpoint if stream returned empty
      if (!fullText.trim()) {
        try {
          const fallbackText = await geminiCall(TUTOR_SYSTEM, prompt, tokens, { sessionId: sid, userId });
          if (fallbackText && fallbackText.trim()) {
            fullText = fallbackText;
          }
        } catch (callErr) {
          console.warn('[GeneralTutor] Direct gemini fallback notice:', callErr?.message);
        }
      }
      
      if (!fullText.trim()) {
        throw new Error('AI response generation timed out. Please try asking again.');
      }
      const aiMsg = { id: (Date.now() + 1).toString(36), role: 'ai', content: fullText, features: {} };
      const next = [...msgsWithUser, aiMsg];
      setMessages(next);
      setStreamingText('');
      saveSession(next, sid);
    } catch (e) {
      setErr(e.message || 'Error generating response.');
      setStreamingText('');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFeature = async (msgIdx, type) => {
    if (generating.msgIdx === msgIdx && generating.type === type) return;
    const msg = messages[msgIdx];
    if (!msg || msg.role !== 'ai') return;

    setGenerating({ msgIdx, type });
    try {
      if (type === 'infographic') {
        let parsed = null;
        try {
          const lastUserMsg = [...messages.slice(0, msgIdx)].reverse().find(m => m.role === 'user');
          parsed = await generateDynamicInfographic({
            response: msg.content,
            question: lastUserMsg?.content || '',
            subject: 'General',
          });
        } catch (callErr) {
          console.warn('[GeneralTutor] Dynamic infographic call notice:', callErr?.message);
        }

        // Graceful fallback to dynamic local infographic engine using actual content
        if (!parsed || !parsed.scene) {
          const localResult = generateInfographic(msg.content);
          parsed = {
            points: localResult.points,
            mermaid: localResult.mermaid,
            diagramType: localResult.diagramType || 'flowchart'
          };
        }

        setMessages(prev => {
          const next = prev.map((m, i) => {
            if (i !== msgIdx) return m;
            return {
              ...m,
              features: { ...m.features, infographic: parsed },
              activeFeature: 'infographic'
            };
          });
          setTimeout(() => saveSession(next, currentSessionId), 50);
          return next;
        });
        return;
      }

      const system = getAcademicFeatureSystem(type);
      const prompt = buildFeaturePrompt(type, msg.content, mode);
      const tokens = type === 'simpler' || type === 'examples' ? 1000 : 1500;
      const text = await geminiCall(system, prompt, tokens, { sessionId: currentSessionId, userId });
      if (!text.trim() || text.trim() === '[]') throw new Error(`Could not generate academic feature for this topic.`);

      setMessages(prev => {
        const next = prev.map((m, i) => {
          if (i !== msgIdx) return m;
          const f = { ...m.features };
          if (type === 'quiz') f.quiz = { questions: parseQuizOutput(text), currentIdx: 0, currentAnswer: null };
          else if (type === 'flashcards') f.flashcards = { cards: parseFlashcardsOutput(text), currentIdx: 0, flipped: false };
          else if (type === 'simpler') f.simpler = { text };
          else if (type === 'examples') f.examples = { text };
          return { ...m, features: f, activeFeature: type };
        });
        setTimeout(() => saveSession(next, currentSessionId), 50);
        return next;
      });
    } catch (e) {
      setErr(`Failed to generate ${type}: ${e.message}`);
    } finally {
      setGenerating({ msgIdx: null, type: null });
    }
  };

  const handleFeatureClick = (msgIdx, type) => {
    const msg = messages[msgIdx];
    if (!msg) return;
    if (featureExists(msg, type)) {
      setMessages(prev => prev.map((m, i) => {
        if (i !== msgIdx) return m;
        return { ...m, activeFeature: m.activeFeature === type ? null : type };
      }));
    } else {
      handleGenerateFeature(msgIdx, type);
    }
  };

  const handleQuizAnswer = (msgIdx, answerIdx) => {
    setMessages(prev => prev.map((m, i) => {
      if (i !== msgIdx || !m.features.quiz) return m;
      if (m.features.quiz.currentAnswer !== null) return m;
      return { ...m, features: { ...m.features, quiz: { ...m.features.quiz, currentAnswer: answerIdx } } };
    }));
  };

  const handleQuizNav = (msgIdx, dir) => {
    setMessages(prev => prev.map((m, i) => {
      if (i !== msgIdx || !m.features.quiz) return m;
      const q = m.features.quiz;
      const max = q.questions.length - 1;
      const next = dir === 'next' ? Math.min(q.currentIdx + 1, max) : Math.max(q.currentIdx - 1, 0);
      return { ...m, features: { ...m.features, quiz: { ...q, currentIdx: next, currentAnswer: null } } };
    }));
  };

  const handleFlashcardFlip = (msgIdx) => {
    setMessages(prev => prev.map((m, i) => {
      if (i !== msgIdx || !m.features.flashcards) return m;
      return { ...m, features: { ...m.features, flashcards: { ...m.features.flashcards, flipped: !m.features.flashcards.flipped } } };
    }));
  };

  const handleFlashcardNav = (msgIdx, dir) => {
    setMessages(prev => prev.map((m, i) => {
      if (i !== msgIdx || !m.features.flashcards) return m;
      const fc = m.features.flashcards;
      const len = fc.cards.length;
      const next = dir === 'next' ? (fc.currentIdx + 1) % len : (fc.currentIdx - 1 + len) % len;
      return { ...m, features: { ...m.features, flashcards: { ...fc, currentIdx: next, flipped: false } } };
    }));
  };

  const isGeneratingFeature = (mi, type) => generating.msgIdx === mi && generating.type === type;

  const featureExists = (msg, type) => {
    if (type === 'quiz') return !!msg.features?.quiz;
    if (type === 'flashcards') return !!msg.features?.flashcards;
    if (type === 'infographic') return !!msg.features?.infographic;
    if (type === 'simpler') return !!msg.features?.simpler;
    if (type === 'examples') return !!msg.features?.examples;
    return false;
  };

  const tutorNavItems = [
    { href: '/',              Icon: Home,      label: 'Dashboard'     },
    { href: '/courses',       Icon: BookOpen,  label: 'Courses'       },
    { href: '/coding-tutor',  Icon: Code2,     label: 'Code with AI Tutor'  },
    { href: '/progress',      Icon: BarChart3, label: 'Progress'      },
  ];

  const tutorExtras = (close) => {
    const items = [];

    // Mode select
    items.push(
      <div key="mode-select">
        <label style={featureStyleFunctions.s0({T})}>LEARNING MODE</label>
        <select value={mode} onChange={e => setMode(e.target.value)}
          style={featureStyleFunctions.s1({T,modeColors,mode})}>
          {MODES.map(m => <option key={m} value={m} style={featureStyleFunctions.s2({T})}>{m}</option>)}
        </select>
      </div>
    );

    // Length select
    items.push(
      <div key="len-select">
        <label style={featureStyleFunctions.s3({T})}>RESPONSE DEPTH</label>
        <select value={length} onChange={e => setLength(e.target.value)}
          style={featureStyleFunctions.s4({T,length})}>
          {LENGTHS.map(l => <option key={l} value={l} style={featureStyleFunctions.s5({T})}>{l}</option>)}
        </select>
      </div>
    );

    // Session history (mobile only)
    if (isMobile && mergedSessions?.length > 0) {
      const groups = {};
      const ordered = ['Today', 'Yesterday', 'This Week', 'Older'];
      for (const s of mergedSessions) {
        const label = getDateLabel(s.timestamp || s.startedAt);
        if (!groups[label]) groups[label] = [];
        groups[label].push(s);
      }
      for (const key of Object.keys(groups)) {
        groups[key].sort((a, b) => {
          return new Date(b.timestamp || b.startedAt).getTime() - new Date(a.timestamp || a.startedAt).getTime();
        });
      }

      items.push(
        <div key="sessions">
          <div style={featureStyleFunctions.s6({T})}>SESSION HISTORY</div>
          {ordered.map(group => {
            const sList = groups[group];
            if (!sList) return null;
            return (
              <div key={group} style={inlineStyles.s0}>
                <div style={featureStyleFunctions.s7({T})}>{group}</div>
                {sList.map(session => {
                  const isActive = session.id === currentSessionId;
                  const isVoice = session.type === 'voice';
                  return (
                    <button key={session.type + '-' + session.id}
                      onClick={() => {
                        if (isVoice) {
                          setVoiceSessionToRestore(session);
                          setActiveTab('voice');
                        } else {
                          setActiveTab('text');
                          handleSelectSession(session);
                        }
                        if (close) close();
                      }}
                      style={featureStyleFunctions.s8({isActive,T})}>
                      <span style={featureStyleFunctions.s9({isVoice,T})}>
                        {isVoice ? <Zap size={11} color={T.accent} /> : <Brain size={11} color={T.purple} />}
                      </span>
                      <span style={featureStyleFunctions.s10({isActive})}>
                        {session.label || 'Untitled'}
                      </span>
                      <span style={featureStyleFunctions.s11({T})}>{isVoice ? 'Voice' : 'Text'}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    return items;
  };

  const handleKeyDown = (e) => {
    if (showAtMenu && filteredDocs.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAtMenuIndex(prev => (prev + 1) % filteredDocs.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAtMenuIndex(prev => (prev - 1 + filteredDocs.length) % filteredDocs.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAttachDoc(filteredDocs[atMenuIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAtMenu(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsTyping(false);
      handleSend();
      return;
    }

    if (!['Control', 'Alt', 'Shift', 'Meta', 'Escape', 'Tab', 'CapsLock'].includes(e.key)) {
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2500);
    }
  };

  if (authenticating) {
    return (
      <div style={featureStyleFunctions.s12({T})}>
        
        <Loader2 className="custom-spin" size={48} color={T.purple} />
        <p style={featureStyleFunctions.s13({T})}>Authenticating session...</p>
      </div>
    );
  }

  return (
    <>
      <MobileNav title="Ask your AI Tutor" accent={T.purple} items={[]} dropdownItems={NAV} extras={tutorExtras} />
      <div style={featureStyleFunctions.s14({bgTheme,T})}>
      <div style={inlineStyles.s1}>
        {/* Floating Glassmorphic Left Page Navbar (matching reference image) */}
        {showLeftNav && (
          <aside
            ref={leftNavRef}
            data-left-sidebar="true"
            style={featureStyleFunctions.s15({isMobile,leftNavView})}
          >
            {leftNavView === 'menu' ? (
              <>
                {/* Top: Close Button + Action List */}
                <div>
                  <div style={inlineStyles.s2}>
                    <button
                      onClick={() => setShowLeftNav(false)}
                      title="Close Menu (Esc / Ctrl+B)"
                      style={inlineStyles.s3}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Navigation items list matching the screenshot */}
                  <div style={inlineStyles.s4}>
                    {/* New Chat */}
                    <button
                      onClick={() => { handleNewChat(); setShowLeftNav(false); }}
                      style={inlineStyles.s5}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                    >
                      <Plus size={16} color="#C084FC" />
                      <span>New Chat</span>
                    </button>

                    {/* History */}
                    <button
                      onClick={() => setLeftNavView('history')}
                      style={inlineStyles.s6}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                    >
                      <History size={16} color="#38BDF8" />
                      <span style={inlineStyles.s7}>History</span>
                      {mergedSessions && mergedSessions.length > 0 && (
                        <span style={inlineStyles.s8}>
                          {mergedSessions.length}
                        </span>
                      )}
                    </button>

                    {/* Vedika AI (Active highlighted pill matching the screenshot) */}
                    <div
                      style={inlineStyles.s9}
                    >
                      <Brain size={16} color="#E9D5FF" />
                      <span>Vedika AI</span>
                    </div>

                    {/* Divider */}
                    <div style={inlineStyles.s10} />

                    {/* Text */}
                    <button
                      onClick={() => { setActiveTab('text'); setShowLeftNav(false); }}
                      style={featureStyleFunctions.s16({activeTab})}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                      onMouseLeave={e => { if (activeTab !== 'text') { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; } }}
                    >
                      <Type size={16} />
                      <span>Text</span>
                    </button>

                    {/* Voice */}
                    <button
                      onClick={() => { setActiveTab('voice'); setShowLeftNav(false); }}
                      style={featureStyleFunctions.s17({activeTab})}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)'; }}
                      onMouseLeave={e => { if (activeTab !== 'voice') { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; } }}
                    >
                      <Waves size={16} />
                      <span>Voice</span>
                    </button>

                    {/* Theme Selector Section */}
                    <div style={inlineStyles.s11}>
                      <div style={inlineStyles.s12}>
                        Background Theme
                      </div>
                      <div style={inlineStyles.s13}>
                        {BG_THEMES.map(th => {
                          const isCur = bgTheme === th.id;
                          return (
                            <button
                              key={th.id}
                              onClick={() => selectBgTheme(th.id)}
                              style={featureStyleFunctions.s18({isCur,th})}
                              onMouseEnter={e => {
                                if (!isCur) {
                                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                                  e.currentTarget.style.color = '#FFFFFF';
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isCur) {
                                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                  e.currentTarget.style.color = '#94A3B8';
                                }
                              }}
                            >
                              <span style={inlineStyles.s14}>{th.emoji}</span>
                              <span style={inlineStyles.s15}>{th.shortLabel}</span>
                              {isCur && <span style={featureStyleFunctions.s19({th})} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* History Subview inside the Floating Glassmorphic Sidebar */
              <div style={inlineStyles.s16}>
                {/* Header: Back to Menu + History Title with Badge + New Chat + Close */}
                <div style={inlineStyles.s17}>
                  <div style={inlineStyles.s18}>
                    <button
                      onClick={() => setLeftNavView('menu')}
                      style={inlineStyles.s19}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                      title="Back to Menu"
                    >
                      <ChevronLeft size={15} />
                      <span>Menu</span>
                    </button>

                    <span style={inlineStyles.s20}>
                      <span>History</span>
                      {mergedSessions?.length > 0 && (
                        <span style={inlineStyles.s21}>
                          {mergedSessions.length}
                        </span>
                      )}
                    </span>
                  </div>

                  <div style={inlineStyles.s22}>
                    <button
                      onClick={() => { handleNewChat(); setShowLeftNav(false); }}
                      style={inlineStyles.s23}
                      title="Start New Chat"
                    >
                      <Plus size={13} color="#C084FC" />
                      <span>New</span>
                    </button>

                    <button
                      onClick={() => setShowLeftNav(false)}
                      style={inlineStyles.s24}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                      title="Close"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div style={inlineStyles.s25}>
                  <Search size={13} color="#64748B" style={inlineStyles.s26} />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    placeholder="Search conversations..."
                    style={inlineStyles.s27}
                  />
                  {historySearch && (
                    <button
                      onClick={() => setHistorySearch('')}
                      style={inlineStyles.s28}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Sessions Scroll List */}
                <div style={inlineStyles.s29}>
                  {isLoadingHistory && (
                    <div style={inlineStyles.s30}>
                      <Loader2 size={13} className="custom-spin" color="#38BDF8" />
                      <span>Syncing history...</span>
                    </div>
                  )}

                  {['Today', 'Yesterday', 'This Week', 'Older'].map(groupKey => {
                    const list = sessionGroups[groupKey] || [];
                    if (list.length === 0) return null;
                    return (
                      <div key={groupKey} style={inlineStyles.s31}>
                        <div style={inlineStyles.s32}>
                          {groupKey}
                        </div>
                        {list.map(session => {
                          const isActive = session.id === currentSessionId;
                          const isVoice = session.type === 'voice';
                          const title = session.label || session.topic || (isVoice ? 'Voice Session' : 'Untitled Conversation');
                          const msgCount = session.messages?.length || 0;
                          const timeStr = session.timestamp ? new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                          return (
                            <div
                              key={session.id}
                              onClick={() => { handleSelectSession(session); setShowLeftNav(false); }}
                              style={featureStyleFunctions.s20({isActive})}
                              onMouseEnter={e => {
                                if (!isActive) {
                                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isActive) {
                                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                                }
                              }}
                            >
                              <div style={inlineStyles.s33}>
                                <span style={featureStyleFunctions.s21({isActive})}>
                                  {isVoice ? '🎙️ ' : ''}{title}
                                </span>
                                <button
                                  onClick={(e) => handleDeleteSession(session.id, e)}
                                  title="Delete session"
                                  style={inlineStyles.s34}
                                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#F87171'; }}
                                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = '#64748B'; }}
                                >
                                  <Trash size={12} />
                                </button>
                              </div>
                              <div style={inlineStyles.s35}>
                                <div style={inlineStyles.s36}>
                                  {session.mode && (
                                    <span style={featureStyleFunctions.s22({modeColors,session,T})}>
                                      {session.mode}
                                    </span>
                                  )}
                                  {msgCount > 0 && <span>{msgCount} msgs</span>}
                                </div>
                                {timeStr && <span style={inlineStyles.s37}>{timeStr}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {filteredSessions.length === 0 && !isLoadingHistory && (
                    <div style={inlineStyles.s38}>
                      <History size={24} style={inlineStyles.s39} />
                      <div>No conversations found.</div>
                      <button
                        onClick={() => { handleNewChat(); setShowLeftNav(false); }}
                        style={inlineStyles.s40}
                      >
                        + Start New Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        )}

        {activeTab === 'voice' ? (
          <VoiceAgentView
            inline={true}
            onClose={() => { setActiveTab('text'); setVoiceSessionToRestore(null); }}
            initialSession={voiceSessionToRestore}
            sessionId={currentSessionId}
            userId={userId}
            onSessionComplete={(voiceMsgs) => {
              if (voiceMsgs?.length > 0) {
                const mapped = voiceMsgs.map(m => ({
                  role: m.sender === 'student' ? 'user' : 'ai',
                  content: m.text
                }));
                setMessages(prev => {
                  const updated = [...prev, ...mapped];
                  setTimeout(() => saveSession(updated, currentSessionId), 100);
                  return updated;
                });
              }
            }}
          />
        ) : (
          <>
            {/* ── CHAT & WATERMARK CONTAINER ── */}
            <div style={featureStyleFunctions.s23({bgTheme})}>
              
              {/* FeralUI SVG flow gradient background */}
              <GlacierBackground variant={bgTheme} opacity={1.0} />

              {/* ── CHAT AREA (z-index: 1 sits cleanly over watermark) ── */}
              <div ref={chatRef} onScroll={handleChatScroll} style={featureStyleFunctions.s24({isMobile})}>

                {/* Top Bar: Back Button + Centered Date Capsule */}
                <div style={inlineStyles.s41}>
                  <button
                    type="button"
                    onClick={() => router.push('/vedika-ai')}
                    style={inlineStyles.s42}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#A855F7'; e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)'; e.currentTarget.style.color = '#E2E8F0'; }}
                    title="Back to Assistant Hub"
                  >
                    <ChevronLeft size={14} color="#C084FC" />
                    <span>Back</span>
                  </button>
                  <div style={inlineStyles.s43}>
                    Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={inlineStyles.s44} />
                </div>

                {/* Welcome AI message */}
                <div style={featureStyleFunctions.s25({rGap,msgMaxW})}>
                  <div style={featureStyleFunctions.s26({isMobile,T})}>
                    <Brain size={isMobile ? 15 : 18} color={T.purple} />
                  </div>
                  <div style={inlineStyles.s45}>
                    <div style={featureStyleFunctions.s27({T})}>
                      <span>VEDIKA AI</span>
                      <span style={inlineStyles.s46} />
                    </div>
                    <div style={featureStyleFunctions.s28({isMobile})}>
                      <div style={inlineStyles.s47}>Hello! I'm Vedika, your AI learning assistant.</div>
                      <div style={inlineStyles.s48}>Tell me what you'd like to learn and I'll create a personalised explanation.</div>
                      <div style={inlineStyles.s49}>You can also generate quizzes, flashcards, and infographics on demand.</div>
                    </div>
                  </div>
                </div>

          {/* Conversation messages */}
          {messages.map((msg, mi) => (
            <div key={msg.id || mi} id={`msg-${mi}`} style={inlineStyles.s50}>
              {/* ── User message ── */}
              {msg.role === 'user' && (
                <div style={inlineStyles.s51}>
                  <div style={featureStyleFunctions.s29({isMobile,bubbleMaxW})}>
                    {/* Top Header: Violet YOU label beside Blob mascot */}
                    <div style={inlineStyles.s52}>
                      <UserBlobAvatar
                        isTyping={false}
                        isAiLoading={false}
                        size={isMobile ? 36 : 42}
                        themeColor="amber"
                        mood={msg.blobMood || ['happy', 'curious', 'surprised', 'love', 'sideEye', 'hmm', 'shy', 'wave'][mi % 8]}
                      />
                    </div>

                    {/* User Text Bubble starting directly below (Subtle Instagram theme gradient) */}
                    <div style={featureStyleFunctions.s30({isMobile})}>
                      {msg.content}
                      {msg.documents && msg.documents.length > 0 && (
                        <div style={inlineStyles.s53}>
                          {msg.documents.map(doc => (
                            <div key={doc.id} style={inlineStyles.s54}>
                              <span>📄</span>
                              <span style={inlineStyles.s55}>{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.mode && (
                      <div style={inlineStyles.s56}>
                        {msg.mode} &middot; {msg.length}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── AI message ── */}
              {msg.role === 'ai' && (
                <div style={featureStyleFunctions.s31({msgMaxW})}>
                  {/* Top Header: Brain icon + VEDIKA */}
                  <div style={inlineStyles.s57}>
                    <div style={inlineStyles.s58}>
                      <Brain size={14} color="#2DD4BF" />
                    </div>
                    <div style={inlineStyles.s59}>
                      <span>VEDIKA</span>
                      <span style={inlineStyles.s60} />
                    </div>
                  </div>

                  <div style={inlineStyles.s61}>
                    {/* Glassmorphic AI Response Message Box (Subtle Ocean-Emerald Jewel Gradient) */}
                    <div style={featureStyleFunctions.s32({bubbleMaxW,isMobile})}>
                      <div className="md-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanMarkdown(msg.content)}</ReactMarkdown>
                      </div>
                    </div>

                    {/* HTML Tab Suggestions Container */}
                    {msg.activeFeature && (
                      <div data-feature-container="true" style={featureStyleFunctions.s33({T})}>
                        {/* Tab Content Panel */}
                        <div style={inlineStyles.s62}>
                          {/* Rendering the active tab's view */}
                          {msg.activeFeature === 'quiz' && (
                            msg.features?.quiz?.questions?.length > 0 ? (
                              <>
                                <div style={inlineStyles.s63}>
                                  <span style={featureStyleFunctions.s34({T})}>Question {msg.features.quiz.currentIdx + 1} of {msg.features.quiz.questions.length}</span>
                                  <button onClick={() => handleGenerateFeature(mi, 'quiz')}
                                    style={featureStyleFunctions.s35({T})}>
                                    Regenerate
                                  </button>
                                </div>
                                <div style={featureStyleFunctions.s36({T})}>{msg.features.quiz.questions[msg.features.quiz.currentIdx]?.question}</div>
                                <div style={inlineStyles.s64}>
                                  {msg.features.quiz.questions[msg.features.quiz.currentIdx]?.options.map((opt, oi) => {
                                    const answered = msg.features.quiz.currentAnswer !== null;
                                    const selected = msg.features.quiz.currentAnswer === oi;
                                    const correct = oi === msg.features.quiz.questions[msg.features.quiz.currentIdx].correct;
                                    let bg = T.s3, bd = T.border, cl = T.muted;
                                    if (answered && correct) { bg = `${T.green}18`; bd = `${T.green}50`; cl = T.green; }
                                    else if (answered && selected) { bg = `${T.red}18`; bd = `${T.red}50`; cl = T.red; }
                                    else if (selected) { bg = `${T.accent}18`; bd = `${T.accent}50`; cl = T.accent; }
                                    return (
                                      <button key={oi} onClick={() => handleQuizAnswer(mi, oi)} disabled={answered}
                                        style={featureStyleFunctions.s37({bg,bd,cl,answered})}>
                                        <span style={inlineStyles.s65}>{'ABCD'[oi]})</span>{opt}
                                      </button>
                                    );
                                  })}
                                </div>
                                {msg.features.quiz.currentAnswer !== null && (
                                  <div style={inlineStyles.s66}>
                                    <span style={featureStyleFunctions.s38({msg,T})}>
                                      {msg.features.quiz.currentAnswer === msg.features.quiz.questions[msg.features.quiz.currentIdx].correct ? '\u2713 Correct!' : `\u2717 Incorrect \u2014 correct: ${'ABCD'[msg.features.quiz.questions[msg.features.quiz.currentIdx].correct]}`}
                                    </span>
                                    <div style={inlineStyles.s67}>
                                      {msg.features.quiz.currentIdx > 0 && (
                                        <button onClick={() => handleQuizNav(mi, 'prev')}
                                          style={featureStyleFunctions.s39({T})}>
                                          &larr; Prev
                                        </button>
                                      )}
                                      {msg.features.quiz.currentIdx < msg.features.quiz.questions.length - 1 && (
                                        <button onClick={() => handleQuizNav(mi, 'next')}
                                          style={featureStyleFunctions.s40({T})}>
                                          Next <ChevronRight size={12} />
                                        </button>
                                      )}
                                      {msg.features.quiz.currentIdx === msg.features.quiz.questions.length - 1 && (
                                        <span style={featureStyleFunctions.s41({T})}>Quiz complete!</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={featureStyleFunctions.s42({T})}>
                                <Loader2 size={18} style={inlineStyles.s68} />
                                Loading Quiz Questions...
                              </div>
                            )
                          )}

                          {msg.activeFeature === 'flashcards' && (
                            msg.features?.flashcards?.cards?.length > 0 ? (
                              <>
                                <div style={inlineStyles.s69}>
                                  <span style={featureStyleFunctions.s43({T})}>Card {msg.features.flashcards.currentIdx + 1} of {msg.features.flashcards.cards.length}</span>
                                  <button onClick={() => handleGenerateFeature(mi, 'flashcards')}
                                    style={featureStyleFunctions.s44({T})}>
                                    Regenerate
                                  </button>
                                </div>
                                <div onClick={() => handleFlashcardFlip(mi)} style={inlineStyles.s70}>
                                  <div style={featureStyleFunctions.s45({msg,T})}>
                                    <div style={featureStyleFunctions.s46({T})}>
                                      {msg.features.flashcards.flipped ? 'Answer' : 'Question \u2014 tap to reveal'}
                                    </div>
                                    <div style={featureStyleFunctions.s47({T,msg})}>
                                      {msg.features.flashcards.flipped ? msg.features.flashcards.cards[msg.features.flashcards.currentIdx]?.back : msg.features.flashcards.cards[msg.features.flashcards.currentIdx]?.front}
                                    </div>
                                    {!msg.features.flashcards.flipped && <div style={featureStyleFunctions.s48({T})}>tap to flip</div>}
                                  </div>
                                </div>
                                <div style={inlineStyles.s71}>
                                  <button onClick={() => handleFlashcardNav(mi, 'prev')}
                                    style={featureStyleFunctions.s49({T})}>
                                    &larr; Prev
                                  </button>
                                  <button onClick={() => handleFlashcardNav(mi, 'next')}
                                    style={featureStyleFunctions.s50({T})}>
                                    Next &rarr;
                                  </button>
                                </div>
                                <div style={inlineStyles.s72}>
                                  {msg.features.flashcards.cards.map((_, i) => (
                                    <div key={i} style={featureStyleFunctions.s51({msg,i,T})} />
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div style={featureStyleFunctions.s52({T})}>
                                <Loader2 size={18} style={inlineStyles.s73} />
                                Loading Flashcards...
                              </div>
                            )
                          )}

                          {(msg.activeFeature === 'infographic' || isGeneratingFeature(mi, 'infographic')) && (
                            msg.features?.infographic?.scene ? (
                              <div style={inlineStyles.s74}>
                                <InfographicCanvas
                                  scene={msg.features.infographic.scene}
                                  points={msg.features.infographic.points || []}
                                  topicTitle={msg.features.infographic.topic || msg.features.infographic.scene?.title || 'Visual Summary'}
                                  initialExpanded={true}
                                  onRegenerate={() => handleGenerateFeature(mi, 'infographic')}
                                  onClose={() => {
                                    setMessages(prev => prev.map((m, i) => i === mi ? { ...m, activeFeature: null } : m));
                                  }}
                                />
                              </div>
                            ) : isGeneratingFeature(mi, 'infographic') ? (
                              <div style={inlineStyles.s75}>
                                <InfographicCanvas
                                  scene={null}
                                  isLoading={true}
                                  topicTitle="Visual Summary"
                                  initialExpanded={true}
                                  onClose={() => {
                                    setGenerating({ msgIdx: null, type: null });
                                  }}
                                />
                              </div>
                            ) : (msg.features?.infographic?.points?.length > 0 || msg.features?.infographic?.mermaid) ? (
                              <div style={inlineStyles.s76}>
                                <MermaidDiagram
                                  chart={msg.features.infographic.mermaid}
                                  points={msg.features.infographic.points}
                                  chatHistory={messages}
                                  diagramType={msg.features.infographic.diagramType || 'flowchart'}
                                  onRegenerate={() => handleGenerateFeature(mi, 'infographic')}
                                  onClose={() => {
                                    setMessages(prev => prev.map((m, i) => i === mi ? { ...m, activeFeature: null } : m));
                                  }}
                                />
                              </div>
                            ) : null
                          )}

                          {msg.activeFeature === 'simpler' && (
                            msg.features?.simpler?.text ? (
                              <div style={featureStyleFunctions.s53({T})}>
                                <div style={inlineStyles.s77}>
                                  <span style={featureStyleFunctions.s54({T})}>SIMPLIFIED</span>
                                  <button onClick={() => handleGenerateFeature(mi, 'simpler')}
                                    style={featureStyleFunctions.s55({T})}>
                                    Regenerate
                                  </button>
                                </div>
                                <div style={featureStyleFunctions.s56({T})}>
                                  <div className="md-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanMarkdown(msg.features.simpler.text)}</ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div style={featureStyleFunctions.s57({T})}>
                                <Loader2 size={18} style={inlineStyles.s78} />
                                Generating Simplified Explanation...
                              </div>
                            )
                          )}

                          {msg.activeFeature === 'examples' && (
                            msg.features?.examples?.text ? (
                              <div style={featureStyleFunctions.s58({T})}>
                                <div style={inlineStyles.s79}>
                                  <span style={featureStyleFunctions.s59({T})}>EXAMPLES</span>
                                  <button onClick={() => handleGenerateFeature(mi, 'examples')}
                                    style={featureStyleFunctions.s60({T})}>
                                    Regenerate
                                  </button>
                                </div>
                                <div style={featureStyleFunctions.s61({T})}>
                                  <div className="md-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanMarkdown(msg.features.examples.text)}</ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div style={featureStyleFunctions.s62({T})}>
                                <Loader2 size={18} style={inlineStyles.s80} />
                                Generating Examples...
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Suggestion chips (All 5 options visible on mobile and desktop) ── */}
                    {!msg.local && (
                      <div style={inlineStyles.s81}>
                        {SUGGESTIONS.map(s => {
                          const loading = isGeneratingFeature(mi, s.id);
                          const isActive = msg.activeFeature === s.id;
                          return (
                            <button
                              key={s.id}
                              data-feature-button="true"
                              onClick={() => handleFeatureClick(mi, s.id)}
                              disabled={loading}
                              style={featureStyleFunctions.s63({isActive,s,loading})}
                            >
                              {loading ? <Loader2 size={12} style={inlineStyles.s82} /> : <s.Icon size={12} />}
                              {loading ? 'Generating...' : s.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── STREAMING (Contrasting Ocean-Emerald Jewel Response Gradient) ── */}
          {streamingText && (
            <div style={featureStyleFunctions.s64({msgMaxW})}>
              <div style={inlineStyles.s83}>
                <div style={inlineStyles.s84}>
                  <Brain size={14} color="#2DD4BF" />
                </div>
                <div style={inlineStyles.s85}>
                  <span>VEDIKA</span>
                  <span style={inlineStyles.s86} />
                </div>
              </div>
              <div style={featureStyleFunctions.s65({bubbleMaxW,isMobile})}>
                <div ref={streamElRef} style={inlineStyles.s87} />
                <Loader2 size={12} color="#38BDF8" style={inlineStyles.s88} />
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && !streamingText && (
            <div style={featureStyleFunctions.s66({msgMaxW})}>
              <div style={inlineStyles.s89}>
                <div style={inlineStyles.s90}>
                  <Brain size={14} color="#2DD4BF" />
                </div>
                <div style={inlineStyles.s91}>
                  <span>VEDIKA</span>
                  <span style={inlineStyles.s92} />
                </div>
              </div>
              <div style={inlineStyles.s93}>
                <Loader2 size={16} color="#38BDF8" style={inlineStyles.s94} />
                <span style={inlineStyles.s95}>Generating...</span>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {err && (
            <div style={featureStyleFunctions.s67({T})}>
              {err}
            </div>
          )}
          
          {/* ── UPLOAD ERROR ── */}
          {uploadErr && (
            <div style={featureStyleFunctions.s68({T})}>
              {uploadErr}
            </div>
          )}

          {/* ── SESSION DOCUMENTS ── */}
          {sessionDocs.length > 0 && (
            <div style={featureStyleFunctions.s69({msgMaxW})}>
              {sessionDocs.map(doc => (
                <div key={doc.id} style={featureStyleFunctions.s70({T})}>
                  <span style={featureStyleFunctions.s71({T})}>📄</span>
                  <span style={featureStyleFunctions.s72({T})}>{doc.name}</span>
                  <span style={featureStyleFunctions.s73({doc,T})}>
                    ({doc.status === 'pending_ingestion' ? 'processing' : doc.status})
                  </span>
                  <button onClick={() => handleDeleteDoc(doc.id)} style={featureStyleFunctions.s74({T})}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SCROLL FOR MORE BUTTON MATCHING REFERENCE IMAGE ── */}
        {showScrollDown && (
          <button
            type="button"
            onClick={() => {
              if (chatRef.current) {
                chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
              }
            }}
            style={featureStyleFunctions.s75({isMobile})}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#A855F7';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#CBD5E1';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
            }}
          >
            <ChevronDown size={14} color="#A855F7" />
            <span>Scroll for more</span>
          </button>
        )}

        {/* ── CREATIVE FLOATING DYNAMIC OMNIBAR CONTAINER WITH COMPANION BLOB ── */}
        <div
          style={featureStyleFunctions.s76({isMobile})}
        >
          {/* Omnibar input row with toggle button + omnibar */}
          <div
            style={inlineStyles.s96}
          >
          {/* Full Creative Omnibar - Always active by default */}
          <div
              onMouseEnter={() => setIsInputHovered(true)}
              onMouseLeave={() => setIsInputHovered(false)}
              style={featureStyleFunctions.s77({isInputFocused,isMobile})}
            >
              {/* Attached PDF documents pills (if any) */}
              {sessionDocs && sessionDocs.length > 0 && (
                <div style={inlineStyles.s97}>
                  {sessionDocs.map(doc => (
                    <div key={doc.id} style={inlineStyles.s98}>
                      <span>📄</span>
                      <span style={inlineStyles.s99}>{doc.name}</span>
                      {doc.status && doc.status !== 'completed' && <span style={inlineStyles.s100}>({doc.status})</span>}
                      <button type="button" onClick={() => handleDeleteDoc(doc.id)} style={inlineStyles.s101}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Autocomplete @ menu for PDFs */}
              {showAtMenu && filteredDocs.length > 0 && (
                <div style={inlineStyles.s102}>
                  <div style={inlineStyles.s103}>
                    CHOOSE PDF TO ATTACH (@)
                  </div>
                  {filteredDocs.map((doc, idx) => (
                    <div
                      key={doc.id}
                      onMouseEnter={() => setAtMenuIndex(idx)}
                      style={featureStyleFunctions.s78({idx,atMenuIndex})}
                    >
                      <div onClick={() => handleAttachDoc(doc)} style={inlineStyles.s104}>
                        <span>📄</span>
                        <span style={inlineStyles.s105}>{doc.name}</span>
                        <span style={inlineStyles.s106}>({new Date(doc.creation).toLocaleDateString()})</span>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${doc.name}" from your library?`)) {
                            await handleLibraryDelete(doc.id);
                          }
                        }}
                        style={inlineStyles.s107}
                        title="Delete from library"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" style={inlineStyles.s108} />

              {isMobile ? (
                /* Mobile 2-Row Layout: Full-width textarea on Row 1, Action bar on Row 2 */
                <>
                  {/* Row 1: Full-Width Clean Textarea */}
                  <div style={inlineStyles.s109}>
                    <textarea
                      ref={inputRef}
                      value={topic}
                      onChange={handleTextareaChange}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Ask Vedika anything..."
                      rows={1}
                      onKeyDown={handleKeyDown}
                      style={inlineStyles.s110}
                    />
                  </div>

                  {/* Row 2: Bottom Action Row */}
                  <div style={inlineStyles.s111}>
                    {/* Left quick actions: Menu toggle, PDF & Voice */}
                    <div style={inlineStyles.s112}>
                      <button
                        type="button"
                        data-leftnav-toggle="true"
                        onClick={() => {
                          setShowLeftNav(prev => {
                            if (!prev) setLeftNavView('menu');
                            return !prev;
                          });
                        }}
                        style={featureStyleFunctions.s79({showLeftNav})}
                        title="Toggle Vedika Menu (Ctrl+B)"
                      >
                        <PanelLeft size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={featureStyleFunctions.s80({uploading})}
                        onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = uploading ? '#C084FC' : '#94A3B8'; e.currentTarget.style.background = 'none'; }}
                        title="Upload PDF Document Context"
                      >
                        {uploading ? <Loader2 size={16} className="custom-spin" /> : <Paperclip size={16} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('voice')}
                        style={inlineStyles.s113}
                        onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'none'; }}
                        title="Switch to Voice AI"
                      >
                        <Mic size={16} />
                      </button>
                    </div>

                    {/* Right tools cluster: Config Popover, Send Button */}
                    <div style={inlineStyles.s114}>
                      <div style={inlineStyles.s115} ref={configDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsConfigOpen(prev => !prev)}
                          style={inlineStyles.s116}
                          title="Learning Mode & Depth"
                        >
                          <div style={featureStyleFunctions.s81({modeColors,mode,T})} />
                          <span>{mode} &middot; {length}</span>
                          <ChevronDown size={11} color="#94A3B8" style={featureStyleFunctions.s82({isConfigOpen})} />
                        </button>

                        {isConfigOpen && (
                          <div style={inlineStyles.s117}>
                            <div>
                              <div style={featureStyleFunctions.s83({T})}>
                                Learning Mode
                              </div>
                              <div style={inlineStyles.s118}>
                                {MODES.map(m => {
                                  const isSel = mode === m;
                                  return (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() => setMode(m)}
                                      style={featureStyleFunctions.s84({isSel,modeColors,m,T})}
                                    >
                                      {m}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <div style={featureStyleFunctions.s85({T})}>
                                Explanation Depth
                              </div>
                              <div style={inlineStyles.s119}>
                                {LENGTHS.map(l => {
                                  const isSel = length === l;
                                  return (
                                    <button
                                      key={l}
                                      type="button"
                                      onClick={() => setLength(l)}
                                      style={featureStyleFunctions.s86({isSel,T})}
                                    >
                                      {l}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={loading}
                        style={featureStyleFunctions.s87({loading,T})}
                      >
                        {loading ? <Loader2 size={16} color="#fff" className="custom-spin" /> : <Send size={16} color="#fff" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Desktop & Laptop 1-Row Sleek Layout (Original cff79c0) */
                <div style={inlineStyles.s120}>
                  {/* Left quick actions: Menu toggle, PDF & Voice */}
                  <div style={inlineStyles.s121}>
                    <button
                      type="button"
                      data-leftnav-toggle="true"
                      onClick={() => {
                        setShowLeftNav(prev => {
                          if (!prev) setLeftNavView('menu');
                          return !prev;
                        });
                      }}
                      style={featureStyleFunctions.s88({showLeftNav})}
                      title="Toggle Vedika Menu (Ctrl+B)"
                    >
                      <PanelLeft size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={featureStyleFunctions.s89({uploading})}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = uploading ? '#C084FC' : '#94A3B8'; e.currentTarget.style.background = 'none'; }}
                      title="Upload PDF Document Context"
                    >
                      {uploading ? <Loader2 size={16} className="custom-spin" /> : <Paperclip size={16} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('voice')}
                      style={inlineStyles.s122}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'none'; }}
                      title="Switch to Voice AI"
                    >
                      <Mic size={16} />
                    </button>
                  </div>

                  {/* Center: Textarea (Never squished or overlapping send button) */}
                  <div style={inlineStyles.s123}>
                    <textarea
                      ref={inputRef}
                      value={topic}
                      onChange={handleTextareaChange}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Type a topic, ask for an infographic, or type @ to attach PDF..."
                      rows={1}
                      onKeyDown={handleKeyDown}
                      style={inlineStyles.s124}
                    />
                  </div>

                  {/* Right tools cluster: Config Popover, Pin button, Send Button */}
                  <div style={inlineStyles.s125}>
                    <div style={inlineStyles.s126}>
                      <button
                        type="button"
                        onClick={() => setIsConfigOpen(prev => !prev)}
                        style={inlineStyles.s127}
                        title="Learning Mode & Depth"
                      >
                        <div style={featureStyleFunctions.s90({modeColors,mode,T})} />
                        <span>{mode} &middot; {length}</span>
                        <ChevronDown size={11} color="#94A3B8" style={featureStyleFunctions.s91({isConfigOpen})} />
                      </button>

                      {isConfigOpen && (
                        <div style={inlineStyles.s128}>
                          <div>
                            <div style={featureStyleFunctions.s92({T})}>
                              Learning Mode
                            </div>
                            <div style={inlineStyles.s129}>
                              {MODES.map(m => {
                                const isSel = mode === m;
                                return (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMode(m)}
                                    style={featureStyleFunctions.s93({isSel,modeColors,m,T})}
                                  >
                                    {m}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <div style={featureStyleFunctions.s94({T})}>
                              Explanation Depth
                            </div>
                            <div style={inlineStyles.s130}>
                              {LENGTHS.map(l => {
                                const isSel = length === l;
                                return (
                                  <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLength(l)}
                                    style={featureStyleFunctions.s95({isSel,T})}
                                  >
                                    {l}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pin Omnibar Button */}
                    <button
                      type="button"
                      onClick={() => setIsInputPinned(prev => !prev)}
                      style={featureStyleFunctions.s96({isInputPinned})}
                      title={isInputPinned ? "Unpin omnibar" : "Pin omnibar expanded"}
                    >
                      <Pin size={14} style={featureStyleFunctions.s97({isInputPinned})} />
                    </button>

                    {/* Glowing Send Button (Subtle Instagram Gradient) */}
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={loading}
                      style={featureStyleFunctions.s98({loading,T})}
                    >
                      {loading ? <Loader2 size={16} color="#fff" className="custom-spin" /> : <Send size={16} color="#fff" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
    )}
    </div>

      
    </div>
  </>
  );
}
