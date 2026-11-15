'use client';

import inlineStyles from '@/features/labs/styles/PhetSimViewer.styles';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Maximize2, RotateCcw, BookOpen, HelpCircle, 
  ExternalLink, Layers, CheckCircle2, ChevronDown, ChevronUp, Award, Send, Bot, RefreshCw,
  Sparkles, Smartphone, X, Check, Compass, ArrowLeft
} from 'lucide-react';
import { PHET_SIMULATIONS, LAB_SUBJECT_METADATA } from '@/lib/phet-simulations';
import { T } from '@/shared/design-system/theme';
import MathEquationRenderer from '@/components/labs/MathEquationRenderer';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import {LAB_FEATURE_OPTIONS} from '@/features/labs/components/features-labs-components-PhetSimViewer.support.jsx';

export function usePhetSimViewerModel({ subject = 'physics', activeSimId, onSelectSim, onViewModeChange, currentViewMode = 'phet' }) {

  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const sims = PHET_SIMULATIONS[subject] || [];
  const activeSim = sims.find(s => s.id === activeSimId) || sims[0];
  const subjectMeta = LAB_SUBJECT_METADATA[subject] || LAB_SUBJECT_METADATA.physics;

  const getInitialGreeting = (sim, subj) => {
    const title = sim?.title || 'this experiment';
    const badge = sim?.badge ? ` (${sim.badge})` : '';
    const formulas = sim?.keyFormulas?.length ? `\n\n📐 **Key Formulas:** ${sim.keyFormulas.join(', ')}` : '';
    const objectives = sim?.objectives?.length 
      ? `\n\n🎯 **Core Objectives:**\n${sim.objectives.slice(0, 2).map(o => `• ${o}`).join('\n')}`
      : '';

    return `Hello! I am Vedika, your ${subj.toUpperCase()} Science Tutor. I am fully briefed on **${title}**${badge}.${objectives}${formulas}\n\nAsk me any question about the experiment, or select a question from the **Viva & Self Test** tab for a complete guided solution!`;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sim'); // 'sim', 'objectives', 'formulas', 'questions', 'ai'
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  const [showMobileTip, setShowMobileTip] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([
    { sender: 'ai', text: getInitialGreeting(activeSim, subject) }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef(null);

  // Sync tab with URL parameter if provided (e.g. ?tab=formulas)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && LAB_FEATURE_OPTIONS.some(o => o.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Listen for native fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Close feature dropdown on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFeatureDropdownOpen(false);
      }
    };
    if (isFeatureDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isFeatureDropdownOpen]);

  // Reset AI chat context with primed experiment briefing when switching to a different simulation
  useEffect(() => {
    setAiChat([
      { sender: 'ai', text: getInitialGreeting(activeSim, subject) }
    ]);
    setAiQuery('');
    setIsAiThinking(false);
  }, [activeSimId, subject]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'ai' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChat, isAiThinking, activeTab]);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleReloadIframe = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleAskAi = async (textToSend, options = {}) => {
    const q = textToSend || aiQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setAiChat(prev => [...prev, userMsg]);
    setAiQuery(''); // Always clear input
    setIsAiThinking(true);

    let vivaQuestion = options.vivaQuestion;
    let questionIndex = options.questionIndex;

    // Parse viva question details if called with standard question prefix
    if (!vivaQuestion && q.startsWith('Answer Viva Question Q')) {
      const match = q.match(/Answer Viva Question Q(\d+):\s*(.*)/i);
      if (match) {
        questionIndex = parseInt(match[1], 10);
        vivaQuestion = match[2];
      }
    }

    try {
      // Primary: Dedicated Labs Tutor API with full experiment briefing & Gemini key rotation
      const res = await fetch('/api/labs/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          experiment: activeSim,
          userQuery: q,
          vivaQuestion: vivaQuestion || null,
          questionIndex: questionIndex || null,
          history: aiChat.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      const aiReply = data.reply || data.response;
      if (aiReply) {
        setAiChat(prev => [...prev, { sender: 'ai', text: aiReply }]);
        return;
      }
      throw new Error('No response text received');
    } catch (err) {
      console.warn('[Lab Tutor API error, attempting direct fallback]:', err);
      // Secondary fallback: Direct /api/gemini endpoint
      try {
        const directRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are Vedika, the senior AI science tutor for ${activeSim?.title || 'Virtual Labs'}. Key Formulas: ${activeSim?.keyFormulas?.join(', ') || 'Fundamental laws'}. Provide a clear direct viva answer, theoretical explanation, and simulation verification steps.`,
            user: q
          })
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData.text) {
            setAiChat(prev => [...prev, { sender: 'ai', text: directData.text }]);
            return;
          }
        }
      } catch (fallbackErr) {
        console.warn('[Direct fallback also failed]:', fallbackErr);
      }

      // Offline synthesis fallback
      setAiChat(prev => [...prev, { 
        sender: 'ai', 
        text: `### Direct Viva Answer: ${activeSim?.title || 'Experiment'}\n\n` +
              `**Key Principle:** In this experiment, system behavior is determined by: **${activeSim?.keyFormulas?.join(', ') || 'fundamental laws'}**.\n\n` +
              `**Simulation Guidance:** Use the simulator components and meters to observe direct changes as you adjust parameters. Please ask again in a moment for full live analysis.` 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const currentFeature = LAB_FEATURE_OPTIONS.find(f => f.id === activeTab) || LAB_FEATURE_OPTIONS[0];
  const CurrentFeatureIcon = currentFeature.icon;

  
return {router,isMobile,sims,activeSim,subjectMeta,getInitialGreeting,isLoading,setIsLoading,activeTab,setActiveTab,isFeatureDropdownOpen,setIsFeatureDropdownOpen,showMobileTip,setShowMobileTip,isFullscreen,setIsFullscreen,dropdownRef,aiQuery,setAiQuery,aiChat,setAiChat,isAiThinking,setIsAiThinking,chatBottomRef,containerRef,iframeRef,handleToggleFullscreen,handleReloadIframe,handleAskAi,currentFeature,CurrentFeatureIcon};
}
