'use client';
import * as featureStyleFunctions from '@/features/landing/styles/features-landing-pages-vedika-labs-View.support.f3751ce7.styles.js';

import inlineStyles from '@/features/landing/styles/vedika-labs-page.jsx.styles.js';
import { useReducer, useState, useRef, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Layers,
  FlaskConical,
  Atom,
  ChevronDown,
  Sparkles,
  Award,
  HelpCircle,
  Bot
} from 'lucide-react';
import VedikaParticleBot from '@/components/VedikaParticleBot';
import { useMediaQuery, isMobileMQ, isTabletMQ } from '@/lib/useMediaQuery';
import { LabThematicArt } from '@/app/vedika-labs/LabCardArt';
import '@/app/vedika-labs/vedika-labs.css';
export const VEDIKA_HUB_FEATURES = [
  {
    id: 'sim',
    label: 'Interactive Canvas',
    icon: Layers,
    badge: 'PhET Sim',
    desc: 'Interactive HTML5 STEM simulation and 3D WebGL workbenches'
  },
  {
    id: 'objectives',
    label: 'Objectives & Steps',
    icon: BookOpenIcon,
    badge: 'Procedure',
    desc: 'Guided step-by-step scientific methods and curriculum goals'
  },
  {
    id: 'formulas',
    label: 'Formulas & Principles',
    icon: Award,
    badge: 'Theory',
    desc: 'Mathematical equations and underlying physical laws'
  },
  {
    id: 'questions',
    label: 'Viva & Self Test',
    icon: HelpCircle,
    badge: 'Oral Exam',
    desc: 'Interactive oral examination questions and self-tests'
  },
  {
    id: 'ai',
    label: 'Vedika AI Science Tutor',
    icon: Bot,
    badge: 'AI Mentor',
    desc: 'Multimodal AI tutor providing live explanations and answers'
  }
];

