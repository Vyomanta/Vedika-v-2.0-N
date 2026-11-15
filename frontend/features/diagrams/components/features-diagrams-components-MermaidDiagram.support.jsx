'use client';

import inlineStyles from '@/features/diagrams/styles/MermaidDiagram.styles';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, RotateCcw, Code, Copy, Check, Sparkles, AlertCircle, Maximize2, ChevronDown, X, ArrowLeft, Move } from 'lucide-react';
import StitchAICursor from '@/components/StitchAICursor';
import '@/features/diagrams/styles/MermaidDiagram.css';
export function renderFormattedText(str) {
  if (!str) return '';
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="mermaid-text-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="mermaid-text-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="mermaid-text-italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }
  return parts.length > 0 ? parts : str;
}

export function sanitizeMermaid(raw) {
  if (!raw) return '';
  let code = raw.trim();

  // Strip markdown code fences if accidentally included
  code = code.replace(/^```(?:mermaid)?\s*/i, '').replace(/```\s*$/, '').trim();

  // Ensure diagram header exists
  if (!/^(flowchart|graph|mindmap|sequenceDiagram|classDiagram|stateDiagram|erDiagram)/i.test(code)) {
    code = `flowchart TD\n${code}`;
  }

  // Helper to clean label text: convert markdown bold/italic, escape quotes
  const cleanLabelText = (text) => {
    let clean = (text || '').trim();
    // Convert markdown bold to <b> and italic to <i> so rich typography renders cleanly in HTML labels
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    clean = clean.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    clean = clean.replace(/`([^`]+)`/g, '$1');
    // If enclosed in outer quotes, unwrap first
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1).trim();
    }
    // Escape inner double quotes to single quotes to prevent breaking Mermaid syntax
    clean = clean.replace(/"/g, "'");
    return clean;
  };

  // 1. Stadium shape: A(["..."])
  code = code.replace(/\(\[\s*([^\]\n]+?)\s*\]\)/g, (_, text) => `(["${cleanLabelText(text)}"])`);

  // 2. Cylinder shape: A[("...")]
  code = code.replace(/\[\(\s*([^\)\n]+?)\s*\)\]/g, (_, text) => `[("${cleanLabelText(text)}")]`);

  // 3. Subroutine shape: A[["..."]]
  code = code.replace(/\[\[\s*([^\]\n]+?)\s*\]\]/g, (_, text) => `[["${cleanLabelText(text)}"]]`);

  // 4. Hexagon shape: A{{"..."}} (CRITICAL: Strictly NO space after {{ to comply with Mermaid 11.x lexer)
  code = code.replace(/\{\{\s*([^\}\n]+?)\s*\}\}/g, (_, text) => `{{"${cleanLabelText(text)}"}}`);

  // 5. Circle shape: A(("..."))
  code = code.replace(/\(\(\s*([^\)\n]+?)\s*\)\)/g, (_, text) => `(("${cleanLabelText(text)}"))`);

  // 6. Standard rectangle shape: A["..."] (excluding previously handled shapes)
  code = code.replace(/(?<![\(\[])\[\s*([^\(\[\{\]\)\n]+?)\s*\](?![\)\]])/g, (_, text) => `["${cleanLabelText(text)}"]`);

  // 7. Connector edge labels: -->|"label"| or -->|label|
  code = code.replace(/\|([^\|\n]+?)\|/g, (_, label) => `|"${cleanLabelText(label)}"|`);

  // 8. Subgraph labels: subgraph Title ["Label"] - sanitize the label inside brackets
  code = code.replace(/subgraph\s+(\w+)\s*\[([^\]]+)\]/gi, (match, id, label) => {
    return `subgraph ${id} ["${cleanLabelText(label)}"]`;
  });

  // 9. Clickable links: click nodeId "url" "tooltip" - preserve but sanitize tooltip
  code = code.replace(/click\s+(\w+)\s+"([^"]+)"\s+"([^"]+)"/gi, (match, nodeId, url, tooltip) => {
    return `click ${nodeId} "${url}" "${cleanLabelText(tooltip)}"`;
  });

  // 10. ClassDef labels: classDef className fill:#color,stroke:#color,stroke-width:2px,color:#fff;
  //    Ensure classDef names don't have spaces and sanitize any label-like content
  //    (Mermaid classDef doesn't typically have labels, but handle if present)

  return code;
}

export const NODE_PALETTES = [
  {
    name: 'violet',
    stroke: '#A855F7',
    fill: '#161324',
    arrow: '#A855F7',
    text: '#F8FAFC'
  },
  {
    name: 'sky',
    stroke: '#38BDF8',
    fill: '#0D1929',
    arrow: '#38BDF8',
    text: '#F8FAFC'
  },
  {
    name: 'amber',
    stroke: '#F59E0B',
    fill: '#23180C',
    arrow: '#F59E0B',
    text: '#F8FAFC'
  },
  {
    name: 'emerald',
    stroke: '#10B981',
    fill: '#0D2018',
    arrow: '#10B981',
    text: '#F8FAFC'
  },
  {
    name: 'indigo',
    stroke: '#818CF8',
    fill: '#13162B',
    arrow: '#818CF8',
    text: '#F8FAFC'
  },
  {
    name: 'rose',
    stroke: '#F43F5E',
    fill: '#241018',
    arrow: '#F43F5E',
    text: '#F8FAFC'
  },
  {
    name: 'cyan',
    stroke: '#06B6D4',
    fill: '#0C242E',
    arrow: '#06B6D4',
    text: '#F8FAFC'
  }
];

export function applyBlenderPalettes(root) {
  if (!root) return;
  const wrappers = root.querySelectorAll
    ? (root.classList?.contains('mermaid-svg-wrapper') ? [root] : Array.from(root.querySelectorAll('.mermaid-svg-wrapper')))
    : [];
  wrappers.forEach((wrapper) => {
    const allNodes = Array.from(wrapper.querySelectorAll('.node, g.node'));
    allNodes.forEach((n, idx) => {
      const palette = NODE_PALETTES[idx % NODE_PALETTES.length];
      n.classList.add(`node-palette-${idx % NODE_PALETTES.length}`);
      const shape = n.querySelector('rect, polygon, circle, ellipse, path:not(.arrowMarkerPath)') || n;
      if (shape && shape.style) {
        shape.style.stroke = palette.stroke;
        shape.style.fill = palette.fill;
        shape.style.strokeWidth = '2px';
        if (shape.tagName === 'rect') {
          shape.style.rx = '14px';
          shape.style.ry = '14px';
        }
      }
    });
  });
}

export function synthesizeCreativeInfographic(points, fallbackTitle = "Visual Architecture & Concept Flow") {
  if (!points || points.length === 0) {
    return `flowchart TD
  subgraph Architecture ["🎯 Concept Architecture"]
    direction TB
    Root(["🌟 ${fallbackTitle}"])
    Start["⚡ Interactive Visual Map Ready"]
    Root ==>|"Initializes"| Start
  end`;
  }

  // Parse points: strip bullets, extract bold titles, subtitles, and clean strings
  const parsePoint = (raw) => {
    let clean = (raw || '')
      .replace(/^[-*\d.)\s]+/, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/["\(\)\[\]\{\}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Priority 1: colon separator (e.g. "Dual-Membrane: Outer membrane...")
    let match = clean.match(/^([^:]+?):\s*(.+)$/);
    if (!match) {
      match = clean.match(/^([^—–]+?)\s*[—–]\s*(.+)$/);
    }
    if (!match) {
      match = clean.match(/^([^\-]+?)\s+-\s+(.+)$/);
    }

    if (match && match[1].trim().length >= 2 && match[2].trim().length >= 2) {
      const title = match[1].trim().slice(0, 36);
      const sub = match[2].trim().slice(0, 65);
      return { title, sub };
    }
    return { title: clean.slice(0, 40), sub: '' };
  };

  const pts = points.map(p => parsePoint(p));
  const ICONS = ['⚡', '⚙️', '🔍', '💡', '🚀', '📊', '🛡️', '🧠', '🗄️', '💎'];

  if (pts.length >= 3) {
    const s1 = pts.slice(0, Math.ceil(pts.length / 3));
    const s2 = pts.slice(Math.ceil(pts.length / 3), Math.ceil((pts.length * 2) / 3));
    const s3 = pts.slice(Math.ceil((pts.length * 2) / 3));

    let chart = 'flowchart TD\n';

    // Stage 1: Horizontal inputs & catalysts side-by-side
    chart += '  subgraph Phase1 ["🌱 Stage 1: Foundation & Inputs"]\n';
    chart += '    direction LR\n';
    s1.forEach((pt, idx) => {
      const icon = ICONS[idx % ICONS.length];
      const label = pt.sub ? `<b>${icon} ${pt.title}</b><br/><i>${pt.sub}</i>` : `<b>${icon} ${pt.title}</b>`;
      chart += `    In_${idx + 1}["${label}"]\n`;
    });
    if (s1.length > 1) {
      chart += `    ${s1.map((_, i) => `In_${i + 1}`).join(' ~~~ ')}\n`;
    }
    chart += '  end\n\n';

    // Stage 2: Horizontal transformation core & mechanisms
    chart += '  subgraph Phase2 ["⚙️ Stage 2: Core Mechanism & Transformation Engine"]\n';
    chart += '    direction LR\n';
    s2.forEach((pt, idx) => {
      const icon = ICONS[(idx + 2) % ICONS.length];
      const label = pt.sub ? `<b>${icon} ${pt.title}</b><br/><i>${pt.sub}</i>` : `<b>${icon} ${pt.title}</b>`;
      chart += `    Proc_${idx + 1}["${label}"]\n`;
    });
    if (s2.length > 1) {
      chart += `    ${s2.map((_, i) => `Proc_${i + 1}`).join(' ~~~ ')}\n`;
    }
    chart += '  end\n\n';

    // Stage 3: Horizontal deliverables & impact side-by-side
    chart += '  subgraph Phase3 ["⚡ Stage 3: High-Impact Output & Yield"]\n';
    chart += '    direction LR\n';
    s3.forEach((pt, idx) => {
      const icon = ICONS[(idx + 4) % ICONS.length];
      const label = pt.sub ? `<b>${icon} ${pt.title}</b><br/><i>${pt.sub}</i>` : `<b>${icon} ${pt.title}</b>`;
      chart += `    Out_${idx + 1}["${label}"]\n`;
    });
    if (s3.length > 1) {
      chart += `    ${s3.map((_, i) => `Out_${i + 1}`).join(' ~~~ ')}\n`;
    }
    chart += '  end\n\n';

    // Inter-phase conduit pipelines with descriptive labels
    chart += '  Phase1 ==>|"Processes into"| Phase2\n';
    chart += '  Phase2 ==>|"Yields deliverables"| Phase3\n';
    return chart;
  }

  // 1-2 points fallback
  const p1 = pts[0] || { title: 'Core Foundation', sub: '' };
  const p2 = pts[1] || { title: 'Practical Deliverable', sub: '' };
  const lbl1 = p1.sub ? `<b>⚡ ${p1.title}</b><br/><i>${p1.sub}</i>` : `<b>⚡ ${p1.title}</b>`;
  const lbl2 = p2.sub ? `<b>🎯 ${p2.title}</b><br/><i>${p2.sub}</i>` : `<b>🎯 ${p2.title}</b>`;

  return `flowchart TD
  subgraph Phase1 ["🌱 Stage 1: Foundation"]
    Node_1["${lbl1}"]
  end
  subgraph Phase2 ["🚀 Stage 2: Practical Impact"]
    Node_2["${lbl2}"]
  end
  Phase1 ==>|"Drives"| Phase2\n`;
}

export const MIN_MODAL_ZOOM = 0.60;

export const MAX_MODAL_ZOOM = 1.65;

export const MIN_INLINE_ZOOM = 0.60;

export const MAX_INLINE_ZOOM = 1.50;

export const ZOOM_STEP = 0.15;

export const DIAGRAM_CONFIGS = {
  flowchart: {
    mermaidType: 'flowchart',
    config: {
      htmlLabels: true,
      curve: 'basis',
      useMaxWidth: false,
      nodeSpacing: 40,
      rankSpacing: 60,
      padding: 24,
      subGraphTitleMargin: { top: 14, bottom: 16 }
    }
  },
  mindmap: {
    mermaidType: 'mindmap',
    config: {}
  },
  timeline: {
    mermaidType: 'timeline',
    config: {}
  },
  graph: {
    mermaidType: 'graph',
    config: {
      htmlLabels: true,
      curve: 'basis',
      useMaxWidth: false,
      nodeSpacing: 40,
      rankSpacing: 60,
      padding: 24,
      subGraphTitleMargin: { top: 14, bottom: 16 }
    }
  },
  classDiagram: {
    mermaidType: 'classDiagram',
    config: {}
  },
  sequenceDiagram: {
    mermaidType: 'sequenceDiagram',
    config: {
      useMaxWidth: false,
      diagramMarginX: 50,
      diagramMarginY: 10,
      actorMargin: 50,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      mirrorActors: true,
      bottomMarginAdj: 1
    }
  },
  quadrantChart: {
    mermaidType: 'quadrantChart',
    config: {}
  },
  pie: {
    mermaidType: 'pie',
    config: {}
  },
  pieChart: {
    mermaidType: 'pie',
    config: {}
  }
};

export function getMermaidConfig(diagramType) {
  const cfg = DIAGRAM_CONFIGS[diagramType] || DIAGRAM_CONFIGS.flowchart;
  return cfg;
}