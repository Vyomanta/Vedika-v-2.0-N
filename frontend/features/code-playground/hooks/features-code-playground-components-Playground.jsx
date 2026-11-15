'use client';
import * as featureStyleFunctions from '@/features/code-playground/styles/features-code-playground-components-Playground.a74bca87.styles.js';

import inlineStyles from '@/features/code-playground/styles/Playground.styles';
import '@/features/code-playground/styles/Playground.css';
import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { usePyodide } from '@/hooks/usePyodide';
import { Play, Square, Trash2, CheckCircle, Loader2, ChevronLeft, ChevronRight, Pause, BookOpen, AlertCircle, X, GitFork, Layers, Columns } from 'lucide-react';
import CodeFlowchartVisualizer from '@/components/CodeFlowchartVisualizer';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { T } from '@/shared/design-system/theme';
import { BUG_ANALYSIS_SYSTEM, BUG_TIPS_SYSTEM, BUG_FIX_METHODS_SYSTEM, FIX_EXPLANATION_SYSTEM, SOCRATIC_HELP_SYSTEM } from '@/features/tutoring/domain/prompts';

export function usePlaygroundModel({
  initialCode = '# Write your Python code here\nprint("Hello World!")\n',
  codeOverride = null,
  explanationOverride = null,
  onTraceComplete = null,
  onCodeChange = null,
  codingExercise = null,
  onVerifySuccess = null
}) {

  const getInitialCode = () => {
    if (codingExercise?.hasExercise && codingExercise.starterCode) {
      return codingExercise.starterCode;
    }
    return initialCode;
  };

  const [code, setCode] = useState(getInitialCode);
  const [activeTab, setActiveTab] = useState(codingExercise?.hasExercise ? 'instructions' : 'explanation');
  const [explanation, setExplanation] = useState('');
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [pendingTraceCode, setPendingTraceCode] = useState(null);
  const [assertionResults, setAssertionResults] = useState([]);
  const [verifyState, setVerifyState] = useState('idle'); // 'idle' | 'verifying' | 'success' | 'failed'
  const [traceError, setTraceError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (codingExercise?.hasExercise && codingExercise.starterCode) {
      setCode(codingExercise.starterCode);
    } else {
      setCode(initialCode);
    }
    setVerifyState('idle');
    setAssertionResults([]);
    setTraceError(null);
  }, [codingExercise, initialCode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, []);

  useEffect(() => {
    if (explanationOverride !== null) {
      setExplanation(explanationOverride);
    }
  }, [explanationOverride]);

  // Trace visualizer states
  const [traceData, setTraceData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1500); // 1500ms (1x), 1000ms (1.5x), 500ms (2x)
  const [selectedTutorAction, setSelectedTutorAction] = useState('default');
  const [vizZoom, setVizZoom] = useState(1); // zoom level for 2D visualizer
  const [vizViewMode, setVizViewMode] = useState('flowchart'); // 'flowchart' | 'memory' | 'both'

  const terminalElRef = useRef(null);
  const terminalInstanceRef = useRef(null);
  const fitAddonRef = useRef(null);
  const playIntervalRef = useRef(null);
  const editorViewRef = useRef(null);
  const editorPanelRef = useRef(null);
  // Stdin support refs
  const stdinLineRef = useRef('');
  const waitingForInputRef = useRef(false);
  const sendStdinRef = useRef(null);
  const [mainSplitPercent, setMainSplitPercent] = useState(50); // Left vs Right width percentage
  const [leftSplitPercent, setLeftSplitPercent] = useState(60); // Left Column: Editor height percentage
  const [rightSplitPercent, setRightSplitPercent] = useState(codingExercise?.hasExercise ? 58 : 100); // Right Column: Visualizer height percentage
  
  const isDraggingMainRef = useRef(false);
  const isDraggingLeftRef = useRef(false);
  const isDraggingRightRef = useRef(false);
  const containerRef = useRef(null); // Ref to the outer main split area container

  const handleMainMouseDown = (e) => {
    e.preventDefault();
    isDraggingMainRef.current = true;
    document.addEventListener('mousemove', handleMainMouseMove);
    document.addEventListener('mouseup', handleMainMouseUp);
  };

  const handleMainMouseMove = (e) => {
    if (!isDraggingMainRef.current) return;
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      let percent = ((e.clientX - rect.left) / rect.width) * 100;
      if (percent < 25) percent = 25;
      if (percent > 75) percent = 75;
      setMainSplitPercent(percent);
    }
  };

  const handleMainMouseUp = () => {
    isDraggingMainRef.current = false;
    document.removeEventListener('mousemove', handleMainMouseMove);
    document.removeEventListener('mouseup', handleMainMouseUp);
  };

  const handleLeftMouseDown = (e) => {
    e.preventDefault();
    isDraggingLeftRef.current = true;
    document.addEventListener('mousemove', handleLeftMouseMove);
    document.addEventListener('mouseup', handleLeftMouseUp);
  };

  const handleLeftMouseMove = (e) => {
    if (!isDraggingLeftRef.current) return;
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      let percent = ((e.clientY - rect.top) / rect.height) * 100;
      if (percent < 15) percent = 15;
      if (percent > 85) percent = 85;
      setLeftSplitPercent(percent);
    }
  };

  const handleLeftMouseUp = () => {
    isDraggingLeftRef.current = false;
    document.removeEventListener('mousemove', handleLeftMouseMove);
    document.removeEventListener('mouseup', handleLeftMouseUp);
  };

  const handleRightMouseDown = (e) => {
    e.preventDefault();
    isDraggingRightRef.current = true;
    document.addEventListener('mousemove', handleRightMouseMove);
    document.addEventListener('mouseup', handleRightMouseUp);
  };

  const handleRightMouseMove = (e) => {
    if (!isDraggingRightRef.current) return;
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      let percent = ((e.clientY - rect.top) / rect.height) * 100;
      if (percent < 15) percent = 15;
      if (percent > 100) percent = 100;
      setRightSplitPercent(percent);
    }
  };

  const handleRightMouseUp = () => {
    isDraggingRightRef.current = false;
    document.removeEventListener('mousemove', handleRightMouseMove);
    document.removeEventListener('mouseup', handleRightMouseUp);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      document.removeEventListener('mousemove', handleMainMouseMove);
      document.removeEventListener('mouseup', handleMainMouseUp);
      document.removeEventListener('mousemove', handleLeftMouseMove);
      document.removeEventListener('mouseup', handleLeftMouseUp);
      document.removeEventListener('mousemove', handleRightMouseMove);
      document.removeEventListener('mouseup', handleRightMouseUp);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Hook callbacks
  const onStdout = (text) => {
    if (text.includes("__TEST_RESULTS__:")) {
      const parts = text.split("__TEST_RESULTS__:");
      const jsonStr = parts[1];
      if (parts[0] && terminalInstanceRef.current) {
        terminalInstanceRef.current.write(parts[0]);
      }
      try {
        const results = JSON.parse(jsonStr.trim());
        setAssertionResults(results);
        const allPassed = results.length > 0 && results.every(r => r.passed);
        if (allPassed) {
          setVerifyState('success');
          if (onVerifySuccess) onVerifySuccess();
        } else {
          setVerifyState('failed');
        }
      } catch (e) {
        console.error("Failed to parse test results:", e);
      }
      return;
    }
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write(text);
    }
  };

  const onStderr = (text) => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write(`\x1b[31m${text}\x1b[0m`);
    }
  };

  const onReady = () => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write('\r\x1b[2K\x1b[32mEnvironment Ready!\x1b[0m\n');
    }
  };

  const onFinish = () => {
    // Reset stdin state when execution ends
    waitingForInputRef.current = false;
    stdinLineRef.current = '';
    if (verifyState === 'verifying' && assertionResults.length === 0) {
      setVerifyState('failed');
      setAssertionResults([{ expr: "Execution check", passed: false, msg: "Script completed but verification assertions failed or didn't run." }]);
    }
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write('\n\x1b[90m--- Program finished ---\x1b[0m\n');
    }
  };

  const onError = (msg) => {
    // Reset stdin state on error
    waitingForInputRef.current = false;
    stdinLineRef.current = '';
    setIsTracing(false);
    if (verifyState === 'verifying') {
      setVerifyState('failed');
      setAssertionResults([{ expr: "Execution check", passed: false, msg: msg }]);
    }
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write(`\x1b[31mError: ${msg}\x1b[0m\n`);
    }
    if (onTraceComplete) onTraceComplete(null);
  };

  // Called by the worker when Python's input() is waiting for user input
  const onStdinRequest = () => {
    waitingForInputRef.current = true;
    stdinLineRef.current = '';
    // Note: the prompt text already arrived via STDOUT before this fires.
    // Switch to cyan so the user's typed chars appear in a distinct color.
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.write('\x1b[96m');
    }
  };

  const validateTraceData = (trace) => {
    if (!trace || !Array.isArray(trace)) {
      return { valid: false, reason: "No execution trace was generated." };
    }
    if (trace.length > 500) {
      return { valid: false, reason: "Execution trace exceeds safety limits (> 500 steps). Infinite loop or heavy recursion detected." };
    }
    const lastStep = trace[trace.length - 1];
    if (lastStep && lastStep.error) {
      if (lastStep.error.includes("Trace limit exceeded")) {
        return { valid: false, reason: "Infinite loop safety limit exceeded. Pyodide execution tracing stopped to avoid freezing the browser." };
      }
    }
    return { valid: true };
  };

  const onTraceResult = (trace) => {
    const check = validateTraceData(trace);
    if (!check.valid) {
      setTraceError(check.reason);
      setTraceData(null);
      setIsTracing(false);
      if (onTraceComplete) onTraceComplete(null);
      return;
    }

    setTraceError(null);
    setTraceData(trace);
    setCurrentStep(0);
    setIsTracing(false);
    if (onTraceComplete) onTraceComplete(trace);
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

  // Keep sendStdin stable inside terminal's onKey closure
  useEffect(() => {
    sendStdinRef.current = sendStdin;
  }, [sendStdin]);

  // Trigger trace runner once Pyodide is ready and console execution is finished
  useEffect(() => {
    if (isReady && !isRunning && pendingTraceCode !== null) {
      const codeToTrace = pendingTraceCode;
      setPendingTraceCode(null);
      setIsTracing(true);
      setTraceError(null);
      runTrace(codeToTrace);
    }
  }, [isReady, isRunning, pendingTraceCode, runTrace]);

  // Handle parent code overrides
  useEffect(() => {
    if (codeOverride !== null) {
      handleCodeChange(codeOverride);
      setActiveTab('visualizer');
      setIsTracing(true);
      setTraceData(null);
      setTraceError(null);
      setPendingTraceCode(codeOverride);
    }
  }, [codeOverride]);

  // Auto-play interval
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

  // Highlight and scroll active code line into view in CodeMirror editor
  useEffect(() => {
    if (editorViewRef.current) {
      const view = editorViewRef.current;
      if (traceData && traceData[currentStep]) {
        const activeLine = traceData[currentStep].line;
        try {
          if (activeLine > 0 && activeLine <= view.state.doc.lines) {
            const line = view.state.doc.line(activeLine);
            view.dispatch({
              selection: { anchor: line.from, head: line.to },
              scrollIntoView: true
            });
          }
        } catch (e) {
          console.warn("Error highlighting line in CodeMirror:", e);
        }
      } else {
        // Clear active selection when trace is finished/stopped/cleared
        try {
          const pos = view.state.selection.main.head;
          view.dispatch({
            selection: { anchor: pos, head: pos }
          });
        } catch (e) { }
      }
    }
  }, [currentStep, traceData]);

  // Initialize terminal with layout safety delays
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!terminalElRef.current) return;
    const isUnmounted = { current: false };

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#090A0F', // matches dark premium theme
        foreground: '#E2E8F0',
        cursor: '#5B8CF8',
      },
      fontSize: 12.5,
      fontFamily: "'Zed Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Menlo, Monaco, Consolas, monospace",
      letterSpacing: 0,
      lineHeight: 1.25,
      convertEol: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Delay opening slightly to let CSS grid/flex layouts fully settle their dimensions
    const initTimer = setTimeout(() => {
      if (isUnmounted.current || !terminalElRef.current) return;
      try {
        term.open(terminalElRef.current);
        terminalInstanceRef.current = term;
        fitAddon.fit();
        if (isReady) {
          term.writeln("\x1b[32mEnvironment Ready! (Python 3.11 Pyodide)\x1b[0m");
        } else {
          term.writeln("\x1b[33mLoading Python Environment (Pyodide WASM)...\x1b[0m");
        }

        // --- Intercept keystrokes for interactive stdin (input() support) ---
        term.onKey(({ key, domEvent }) => {
          const kc = domEvent.keyCode;
          if (!waitingForInputRef.current) return;

          if (kc === 13) {
            // Enter — submit buffered line
            const line = stdinLineRef.current;
            stdinLineRef.current = '';
            waitingForInputRef.current = false;
            term.write('\x1b[0m\r\n'); // reset color, newline
            if (sendStdinRef.current) sendStdinRef.current(line);
          } else if (kc === 8 || kc === 127) {
            // Backspace
            if (stdinLineRef.current.length > 0) {
              stdinLineRef.current = stdinLineRef.current.slice(0, -1);
              term.write('\b \b');
            }
          } else if (key && key.length === 1) {
            // Printable character
            stdinLineRef.current += key;
            term.write(key);
          }
        });
      } catch (e) {
        console.warn("Failed to initialize xterm:", e);
      }
    }, 100);

    // Bulletproof terminal fitting using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (isUnmounted.current) return;
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && terminalInstanceRef.current) {
          try {
            fitAddon.fit();
          } catch (e) {
            // Ignore errors during CSS transition resizing
          }
        }
      }
    });

    if (terminalElRef.current) {
      resizeObserver.observe(terminalElRef.current);
    }

    return () => {
      isUnmounted.current = true;
      clearTimeout(initTimer);
      resizeObserver.disconnect();
      try {
        term.dispose();
      } catch (e) {
        // Ignore internal disposal errors
      }
      terminalInstanceRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  const generateExplanationForCode = async (codeText, actionType = 'default') => {
    if (!codeText || !codeText.trim()) return;
    setIsGeneratingExplanation(true);
    setExplanation('Generating response...');
    try {
      let systemPrompt = "You are an expert Python tutor. Explain the following Python code step-by-step. Keep your explanation concise, clear, and focused on how the code executes, data structures, and algorithms used. Do not include greetings. Use markdown.";
      let promptPrefix = "Please explain this Python code:\n";
      
      if (actionType === 'analyze') {
        systemPrompt = BUG_ANALYSIS_SYSTEM;
        promptPrefix = "Please analyze the bugs and time/space complexity of this Python code:\n";
      } else if (actionType === 'tips') {
        systemPrompt = BUG_TIPS_SYSTEM;
        promptPrefix = "Please provide hints and correction tips (without direct solution code) for this Python code:\n";
      } else if (actionType === 'fix') {
        systemPrompt = BUG_FIX_METHODS_SYSTEM;
        promptPrefix = "Please detail the fixing strategies and algorithms to resolve bugs in this Python code:\n";
      } else if (actionType === 'explain') {
        systemPrompt = FIX_EXPLANATION_SYSTEM;
        promptPrefix = "Please provide a theoretical explanation of how/why this Python code works:\n";
      } else if (actionType === 'help') {
        systemPrompt = SOCRATIC_HELP_SYSTEM;
        promptPrefix = "Please provide a Socratic guide helping me fix this Python code:\n";
      }

      const finalPrompt = `${promptPrefix}\`\`\`python\n${codeText}\n\`\`\``;

      let storedUserId = '';
      if (typeof window !== 'undefined') {
        storedUserId = localStorage.getItem('lms-user-id') || '';
      }

      const res = await fetch('/api/gemini/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: systemPrompt,
          user: finalPrompt,
          maxOutputTokens: 1500,
          userId: storedUserId
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate response');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      setExplanation('');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setExplanation(fullText);
      }
    } catch (e) {
      console.error(e);
      setExplanation('⚠️ Failed to generate tutor response for this code.');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleTabClick = (tab) => {
    if (activeTab === tab && rightSplitPercent < 100) {
      setRightSplitPercent(100);
    } else {
      setActiveTab(tab);
      if (rightSplitPercent > 85) {
        setRightSplitPercent(58);
      }
    }
  };

  const handleRun = () => {
    if (!isReady || isRunning) return;
    setVerifyState('idle');
    setAssertionResults([]);
    setActiveTab('console');
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
      terminalInstanceRef.current.writeln('\x1b[90mRunning script...\x1b[0m');
    }

    // Start generating AI explanation in the background
    generateExplanationForCode(code, selectedTutorAction);

    // Setup tracing visualizer state to loading
    setIsTracing(true);
    setTraceData(null);
    setTraceError(null);

    // Queue trace execution for when runCode finishes
    setPendingTraceCode(code);

    // Execute code in Console
    runCode(code);
  };

  const handleVerify = () => {
    if (!isReady || isRunning) return;
    setVerifyState('verifying');
    setAssertionResults([]);
    setActiveTab('console');
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
      terminalInstanceRef.current.writeln('\x1b[90mVerifying solution against assertions...\x1b[0m');
    }

    const testCases = codingExercise?.testCases || [];
    let validationCode = code + "\n\n";
    validationCode += "import json\n__results = []\n";
    for (const testCase of testCases) {
      validationCode += `
try:
    ${testCase}
    __results.append({"expr": ${JSON.stringify(testCase)}, "passed": True})
except AssertionError as e:
    __results.append({"expr": ${JSON.stringify(testCase)}, "passed": False, "msg": str(e) or "Assertion failed"})
except Exception as e:
    __results.append({"expr": ${JSON.stringify(testCase)}, "passed": False, "msg": f"Error: {str(e)}"})
`;
    }
    validationCode += '\nprint("__TEST_RESULTS__:" + json.dumps(__results))\n';

    runCode(validationCode);
  };

  const handleClear = () => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
    }
  };

  // Dynamic sorting and array execution animator
  const renderArrayVisualizer = (listKey, listVal, variables, prevVariables) => {
    // 1. Find pointer variables pointing to indices in this list
    const pointers = {};
    Object.entries(variables).forEach(([k, v]) => {
      if (typeof v === 'number' && v >= 0 && v < listVal.length && !k.startsWith('__') && k !== 'step_counter') {
        if (!pointers[v]) pointers[v] = [];
        pointers[v].push(k);
      }
    });

    // 2. Detect swaps/changes
    const prevListVal = prevVariables?.[listKey];
    let actionType = "STEP";
    let swapMessage = "";
    
    // Determine action type and message
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
      COMPARE: { text: '#5B8CF8', bg: 'rgba(91, 140, 248, 0.12)' },
      SWAP: { text: '#22C5A0', bg: 'rgba(34, 197, 160, 0.12)' },
      ASSIGN: { text: '#F5A95B', bg: 'rgba(245, 169, 91, 0.12)' },
      STEP: { text: '#8892B0', bg: 'rgba(255, 255, 255, 0.05)' }
    };
    const actionStyle = actionColors[actionType] || actionColors.STEP;

    // Draw compare-swap linker line if 2 active indices
    const activeIndices = Object.keys(pointers).map(Number).sort((a, b) => a - b);
    let linkerLine = null;
    if (activeIndices.length >= 2) {
      const idx1 = activeIndices[0];
      const idx2 = activeIndices[activeIndices.length - 1];
      const cellWidth = 42;
      const gap = 10;
      const stepWidth = cellWidth + gap; // 52px
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
      <div style={inlineStyles.s0}>
        {/* Dynamic Action Status Header */}
        <div style={inlineStyles.s1}>
          <div style={inlineStyles.s2}>
            <span style={inlineStyles.s3}>
              Visual Execution ({listKey})
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

        {/* Array Pill Track */}
        <div style={featureStyleFunctions.s5({listVal})} className="no-scrollbar">
          <div style={inlineStyles.s4}>
            {linkerLine}
            {listVal.map((item, idx) => {
              const activePointers = pointers[idx] || [];
              const isPointed = activePointers.length > 0;
              const wasChanged = prevListVal !== undefined && prevListVal[idx] !== item;

              let pillBg = '#131824';
              let pillBorder = '1px solid rgba(91, 140, 248, 0.15)';
              let textColor = '#8892B0';

              if (isPointed) {
                pillBg = actionType === 'SWAP' ? 'rgba(245, 169, 91, 0.12)' : 'rgba(34, 197, 160, 0.12)';
                pillBorder = actionType === 'SWAP' ? '1px solid #F5A95B' : '1px solid #22C5A0';
                textColor = actionType === 'SWAP' ? '#F5A95B' : '#22C5A0';
              } else if (wasChanged) {
                pillBg = 'rgba(245, 169, 91, 0.12)';
                pillBorder = '1px solid #F5A95B';
                textColor = '#F5A95B';
              }

              return (
                <div key={idx} style={inlineStyles.s5}>
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={featureStyleFunctions.s6({pillBg,pillBorder,textColor,isPointed,actionType})}
                  >
                    {String(item)}
                  </motion.div>

                  <div style={inlineStyles.s6}>
                    [{idx}]
                  </div>

                  {isPointed && (
                    <div style={inlineStyles.s7}>
                      <div style={featureStyleFunctions.s7({textColor})} />
                      <div style={featureStyleFunctions.s8({textColor})}>
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

  const getTraceStepDetails = () => {
    if (!traceData || !traceData[currentStep]) return null;
    const { variables = {}, error, line, stdout = "" } = traceData[currentStep];
    const keys = Object.keys(variables);
    const prevStep = currentStep > 0 ? traceData[currentStep - 1] : null;
    const prevVariables = prevStep ? prevStep.variables : {};

    const listKey = keys.find(k => Array.isArray(variables[k]) && !k.startsWith('__'));
    const listVal = listKey ? variables[listKey] : [];
    
    // Find pointer variables pointing to indices in this list
    const pointers = {};
    if (listKey) {
      Object.entries(variables).forEach(([k, v]) => {
        if (typeof v === 'number' && v >= 0 && v < listVal.length && !k.startsWith('__') && k !== 'step_counter') {
          if (!pointers[v]) pointers[v] = [];
          pointers[v].push(k);
        }
      });
    }

    const prevListVal = prevVariables[listKey];
    let actionType = "STEP";
    let swapMessage = "";
    
    const changedIndices = [];
    if (listKey && prevListVal && JSON.stringify(prevListVal) !== JSON.stringify(listVal)) {
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
    } else if (listKey) {
      const activePointers = Object.entries(pointers).flatMap(([idx, names]) => names);
      if (activePointers.length >= 2) {
        actionType = "COMPARE";
        swapMessage = `Compare ${activePointers.join(' ↔ ')}`;
      }
    }

    const scalarKeys = keys.filter(k => {
      const val = variables[k];
      return !Array.isArray(val) && (typeof val !== 'object' || val === null);
    });

    const dictKeys = keys.filter(k => {
      const val = variables[k];
      return typeof val === 'object' && val !== null && !Array.isArray(val);
    });

    // Active line info
    const lines = code.split('\n');
    const activeLineText = lines[line - 1]?.trim() || '';
    
    let lineActionType = "EXECUTE";
    if (activeLineText.startsWith('for ') || activeLineText.startsWith('while ')) {
      lineActionType = "LOOP EVALUATION";
    } else if (activeLineText.startsWith('if ') || activeLineText.startsWith('elif ') || activeLineText.startsWith('else:')) {
      lineActionType = "BRANCH DECISION";
    } else if (activeLineText.includes('print(')) {
      lineActionType = "PRINT OUTPUT";
    } else if (activeLineText.includes('=')) {
      lineActionType = "VARIABLE ASSIGN";
    } else if (activeLineText.startsWith('def ')) {
      lineActionType = "FUNCTION DECLARE";
    } else if (activeLineText.startsWith('return ')) {
      lineActionType = "FUNCTION RETURN";
    }

    return {
      variables,
      error,
      line,
      stdout,
      listKey,
      listVal,
      scalarKeys,
      dictKeys,
      actionType,
      swapMessage,
      activeLineText,
      lineActionType
    };
  };

  // 3D visualizer removed — 2D only


  // Variable visualizer renderer
  const renderVariables = () => {
    if (!traceData || !traceData[currentStep]) return null;
    const { variables = {}, error, line, stdout = "" } = traceData[currentStep];
    
    if (error) {
      return (
        <div style={inlineStyles.s8}>
          <strong style={inlineStyles.s9}>⚠️ Python Runtime Error</strong>
          <span style={inlineStyles.s10}>{error}</span>
        </div>
      );
    }

    const keys = Object.keys(variables);
    const prevStep = currentStep > 0 ? traceData[currentStep - 1] : null;

    // 1. Current Code Line Inspector
    const lines = code.split('\n');
    const activeLineText = lines[line - 1]?.trim() || '';
    
    let lineActionType = "EXECUTE";
    if (activeLineText.startsWith('for ') || activeLineText.startsWith('while ')) {
      lineActionType = "LOOP EVALUATION";
    } else if (activeLineText.startsWith('if ') || activeLineText.startsWith('elif ') || activeLineText.startsWith('else:')) {
      lineActionType = "BRANCH DECISION";
    } else if (activeLineText.includes('print(')) {
      lineActionType = "PRINT OUTPUT";
    } else if (activeLineText.includes('=')) {
      lineActionType = "VARIABLE ASSIGN";
    } else if (activeLineText.startsWith('def ')) {
      lineActionType = "FUNCTION DECLARE";
    } else if (activeLineText.startsWith('return ')) {
      lineActionType = "FUNCTION RETURN";
    }

    const lineInspector = activeLineText ? (
      <div style={inlineStyles.s11}>
        <div style={inlineStyles.s12}>
          <span style={inlineStyles.s13}>Active Line {line}</span>
          <span style={inlineStyles.s14}>{lineActionType}</span>
        </div>
        <div style={inlineStyles.s15}>
          {activeLineText}
        </div>
      </div>
    ) : null;

    // Detect if we have a list to visualize
    const listKey = keys.find(k => Array.isArray(variables[k]) && !k.startsWith('__'));

    // Separate lists and scalars
    const scalarKeys = keys.filter(k => {
      const val = variables[k];
      return !Array.isArray(val) && (typeof val !== 'object' || val === null);
    });

    const dictKeys = keys.filter(k => {
      const val = variables[k];
      return typeof val === 'object' && val !== null && !Array.isArray(val);
    });

    return (
      <div style={inlineStyles.s16}>
        {/* Active Line Code Block */}
        {lineInspector}

        {/* Array execution animator (if array exists) */}
        {listKey && renderArrayVisualizer(listKey, variables[listKey], variables, prevStep?.variables)}

        {/* Memory Stack Variable Grid (Scalar Values) */}
        {scalarKeys.length > 0 && (
          <div style={inlineStyles.s17}>
            <div style={inlineStyles.s18}>
              STACK MEMORY REGISTER
            </div>
            <div style={inlineStyles.s19}>
              {scalarKeys.map((key) => {
                const val = variables[key];
                const prevVal = prevStep ? prevStep.variables?.[key] : undefined;
                const isChanged = prevVal !== undefined && JSON.stringify(prevVal) !== JSON.stringify(val);
                const valType = typeof val;
                
                const borderStyle = isChanged ? '1px solid rgba(245, 169, 91, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)';
                const shadowStyle = isChanged ? '0 0 10px rgba(245, 169, 91, 0.1)' : 'none';
                const valColor = isChanged ? '#F5A95B' : (valType === 'boolean' ? '#22C5A0' : (valType === 'number' ? '#5B8CF8' : '#F5A95B'));

                return (
                  <motion.div
                    key={key}
                    layout
                    className="variable-card"
                    style={featureStyleFunctions.s9({borderStyle,shadowStyle})}
                  >
                    <div style={inlineStyles.s20}>
                      <span style={inlineStyles.s21}>
                        {key}
                        <span style={featureStyleFunctions.s10({valType})}>
                          {valType}
                        </span>
                      </span>
                    </div>

                    {/* Value slot with vertical shifting AnimatePresence animation */}
                    <div style={featureStyleFunctions.s11({isChanged})}>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={JSON.stringify(val)} // key triggers AnimatePresence on update
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                          style={featureStyleFunctions.s12({valColor})}
                        >
                          {String(val)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dicts Visualizer */}
        {dictKeys.map((key) => {
          const val = variables[key];
          const prevVal = prevStep ? prevStep.variables?.[key] : undefined;
          const isChanged = prevVal !== undefined && JSON.stringify(prevVal) !== JSON.stringify(val);
          const borderStyle = isChanged ? '1px solid rgba(245, 169, 91, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)';
          const shadowStyle = isChanged ? '0 0 12px rgba(245, 169, 91, 0.15)' : 'none';

          return (
            <motion.div
              key={key}
              layout
              animate={{ scale: isChanged ? [1, 1.03, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="variable-card"
              style={featureStyleFunctions.s13({borderStyle,shadowStyle})}
            >
              <div style={inlineStyles.s22}>
                <div style={inlineStyles.s23}>{key} (Dict)</div>
                {isChanged && <span style={inlineStyles.s24}>Modified</span>}
              </div>
              <div style={inlineStyles.s25}>
                {Object.entries(val).map(([k, v]) => {
                  const prevSubVal = prevVal && typeof prevVal === 'object' ? prevVal[k] : undefined;
                  const isSubValChanged = prevSubVal !== undefined && prevSubVal !== v;
                  return (
                    <div key={k} style={featureStyleFunctions.s14({})}>
                      <span style={inlineStyles.s26}>{k}</span>
                      <motion.span
                        animate={{ color: isSubValChanged ? '#F5A95B' : '#DDE3F2' }}
                        style={inlineStyles.s27}
                      >
                        {String(v)}
                      </motion.span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Stdout Console output */}
        {stdout && (
          <div style={inlineStyles.s28}>
            <div style={inlineStyles.s29}>
              <span style={inlineStyles.s30}>OUTPUT STREAM CONSOLE</span>
              <div style={inlineStyles.s31}>
                <div style={inlineStyles.s32} />
                <div style={inlineStyles.s33} />
                <div style={inlineStyles.s34} />
              </div>
            </div>
            <div style={inlineStyles.s35} className="no-scrollbar">
              {stdout.split('\n').filter(l => l.length > 0).map((line, li) => (
                <motion.div
                  key={li}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  style={inlineStyles.s36}
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  
return {getInitialCode,code,setCode,activeTab,setActiveTab,explanation,setExplanation,isGeneratingExplanation,setIsGeneratingExplanation,pendingTraceCode,setPendingTraceCode,assertionResults,setAssertionResults,verifyState,setVerifyState,traceError,setTraceError,isMobile,setIsMobile,handleCodeChange,traceData,setTraceData,currentStep,setCurrentStep,isPlaying,setIsPlaying,isTracing,setIsTracing,playSpeed,setPlaySpeed,selectedTutorAction,setSelectedTutorAction,vizZoom,setVizZoom,vizViewMode,setVizViewMode,terminalElRef,terminalInstanceRef,fitAddonRef,playIntervalRef,editorViewRef,editorPanelRef,stdinLineRef,waitingForInputRef,sendStdinRef,mainSplitPercent,setMainSplitPercent,leftSplitPercent,setLeftSplitPercent,rightSplitPercent,setRightSplitPercent,isDraggingMainRef,isDraggingLeftRef,isDraggingRightRef,containerRef,handleMainMouseDown,handleMainMouseMove,handleMainMouseUp,handleLeftMouseDown,handleLeftMouseMove,handleLeftMouseUp,handleRightMouseDown,handleRightMouseMove,handleRightMouseUp,onStdout,onStderr,onReady,onFinish,onError,onStdinRequest,validateTraceData,onTraceResult,isReady,isRunning,runCode,runTrace,stopCode,sendStdin,generateExplanationForCode,handleTabClick,handleRun,handleVerify,handleClear,renderArrayVisualizer,getTraceStepDetails,renderVariables};
}
