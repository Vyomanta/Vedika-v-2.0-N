'use client';
import * as featureStyleFunctions from '@/features/voice-tutor/styles/VoiceAgentView.28411193.styles.js';

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
import {useVoiceAgentViewModel} from '@/features/voice-tutor/hooks/features-voice-tutor-components-VoiceAgentView.jsx';
export default function VoiceAgentView({ onClose, initialSession, inline = false, sessionId = null, userId = null, onSessionComplete = null }) {
const {selectedLanguage,setSelectedLanguage,selectedSubject,setSelectedSubject,connectionStatus,setConnectionStatus,statusMessage,setStatusMessage,conversation,setConversation,currentSentiment,setCurrentSentiment,isMuted,setIsMuted,sessions,setSessions,textSessions,setTextSessions,localUserId,activeUserId,mergedSessions,wsRef,audioCtxRef,processorRef,sourceRef,micStreamRef,nextPlayTimeRef,audioSourcesQueueRef,isMutedRef,wsHadErrorRef,voiceSessionIdRef,conversationRef,liveSessionRef,stopAllAudioPlaybacks,saveCurrentSession,terminateSession,handleSelectSession,playPcmAudioChunk,handleToggleMute,handleMicToggle,clearTranscriptLog,isActive,isMobile,voiceZ,sidebarCollapsed,setSidebarCollapsed}=useVoiceAgentViewModel({onClose,initialSession,inline,sessionId,userId,onSessionComplete});
return (
    <div style={inline ? {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: isMobile ? 48 : 0,
      boxSizing: 'border-box',
      background: 'transparent',
      color: T.text,
      fontFamily: 'var(--font-outfit), "Segoe UI", sans-serif',
      overflow: 'hidden'
    } : {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: isMobile ? 0 : (sidebarCollapsed ? 70 : 220),
      right: 0,
      paddingTop: isMobile ? 48 : 0,
      boxSizing: 'border-box',
      zIndex: voiceZ,
      display: 'flex',
      background: T.bg,
      color: T.text,
      fontFamily: 'var(--font-outfit), "Segoe UI", sans-serif',
      transition: 'left 0.2s ease'
    }}>
      {/* Standalone Sidebar for Full Page Modal */}
      {!inline && (
        <UnifiedSidebar
          sessions={mergedSessions}
          currentSessionId={voiceSessionIdRef.current || sessionId}
          onSelectSession={handleSelectSession}
          onBack={onClose}
        />
      )}

      {/* Main Voice Agent Workspace */}
      <div style={inlineStyles.s2}>
        {/* Navigation & Status Header */}
        <header style={featureStyleFunctions.s0({isMobile,inline,T})}>
          <div style={featureStyleFunctions.s1({isMobile})}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={inlineStyles.s3}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(168, 85, 247, 0.35)'; e.currentTarget.style.borderColor = '#C084FC'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(168, 85, 247, 0.25)'; e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.55)'; }}
                title="Return to Text Chat"
              >
                <ArrowLeft size={15} />
                <span>Back to Chat</span>
              </button>
            )}

            <h2 style={featureStyleFunctions.s2({isMobile,T})}>
              <span>{SUBJECTS.find((s) => s.id === selectedSubject)?.name || 'General Tutor'}</span>
            </h2>

            <div style={inlineStyles.s4} />

            {/* Live Connection Pill */}
            <div style={inlineStyles.s5}>
              <div style={featureStyleFunctions.s3({connectionStatus,isActive,T})} />
              <span style={inlineStyles.s6}>
                {connectionStatus === 'disconnected' && 'Voice Offline'}
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'connected' && 'Voice Mode Active'}
                {connectionStatus === 'tutor-speaking' && 'Tutor Speaking'}
                {connectionStatus === 'error' && 'Error'}
              </span>
            </div>
          </div>

          {/* Subject & Language Selectors */}
          <div style={inlineStyles.s7}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isActive}
              style={featureStyleFunctions.s4({isMobile,T,isActive})}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} style={inlineStyles.s8}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isActive}
              style={featureStyleFunctions.s5({isMobile,T,isActive})}
            >
              {SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.id} style={inlineStyles.s9}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Live Conversation Transcript */}
        {conversation.length > 0 && (
          <VoiceChatMessages conversation={conversation} />
        )}

        {/* Center Robot Visualizer & Real-Time Controls */}
        <div style={featureStyleFunctions.s6({isMobile,conversation,T,inline})}>
          {/* Status Message Text */}
          <p style={featureStyleFunctions.s7({isMobile,isActive})}>
            {statusMessage}
          </p>

          {/* Real-Time Sentiment Badge */}
          {currentSentiment && isActive && (
            <div style={featureStyleFunctions.s8({T})}>
              <span style={inlineStyles.s10}>{currentSentiment.emoji}</span>
              <span style={inlineStyles.s11}>{currentSentiment.label}</span>
            </div>
          )}

          {/* Interactive 3D Robot Visualizer Container */}
          <div style={featureStyleFunctions.s9({isMobile})}>
            {/* Ambient Pulsing Aura */}
            <div style={featureStyleFunctions.s10({connectionStatus,isActive})} />
            <VoiceRobotVisualizer />
          </div>

          {/* Control Dock */}
          <div style={inlineStyles.s12}>
            {/* Mute Microphone Button */}
            {isActive && (
              <button
                type="button"
                onClick={handleToggleMute}
                style={featureStyleFunctions.s11({isMuted,T})}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {/* Main Action Button (Start / End Session) */}
            <button
              type="button"
              onClick={handleMicToggle}
              style={featureStyleFunctions.s12({isActive})}
            >
              {isActive ? (
                <>
                  <MicOff size={14} />
                  <span>END SESSION</span>
                </>
              ) : (
                <>
                  <Mic size={14} />
                  <span>START SESSION</span>
                </>
              )}
            </button>

            {/* Clear Transcript Button */}
            {conversation.length > 0 && (
              <button
                type="button"
                onClick={clearTranscriptLog}
                style={featureStyleFunctions.s13({T})}
                title="Clear Live Transcript"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Ambient Subtle Background Light */}
        {!inline && (
          <React.Fragment>
            <div style={featureStyleFunctions.s14({isMobile})} />
            <div style={featureStyleFunctions.s15({isMobile})} />
          </React.Fragment>
        )}
      </div>
    </div>
  );

}
