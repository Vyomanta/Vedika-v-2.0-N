'use client';

import inlineStyles from '@/features/labs/styles/MathLab.styles';
import React, { useState, useEffect, useRef, Component } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  Calculator, Edit3, Eraser, Trash2, RotateCcw, Play, Sparkles,
  Sliders, Activity, HelpCircle, Compass, Zap, Lightbulb, ChevronRight, ChevronDown, X,
  TrendingUp, Circle, Triangle, Layers, ZoomIn, ZoomOut, RefreshCw, Send, Image as ImageIcon,
  Crop, Mic, MicOff, Square, CheckCircle2, Award, Box, Volume2,
  Maximize2, Minimize2, PenLine, LineChart, ArrowLeft
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { getMascotBridge } from '@/lib/mascotBridge';
import MathEquationRenderer from '@/components/labs/MathEquationRenderer';
import DynamicMathVisualizer from '@/components/labs/DynamicMathVisualizer';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import '@/features/labs/styles/MathLab.css';
import {preprocessLaTeX,calcGcd,parseMathEquation,SafeMathRenderer,CustomMathMarkdown} from '@/features/labs/components/features-labs-components-MathLab.support.jsx';

export function useMathLabModel() {

  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isTablet = useMediaQuery(isTabletMQ);
  const isStacked = isMobile;
  const [activeTab, setActiveTab] = useState('whiteboard');
  const [visualizerSubTab, setVisualizerSubTab] = useState('pythagoras');

  // Whiteboard State
  const canvasRef = useRef(null);
  const cropStartRef = useRef({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawTool, setDrawTool] = useState('pen');
  const [penColor, setPenColor] = useState('#FFFFFF');
  const [penWidth, setPenWidth] = useState(4);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 0, h: 0, isSelecting: false, isSelected: false });
  const [isWhiteboardExpanded, setIsWhiteboardExpanded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 390 });
  const [graphCanvasSize, setGraphCanvasSize] = useState({ w: 600, h: 300 });
  const [showVisualConcepts, setShowVisualConcepts] = useState(false);
  const [showOcrCard, setShowOcrCard] = useState(true);

  // Equation State
  const [equationText, setEquationText] = useState('y = x + 1');
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  // Graph State
  const [paramA, setParamA] = useState(1);
  const [paramB, setParamB] = useState(0);
  const [paramC, setParamC] = useState(1);
  const [paramD, setParamD] = useState(0);
  const [plotMode, setPlotMode] = useState('linear');
  const graphCanvasRef = useRef(null);
  const [zoomScale, setZoomScale] = useState(30);
  const [hoverCoord, setHoverCoord] = useState(null);

  // AI Tutor & Continuous Voice State
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTutorThinking, setIsTutorThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [parsedVisualSpec, setParsedVisualSpec] = useState(null);
  const recognitionRef = useRef(null);
  const tutorResponseRef = useRef(null);

  // Visualizer Parameters
  const [pythA, setPythA] = useState(6);
  const [pythB, setPythB] = useState(8);
  const [trigAngle, setTrigAngle] = useState(45);
  const [calcX0, setCalcX0] = useState(1.5);
  const [calcFunc, setCalcFunc] = useState('quadratic');
  const [vecU, setVecU] = useState({ x: 4, y: 3 });
  const [vecV, setVecV] = useState({ x: -2, y: 5 });

  // Auto-scroll to AI solution response when it arrives
  useEffect(() => {
    if (tutorResponse && tutorResponseRef.current) {
      tutorResponseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [tutorResponse]);

  // URL Query Parameters & Mascot Bridge Controller
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyQueryParams = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      const subtab = params.get('subtab') || params.get('vis') || params.get('experiment');
      const mode = params.get('mode');
      const eq = params.get('eq') || params.get('equation');

      if (tab) {
        if (['whiteboard', 'graph', 'visualizer'].includes(tab.toLowerCase())) {
          setActiveTab(tab.toLowerCase() === 'visualizer' ? 'graph' : tab.toLowerCase());
        }
      }
      if (subtab) {
        const validSubtabs = [
          'pythagoras', 'sector', 'solid', 'cone', 'sphere', 'composite',
          'elevation', 'coordgeo', 'parabola', 'trapezoid', 'venn', 'bellcurve',
          'vectors', 'tangent', 'inequality', 'trig', 'calculus', 'angles'
        ];
        if (validSubtabs.includes(subtab.toLowerCase())) {
          setActiveTab('graph');
          setVisualizerSubTab(subtab.toLowerCase());
        }
      }
      if (mode) {
        const validModes = ['linear', 'quadratic', 'polynomial', 'trig', 'exponential'];
        if (validModes.includes(mode.toLowerCase())) {
          setActiveTab('graph');
          setPlotMode(mode.toLowerCase());
        }
      }
      if (eq) {
        setEquationText(decodeURIComponent(eq));
      }
    };

    applyQueryParams();

    // Listen for real-time remote commands from Desktop Mascot
    const bridge = getMascotBridge();
    const unsubscribe = bridge.subscribe((msg) => {
      if (msg.type === 'PET_ACTION_REQUESTED' && msg.payload) {
        const { action, target } = msg.payload;
        if (action === 'select_tab') {
          if (['whiteboard', 'graph', 'visualizer'].includes(target?.toLowerCase())) {
            setActiveTab(target.toLowerCase() === 'visualizer' ? 'graph' : target.toLowerCase());
          }
        } else if (action === 'select_visualizer' || action === 'select_experiment') {
          const sub = target?.toLowerCase();
          const validSubtabs = [
            'pythagoras', 'sector', 'solid', 'cone', 'sphere', 'composite',
            'elevation', 'coordgeo', 'parabola', 'trapezoid', 'venn', 'bellcurve',
            'vectors', 'tangent', 'inequality', 'trig', 'calculus', 'angles'
          ];
          if (validSubtabs.includes(sub)) {
            setActiveTab('graph');
            setVisualizerSubTab(sub);
          }
        } else if (action === 'select_plot_mode') {
          const m = target?.toLowerCase();
          const validModes = ['linear', 'quadratic', 'polynomial', 'trig', 'exponential'];
          if (validModes.includes(m)) {
            setActiveTab('graph');
            setPlotMode(m);
          }
        }
      } else if (msg.type === 'NAVIGATE_WEBAPP' && msg.payload?.route) {
        const r = msg.payload.route;
        if (r.includes('?')) {
          const params = new URLSearchParams(r.split('?')[1]);
          const tab = params.get('tab');
          const subtab = params.get('subtab') || params.get('vis') || params.get('experiment');
          const mode = params.get('mode');
          if (tab && ['whiteboard', 'graph', 'visualizer'].includes(tab.toLowerCase())) {
            setActiveTab(tab.toLowerCase() === 'visualizer' ? 'graph' : tab.toLowerCase());
          }
          const validSubtabs = [
            'pythagoras', 'sector', 'solid', 'cone', 'sphere', 'composite',
            'elevation', 'coordgeo', 'parabola', 'trapezoid', 'venn', 'bellcurve',
            'vectors', 'tangent', 'inequality', 'trig', 'calculus', 'angles'
          ];
          if (subtab && validSubtabs.includes(subtab.toLowerCase())) {
            setActiveTab('graph');
            setVisualizerSubTab(subtab.toLowerCase());
          }
          if (mode && ['linear', 'quadratic', 'polynomial', 'trig', 'exponential'].includes(mode.toLowerCase())) {
            setActiveTab('graph');
            setPlotMode(mode.toLowerCase());
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync active math tab to Desktop Mascot
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bridge = getMascotBridge();
    bridge.sendActivityUpdate('math_tutor', {
      tab: activeTab,
      visualizerSubTab: visualizerSubTab,
      plotMode: plotMode
    });
    return () => {
      bridge.sendActivityUpdate('browsing', { page: window.location.pathname });
    };
  }, [activeTab, visualizerSubTab, plotMode]);

  // ----------------------------------------------------
  // RESPONSIVE RESIZE FOR DESKTOP FULL-SCREEN CANVAS
  // ----------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        if (canvasRef.current && canvasRef.current.parentElement) {
          const rect = canvasRef.current.parentElement.getBoundingClientRect();
          if (rect.width > 150 && rect.height > 150) {
            const newW = Math.round(rect.width);
            const newH = Math.round(rect.height);
            setCanvasSize(prev => (prev.w !== newW || prev.h !== newH ? { w: newW, h: newH } : prev));
          }
        }
        if (graphCanvasRef.current && graphCanvasRef.current.parentElement) {
          const gRect = graphCanvasRef.current.parentElement.getBoundingClientRect();
          if (gRect.width > 150 && gRect.height > 150) {
            const newGW = Math.round(gRect.width);
            const newGH = Math.round(gRect.height);
            setGraphCanvasSize(prev => (prev.w !== newGW || prev.h !== newGH ? { w: newGW, h: newGH } : prev));
          }
        }
      } else {
        const mobH = isWhiteboardExpanded ? 540 : 390;
        setCanvasSize(prev => (prev.w !== 600 || prev.h !== mobH ? { w: 600, h: mobH } : prev));
        setGraphCanvasSize(prev => (prev.w !== 600 || prev.h !== 300 ? { w: 600, h: 300 } : prev));
      }
    };

    handleResize();
    const raf = requestAnimationFrame(handleResize);
    const timer = setTimeout(handleResize, 150);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab, isWhiteboardExpanded]);

  // ----------------------------------------------------
  // WHITEBOARD & CROPPING
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== 'whiteboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!hasDrawn) clearWhiteboard();
  }, [activeTab]);

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setRecognizedText('');
    setAiExplanation('');
    setShowOcrCard(false);
    setCropBox({ x: 0, y: 0, w: 0, h: 0, isSelecting: false, isSelected: false });
  };

  const clearCropSelection = () => {
    setCropBox({ x: 0, y: 0, w: 0, h: 0, isSelecting: false, isSelected: false });
  };

  const switchTool = (tool) => {
    setDrawTool(tool);
    if (tool !== 'select') clearCropSelection();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    setIsDrawing(true);

    if (drawTool === 'select') {
      cropStartRef.current = { x: coords.x, y: coords.y };
      setCropBox({ x: coords.x, y: coords.y, w: 0, h: 0, isSelecting: true, isSelected: false });
    } else {
      clearCropSelection();
      setHasDrawn(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (drawTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = penWidth * 5;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (drawTool === 'select' && cropBox.isSelecting) {
      const x = Math.min(cropStartRef.current.x, coords.x);
      const y = Math.min(cropStartRef.current.y, coords.y);
      const w = Math.abs(coords.x - cropStartRef.current.x);
      const h = Math.abs(coords.y - cropStartRef.current.y);
      setCropBox({ x, y, w, h, isSelecting: true, isSelected: false });
    } else {
      if (drawTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = penWidth * 5;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (isDrawing) {
      setIsDrawing(false);
      if (drawTool === 'select' && cropBox.isSelecting) {
        if (cropBox.w > 10 && cropBox.h > 10) {
          setCropBox(prev => ({ ...prev, isSelecting: false, isSelected: true }));
        } else {
          clearCropSelection();
        }
      }
    }
  };

  const handleRecognizeCanvas = async (cropOnly = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecognizing(true);
    setAiExplanation('');

    try {
      let dataUrl = '';
      if (cropOnly && cropBox.isSelected && cropBox.w > 5 && cropBox.h > 5) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = cropBox.w;
        offCanvas.height = cropBox.h;
        const offCtx = offCanvas.getContext('2d');
        offCtx.fillStyle = '#070B16';
        offCtx.fillRect(0, 0, cropBox.w, cropBox.h);
        offCtx.drawImage(canvas, cropBox.x, cropBox.y, cropBox.w, cropBox.h, 0, 0, cropBox.w, cropBox.h);
        dataUrl = offCanvas.toDataURL('image/png');
      } else {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.fillStyle = '#070B16';
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
        offCtx.drawImage(canvas, 0, 0);
        dataUrl = offCanvas.toDataURL('image/png');
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: `Analyze this handwritten math equation image carefully.
Identify the exact equation written on the whiteboard (e.g. x = y + 4, y = 2x - 3, y = x^2 - 4, y = sin(x)).
Express it in standard Cartesian form solved for y: y = f(x).

Respond ONLY with valid JSON in this exact structure:
{
  "equation": "<original_detected_equation, e.g. x = y + 4>",
  "canonical": "<solved_for_y_equation, e.g. y = x - 4>",
  "mode": "linear" | "quadratic" | "sine",
  "params": {
    "a": <number, slope or leading coefficient, e.g. 1>,
    "b": <number, frequency or linear coeff, default 0>,
    "c": <number, y-intercept or constant, e.g. -4>,
    "d": <number, vertical offset, default 0>
  },
  "explanation": "<short explanation, e.g. Detected handwritten equation x = y + 4. Solved for y: y = x - 4 (slope m = 1, y-intercept c = -4).>"
}`,
          image: dataUrl
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let resData = {};
      if (contentType.includes('application/json')) {
        resData = await response.json();
      } else {
        setAiExplanation("OCR Server initializing. Please try again.");
        return;
      }

      if (resData.error) {
        setAiExplanation("AI Engine Error: " + resData.error);
        return;
      }

      let rawText = resData.text || '';

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          const parsedResult = parseMathEquation(parsed.equation || parsed.canonical, parsed.mode, parsed.params, parsed.canonical);

          setPlotMode(parsedResult.mode);
          setParamA(parsedResult.a);
          setParamB(parsedResult.b);
          setParamC(parsedResult.c);
          setParamD(parsedResult.d);
          setEquationText(parsedResult.eqText);
          setRecognizedText(parsed.equation || parsedResult.rawEq || parsedResult.eqText);
          setAiExplanation(parsed.explanation || `Detected: ${parsed.equation || parsedResult.rawEq} ➔ Plotted: ${parsedResult.eqText}`);
        } catch (err) {
          const parsedResult = parseMathEquation(rawText);
          setPlotMode(parsedResult.mode);
          setParamA(parsedResult.a);
          setParamB(parsedResult.b);
          setParamC(parsedResult.c);
          setParamD(parsedResult.d);
          setEquationText(parsedResult.eqText);
          setRecognizedText(parsedResult.rawEq || parsedResult.eqText);
          setAiExplanation(`Recognized: ${parsedResult.rawEq} ➔ Plotted: ${parsedResult.eqText}`);
        }
      } else {
        const parsedResult = parseMathEquation(rawText);
        setPlotMode(parsedResult.mode);
        setParamA(parsedResult.a);
        setParamB(parsedResult.b);
        setParamC(parsedResult.c);
        setParamD(parsedResult.d);
        setEquationText(parsedResult.eqText);
        setRecognizedText(parsedResult.rawEq || parsedResult.eqText);
        setAiExplanation(rawText.slice(0, 150) || `Detected ${parsedResult.eqText}`);
      }
    } catch (error) {
      console.error("Recognition error:", error);
      setAiExplanation("Recognition error: " + (error.message || "Failed to analyze selection"));
    } finally {
      setIsRecognizing(false);
      setShowOcrCard(true);
      clearCropSelection();
      setDrawTool('pen');
    }
  };

  // ----------------------------------------------------
  // CONTINUOUS SPEECH-TO-TEXT VOICE INPUT
  // ----------------------------------------------------
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setTutorQuery(transcript);
          }
        };
        recognition.onerror = (e) => {
          console.warn("Speech notice:", e.error);
          if (e.error === 'not-allowed') {
            alert("Microphone permission denied. Please allow microphone access in browser address bar.");
            setIsListening(false);
          }
        };
        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch(err) {
        console.error("Speech error:", err);
        setIsListening(false);
      }
    }
  };

  // ----------------------------------------------------
  // 2D GRAPH PLOTTER ENGINE
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    ctx.fillStyle = '#07080F';
    ctx.fillRect(0, 0, width, height);

    // Gridlines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;

    for (let x = originX % zoomScale; x < width; x += zoomScale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = originY % zoomScale; y < height; y += zoomScale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Ticks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '10px sans-serif';
    for (let u = -10; u <= 10; u += 2) {
      if (u === 0) continue;
      const px = originX + u * zoomScale;
      const py = originY - u * zoomScale;
      if (px > 0 && px < width) ctx.fillText(`${u}`, px - 4, originY + 14);
      if (py > 0 && py < height) ctx.fillText(`${u}`, originX + 6, py + 4);
    }

    const evaluateY = (x) => {
      const a = paramA, b = paramB, c = paramC, d = paramD;
      switch (plotMode) {
        case 'linear':
          return a * x + c;
        case 'quadratic':
          return a * x * x + b * x + c + d;
        case 'sine':
          return a * Math.sin(b * x + c) + d;
        case 'cubic':
          return a * Math.pow(x, 3) + b * x * x + c * x + d;
        default:
          return a * x + c;
      }
    };

    // Plot Curve
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    let isFirst = true;

    if (plotMode === 'vertical') {
      const px = originX + paramC * zoomScale;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      // Highlight X-intercept for vertical line
      if (px >= 0 && px <= width) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(px, originY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`(${paramC}, 0)`, px + 8, originY - 6);
      }
    } else {
      for (let px = 0; px < width; px += 2) {
        const mathX = (px - originX) / zoomScale;
        const mathY = evaluateY(mathX);
        const py = originY - mathY * zoomScale;

        if (py >= -100 && py <= height + 100) {
          if (isFirst) {
            ctx.moveTo(px, py);
            isFirst = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          isFirst = true;
        }
      }
      ctx.stroke();

      // Highlight Y-intercept
      const yInt = evaluateY(0);
      const pyInt = originY - yInt * zoomScale;
      if (pyInt >= 0 && pyInt <= height) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(originX, pyInt, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`(0, ${yInt.toFixed(1)})`, originX + 8, pyInt - 6);
      }

      // Highlight X-intercept for linear curves
      if (plotMode === 'linear' && paramA !== 0) {
        const xInt = -paramC / paramA;
        const pxInt = originX + xInt * zoomScale;
        if (pxInt >= 0 && pxInt <= width && Math.abs(xInt) > 0.05) {
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(pxInt, originY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`(${xInt.toFixed(1)}, 0)`, pxInt + 8, originY + 14);
        }
      }
    }

  }, [zoomScale, paramA, paramB, paramC, paramD, plotMode, hoverCoord, graphCanvasSize.w, graphCanvasSize.h, activeTab]);

  const handleGraphMouseMove = (e) => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    const mathX = (px - originX) / zoomScale;
    const mathY = plotMode === 'linear' ? paramA * mathX + paramC : paramA * mathX * mathX + paramC;
    setHoverCoord({ x: mathX, y: mathY });
  };

  // ----------------------------------------------------
  // AI MATH TUTOR & DYNAMIC VISUALIZER PARSER
  // ----------------------------------------------------
  const handleAskTutor = async (promptQuery) => {
    const q = promptQuery || tutorQuery;
    if (!q.trim()) return;

    setIsTutorThinking(true);
    setTutorResponse('');
    setParsedVisualSpec(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are Vedika Math AI, an expert math tutor. Format your explanations with crystal-clear mathematical rigor and beautiful presentation:

1. Mathematical Notation:
- ALWAYS use standard LaTeX math syntax for ALL formulas, equations, variables, and calculations.
- For standalone equations and multi-line derivations, ALWAYS use display math $$...$$ on their own lines (e.g. $$A_{\\text{total}} = 2\\pi r h + 2\\pi r^2$$).
- For inline symbols, variables, numbers with units, and expressions, ALWAYS use inline math $...$ (e.g. $r = 7\\text{ cm}$, $h = 10\\text{ cm}$, $\\pi \\approx \\frac{22}{7}$).
- Use \\times for multiplication (NEVER bare * or x).
- Use \\frac{numerator}{denominator} for fractions.
- NEVER output bare LaTeX commands (like \\pi, \\times, \\text) without wrapping them in $...$ or $$...$$.

2. Structure Your Response:
- ### Given & Required: State values with units as inline LaTeX.
- ### Formulas Used: Display the key formulas.
- ### Step-by-Step Solution: Clear numbered steps (e.g., Step 1: ..., Step 2: ...).
- ### Final Answer: Put the final answer inside $$\\boxed{\\text{Answer: } ...}$$.

3. Visual Diagram Generation:
ALWAYS append a \`\`\`json block at the VERY END containing a visualSpec JSON object.
Select the single best-matching "type" from the 18 mathematical visualizer categories below, and populate its numeric parameters according to the question values:

1. "angles" | "supplementary_angles" | "complementary_angles":
   params: {"angle1": number, "angle2": number, "totalAngle": 90 | 180}
2. "triangle" | "pythagoras":
   params: {"base": number, "height": number}
3. "sector":
   params: {"radius": number, "angle": number}
4. "solid_surface" | "cylinder":
   params: {"radius": number, "height": number}
5. "cone":
   params: {"radius": number, "height": number}
6. "sphere_hemisphere":
   params: {"radius": number, "mode": "sphere" | "hemisphere"}
7. "composite_solid":
   params: {"radius": number, "height": number}
8. "elevation_depression" | "heights_distances":
   params: {"distance": number, "angle": number}
9. "coordinate_geometry":
   params: {"x1": number, "y1": number, "x2": number, "y2": number, "m": number, "n": number}
10. "quadratic_parabola":
   params: {"a": number, "b": number, "c": number}
11. "trapezoid":
   params: {"a": number, "b": number, "h": number}
12. "venn_diagram":
   params: {"onlyA": number, "onlyB": number, "both": number, "total": number}
13. "bell_curve":
   params: {"mean": number, "sd": number}
14. "vector_addition":
   params: {"magA": number, "magB": number, "angle": number}
15. "tangent_derivative":
   params: {"x0": number}
16. "number_line_inequality":
   params: {"min": number, "max": number, "leftInclusive": boolean, "rightInclusive": boolean}
17. "circle":
   params: {"radius": number}
18. "area_under_curve":
   params: {"a": number, "b": number, "func": "x^2" | "2x+1"}

Example:
\`\`\`json
{
  "type": "elevation_depression",
  "title": "Heights & Distances (Tower Elevation)",
  "params": {"distance": 50, "angle": 30}
}
\`\`\``,
          user: `Solve and explain this mathematical equation or question step-by-step:\n"${q}"`
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn("Server HTML notice:", text.slice(0, 150));
        setTutorResponse("AI Service is initializing. Please click Solve again.");
        return;
      }

      if (data.error) {
        setTutorResponse(`AI Engine Notice: ${data.error}`);
        return;
      }

      const rawText = data.text || 'Unable to generate response.';

      let specObj = null;
      const jsonMatch = rawText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
      if (jsonMatch) {
        try {
          specObj = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.warn("Visual spec parsing failed:", e);
        }
      } else {
        const nakedMatch = rawText.match(/(\{\s*"type"\s*:[\s\S]*?"params"\s*:[\s\S]*?\})/);
        if (nakedMatch) {
          try {
            specObj = JSON.parse(nakedMatch[1]);
          } catch (e) {
            // ignore
          }
        }
      }
      if (specObj) {
        setParsedVisualSpec(specObj);
      }

      setTutorResponse(rawText.replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/gi, '').trim());
    } catch (err) {
      console.error("Math AI Connection Error:", err);
      setTutorResponse(`Notice: ${err.message || 'Failed to connect to Math AI engine.'}`);
    } finally {
      setIsTutorThinking(false);
    }
  };

  const getFormattedFormula = () => {
    switch (plotMode) {
      case 'linear': {
        const a = paramA;
        const c = paramC;
        if (a === 0) return `y = ${c}`;
        let aStr = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
        if (c === 0) return `y = ${aStr}`;
        return `y = ${aStr} ${c > 0 ? '+ ' + c : '- ' + Math.abs(c)}`;
      }
      case 'vertical':
        return `x = ${paramC}`;
      case 'quadratic': {
        const a = paramA;
        const b = paramB;
        const c = paramC;
        let res = 'y = ';
        if (a !== 0) res += `${a === 1 ? '' : a === -1 ? '-' : a}x²`;
        if (b !== 0) res += ` ${b > 0 && a !== 0 ? '+ ' : b < 0 ? '- ' : ''}${Math.abs(b) === 1 ? 'x' : Math.abs(b) + 'x'}`;
        if (c !== 0 || (a === 0 && b === 0)) res += ` ${c > 0 && (a !== 0 || b !== 0) ? '+ ' : c < 0 ? '- ' : ''}${Math.abs(c)}`;
        return res.trim();
      }
      case 'sine':
        return `y = ${paramA !== 1 ? paramA : ''}sin(${paramB !== 1 ? paramB : ''}x)${paramD !== 0 ? (paramD > 0 ? ' + ' + paramD : ' - ' + Math.abs(paramD)) : ''}`;
      default:
        return equationText || 'y = x + 1';
    }
  };

  
