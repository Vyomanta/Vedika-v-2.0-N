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
export function formatTimestamp(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function extractYoutubeId(urlOrId) {
  if (!urlOrId) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  const match = String(urlOrId).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : urlOrId;
}

export function renderCleanFormattedText(text) {
  if (!text || typeof text !== 'string') return null;
  const clean = text.replace(/#{1,6}\s+/g, '');
  const parts = clean.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} style={inlineStyles.s0}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function renderFormattedChatMessage(text, onSeek) {
  if (!text || typeof text !== 'string') return null;
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} style={inlineStyles.s1}>
          {currentList.map((item, idx) => (
            <li key={idx} style={inlineStyles.s2}>
              {renderCleanFormattedText(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, lineIdx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    const bulletMatch = trimmed.match(/^([*\-•]|\d+\.)\s+(.*)/);
    if (bulletMatch) {
      currentList.push(bulletMatch[2]);
    } else {
      flushList();
      elements.push(
        <p key={`p-${lineIdx}`} style={inlineStyles.s3}>
          {renderCleanFormattedText(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div style={inlineStyles.s4}>{elements}</div>;
}