export function BookOpenIcon(props) {
  return (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

export const LABS_DATA = [
  {
    id: 'math',
    title: 'Math Lab',
    headline: 'Math Lab',
    subtitle: 'Graphs, equations and 3D visualization',
    symbol: 'Σ',
    secondarySymbol: 'π',
    iconType: 'calculator',
    color: '#A855F7',
    colorRgb: '168, 85, 247',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    botImage: '/vedika-bot-math.png?v=3',
    url: '/vedika-labs/math',
    badge: '3D CALCULUS & DYNAMICS',
    tags: ['Graphing 2D/3D', 'Lorenz Attractor', 'Calculus', 'Fourier Analysis'],
    quote: 'Mathematics reveals the hidden symmetries of reality.'
  },
  {
    id: 'physics',
    title: 'Physics Lab',
    headline: 'Physics Lab',
    subtitle: 'Explore laws of nature through simulation',
    symbol: '⚛',
    secondarySymbol: '⚡',
    iconType: 'atom',
    color: '#00D4FF',
    colorRgb: '0, 212, 255',
    glowColor: 'rgba(0, 212, 255, 0.75)',
    botImage: '/vedika-bot-physics.png?v=3',
    url: '/vedika-labs/physics',
    badge: 'NEWTONIAN & QUANTUM',
    tags: ["Newton's Cradle", 'Pendulum Waves', 'Gravity', 'Ohm\'s Circuit'],
    quote: 'Forces and fields govern every motion across the cosmos.'
  },
  {
    id: 'chemistry',
    title: 'Chemistry Lab',
    headline: 'Chemistry Lab',
    subtitle: 'Molecules, reactions and structures',
    symbol: '⚗',
    secondarySymbol: '🧪',
    iconType: 'flask',
    color: '#00E5A3',
    colorRgb: '0, 229, 163',
    glowColor: 'rgba(0, 229, 163, 0.75)',
    botImage: '/vedika-bot-chemistry.png?v=3',
    url: '/vedika-labs/chemistry',
    badge: 'MOLECULES & REACTION DYNAMICS',
    tags: ['Atomic Orbitals', 'Reaction Kinetics', 'Titration', 'Gas Diffusion'],
    quote: 'Matter transforms through atomic bonds and chemical reactions.'
  },
  {
    id: 'biology',
    title: 'Biology Lab',
    headline: 'Biology Lab',
    subtitle: 'Cells, DNA and ecosystems',
    symbol: '🍃',
    secondarySymbol: '🧬',
    iconType: 'dna',
    color: '#F59E0B',
    colorRgb: '245, 158, 11',
    glowColor: 'rgba(245, 158, 11, 0.75)',
    botImage: '/vedika-bot-biology.png?v=3',
    url: '/vedika-labs/biology',
    badge: 'GENETICS & CELLULAR WORLDS',
    tags: ['DNA Double Helix', 'Animal & Plant Cells', 'Microbiology', 'Ecosystems'],
    quote: 'Life unfolds from molecular codes into living organisms.'
  }
];

export const FIXED_SLOTS = [
  { x: -455, y: -8, z: 16, rotX: 1.2, rotY: 15.5, rotZ: -0.8 }, // 0: Math Lab (Left curved bank)
  { x: -262, y: 2,  z: -6, rotX: 0,   rotY: 5,    rotZ: 0 },    // 1: Physics Lab (Center-Left)
  { x: 262,  y: 2,  z: -6, rotX: 0,   rotY: -5,   rotZ: 0 },    // 2: Chemistry Lab (Center-Right)
  { x: 455,  y: -8, z: 16, rotX: 1.2, rotY: -15.5, rotZ: 0.8 }  // 3: Biology Lab (Right curved bank)
];

export const METRICS_BAR = [
  { icon: FlaskConical, value: '4', title: 'Interactive Labs', accent: '#00D4FF' },
  { icon: Layers, value: '100+', title: 'Simulations', accent: '#818CF8' },
  { icon: Atom, value: 'Real', title: 'Concepts', accent: '#A855F7' },
  { icon: Compass, value: 'Learn', title: 'by Doing', accent: '#F59E0B' }
];

export const initialState = {
  activeIdx: 1, // Default to Physics Lab (center)
  isNavigating: false
};

export function vedikaLabsReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_LAB':
      if (state.isNavigating || state.activeIdx === action.payload) return state;
      return { ...state, activeIdx: action.payload };
    case 'PREV_LAB': {
      if (state.isNavigating) return state;
      const count = action.payload || LABS_DATA.length;
      return {
        ...state,
        activeIdx: state.activeIdx > 0 ? state.activeIdx - 1 : count - 1
      };
    }
    case 'NEXT_LAB': {
      if (state.isNavigating) return state;
      const count = action.payload || LABS_DATA.length;
      return {
        ...state,
        activeIdx: state.activeIdx < count - 1 ? state.activeIdx + 1 : 0
      };
    }
    case 'START_NAVIGATE':
      return { ...state, isNavigating: true };
    default:
      return state;
  }
}