return {router,isMobile,isTablet,isStacked,activeTab,setActiveTab,visualizerSubTab,setVisualizerSubTab,canvasRef,cropStartRef,isDrawing,setIsDrawing,drawTool,setDrawTool,penColor,setPenColor,penWidth,setPenWidth,hasDrawn,setHasDrawn,cropBox,setCropBox,isWhiteboardExpanded,setIsWhiteboardExpanded,canvasSize,setCanvasSize,graphCanvasSize,setGraphCanvasSize,showVisualConcepts,setShowVisualConcepts,showOcrCard,setShowOcrCard,equationText,setEquationText,recognizedText,setRecognizedText,isRecognizing,setIsRecognizing,aiExplanation,setAiExplanation,paramA,setParamA,paramB,setParamB,paramC,setParamC,paramD,setParamD,plotMode,setPlotMode,graphCanvasRef,zoomScale,setZoomScale,hoverCoord,setHoverCoord,tutorQuery,setTutorQuery,tutorResponse,setTutorResponse,isTutorThinking,setIsTutorThinking,isListening,setIsListening,parsedVisualSpec,setParsedVisualSpec,recognitionRef,tutorResponseRef,pythA,setPythA,pythB,setPythB,trigAngle,setTrigAngle,calcX0,setCalcX0,calcFunc,setCalcFunc,vecU,setVecU,vecV,setVecV,clearWhiteboard,clearCropSelection,switchTool,getCanvasCoords,startDrawing,draw,stopDrawing,handleRecognizeCanvas,toggleListening,handleGraphMouseMove,handleAskTutor,getFormattedFormula};
}
