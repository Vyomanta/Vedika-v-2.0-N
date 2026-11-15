'use client';

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
export const VoiceRobotVisualizer = dynamic(() => import('@/components/voice-tutor/VoiceRobotVisualizer'), {
  ssr: false,
  loading: () => (
    <div style={inlineStyles.s0}>
      <div style={inlineStyles.s1} />
    </div>
  )
});

export const SESSIONS_KEY = 'voice-tutor-sessions';

export const TEXT_SESSIONS_KEY = 'general-tutor-sessions';

export function analyzeSentiment(text) {
  if (!text) return null;
  const lowercase = text.toLowerCase();
  const confusedWords = ["don't understand","do not understand","dont understand","not sure","confused","cannot get","cant get","difficult","hard","stuck","doubt","explain again","unclear","lost","struggling","help","confusing","అర్థం కాలేదు","కష్టంగా ఉంది","సందేహం","తెలియదు","మళ్ళీ చెప్పండి","కన్ఫ్యూజ్","ardham raledu","artham kaledu","kashtanga undi","malli cheppandi","samajh nahi","mushkil","kathin","shanka","phirse","phir se","pareshani","confuse","sandeha"];
  const positiveWords = ["understand","got it","easy","awesome","perfect","clear","great","wow","fantastic","amazing","makes sense","thank you","thanks","excellent","brilliant","అర్థమైంది","సులభంగా ఉంది","చాలా బాగుంది","థాంక్స్","సూపర్","అవును","ardhamaindi","sulabhanga undi","chala bagundi","samajh gaya","samajh gya","aasan","saral","badhiya","bahut achha","clear hai","dhanyawad","shukriya"];
  const curiousWords = ["what is","how do","tell me about","why is","curious","interested","learn","know","question","ఏమిటి","ఎలా","ఎందుకు","తెలుసుకోవాలి","emiti","ela","enduku","telusukovali","kya hai","kaise","kyun","jaan na"];
  let confusedCount = 0, positiveCount = 0, curiousCount = 0;
  for (const w of confusedWords) { if (lowercase.includes(w)) confusedCount++; }
  for (const w of positiveWords) { if (lowercase.includes(w)) positiveCount++; }
  for (const w of curiousWords) { if (lowercase.includes(w)) curiousCount++; }
  if (confusedCount > positiveCount && confusedCount >= curiousCount)
    return { label: 'Struggling / Confused', score: -0.6, emoji: '😟' };
  if (positiveCount > confusedCount && positiveCount >= curiousCount)
    return { label: 'Happy / Confident', score: 0.8, emoji: '😊' };
  if (curiousCount > confusedCount && curiousCount > positiveCount)
    return { label: 'Curious / Inquisitive', score: 0.4, emoji: '🤔' };
  return { label: 'Calm / Conversational', score: 0.0, emoji: '😐' };
}

export function buildTutorSystemPrompt(language, subject, memoryCtx = '') {
  let prompt =
    'Your name is Vedika. You are a warm, highly humanized, and friendly academic tutor supporting school students. ' +
    'VOICE & HUMANIZATION GUIDELINES: ' +
    'Speak in a smooth, expressive, warm, and natural human tone with a familiar, conversational Indian accent rhythm in English ' +
    '(using natural phrases like "chalo", "got it ya", "super simple", "no problem at all", "don\'t worry!"). ' +
    'Sound like an encouraging elder sibling or personal tutor: warm, relatable, dynamic, and full of natural life. ' +
    'Keep answers strictly short and fluid (usually 1 to 2 short sentences per turn) so text-to-speech voice output sounds immediate, crisp, and human. ' +
    'Never output markdown symbols, asterisks, bullet points, numbers, or complex formulas into text, as they disrupt natural voice synthesis. ' +
      'STRICT ACADEMIC FOCUS & MASCOT DRIFT REMINDER: ' +
      'You are strictly an academic tutor and study companion. If the student\'s conversation drifts away from academic learning into casual gossip, gaming, pop culture, or off-topic chit-chat, ' +
      'you must warmly but firmly bring them back to their studies: remind them of their learning goals and ask: "Can we study this, or shall we start where we left off previously?" or suggest a relevant academic topic to explore. ';

  if (language === 'telugu') {
    prompt += 'LANGUAGE MODE: You must speak in sweet, conversational Telugu only (unless referring to specific scientific/mathematical English terms). ';
  } else if (language === 'hindi') {
    prompt += 'LANGUAGE MODE: You must speak in simple, warm, conversational Hindi. ';
  } else if (language === 'english') {
    prompt += 'LANGUAGE MODE: Speak in clear, warm, expressive Indian English with friendly colloquial phrasing. ';
  } else {
    prompt +=
      'CODE-SWITCHING & LANGUAGE MATCHING: Dynamically match and mirror the student\'s exact language mix and tone. ' +
      'If the user speaks in Teluglish (e.g., "Artham kaledu brother", "Ela cheyyali cheppu"), respond in natural, sweet Teluglish. ' +
      'If the user speaks in Hinglish (e.g., "Samajh nahi aaya, phir se batao"), respond in natural, friendly Hinglish. ' +
      'If the user speaks in English, respond in natural, warm Indian English. ';
  }

  if (subject === 'math') {
    prompt += ' SUBJECT FOCUS: Currently helping with Mathematics! Explain concepts using simple physical analogies.';
  } else if (subject === 'science') {
    prompt += ' SUBJECT FOCUS: Currently helping with Science! Explain concepts with fun real-world facts.';
  } else if (subject === 'languages') {
    prompt += ' SUBJECT FOCUS: Currently helping with Languages & Reading! Expand vocabulary and grammar.';
  } else {
    prompt += ' Ready to tutor across all academic subjects with simple, delightful real-world analogies.';
  }

  if (memoryCtx) prompt += memoryCtx;
  return prompt;
}

export function loadSessions() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((s) => ({
      ...s,
      messages: (s.messages || []).map((m) => ({
        ...m,
        sender: m.sender || (m.role === 'ai' ? 'tutor' : 'student'),
        text: m.text || m.content || '',
        timestamp: new Date(m.timestamp || Date.now())
      })),
    }));
  } catch { return []; }
}

export function saveSessions(sessions) {
  try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)); } catch {}
}

export function generateLabel(messages, subject) {
  const firstUser = messages.find((m) => m.sender === 'student');
  if (firstUser) return firstUser.text.slice(0, 40) + (firstUser.text.length > 40 ? '...' : '');
  const subjects = { math: 'Mathematics', science: 'Science', languages: 'Languages', all: 'General Tutor' };
  return subjects[subject] || 'Voice Session';
}

export const LANGUAGES = [
  { id: 'all', name: 'Auto-Detect', flag: '🌍' },
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'telugu', name: 'Telugu', flag: '🇮🇳' },
  { id: 'hindi', name: 'Hindi', flag: '🇮🇳' },
];

export const SUBJECTS = [
  { id: 'all', name: 'General Tutoring' },
  { id: 'math', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'languages', name: 'Languages / English' },
];