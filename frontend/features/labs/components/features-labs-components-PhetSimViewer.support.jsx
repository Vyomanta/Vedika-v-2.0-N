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
export const LAB_FEATURE_OPTIONS = [
  {
    id: 'sim',
    label: 'Interactive Canvas',
    icon: Layers,
    badge: 'PhET Sim',
    subtitle: 'Interactive HTML5 STEM Simulation Engine'
  },
  {
    id: 'objectives',
    label: 'Objectives & Steps',
    icon: BookOpen,
    badge: 'Procedure',
    subtitle: 'Core Learning Objectives & Guided Lab Protocol'
  },
  {
    id: 'formulas',
    label: 'Formulas & Principles',
    icon: Award,
    badge: 'Theory',
    subtitle: 'Fundamental Equations & Scientific Principles'
  },
  {
    id: 'questions',
    label: 'Viva & Self Test',
    icon: HelpCircle,
    badge: 'Oral Exam',
    subtitle: 'Interactive Viva Voce Questions & Practice Quiz'
  },
  {
    id: 'ai',
    label: 'Vedika AI Science Tutor',
    icon: Bot,
    badge: 'AI Mentor',
    subtitle: 'Real-time STEM Dialogue & Step-by-Step Solutions'
  }
];