'use client';
import { getVoiceTicket } from '@/features/voice-tutor/api/ticket';

import inlineStyles from '@/features/voice-tutor/styles/VoiceAgentView.styles';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Home, BookOpen, Brain, Code2, BarChart3, Zap, ArrowLeft, Mic, MicOff, Volume2, VolumeX, Trash2, RotateCcw } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import dynamic from 'next/dynamic';
import VoiceChatMessages from '@/components/voice-tutor/VoiceChatMessages';
import UnifiedSidebar from '@/components/voice-tutor/UnifiedSidebar';
import { getJwtToken } from '@/lib/jwtCache';
import MobileNav from '@/components/MobileNav';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import {VoiceRobotVisualizer,SESSIONS_KEY,TEXT_SESSIONS_KEY,analyzeSentiment,buildTutorSystemPrompt,loadSessions,saveSessions,generateLabel,LANGUAGES,SUBJECTS} from '@/features/voice-tutor/components/features-voice-tutor-components-VoiceAgentView.support.jsx';

export function useVoiceAgentViewModel({ onClose, initialSession, inline = false, sessionId = null, userId = null, onSessionComplete = null }) {

  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [statusMessage, setStatusMessage] = useState('Tap the microphone to start your voice tutoring session');
  const [conversation, setConversation] = useState([]);
  const [currentSentiment, setCurrentSentiment] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [sessions, setSessions] = useState(loadSessions);
  const [textSessions, setTextSessions] = useState([]);

  const [localUserId] = useState(() => {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('lms-user-id');
    if (!id) {
      id = 'user-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      localStorage.setItem('lms-user-id', id);
    }
    return id;
  });

  const activeUserId = userId || localUserId;

  // Load text sessions for unified history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TEXT_SESSIONS_KEY);
      if (raw) setTextSessions(JSON.parse(raw));
    } catch {}
  }, []);

  // Merge both session types
  const mergedSessions = useMemo(() => {
    const voice = (sessions || []).map(s => ({ ...s, type: 'voice' }));
    const text = (textSessions || []).map(s => ({ ...s, type: 'text' }));
    const all = [...text, ...voice];
    all.sort((a, b) => {
      const ta = new Date(a.timestamp || a.startedAt || 0).getTime();
      const tb = new Date(b.timestamp || b.startedAt || 0).getTime();
      return tb - ta;
    });
    return all;
  }, [sessions, textSessions]);

  // Audio and WebSocket Refs (Full-Duplex Gemini Multimodal Live Streaming)
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const micStreamRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const audioSourcesQueueRef = useRef([]);
  const isMutedRef = useRef(false);
  const wsHadErrorRef = useRef(false);
  const voiceSessionIdRef = useRef(null);
  const conversationRef = useRef([]);
  const liveSessionRef = useRef(null);


  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { conversationRef.current = conversation; }, [conversation]);

  // Restore initial session passed from parent (e.g. clicking a voice session from history)
  useEffect(() => {
    if (initialSession && initialSession.messages) {
      setConversation(initialSession.messages.map((m) => ({
        ...m,
        sender: m.sender || (m.role === 'ai' ? 'tutor' : 'student'),
        text: m.text || m.content || '',
        timestamp: new Date(m.timestamp || Date.now())
      })));
      setCurrentSentiment(null);
      if (initialSession.subject) setSelectedSubject(initialSession.subject);
      if (initialSession.language) setSelectedLanguage(initialSession.language);
      setStatusMessage(`Viewing: ${initialSession.label || 'Saved Session'}`);
    }
  }, [initialSession]);

  // Immediate audio playback cancellation (for interruption / barge-in)
  const stopAllAudioPlaybacks = useCallback(() => {
    audioSourcesQueueRef.current.forEach((source) => {
      try { source.stop(); } catch {}
    });
    audioSourcesQueueRef.current = [];
    nextPlayTimeRef.current = 0;
  }, []);

  // Save current conversation session to local storage and remote memory
  const saveCurrentSession = useCallback(() => {
    const currentMsgs = conversationRef.current;
    if (currentMsgs.length === 0) return;
    const sid = sessionId || voiceSessionIdRef.current || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    if (!voiceSessionIdRef.current) voiceSessionIdRef.current = sid;

    const normalizedMessages = currentMsgs.map(m => ({
      id: m.id || Date.now().toString(36),
      role: m.sender === 'tutor' || m.role === 'ai' ? 'ai' : 'user',
      content: m.text || m.content || '',
      timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : new Date().toISOString(),
      isVoice: true
    }));

    const session = {
      id: sid,
      label: generateLabel(currentMsgs, selectedSubject),
      subject: selectedSubject,
      language: selectedLanguage,
      timestamp: new Date().toISOString(),
      messages: normalizedMessages,
      type: 'voice'
    };

    setSessions(prev => {
      const updated = [session, ...prev.filter((s) => s.id !== session.id)];
      saveSessions(updated);
      return updated;
    });

    // Notify parent callback so chat state updates
    if (onSessionComplete) {
      onSessionComplete(currentMsgs);
    }

    // Dispatch update event to sidebar / listeners
    try {
      const event = new CustomEvent('tutor-state-update', {
        detail: {
          currentSessionId: sid,
          voiceSessions: [session],
          type: 'voice'
        }
      });
      window.dispatchEvent(event);
    } catch (e) {}

    // Persist to Redis memory asynchronously
    fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save',
        sessionId: sid,
        userId: activeUserId,
        messages: normalizedMessages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
      }),
    }).catch(() => {});
  }, [selectedSubject, selectedLanguage, activeUserId, sessionId, onSessionComplete]);

  // Clean termination of all Web Audio, media streams, and WebSocket handles
  const terminateSession = useCallback((preserveMessage) => {
    if (liveSessionRef.current) {
      try { liveSessionRef.current.close(); } catch {}
      liveSessionRef.current = null;
    }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
    stopAllAudioPlaybacks();
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch {}
      processorRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch {}
      sourceRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setConnectionStatus('disconnected');
    if (!preserveMessage) {
      setStatusMessage('Lesson completed. Press the mic button to start again!');
    }
  }, [stopAllAudioPlaybacks]);

  useEffect(() => {
    return () => terminateSession(true);
  }, [terminateSession]);

  const handleSelectSession = useCallback((session) => {
    if (connectionStatus !== 'disconnected') return;
    setConversation(session.messages || []);
    setCurrentSentiment(null);
    if (session.subject) setSelectedSubject(session.subject);
    if (session.language) setSelectedLanguage(session.language);
    setStatusMessage(`Viewing: ${session.label || 'Saved Session'}`);
  }, [connectionStatus]);

  // Gapless 24kHz PCM Web Audio playback scheduled via nextPlayTimeRef
  const playPcmAudioChunk = useCallback((base64Data) => {
    if (isMutedRef.current || !audioCtxRef.current) return;
    try {
      const audioCtx = audioCtxRef.current;
      const binaryString = atob(base64Data);
      const buffer = new ArrayBuffer(binaryString.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < binaryString.length; i++) {
        view[i] = binaryString.charCodeAt(i);
      }
      const int16Samples = new Int16Array(buffer);
      const audioBuffer = audioCtx.createBuffer(1, int16Samples.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < int16Samples.length; i++) {
        channelData[i] = int16Samples[i] / 32768.0;
      }

      const bufferSource = audioCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(audioCtx.destination);
      audioSourcesQueueRef.current.push(bufferSource);

      bufferSource.onended = () => {
        audioSourcesQueueRef.current = audioSourcesQueueRef.current.filter((src) => src !== bufferSource);
        if (audioSourcesQueueRef.current.length === 0) {
          setConnectionStatus('connected');
          setStatusMessage('Tutor is listening... Feel free to talk.');
        }
      };

      const now = audioCtx.currentTime;
      if (nextPlayTimeRef.current < now) {
        nextPlayTimeRef.current = now + 0.05;
      }
      setConnectionStatus('tutor-speaking');
      setStatusMessage('Tutor is speaking...');
      bufferSource.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += audioBuffer.duration;
    } catch (err) {
      console.error('[VoiceAgent] Audio playback error:', err);
    }
  }, []);

  // Handle Mute Microphone Toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      isMutedRef.current = next;
      setStatusMessage(next ? 'Microphone muted. Tap mic to resume.' : 'Tutor is listening... Feel free to talk.');
      return next;
    });
  }, []);

  // Main Toggle: Connect or Disconnect Live Gemini Session
  const handleMicToggle = useCallback(async () => {
    if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
      try {
        setConnectionStatus('connecting');
        setStatusMessage('Requesting microphone access and initializing Voice Tutor...');
        stopAllAudioPlaybacks();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        micStreamRef.current = stream;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        audioCtxRef.current = audioCtx;
        if (audioCtx.state === 'suspended') {
          try { await audioCtx.resume(); } catch (e) {}
        }

        const voiceSid = sessionId || voiceSessionIdRef.current || ('voice-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
        voiceSessionIdRef.current = voiceSid;

        // WebSocket Target Strategy (Port 5001 primary, Port 5050 and host fallback)
        const primaryWsHost = process.env.NEXT_PUBLIC_VOICE_WS_URL || process.env.NEXT_PUBLIC_WS_URL || (
          typeof window !== 'undefined' && ['localhost','127.0.0.1','[::1]'].includes(window.location.hostname)
            ? 'ws://localhost:5001'
            : `${typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${typeof window !== 'undefined' ? window.location.host : 'localhost'}`
        );

        const fallbackHosts = [
          primaryWsHost,
          `${typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${typeof window !== 'undefined' ? window.location.host : 'localhost'}`
        ].filter((host, idx, arr) => arr.indexOf(host) === idx);

        let currentHostIdx = 0;

        const isLocalHost = typeof window !== 'undefined' && (
          ['localhost','127.0.0.1','[::1]'].includes(window.location.hostname) ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === '[::1]'
        );

        const setupMicProcessor = (onChunk) => {
          if (processorRef.current) {
            try { processorRef.current.disconnect(); } catch {}
          }
          if (sourceRef.current) {
            try { sourceRef.current.disconnect(); } catch {}
          }
          const source = audioCtx.createMediaStreamSource(stream);
          sourceRef.current = source;
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          const silentGain = audioCtx.createGain();
          silentGain.gain.value = 0;
          source.connect(processor);
          processor.connect(silentGain);
          silentGain.connect(audioCtx.destination);

          processor.onaudioprocess = (e) => {
            if (isMutedRef.current) return;
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
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            onChunk(btoa(binary));
          };
        };

        const voiceUnavailable = () => {
          terminateSession(true);
          setConnectionStatus('error');
          setStatusMessage('Voice server unavailable. Please retry, or ask your administrator to configure the secure voice server.');
        };

        const connectToSocket = async (targetHost) => {
          let ticket;
          try { ticket = await getVoiceTicket(voiceSid); } catch (error) { voiceUnavailable(); return; }
          const wsUrl = `${targetHost}/api/ws?language=${encodeURIComponent(selectedLanguage)}&subject=${encodeURIComponent(selectedSubject)}&sessionId=${encodeURIComponent(voiceSid)}&ticket=${encodeURIComponent(ticket)}`;
          const ws = new WebSocket(wsUrl);
          wsRef.current = ws;

          let advanced = false;
          const advance = () => {
            if (advanced || wsRef.current !== ws) return;
            advanced = true;
            clearTimeout(connTimeout);
            try { ws.close(); } catch {}
            currentHostIdx++;
            if (currentHostIdx < fallbackHosts.length) connectToSocket(fallbackHosts[currentHostIdx]);
            else voiceUnavailable();
          };
          const connTimeout = setTimeout(() => { if (ws.readyState !== WebSocket.OPEN) advance(); }, 2500);

          ws.onopen = () => {
            clearTimeout(connTimeout);
            wsHadErrorRef.current = false;
            setConnectionStatus('connected');
            setStatusMessage('Tutor connected! Start speaking.');

            setupMicProcessor((base64Data) => {
              if (ws.readyState !== WebSocket.OPEN || isMutedRef.current) return;
              ws.send(JSON.stringify({ type: 'audio', data: base64Data }));
            });
          };

          ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data);
              if (message.type === 'status') {
                setStatusMessage(message.message);
              } else if (message.type === 'error') {
                setStatusMessage(message.message);
                setConnectionStatus('error');
              } else if (message.type === 'audio' && message.data) {
                playPcmAudioChunk(message.data);
              } else if (message.type === 'interrupted') {
                stopAllAudioPlaybacks();
                setConnectionStatus('connected');
                setStatusMessage('Tutor was interrupted. Listening now...');
              } else if (message.type === 'agent-transcription') {
                setConversation((prev) => {
                  if (prev.length > 0 && prev[prev.length - 1].sender === 'tutor') {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      text: (updated[updated.length - 1].text ? updated[updated.length - 1].text + ' ' : '') + message.text
                    };
                    return updated;
                  }
                  return [
                    ...prev,
                    {
                      id: Math.random().toString(36).slice(2),
                      sender: 'tutor',
                      text: message.text,
                      timestamp: new Date()
                    }
                  ];
                });
              } else if (message.type === 'user-transcription') {
                setConversation((prev) => [
                  ...prev,
                  {
                    id: Math.random().toString(36).slice(2),
                    sender: 'student',
                    text: message.text,
                    timestamp: new Date(),
                    sentiment: message.sentiment
                  }
                ]);
                if (message.sentiment) {
                  setCurrentSentiment(message.sentiment);
                }
              }
            } catch (e) {
              console.error('[VoiceAgent] WS parse error:', e);
            }
          };

          ws.onerror = advance;

          ws.onclose = () => {
            clearTimeout(connTimeout);
            if (!advanced && wsRef.current === ws) {
              terminateSession(false);
            }
          };
        };

        connectToSocket(fallbackHosts[0]);
      } catch (err) {
        setConnectionStatus('error');
        setStatusMessage(`Microphone access denied: ${err.message || err}. Please permit microphone permissions.`);
      }
    } else {
      saveCurrentSession();
      terminateSession();
    }
  }, [connectionStatus, selectedLanguage, selectedSubject, stopAllAudioPlaybacks, playPcmAudioChunk, terminateSession, saveCurrentSession, sessionId, activeUserId]);

  const clearTranscriptLog = useCallback(() => {
    setConversation([]);
    setCurrentSentiment(null);
  }, []);

  const isActive = connectionStatus !== 'disconnected' && connectionStatus !== 'error';
  const isMobile = useMediaQuery(isMobileMQ);
  const voiceZ = isMobile ? 1010 : 1000;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
      const handleStorageChange = () => {
        setSidebarCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
      };
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('sidebarToggle', handleStorageChange);
      const interval = setInterval(handleStorageChange, 1500);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('sidebarToggle', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  
return {selectedLanguage,setSelectedLanguage,selectedSubject,setSelectedSubject,connectionStatus,setConnectionStatus,statusMessage,setStatusMessage,conversation,setConversation,currentSentiment,setCurrentSentiment,isMuted,setIsMuted,sessions,setSessions,textSessions,setTextSessions,localUserId,activeUserId,mergedSessions,wsRef,audioCtxRef,processorRef,sourceRef,micStreamRef,nextPlayTimeRef,audioSourcesQueueRef,isMutedRef,wsHadErrorRef,voiceSessionIdRef,conversationRef,liveSessionRef,stopAllAudioPlaybacks,saveCurrentSession,terminateSession,handleSelectSession,playPcmAudioChunk,handleToggleMute,handleMicToggle,clearTranscriptLog,isActive,isMobile,voiceZ,sidebarCollapsed,setSidebarCollapsed};
}