export const DesktopHologramCard = memo(function DesktopHologramCard({ lab, idx, isSelected, slot, slotScale = 1, onSelect, onLaunch }) {
  const transX = Math.round(slot.x * slotScale);
  const transY = slot.y;
  const transZ = Math.round(slot.z * slotScale) + (isSelected ? 16 : 0);
  const rotX = slot.rotX;
  const rotY = Math.round(slot.rotY * (slotScale < 1 ? 0.6 : 1));
  const rotZ = slot.rotZ;
  const scaleVal = isSelected ? 1.02 : 0.98;

  return (
    <div
      key={lab.id}
      className={`vedika-hologram-card ${isSelected ? 'selected-glow' : 'ambient-card'}`}
      style={featureStyleFunctions.s0({lab,transX,transY,transZ,rotX,rotY,rotZ,scaleVal,isSelected})}
      onClick={() => {
        if (isSelected) {
          onLaunch(lab.url);
        } else {
          onSelect(idx);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${isSelected ? 'Enter' : 'Select'} ${lab.title}`}
    >
      <div className="card-glass-panel">
        <div className="card-header-titles">
          <div className="card-header-top-row">
            <span className="card-tech-dot" />
            <h3 className="card-lab-headline">
              {lab.id === 'math' && <>Math <span style={inlineStyles.s0}>Lab</span></>}
              {lab.id === 'physics' && <>Physics <span style={inlineStyles.s1}>Lab</span></>}
              {lab.id === 'chemistry' && <>Chemistry <span style={inlineStyles.s2}>Lab</span></>}
              {lab.id === 'biology' && <>Biology <span style={inlineStyles.s3}>Lab</span></>}
            </h3>
          </div>
          <div className="card-headline-accent-bar" style={featureStyleFunctions.s1({lab})} />
        </div>

        <div className="card-thematic-art">
          <LabThematicArt labId={lab.id} />
        </div>

        {isSelected && <div className="card-active-glow-aura" />}
      </div>
    </div>
  );
});

export const DesktopMetricsBanner = memo(function DesktopMetricsBanner() {
  return (
    <div className="vedika-labs-bottom-banner">
      <div className="metrics-banner-inner">
        {METRICS_BAR.map((item, idx) => {
          const { icon: MetricIcon } = item;
          return (
            <div key={idx} className="metric-cell">
              <div
                className="metric-icon-wrap"
                style={featureStyleFunctions.s2({item})}
              >
                <MetricIcon size={20} />
              </div>
              <div className="metric-text-wrap">
                <span className="metric-val">{item.value}</span>
                <span className="metric-lbl">{item.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export const MobileHologramCard = memo(function MobileHologramCard({ lab, idx, activeIdx, onSelect, onLaunch }) {
  let offset = idx - activeIdx;
  const count = LABS_DATA.length;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;

  const isCenter = offset === 0;
  const isLeft = offset === -1 || (activeIdx === 0 && idx === count - 1);
  const isRight = offset === 1 || (activeIdx === count - 1 && idx === 0);

  let posClass = 'card-hidden-slide';
  if (isCenter) posClass = 'card-active-slide';
  else if (isLeft) posClass = 'card-left-peek';
  else if (isRight) posClass = 'card-right-peek';

  return (
    <div
      key={lab.id}
      className={`carousel-card-slide ${posClass}`}
      style={featureStyleFunctions.s3({lab})}
      onClick={() => {
        if (isCenter) {
          onLaunch(lab.url);
        } else {
          onSelect(idx);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${isCenter ? 'Enter' : 'Select'} ${lab.title}`}
    >
      <div className="card-glass-panel">
        <div className="card-header-titles">
          <div className="card-header-top-row">
            <span className="card-tech-dot" />
            <h3 className="card-lab-headline">
              {lab.headline.split(' ')[0]} <span style={featureStyleFunctions.s4({lab})}>Lab</span>
            </h3>
          </div>
          <p className="card-lab-subtitle">{lab.subtitle}</p>
        </div>

        <div className="card-thematic-art">
          <LabThematicArt labId={lab.id} />
        </div>

        {isCenter && (
          <button
            type="button"
            className="card-launch-fab"
            aria-label={`Enter ${lab.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onLaunch(lab.url);
            }}
          >
            <ArrowRight size={16} color="#FFFFFF" />
          </button>
        )}

        {isCenter && <div className="card-active-glow-aura" />}
      </div>
    </div>
  );
});

export const MobileMetricsBanner = memo(function MobileMetricsBanner() {
  return (
    <div className="vedika-labs-mobile-bottom-banner">
      <div className="mobile-metrics-inner">
        {METRICS_BAR.map((item, idx) => (
          <div key={idx} className="mobile-metric-cell">
            <span className="mobile-metric-val" style={featureStyleFunctions.s5({item})}>{item.value}</span>
            <span className="mobile-metric-lbl">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
});