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
export function preprocessLaTeX(text) {
  if (!text) return '';
  let str = String(text).replace(/\\n/g, '\n');

  // Sanitize unescaped underscores inside \text{...} and subscripts
  str = str.replace(/\\(text|mathrm|mathbf|textit|operatorname)\{([^{}]+)\}/g, (_, tag, inner) => {
    return `\\${tag}{${inner.replace(/_/g, '\\_')}}`;
  });
  str = str.replace(/_\{([a-zA-Z0-9]+)_([a-zA-Z0-9_]+)\}/g, (_, p1, p2) => {
    return `_{\\text{${p1}\\_${p2.replace(/_/g, '\\_')}}}`;
  });

  str = str
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => ` $${formula.trim()}$ `);
  str = str.replace(/\${3,}/g, '$$');
  return str;
}

export function calcGcd(a, b) {
  a = Math.abs(Math.round(a || 0));
  b = Math.abs(Math.round(b || 0));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function parseMathEquation(rawEq, modeFromAI, paramsFromAI, canonicalFromAI) {
  if (!rawEq) return { eqText: 'y = x + 1', mode: 'linear', a: 1, b: 0, c: 1, d: 0, rawEq: 'y = x + 1' };

  let clean = String(rawEq).replace(/\s+/g, '').replace(/−/g, '-');

  // If AI gave explicit parameters, prioritize them
  if (paramsFromAI && (paramsFromAI.a !== undefined || paramsFromAI.c !== undefined)) {
    const a = paramsFromAI.a !== undefined ? parseFloat(paramsFromAI.a) : 1;
    const b = paramsFromAI.b !== undefined ? parseFloat(paramsFromAI.b) : 0;
    const c = paramsFromAI.c !== undefined ? parseFloat(paramsFromAI.c) : 0;
    const d = paramsFromAI.d !== undefined ? parseFloat(paramsFromAI.d) : 0;
    const mode = modeFromAI || (clean.includes('x^2') || clean.includes('x²') ? 'quadratic' : clean.includes('sin') ? 'sine' : 'linear');
    return {
      eqText: canonicalFromAI || (mode === 'linear' ? (a === 0 ? `y = ${c}` : `y = ${a === 1 ? '' : a === -1 ? '-' : a}x ${c !== 0 ? (c > 0 ? '+ ' + c : '- ' + Math.abs(c)) : ''}`.trim()) : rawEq),
      mode,
      a: isNaN(a) ? 1 : a,
      b: isNaN(b) ? 0 : b,
      c: isNaN(c) ? 0 : c,
      d: isNaN(d) ? 0 : d,
      rawEq
    };
  }

  // 1. Check for Trigonometric Sine
  if (clean.includes('sin') || modeFromAI === 'sine') {
    const sinMatch = clean.match(/y=([+\-]?\d*\.?\d*)?\*?sin\(([+\-]?\d*\.?\d*)?x([+\-]\d+\.?\d*)?\)([+\-]\d+\.?\d*)?/i);
    let a = 1, b = 1, c = 0, d = 0;
    if (sinMatch) {
      if (sinMatch[1] === '-') a = -1;
      else if (sinMatch[1] && sinMatch[1] !== '+') a = parseFloat(sinMatch[1]);
      if (sinMatch[2] === '-') b = -1;
      else if (sinMatch[2] && sinMatch[2] !== '+') b = parseFloat(sinMatch[2]);
      if (sinMatch[3]) c = parseFloat(sinMatch[3]);
      if (sinMatch[4]) d = parseFloat(sinMatch[4]);
    }
    return {
      eqText: `y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}sin(${b !== 1 ? b : ''}x)${d !== 0 ? (d > 0 ? ' + ' + d : ' - ' + Math.abs(d)) : ''}`.trim(),
      mode: 'sine',
      a: isNaN(a) ? 1 : a,
      b: isNaN(b) ? 1 : b,
      c: isNaN(c) ? 0 : c,
      d: isNaN(d) ? 0 : d,
      rawEq
    };
  }

  // 2. Check for Quadratic (x^2 or x²)
  if (clean.includes('x^2') || clean.includes('x²') || modeFromAI === 'quadratic') {
    const std = clean.replace(/x²/g, 'x^2');
    const quadMatch = std.match(/y=([+\-]?\d*\.?\d*)x\^2([+\-]?\d*\.?\d*x)?([+\-]\d+\.?\d*)?/i);
    let a = 1, b = 0, c = 0, d = 0;
    if (quadMatch) {
      if (quadMatch[1] === '-') a = -1;
      else if (quadMatch[1] && quadMatch[1] !== '+') a = parseFloat(quadMatch[1]);
      if (quadMatch[2]) {
        const bStr = quadMatch[2].replace('x', '');
        if (bStr === '+' || bStr === '') b = 1;
        else if (bStr === '-') b = -1;
        else b = parseFloat(bStr);
      }
      if (quadMatch[3]) c = parseFloat(quadMatch[3]);
    } else {
      const matchA = std.match(/([+\-]?\d*\.?\d*)x\^2/);
      if (matchA) {
        if (matchA[1] === '-') a = -1;
        else if (matchA[1] && matchA[1] !== '+') a = parseFloat(matchA[1]);
      }
    }
    return {
      eqText: `y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}x² ${b !== 0 ? (b > 0 ? '+ ' + b + 'x ' : '- ' + Math.abs(b) + 'x ') : ''}${c !== 0 ? (c > 0 ? '+ ' + c : '- ' + Math.abs(c)) : ''}`.trim(),
      mode: 'quadratic',
      a: isNaN(a) ? 1 : a,
      b: isNaN(b) ? 0 : b,
      c: isNaN(c) ? 0 : c,
      d: 0,
      rawEq
    };
  }

  // 3. Algebraic Linear Solver for any linear relation with '=' (e.g. x = y + 4, 2x + 3y = 6, y = 4 - x)
  if (clean.includes('=')) {
    const [leftRaw, rightRaw] = clean.split('=');
    function extractCoeffs(str, multiplier = 1) {
      const tokens = str.match(/([+\-]?[^+\-]+)/g) || [];
      let coeffX = 0, coeffY = 0, constant = 0;
      for (let token of tokens) {
        if (!token) continue;
        if (token.includes('x')) {
          let numStr = token.replace('x', '');
          let num = 1;
          if (numStr === '' || numStr === '+') num = 1;
          else if (numStr === '-') num = -1;
          else num = parseFloat(numStr);
          if (!isNaN(num)) coeffX += num * multiplier;
        } else if (token.includes('y')) {
          let numStr = token.replace('y', '');
          let num = 1;
          if (numStr === '' || numStr === '+') num = 1;
          else if (numStr === '-') num = -1;
          else num = parseFloat(numStr);
          if (!isNaN(num)) coeffY += num * multiplier;
        } else {
          const num = parseFloat(token);
          if (!isNaN(num)) constant += num * multiplier;
        }
      }
      return { coeffX, coeffY, constant };
    }

    const left = extractCoeffs(leftRaw, 1);
    const right = extractCoeffs(rightRaw, -1);

    const totalA = left.coeffX + right.coeffX; // coeff of x
    const totalB = left.coeffY + right.coeffY; // coeff of y
    const totalC = left.constant + right.constant; // constant

    // If totalB is non-zero, solve for y: y = (-totalA / totalB) * x + (-totalC / totalB)
    if (Math.abs(totalB) > 1e-6) {
      const slope = -totalA / totalB;
      const intercept = -totalC / totalB;
      const roundClean = (v) => Math.abs(v - Math.round(v)) < 1e-4 ? Math.round(v) : parseFloat(v.toFixed(2));
      const a = roundClean(slope);
      const c = roundClean(intercept);

      let formatted = 'y = ';
      if (a === 1) formatted += 'x';
      else if (a === -1) formatted += '-x';
      else if (a !== 0) formatted += `${a}x`;

      if (c > 0) {
        formatted += (a !== 0 ? ' + ' : '') + c;
      } else if (c < 0) {
        formatted += (a !== 0 ? ' - ' : '-') + Math.abs(c);
      } else if (a === 0) {
        formatted += '0';
      }

      return {
        eqText: canonicalFromAI || formatted,
        mode: 'linear',
        a,
        b: 0,
        c,
        d: 0,
        rawEq
      };
    } else if (Math.abs(totalA) > 1e-6) {
      // Vertical line: totalA * x + totalC = 0 => x = -totalC / totalA
      const xVal = parseFloat((-totalC / totalA).toFixed(2));
      return {
        eqText: `x = ${xVal}`,
        mode: 'vertical',
        a: 0,
        b: 0,
        c: xVal,
        d: 0,
        rawEq
      };
    }
  }

  // Fallback default
  return { eqText: 'y = x + 1', mode: 'linear', a: 1, b: 0, c: 1, d: 0, rawEq };
}

export class SafeMathRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("[SafeMathRenderer Caught Error]:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={inlineStyles.s0}>
          {this.props.fallback || this.props.children}
        </div>
      );
    }
    return this.props.children;
  }
}

export function CustomMathMarkdown({ content }) {
  const mathTheme = {
    text: '#F3F4F6',
    muted: '#94A3B8',
    purple: '#A78BFA',
    accent: '#60A5FA',
    green: '#34D399',
    s2: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.1)'
  };

  return (
    <SafeMathRenderer fallback={<div style={inlineStyles.s1}>{content}</div>}>
      <div className="math-markdown-content" style={inlineStyles.s2}>
        <MathEquationRenderer content={content} theme={mathTheme} />
      </div>
    </SafeMathRenderer>
  );
}