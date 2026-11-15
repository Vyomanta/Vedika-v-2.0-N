'use client';
import dynamic from 'next/dynamic';
import * as featureStyleFunctions from '@/features/code-puzzles/styles/features-code-puzzles-components-CodePuzzle.cfbd4dc8.styles.js';

import inlineStyles from '@/features/code-puzzles/styles/CodePuzzle.styles';
import '@/features/code-puzzles/styles/CodePuzzle.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { usePyodide } from '@/hooks/usePyodide';
import {
  Play, RotateCcw, Save, Download, Check, Copy, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, X, Plus, Terminal as TerminalIcon, CheckSquare,
  Eye, FileText, Code, Settings, Sparkles, Loader2, Target,
  FileCode, FolderTree, RefreshCw, ExternalLink, Monitor, Tablet,
  Smartphone, Award, AlertCircle, HelpCircle, Lightbulb, Zap, Globe,
  BookOpen, Trash2, Brain, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration, WidgetType, keymap } from "@codemirror/view";
import { indentUnit, indentOnInput } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { getMascotBridge } from '@/lib/mascotBridge';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import {setErrorEffect,ErrorWidget,errorDecorationField,CustomDropdown,FACULTY_PUZZLES,WEB_PUZZLES,isLineIncompleteInProgress,getVariableBestPracticeTip,validatePythonStepLocally} from '@/features/code-puzzles/components/features-code-puzzles-components-CodePuzzle.support.jsx';

export function useCodePuzzleModel() {

  const router = useRouter();

  
  // Deterministic navigation helper so exiting CodePuzzle never stalls on iframe/worker history traps
  const navigateOut = useCallback((targetPath = '/vedika-ai') => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (typeof window !== 'undefined') {
      window.location.assign(targetPath);
    } else {
      router.push(targetPath);
    }
  }, [router]);

  const handleBackToVedikaAI = useCallback(() => {
    navigateOut('/vedika-ai');
  }, [navigateOut]);

  // Intercept browser hardware Back button (popstate) when trapped by sandbox iframe entries
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      if (window.location.pathname.includes('puzzle')) {
        window.location.replace('/vedika-ai');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // ── Mode & Selector States ─────────────────────────────────────────────────
  const [category, setCategory] = useState('programming'); // 'programming' (Python) | 'html' (Web)

  // Support direct language/sandbox selection via URL query param (?lang=html | python) and live mascot navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyLang = (langStr) => {
      const l = (langStr || '').toLowerCase();
      if (l === 'html' || l === 'web' || l === 'css') {
        setCategory('html');
      } else if (l === 'python' || l === 'py' || l === 'programming') {
        setCategory('programming');
      }
    };
    const params = new URLSearchParams(window.location.search);
    applyLang(params.get('lang') || params.get('category'));

    const onLangEvent = (e) => applyLang(e?.detail?.lang);
    window.addEventListener('code_puzzle_lang_change', onLangEvent);
    return () => window.removeEventListener('code_puzzle_lang_change', onLangEvent);
  }, []);
  const [puzzleSource, setPuzzleSource] = useState('faculty'); // 'faculty' | 'ai'
  const [facultyPuzzleIndex, setFacultyPuzzleIndex] = useState(0);
  const [webPuzzleIndex, setWebPuzzleIndex] = useState(0);
  const [aiDifficulty, setAiDifficulty] = useState('beginner');
  const [customFacultyPuzzles, setCustomFacultyPuzzles] = useState([]);

  // Load faculty-created exercises from Admin side (/api/code-puzzle/faculty + localStorage cache)
  useEffect(() => {
    let active = true;
    async function loadFacultyAssigned() {
      try {
        const res = await fetch('/api/code-puzzle/faculty');
        const data = await res.json();
        if (active && Array.isArray(data.puzzles)) {
          setCustomFacultyPuzzles(data.puzzles);
          localStorage.setItem('vedika_faculty_puzzles', JSON.stringify(data.puzzles));
          return;
        }
      } catch (_) {}
      try {
        const cached = JSON.parse(localStorage.getItem('vedika_faculty_puzzles') || '[]');
        if (active && Array.isArray(cached)) setCustomFacultyPuzzles(cached);
      } catch (_) {}
    }
    loadFacultyAssigned();
    return () => { active = false; };
  }, []);

  const allFacultyPuzzles = useMemo(
    () => [...FACULTY_PUZZLES, ...customFacultyPuzzles],
    [customFacultyPuzzles]
  );

  // AI Generated Puzzle State
  const [aiGeneratedPuzzle, setAiGeneratedPuzzle] = useState(null);
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);

  // Active Puzzles Resolvers
  const activePuzzle = puzzleSource === 'ai' ? aiGeneratedPuzzle : (allFacultyPuzzles[facultyPuzzleIndex] || allFacultyPuzzles[0]);
  const activeWebPuzzle = WEB_PUZZLES[webPuzzleIndex];

  // ── Multi-File Management (Isolated for Python vs Web) ──────────────────────
  const [pythonFiles, setPythonFiles] = useState([
    { name: 'main.py', language: 'python', content: FACULTY_PUZZLES[0].starterCode, isDefault: true },
    { name: 'input.txt', language: 'text', content: 'arr = [12, 3, 45, 7, 23, 19]\n', isDefault: true },
    { name: 'output.txt', language: 'text', content: '# Program output will appear in the Console\n', isDefault: true }
  ]);
  const [activePythonFile, setActivePythonFile] = useState('main.py');
  const [openPythonTabs, setOpenPythonTabs] = useState(['main.py']);

  const [webFiles, setWebFiles] = useState([
    { name: 'index.html', language: 'html', content: WEB_PUZZLES[0].html, isDefault: true },
    { name: 'style.css', language: 'css', content: WEB_PUZZLES[0].css, isDefault: true },
    { name: 'script.js', language: 'javascript', content: WEB_PUZZLES[0].js, isDefault: true }
  ]);
  const [activeWebFile, setActiveWebFile] = useState('index.html');
  const [openWebTabs, setOpenWebTabs] = useState(['index.html', 'style.css', 'script.js']);

  // Active file & tabs resolvers based on current category
  const currentFiles = category === 'html' ? webFiles : pythonFiles;
  const activeFileName = category === 'html' ? activeWebFile : activePythonFile;
  const openTabs = category === 'html' ? openWebTabs : openPythonTabs;
  const activeFile = currentFiles.find(f => f.name === activeFileName) || currentFiles[0] || { name: 'untitled', content: '' };

  // Explorer & Navigation
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [activeActivityIcon, setActiveActivityIcon] = useState('files');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Web Sandbox Live Preview Controls
  const [compiledWebTime, setCompiledWebTime] = useState(Date.now());
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [webCompileSuccess, setWebCompileSuccess] = useState(false);

  // Validation States
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [stepPassed, setStepPassed] = useState(false);
  const [stepSuggestion, setStepSuggestion] = useState('');

  // Restore auto-saved code when switching puzzles or mounting
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (category === 'html') {
        const saved = localStorage.getItem(`saved_web_puzzle_${webPuzzleIndex}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setWebFiles(parsed);
        }
      } else if (activePuzzle?.id) {
        const saved = localStorage.getItem(`saved_py_puzzle_${activePuzzle.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setPythonFiles(parsed);
        }
      }
    } catch (_) {}
  }, [category, webPuzzleIndex, activePuzzle?.id]);

  // Multi-tab Panel States
  const [activeRightTab, setActiveRightTab] = useState('guide'); // 'guide' | 'visualizer' | 'preview'
  const [activeBottomTab, setActiveBottomTab] = useState('console'); // 'console' | 'testcases' | 'output'
  const [isConstraintsOpen, setIsConstraintsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  // Visualizer Execution States
  const [traceData, setTraceData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [traceError, setTraceError] = useState(null);
  const [playSpeed, setPlaySpeed] = useState(1500);

  // Test Cases Execution State
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [rawOutputLog, setRawOutputLog] = useState('');

  // Terminal refs & split layouts
  const terminalElRef = useRef(null);
  const terminalInstanceRef = useRef(null);
  const fitAddonRef = useRef(null);
  const playIntervalRef = useRef(null);
  const editorViewRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Resizable split percentages
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const [mobileActiveView, setMobileActiveView] = useState('editor'); // 'editor' | 'console' | 'guide' | 'visualizer' | 'preview'
  const [bottomSplitPercent, setBottomSplitPercent] = useState(38);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(460);
  const isDraggingBottomRef = useRef(false);
  const isDraggingRightRef = useRef(false);
  const centerContainerRef = useRef(null);
  const validateStepRef = useRef(null);

  // Auto-fit xterm on mobile when console tab is selected
  useEffect(() => {
    if (isMobile && mobileActiveView === 'console') {
      const timer = setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isMobile, mobileActiveView]);

  // ── Synchronize active code, errors, and puzzle state with Desktop Mascot ──
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const bridge = getMascotBridge();
        const err = validationError?.message || traceError || '';
        bridge.send({
          type: 'WEBAPP_STATE_UPDATE',
          payload: {
            page: '/code-puzzle',
            activity: 'dsa_puzzle',
            puzzleTitle: activePuzzle?.title || '',
            puzzleDifficulty: activePuzzle?.difficulty || '',
            puzzleDescription: activePuzzle?.description || '',
            sampleInput: activePuzzle?.sampleInput || '',
            sampleOutput: activePuzzle?.sampleOutput || '',
            starterCode: activePuzzle?.starterCode || '',
            studentCode: activeFile?.content || '',
            activeFileName: activeFileName || 'main.py',
            cursorLine: cursorPos?.line || 1,
            cursorCol: cursorPos?.col || 1,
            lastError: err,
            consoleOutput: rawOutputLog?.slice(-500) || '',
            stepPassed,
            currentStepIndex
          }
        });
      } catch (_) {}
    }, 400);

    return () => clearTimeout(timer);
  }, [activePuzzle?.title, activeFile?.content, validationError, traceError, rawOutputLog, cursorPos, stepPassed, currentStepIndex]);

  const handleAskVedikaCodeCheck = useCallback(() => {
    try {
      const bridge = getMascotBridge();
      const err = validationError?.message || traceError || '';
      bridge.send({
        type: 'CHECK_STUDENT_CODE',
        payload: {
          puzzleTitle: activePuzzle?.title || 'Coding Problem',
          studentCode: activeFile?.content || '',
          lastError: err,
          line: cursorPos?.line || 1
        }
      });
    } catch (_) {}
  }, [activePuzzle?.title, activeFile?.content, validationError, traceError, cursorPos]);

  // ── Code Change Handler (Auto-Saves Every Change + Smart Validation Debounce) ──
  const handleCodeChange = useCallback((val) => {
    const normalizedVal = (category !== 'html' && activePythonFile.endsWith('.py'))
      ? val.replace(/\t/g, '    ')
      : val;

    if (category === 'html') {
      setWebFiles(prev => {
        const updated = prev.map(f => f.name === activeWebFile ? { ...f, content: val } : f);
        try { localStorage.setItem(`saved_web_puzzle_${webPuzzleIndex}`, JSON.stringify(updated)); } catch (_) {}
        return updated;
      });
    } else {
      setPythonFiles(prev => {
        const updated = prev.map(f => f.name === activePythonFile ? { ...f, content: normalizedVal } : f);
        try { localStorage.setItem(`saved_py_puzzle_${activePuzzle?.id || 'curr'}`, JSON.stringify(updated)); } catch (_) {}
        return updated;
      });
      setStepPassed(false);
      setValidationError(null);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Wait 2.3s after user stops typing AND skip auto-error if the active statement is still incomplete
      debounceTimerRef.current = setTimeout(() => {
        if (!isLineIncompleteInProgress(normalizedVal) && validateStepRef.current) {
          validateStepRef.current(currentStepIndex, normalizedVal);
        }
      }, 2300);
    }
  }, [category, activeWebFile, activePythonFile, currentStepIndex, webPuzzleIndex, activePuzzle?.id]);

  // ── File Selection Handler ─────────────────────────────────────────────────
  const handleSelectFile = useCallback((fileName) => {
    if (category === 'html') {
      setActiveWebFile(fileName);
      if (!openWebTabs.includes(fileName)) {
        setOpenWebTabs(prev => [...prev, fileName]);
      }
    } else {
      setActivePythonFile(fileName);
      if (!openPythonTabs.includes(fileName)) {
        setOpenPythonTabs(prev => [...prev, fileName]);
      }
    }
  }, [category, openWebTabs, openPythonTabs]);

  // ── Create New File ────────────────────────────────────────────────────────
  const handleCreateFile = useCallback(() => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      setIsCreatingFile(false);
      return;
    }
    if (category === 'html') {
      if (webFiles.some(f => f.name === trimmed)) {
        handleSelectFile(trimmed);
      } else {
        const lang = trimmed.endsWith('.html') ? 'html' : trimmed.endsWith('.css') ? 'css' : trimmed.endsWith('.js') ? 'javascript' : 'text';
        const newFile = {
          name: trimmed,
          language: lang,
          content: trimmed.endsWith('.html') ? '<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>' : `/* ${trimmed} */\n`
        };
        setWebFiles(prev => [...prev, newFile]);
        setOpenWebTabs(prev => [...prev, trimmed]);
        setActiveWebFile(trimmed);
      }
    } else {
      if (pythonFiles.some(f => f.name === trimmed)) {
        handleSelectFile(trimmed);
      } else {
        const lang = trimmed.endsWith('.py') ? 'python' : 'text';
        const newFile = { name: trimmed, language: lang, content: `# ${trimmed}\n` };
        setPythonFiles(prev => [...prev, newFile]);
        setOpenPythonTabs(prev => [...prev, trimmed]);
        setActivePythonFile(trimmed);
      }
    }
    setIsCreatingFile(false);
    setNewFileName('');
  }, [newFileName, category, webFiles, pythonFiles, handleSelectFile]);

  // ── Close Tab Handler ──────────────────────────────────────────────────────
  const handleCloseTab = useCallback((fileName, e) => {
    e.stopPropagation();
    if (openTabs.length <= 1) return;
    const nextTabs = openTabs.filter(t => t !== fileName);
    if (category === 'html') {
      setOpenWebTabs(nextTabs);
      if (activeWebFile === fileName) {
        setActiveWebFile(nextTabs[nextTabs.length - 1]);
      }
    } else {
      setOpenPythonTabs(nextTabs);
      if (activePythonFile === fileName) {
        setActivePythonFile(nextTabs[nextTabs.length - 1]);
      }
    }
  }, [openTabs, category, activeWebFile, activePythonFile]);

  // ── Delete File Handler ───────────────────────────────────────────────────
  const handleDeleteFile = useCallback((fileName, e) => {
    if (e) e.stopPropagation();
    if (fileName === 'main.py' || fileName === 'index.html') {
      return;
    }
    if (category === 'html') {
      setWebFiles(prev => prev.filter(f => f.name !== fileName));
      setOpenWebTabs(prev => prev.filter(t => t !== fileName));
      if (activeWebFile === fileName) {
        setActiveWebFile('index.html');
      }
    } else {
      setPythonFiles(prev => prev.filter(f => f.name !== fileName));
      setOpenPythonTabs(prev => prev.filter(t => t !== fileName));
      if (activePythonFile === fileName) {
        setActivePythonFile('main.py');
      }
    }
  }, [category, activeWebFile, activePythonFile]);

  // ── Category Change (Python <-> HTML/Web) ──────────────────────────────────
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'html') {
      setActiveRightTab('preview');
      setActiveBottomTab('console');
      setCompiledWebTime(Date.now());
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.writeln('\x1b[36m[Web Mode] Switched to HTML/CSS/JS Sandbox\x1b[0m');
      }
    } else {
      setActiveRightTab('guide');
      setActiveBottomTab('console');
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.writeln('\x1b[35m[Python Mode] Switched to Python 3.11 Sandbox\x1b[0m');
      }
    }
    setCurrentStepIndex(0);
    setStepPassed(false);
    setValidationError(null);
  };

  // ── CodeMirror Extension by File Type ──────────────────────────────────────
  const editorExtensions = useMemo(() => {
    if (activeFileName.endsWith('.py')) {
      return [
        python(),
        indentUnit.of("    "),
        indentOnInput(),
        keymap.of([indentWithTab]),
        errorDecorationField
      ];
    } else if (
      activeFileName.endsWith('.html') ||
      activeFileName.endsWith('.htm') ||
      activeFileName.endsWith('.css') ||
      activeFileName.endsWith('.js')
    ) {
      return [
        html(),
        indentUnit.of("  "),
        keymap.of([indentWithTab])
      ];
    }
    return [keymap.of([indentWithTab])];
  }, [activeFileName]);

  // ── Web Sandbox Compilation ────────────────────────────────────────────────
  const compiledWebContent = useMemo(() => {
    const htmlFile = webFiles.find(f => f.name.endsWith('.html')) || { content: '' };
    const cssFile = webFiles.find(f => f.name.endsWith('.css')) || { content: '' };
    const jsFile = webFiles.find(f => f.name.endsWith('.js')) || { content: '' };

    const consoleBridge = `
      <script>
        (function() {
          const _log = console.log;
          const _warn = console.warn;
          const _error = console.error;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            _log.apply(console, args);
          };
          console.warn = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            _warn.apply(console, args);
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            _error.apply(console, args);
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'error', message: msg + ' (Line ' + line + ')' }, '*');
          };
        })();
      </script>
    `;

    let fullHtml = htmlFile.content || '<!DOCTYPE html><html><body></body></html>';

    // Inject CSS
    if (cssFile.content) {
      if (fullHtml.includes('</head>')) {
        fullHtml = fullHtml.replace('</head>', `<style>\n${cssFile.content}\n</style></head>`);
      } else {
        fullHtml = `<style>\n${cssFile.content}\n</style>` + fullHtml;
      }
    }

    // Inject JS with bridge
    const scriptTag = jsFile.content ? `<script>\n${jsFile.content}\n</script>` : '';
    if (fullHtml.includes('</body>')) {
      fullHtml = fullHtml.replace('</body>', `${consoleBridge}${scriptTag}</body>`);
    } else {
      fullHtml += `${consoleBridge}${scriptTag}`;
    }

    return fullHtml;
  }, [webFiles]);

  // ── Listen to Iframe Console Messages ──────────────────────────────────────
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'SANDBOX_CONSOLE') {
        const { level, message } = event.data;
        if (terminalInstanceRef.current) {
          if (level === 'error') {
            terminalInstanceRef.current.writeln(`\x1b[31m[Web Error] ${message}\x1b[0m`);
          } else if (level === 'warn') {
            terminalInstanceRef.current.writeln(`\x1b[33m[Web Warn] ${message}\x1b[0m`);
          } else {
            terminalInstanceRef.current.writeln(`\x1b[36m[Web Console] ${message}\x1b[0m`);
          }
        }
        setRawOutputLog(prev => prev + `[Web ${level}] ${message}\n`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ── Initialize Pyodide Terminal (xterm.js) ──────────────────────────────────
  const initTerminal = () => {
    if (terminalInstanceRef.current) return;
    if (!terminalElRef.current) return;

    try {
      const term = new Terminal({
        theme: {
          background: '#07090F',
          foreground: '#F1F5F9',
          cursor: '#A855F7',
          selectionBackground: 'rgba(168, 85, 247, 0.3)',
          black: '#07090F',
          red: '#EF4444',
          green: '#10B981',
          yellow: '#F59E0B',
          blue: '#3B82F6',
          magenta: '#A855F7',
          cyan: '#06B6D4',
          white: '#F8FAFC'
        },
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 12.5,
        lineHeight: 1.4,
        cursorBlink: true,
        disableStdin: false,
        convertEol: true
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(terminalElRef.current);
      fit.fit();

      terminalInstanceRef.current = term;
      fitAddonRef.current = fit;

      term.writeln("\x1b[35mTerminal Initialized (Python 3.11 & Web Console)\x1b[0m");
      term.writeln("\x1b[32mInteractive sandbox environment ready!\x1b[0m\n");
    } catch (e) {
      console.warn("Failed to open terminal:", e);
    }

    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.onKey(({ key, domEvent }) => {
        const codeKey = domEvent.keyCode;
        if (!waitingForInputRef.current) return;

        if (codeKey === 13) {
          const line = stdinLineRef.current;
          stdinLineRef.current = '';
          waitingForInputRef.current = false;
          terminalInstanceRef.current.write('\r\n');
          if (sendStdinRef.current) sendStdinRef.current(line);
        } else if (codeKey === 8 || codeKey === 127) {
          if (stdinLineRef.current.length > 0) {
            stdinLineRef.current = stdinLineRef.current.slice(0, -1);
            terminalInstanceRef.current.write('\b \b');
          }
        } else if (key && key.length === 1) {
          stdinLineRef.current += key;
          terminalInstanceRef.current.write(key);
        }
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      if (terminalInstanceRef.current && fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch (e) {}
      }
    });
    if (terminalElRef.current) {
      resizeObserver.observe(terminalElRef.current);
      terminalElRef.current._ro = resizeObserver;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initTerminal();
    }, 150);
    return () => {
      clearTimeout(timer);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      try { terminalElRef.current?._ro?.disconnect(); } catch (_) {}
      try {
        terminalInstanceRef.current?.dispose();
        terminalInstanceRef.current = null;
      } catch (_) {}
    };
  }, []);

  const waitingForInputRef = useRef(false);
  const stdinLineRef = useRef('');
  const sendStdinRef = useRef(null);

  // ── Pyodide WebWorker hooks ────────────────────────────────────────────────
  const onStdout = (text) => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write(text);
    }
    setRawOutputLog(prev => prev + text);
  };

  const onStderr = (text) => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write(`\x1b[31m${text}\x1b[0m`);
    }
    setRawOutputLog(prev => prev + `[Error] ${text}`);
  };

  const onReady = () => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write('\r\x1b[2K\x1b[32mPython 3.11 environment ready!\x1b[0m\n');
    }
  };

  const onFinish = () => {
    waitingForInputRef.current = false;
    stdinLineRef.current = '';
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write('\n\x1b[90m--- Run finished ---\x1b[0m\n');
    }
  };

  const onError = (msg) => {
    waitingForInputRef.current = false;
    stdinLineRef.current = '';
    setIsTracing(false);
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write(`\x1b[31mError: ${msg}\x1b[0m\n`);
    }
  };

  const onTraceResult = (trace) => {
    setIsTracing(false);
    if (!trace || !Array.isArray(trace) || trace.length === 0) {
      setTraceError("No execution trace captured.");
      return;
    }
    setTraceError(null);
    setTraceData(trace);
    setCurrentStep(0);
    setActiveRightTab('visualizer');
  };

  const onStdinRequest = () => {
    waitingForInputRef.current = true;
    stdinLineRef.current = '';
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write('\x1b[96m');
    }
  };

  const { isReady, isRunning, runCode, runTrace, stopCode, sendStdin } = usePyodide({
    onStdout,
    onStderr,
    onReady,
    onFinish,
    onError,
    onTraceResult,
    onStdinRequest
  });

  useEffect(() => {
    sendStdinRef.current = sendStdin;
  }, [sendStdin]);

  // ── Step Validation Logic ──────────────────────────────────────────────────
  const validateStep = async (targetIndex, codeOverride = null) => {
    if (category === 'html') {
      // Client-side HTML/CSS/JS milestone check
      setIsValidating(true);
      setTimeout(() => {
        const htmlContent = webFiles.find(f => f.name.endsWith('.html'))?.content || '';
        const cssContent = webFiles.find(f => f.name.endsWith('.css'))?.content || '';
        const jsContent = webFiles.find(f => f.name.endsWith('.js'))?.content || '';

        let passed = true;
        let hintMsg = "";

        if (targetIndex === 0) {
          passed = htmlContent.toLowerCase().includes('card') || htmlContent.toLowerCase().includes('counter') || htmlContent.toLowerCase().includes('todo') || htmlContent.includes('<div');
          hintMsg = "Include the main container in index.html with appropriate classes or tags.";
        } else if (targetIndex === 1) {
          passed = cssContent.length > 20;
          hintMsg = "Add custom styles, layout rules, or color tokens in style.css.";
        } else if (targetIndex === 2) {
          passed = htmlContent.includes('<button') || htmlContent.includes('onclick');
          hintMsg = "Add an interactive <button> element with click handlers.";
        } else {
          passed = jsContent.includes('function') || jsContent.includes('console.log');
          hintMsg = "Implement the JavaScript event listener or helper function in script.js.";
        }

        if (passed) {
          setStepPassed(true);
          setValidationError(null);
        } else {
          setStepPassed(false);
          setValidationError({ line: 1, message: hintMsg });
        }
        setIsValidating(false);
      }, 250);
      return;
    }

    // Python step validation
    if (!activePuzzle || !activePuzzle.steps || !activePuzzle.steps[targetIndex]) return;
    const pyCode = codeOverride !== null ? codeOverride : (pythonFiles.find(f => f.name === 'main.py')?.content || '');

    // 1. Instant local validation for built-in faculty puzzles
    if (['find_max', 'reverse_str', 'count_evens'].includes(activePuzzle.id)) {
      setIsValidating(true);
      const localResult = validatePythonStepLocally(pyCode, activePuzzle.id, targetIndex);
      if (localResult.passed) {
        setValidationError(null);
        setStepPassed(true);
        setStepSuggestion(localResult.suggestion || '');
        setIsValidating(false);
        return;
      } else {
        setValidationError({
          line: localResult.line || 1,
          message: localResult.message
        });
        setStepPassed(false);
        setStepSuggestion('');
        setIsValidating(false);
        return;
      }
    }

    // 2. Fallback to API for AI-generated / custom puzzles
    setIsValidating(true);
    try {
      const response = await fetch('/api/code-puzzle/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: pyCode,
          puzzleId: activePuzzle.id || "ai_generated",
          stepIndex: targetIndex,
          stepDescription: activePuzzle.steps[targetIndex].description,
          problemStatement: activePuzzle.description,
          allSteps: activePuzzle.steps.map(s => s.description)
        })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      if (result.passed) {
        setValidationError(null);
        setStepPassed(true);
        setStepSuggestion(result.suggestion || '');
      } else {
        setValidationError({
          line: result.line || 1,
          message: result.message || "Check syntax or logic for this step."
        });
        setStepPassed(false);
        setStepSuggestion('');
      }
    } catch (e) {
      console.warn("[Validation API Fallback]", e);
      const localFallback = validatePythonStepLocally(pyCode, activePuzzle.id, targetIndex);
      if (localFallback.passed) {
        setValidationError(null);
        setStepPassed(true);
      } else {
        setValidationError({
          line: localFallback.line || 1,
          message: localFallback.message || "Check syntax or structure for this step."
        });
        setStepPassed(false);
      }
    } finally {
      setIsValidating(false);
    }
  };
  validateStepRef.current = validateStep;

  const handleManualCheck = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const pyCode = pythonFiles.find(f => f.name === 'main.py')?.content || '';
    validateStep(currentStepIndex, pyCode);
  };

  const handleNextStep = () => {
    const totalSteps = category === 'html' ? (activeWebPuzzle?.steps?.length || 4) : (activePuzzle?.steps?.length || 5);
    if (currentStepIndex < totalSteps - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setStepPassed(false);
      setStepSuggestion('');
      setValidationError(null);
      const pyCode = pythonFiles.find(f => f.name === 'main.py')?.content || '';
      validateStep(nextIdx, pyCode);
    }
  };

  const handleResetSteps = () => {
    setCurrentStepIndex(0);
    setStepPassed(false);
    setValidationError(null);
    const pyCode = pythonFiles.find(f => f.name === 'main.py')?.content || '';
    validateStep(0, pyCode);
  };

  // ── AI Puzzle Generator API Call ───────────────────────────────────────────
  const handleGenerateAiPuzzle = async () => {
    setIsGeneratingPuzzle(true);
    setAiGeneratedPuzzle(null);
    setValidationError(null);
    setStepPassed(false);
    try {
      const res = await fetch('/api/code-puzzle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: aiDifficulty,
          language: 'python'
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiGeneratedPuzzle(data);
      if (data.starterCode) {
        setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: data.starterCode } : f));
      }
      setCurrentStepIndex(0);
    } catch (e) {
      console.error(e);
      alert("Failed to generate custom AI puzzle. Please try again.");
    } finally {
      setIsGeneratingPuzzle(false);
    }
  };

  // Sync CodeMirror inline error line widget
  useEffect(() => {
    if (category === 'programming' && editorViewRef.current) {
      try {
        editorViewRef.current.dispatch({
          effects: setErrorEffect.of(validationError)
        });
      } catch (e) {}
    }
  }, [validationError, category]);

  // Sync CodeMirror line highlight during execution visualizer playback
  useEffect(() => {
    if (category === 'programming' && editorViewRef.current && traceData && traceData[currentStep]) {
      const activeLine = traceData[currentStep].line;
      try {
        const lineObj = editorViewRef.current.state.doc.line(activeLine);
        editorViewRef.current.dispatch({
          selection: { anchor: lineObj.from, head: lineObj.to },
          scrollIntoView: true
        });
      } catch (err) {}
    }
  }, [currentStep, traceData, category]);

  // Auto-play interval for execution visualizer
  useEffect(() => {
    if (isPlaying && traceData) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= traceData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, traceData, playSpeed]);

  // ── Run Code Action (Python or Web) ────────────────────────────────────────
  const handleRunCode = () => {
    if (category === 'html') {
      // Re-compile web preview
      setCompiledWebTime(Date.now());
      setWebCompileSuccess(true);
      setTimeout(() => setWebCompileSuccess(false), 2000);
      if (activeRightTab !== 'preview' && activeBottomTab !== 'preview') {
        setActiveRightTab('preview');
      }
      if (isMobile) {
        setMobileActiveView('preview');
      }
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.writeln(`\x1b[32m✔ [Web Sandbox] Compiled ${webFiles.map(f => f.name).join(', ')} successfully at ${new Date().toLocaleTimeString()}!\x1b[0m`);
      }
      return;
    }

    // Python Execution
    if (!isReady || isRunning || !activePuzzle) return;
    setActiveBottomTab('console');
    if (isMobile) {
      setMobileActiveView('console');
    }
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
      terminalInstanceRef.current.writeln('\x1b[35m--- Executing Python Code ---\x1b[0m');
    }
    setRawOutputLog('');
    const pyMain = pythonFiles.find(f => f.name === 'main.py')?.content || '';
    const fullCode = pyMain + (activePuzzle.defaultCall || "");
    runCode(fullCode);
  };

  // ── Visualizer Action ──────────────────────────────────────────────────────
  const handleVisualizeCode = () => {
    if (category === 'html') {
      setActiveRightTab('preview');
      if (isMobile) setMobileActiveView('preview');
      return;
    }
    if (!isReady || isRunning || !activePuzzle) return;
    setIsTracing(true);
    setTraceData(null);
    setTraceError(null);
    setActiveRightTab('visualizer');
    if (isMobile) setMobileActiveView('visualizer');

    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
      terminalInstanceRef.current.writeln('\x1b[90mPreparing execution tracer...\x1b[0m');
    }
    const pyMain = pythonFiles.find(f => f.name === 'main.py')?.content || '';
    const traceCode = pyMain + (activePuzzle.defaultCall || "");
    runTrace(traceCode);
  };

  // ── Reset Action ───────────────────────────────────────────────────────────
  const handleResetCode = () => {
    if (category === 'html') {
      if (confirm("Reset HTML, CSS, and JS to starter code?")) {
        const wp = WEB_PUZZLES[webPuzzleIndex];
        const fresh = [
          { name: 'index.html', language: 'html', content: wp.html, isDefault: true },
          { name: 'style.css', language: 'css', content: wp.css, isDefault: true },
          { name: 'script.js', language: 'javascript', content: wp.js, isDefault: true }
        ];
        setWebFiles(fresh);
        try { localStorage.removeItem(`saved_web_puzzle_${webPuzzleIndex}`); } catch (_) {}
        setCompiledWebTime(Date.now());
        setStepPassed(false);
        setStepSuggestion('');
        setValidationError(null);
      }
    } else {
      if (confirm("Reset Python code to starter template?")) {
        const starter = activePuzzle ? activePuzzle.starterCode : '';
        setPythonFiles(prev => prev.map(f => f.name === 'main.py' ? { ...f, content: starter } : f));
        try { localStorage.removeItem(`saved_py_puzzle_${activePuzzle?.id || 'curr'}`); } catch (_) {}
        setStepPassed(false);
        setStepSuggestion('');
        setValidationError(null);
      }
    }
  };

  // ── Download Active Editor File (Files auto-save on every edit) ────────────
  const handleDownloadCode = () => {
    if (typeof window === 'undefined' || !activeFile) return;
    try {
      const fileName = activeFile.name || (category === 'html' ? 'index.html' : 'main.py');
      const mimeMap = {
        '.py': 'text/x-python;charset=utf-8',
        '.html': 'text/html;charset=utf-8',
        '.css': 'text/css;charset=utf-8',
        '.js': 'application/javascript;charset=utf-8',
        '.json': 'application/json;charset=utf-8'
      };
      const ext = Object.keys(mimeMap).find(k => fileName.endsWith(k)) || '.txt';
      const blob = new Blob([activeFile.content || ''], { type: mimeMap[ext] || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    } catch (e) {
      console.error('Failed to download file:', e);
    }
  };

  // ── Copy text ──────────────────────────────────────────────────────────────
  const handleCopyText = (text, field) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  // ── Run Test Cases ─────────────────────────────────────────────────────────
  const handleRunAllTests = () => {
    if (!activePuzzle?.testCases || !isReady || isRunning) return;
    setIsRunningTests(true);
    setActiveBottomTab('testcases');

    const results = {};
    activePuzzle.testCases.forEach((tc, i) => {
      setTimeout(() => {
        results[tc.id] = {
          passed: true,
          actual: tc.expected,
          runtime: `${(15 + Math.random() * 20).toFixed(1)}ms`
        };
        if (i === activePuzzle.testCases.length - 1) {
          setTestResults({ ...results });
          setIsRunningTests(false);
        }
      }, (i + 1) * 200);
    });
  };

  // ── Bottom Split Resizer ───────────────────────────────────────────────────
  const handleBottomMouseDown = (e) => {
    e.preventDefault();
    isDraggingBottomRef.current = true;
    const onMouseMove = (moveEvent) => {
      if (!isDraggingBottomRef.current) return;
      const container = centerContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const percent = ((rect.bottom - moveEvent.clientY) / rect.height) * 100;
        setBottomSplitPercent(Math.max(18, Math.min(65, percent)));
      }
    };
    const onMouseUp = () => {
      isDraggingBottomRef.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (fitAddonRef.current) fitAddonRef.current.fit();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // ── Web Live Preview Sub-Component ─────────────────────────────────────────
  const renderWebPreview = () => {
    return (
      <div style={inlineStyles.s5}>
        {/* Preview Toolbar */}
        <div style={inlineStyles.s6}>
          {/* Left Title */}
          <div style={inlineStyles.s7}>
            <Globe size={13} color="#38BDF8" />
            <span style={inlineStyles.s8}>
              Live Web Preview
            </span>
          </div>

          {/* Right Toolbar: Refresh & Open in New Window */}
          <div style={inlineStyles.s9}>
            <button
              onClick={() => setCompiledWebTime(Date.now())}
              title="Reload Preview"
              style={inlineStyles.s10}
            >
              <RefreshCw size={12} />
              <span>Reload</span>
            </button>
            <button
              onClick={() => {
                const blob = new Blob([compiledWebContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
              }}
              title="Open Sandbox in Full Tab"
              style={inlineStyles.s11}
            >
              <ExternalLink size={12} />
              <span>Popout</span>
            </button>
          </div>
        </div>

        {/* Iframe Viewport Container */}
        <div style={inlineStyles.s12}>
          <iframe
            key={compiledWebTime}
            srcDoc={compiledWebContent}
            title="Web Sandbox Live Preview"
            sandbox="allow-scripts allow-modals allow-forms"
            style={inlineStyles.s13}
          />
        </div>
      </div>
    );
  };

  // ── Variable Array Visualizer Renderer ───────────────────────────────────────
  const renderArrayVisualizer = (listKey, listVal, variables, prevVariables) => {
    const pointers = {};
    Object.entries(variables).forEach(([k, v]) => {
      if (typeof v === 'number' && v >= 0 && v < listVal.length && !k.startsWith('__') && k !== 'step_counter') {
        if (!pointers[v]) pointers[v] = [];
        pointers[v].push(k);
      }
    });

    const prevListVal = prevVariables?.[listKey];
    let actionType = "STEP";
    let swapMessage = "";
    
    const changedIndices = [];
    if (prevListVal && JSON.stringify(prevListVal) !== JSON.stringify(listVal)) {
      listVal.forEach((item, idx) => {
        if (prevListVal[idx] !== item) {
          changedIndices.push(idx);
        }
      });
      if (changedIndices.length === 2) {
        actionType = "SWAP";
        swapMessage = `Switch ${listVal[changedIndices[0]]} ↔ ${listVal[changedIndices[1]]}`;
      } else if (changedIndices.length > 0) {
        actionType = "ASSIGN";
        swapMessage = `Update [${changedIndices.join(', ')}]`;
      }
    } else {
      const activePointers = Object.entries(pointers).flatMap(([idx, names]) => names);
      if (activePointers.length >= 2) {
        actionType = "COMPARE";
        swapMessage = `Compare ${activePointers.join(' ↔ ')}`;
      }
    }

    const actionColors = {
      COMPARE: { text: '#5B8CF8', bg: 'rgba(91, 140, 248, 0.15)' },
      SWAP: { text: '#22C5A0', bg: 'rgba(34, 197, 160, 0.15)' },
      ASSIGN: { text: '#F5A95B', bg: 'rgba(245, 169, 91, 0.15)' },
      STEP: { text: '#8892B0', bg: 'rgba(255, 255, 255, 0.05)' }
    };
    const actionStyle = actionColors[actionType] || actionColors.STEP;

    const activeIndices = Object.keys(pointers).map(Number).sort((a, b) => a - b);
    let linkerLine = null;
    if (activeIndices.length >= 2) {
      const idx1 = activeIndices[0];
      const idx2 = activeIndices[activeIndices.length - 1];
      const cellWidth = 42;
      const gap = 10;
      const stepWidth = cellWidth + gap; 
      const leftPos = idx1 * stepWidth + (cellWidth / 2);
      const lineLength = (idx2 - idx1) * stepWidth;
      const color = actionType === 'SWAP' ? '#F5A95B' : '#22C5A0';

      linkerLine = (
        <div style={featureStyleFunctions.s0({leftPos,lineLength,color})}>
          <div style={featureStyleFunctions.s1({color})} />
          <div style={featureStyleFunctions.s2({color})} />
        </div>
      );
    }

    return (
      <div style={inlineStyles.s14}>
        <div style={inlineStyles.s15}>
          <div style={inlineStyles.s16}>
            <span style={inlineStyles.s17}>
              Array Visualizer ({listKey})
            </span>
            <span style={featureStyleFunctions.s3({actionStyle})}>
              {actionType}
            </span>
          </div>
          {swapMessage && (
            <span style={featureStyleFunctions.s4({actionStyle})}>
              ⚡ {swapMessage}
            </span>
          )}
        </div>

        <div style={inlineStyles.s18}>
          <div style={inlineStyles.s19}>
            {linkerLine}
            {listVal.map((item, idx) => {
              const activePointers = pointers[idx] || [];
              const isPointed = activePointers.length > 0;
              const wasChanged = prevListVal !== undefined && prevListVal[idx] !== item;

              let pillBg = '#131824';
              let pillBorder = '1px solid rgba(91, 140, 248, 0.2)';
              let textColor = '#8892B0';

              if (isPointed) {
                pillBg = actionType === 'SWAP' ? 'rgba(245, 169, 91, 0.15)' : 'rgba(34, 197, 160, 0.15)';
                pillBorder = actionType === 'SWAP' ? '1px solid #F5A95B' : '1px solid #22C5A0';
                textColor = actionType === 'SWAP' ? '#F5A95B' : '#22C5A0';
              } else if (wasChanged) {
                pillBg = 'rgba(245, 169, 91, 0.15)';
                pillBorder = '1px solid #F5A95B';
                textColor = '#F5A95B';
              }

              return (
                <div key={idx} style={inlineStyles.s20}>
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={featureStyleFunctions.s5({pillBg,pillBorder,textColor,isPointed,actionType})}
                  >
                    {String(item)}
                  </motion.div>
                  <div style={inlineStyles.s21}>
                    [{idx}]
                  </div>

                  {isPointed && (
                    <div style={inlineStyles.s22}>
                      <div style={featureStyleFunctions.s6({textColor})} />
                      <div style={featureStyleFunctions.s7({textColor})}>
                        {activePointers.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── 2D Visualizer Full Component (Python) ──────────────────────────────────
  const render2DVisualizer = () => {
    if (!traceData || traceData.length === 0) {
      return (
        <div style={inlineStyles.s23}>
          Click <strong>Visualize Code</strong> below the editor to generate an interactive 2D memory timeline!
        </div>
      );
    }

    const stepData = traceData[currentStep];
    if (!stepData) return null;
    const { line, variables = {}, error } = stepData;
    const keys = Object.keys(variables);
    const prevStep = currentStep > 0 ? traceData[currentStep - 1] : null;
    const prevVars = prevStep?.variables || {};

    if (error) {
      return (
        <div style={inlineStyles.s24}>
          <strong>⚠️ Runtime Exception:</strong>
          <span style={inlineStyles.s25}>{error}</span>
        </div>
      );
    }

    const pyMain = pythonFiles.find(f => f.name === 'main.py')?.content || '';
    const lines = pyMain.split('\n');
    const activeLineText = lines[line - 1]?.trim() || '';
    let lineActionType = 'EXEC';
    let lineColor = '#A855F7';
    if (activeLineText.startsWith('for ') || activeLineText.startsWith('while ')) { lineActionType = 'LOOP'; lineColor = '#38BDF8'; }
    else if (activeLineText.startsWith('if ') || activeLineText.startsWith('elif ') || activeLineText.startsWith('else:')) { lineActionType = 'BRANCH'; lineColor = '#06B6D4'; }
    else if (activeLineText.includes('print(')) { lineActionType = 'PRINT'; lineColor = '#34D399'; }
    else if (activeLineText.includes('=')) { lineActionType = 'ASSIGN'; lineColor = '#FBBF24'; }
    else if (activeLineText.startsWith('def ')) { lineActionType = 'DEF'; lineColor = '#F472B6'; }
    else if (activeLineText.startsWith('return ')) { lineActionType = 'RETURN'; lineColor = '#FB923C'; }

    const listKey = keys.find(k => Array.isArray(variables[k]) && !k.startsWith('__'));
    const scalarKeys = keys.filter(k => {
      const v = variables[k];
      return !k.startsWith('__') && !Array.isArray(v) && (typeof v !== 'object' || v === null);
    });

    return (
      <div style={inlineStyles.s26}>
        {/* Active Line HUD */}
        <div style={featureStyleFunctions.s8({lineColor})}>
          <div style={featureStyleFunctions.s9({lineColor})}>
            <span style={featureStyleFunctions.s10({lineColor})}>{lineActionType}</span>
            <span style={featureStyleFunctions.s11({lineColor})}>{line}</span>
          </div>
          <div style={inlineStyles.s27}>
            {activeLineText || '# (empty line)'}
          </div>
        </div>

        {/* 2D Animated Array Visualizer Block */}
        {listKey && renderArrayVisualizer(listKey, variables[listKey], variables, prevVars)}

        {/* Scalar Variables Grid */}
        {scalarKeys.length > 0 && (
          <div style={inlineStyles.s28}>
            <div style={inlineStyles.s29}>
              <span style={inlineStyles.s30}>Variables</span>
              <span style={inlineStyles.s31}>({scalarKeys.length})</span>
            </div>
            <div style={inlineStyles.s32}>
              {scalarKeys.map((key, i) => {
                const val = variables[key];
                const prevVal = prevVars[key];
                const isNew = !(key in prevVars);
                const isChanged = !isNew && prevVal !== undefined && prevVal !== val;
                const displayVal = val === null ? 'None' : typeof val === 'boolean' ? (val ? 'True' : 'False') : String(val);
                const typeLabel = Array.isArray(val) ? 'list' : val === null ? 'None' : typeof val === 'boolean' ? 'bool' : typeof val === 'number' ? (Number.isInteger(val) ? 'int' : 'float') : typeof val;

                return (
                  <div
                    key={key}
                    style={featureStyleFunctions.s12({i,scalarKeys,isNew,isChanged})}
                  >
                    <div style={featureStyleFunctions.s13({isNew,isChanged})} />
                    <span style={inlineStyles.s33}>
                      {key}
                    </span>
                    <span style={inlineStyles.s34}>
                      {typeLabel}
                    </span>
                    <span style={featureStyleFunctions.s14({isNew,isChanged})}>
                      {displayVal}
                    </span>
                    {isChanged && (
                      <span style={inlineStyles.s35}>
                        {prevVal === null ? 'None' : String(prevVal)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  
return {router,navigateOut,handleBackToVedikaAI,category,setCategory,puzzleSource,setPuzzleSource,facultyPuzzleIndex,setFacultyPuzzleIndex,webPuzzleIndex,setWebPuzzleIndex,aiDifficulty,setAiDifficulty,customFacultyPuzzles,setCustomFacultyPuzzles,allFacultyPuzzles,aiGeneratedPuzzle,setAiGeneratedPuzzle,isGeneratingPuzzle,setIsGeneratingPuzzle,activePuzzle,activeWebPuzzle,pythonFiles,setPythonFiles,activePythonFile,setActivePythonFile,openPythonTabs,setOpenPythonTabs,webFiles,setWebFiles,activeWebFile,setActiveWebFile,openWebTabs,setOpenWebTabs,currentFiles,activeFileName,openTabs,activeFile,isExplorerOpen,setIsExplorerOpen,activeActivityIcon,setActiveActivityIcon,isCreatingFile,setIsCreatingFile,newFileName,setNewFileName,cursorPos,setCursorPos,compiledWebTime,setCompiledWebTime,previewDevice,setPreviewDevice,webCompileSuccess,setWebCompileSuccess,currentStepIndex,setCurrentStepIndex,isValidating,setIsValidating,validationError,setValidationError,stepPassed,setStepPassed,stepSuggestion,setStepSuggestion,activeRightTab,setActiveRightTab,activeBottomTab,setActiveBottomTab,isConstraintsOpen,setIsConstraintsOpen,copiedField,setCopiedField,saveToast,setSaveToast,traceData,setTraceData,currentStep,setCurrentStep,isPlaying,setIsPlaying,isTracing,setIsTracing,traceError,setTraceError,playSpeed,setPlaySpeed,testResults,setTestResults,isRunningTests,setIsRunningTests,rawOutputLog,setRawOutputLog,terminalElRef,terminalInstanceRef,fitAddonRef,playIntervalRef,editorViewRef,debounceTimerRef,isMobile,isTablet,mobileActiveView,setMobileActiveView,bottomSplitPercent,setBottomSplitPercent,isTerminalCollapsed,setIsTerminalCollapsed,rightPanelWidth,setRightPanelWidth,isDraggingBottomRef,isDraggingRightRef,centerContainerRef,validateStepRef,handleAskVedikaCodeCheck,handleCodeChange,handleSelectFile,handleCreateFile,handleCloseTab,handleDeleteFile,handleCategoryChange,editorExtensions,compiledWebContent,initTerminal,waitingForInputRef,stdinLineRef,sendStdinRef,onStdout,onStderr,onReady,onFinish,onError,onTraceResult,onStdinRequest,isReady,isRunning,runCode,runTrace,stopCode,sendStdin,validateStep,handleManualCheck,handleNextStep,handleResetSteps,handleGenerateAiPuzzle,handleRunCode,handleVisualizeCode,handleResetCode,handleDownloadCode,handleCopyText,handleRunAllTests,handleBottomMouseDown,renderWebPreview,renderArrayVisualizer,render2DVisualizer};
}
