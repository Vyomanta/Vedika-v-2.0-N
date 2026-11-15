import syllabusesData from '@/data/syllabuses.json';


export function parseQuizOutput(text) {
  try {
    const block = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/\[[\s\S]*\]/);
    const jsonStr = block ? block[1] || block[0] : text;
    const data = JSON.parse(jsonStr.trim());
    if (Array.isArray(data)) {
      return data.filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2)
        .map(q => ({ question: q.question, options: q.options, correct: q.correct ?? 0 }));
    }
  } catch {}
  const questions = [];
  const qBlocks = text.split(/Q\d+:/i).filter(b => b.trim());
  for (const block of qBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const question = lines[0];
    const fullBlock = lines.join(' ');
    const optMatches = [...fullBlock.matchAll(/([ABCD])\)\s*([^ABCD)]+?)(?=\s+[ABCD]\)|Correct:|$)/gi)];
    const options = optMatches.map(m => m[2].trim()).filter(Boolean);
    const correctMatch = block.match(/Correct:\s*([ABCD])/i);
    const correct = correctMatch ? correctMatch[1].toUpperCase().charCodeAt(0) - 65 : 0;
    if (question && options.length >= 2) questions.push({ question, options, correct });
  }
  return questions;
}

export function parseFlashcardsOutput(text) {
  return text.split(/\n---+\n?/).map(card => {
    const frontMatch = card.match(/FRONT:\s*(.+?)(?=\nBACK:|$)/is);
    const backMatch = card.match(/BACK:\s*(.+?)(?=\nFRONT:|$)/is);
    const front = frontMatch?.[1]?.trim();
    const back = backMatch?.[1]?.trim();
    return (front && back) ? { front, back } : null;
  }).filter(Boolean);
}

export function generateMermaidFromPoints(points, title = "Visual Summary") {
  if (!points || !points.length) return "";
  const cleanTitle = (title || "Summary").replace(/["\(\)\[\]\{\}]/g, '').slice(0, 32);

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
      const t = match[1].trim().slice(0, 36);
      const s = match[2].trim().slice(0, 65);
      return { title: t, sub: s };
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

    // Stage 1: Horizontal inputs side-by-side
    chart += '  subgraph Phase1 ["🌱 Stage 1: Foundation & Inputs"]\n';
    chart += '    direction LR\n';
    s1.forEach((pt, idx) => {
      const icon = ICONS[idx % ICONS.length];
      const label = pt.sub ? `<b>${icon} ${pt.title}</b><br/><i>${pt.sub}</i>` : `${icon} ${pt.title}`;
      chart += `    In_${idx + 1}(["${label}"])\n`;
    });
    if (s1.length > 1) {
      chart += `    ${s1.map((_, i) => `In_${i + 1}`).join(' ~~~ ')}\n`;
    }
    chart += '  end\n\n';

    // Stage 2: Vertical transformation core
    chart += '  subgraph Phase2 ["⚙️ Stage 2: Core Mechanism & Logic"]\n';
    chart += '    direction TB\n';
    s2.forEach((pt, idx) => {
      const icon = ICONS[(idx + 2) % ICONS.length];
      const label = pt.sub ? `<b>${icon} ${pt.title}</b><br/><i>${pt.sub}</i>` : `${icon} ${pt.title}`;
      if (idx % 2 === 1) {
        chart += `    Proc_${idx + 1}{{"${label}"}}\n`;
      } else {
        chart += `    Proc_${idx + 1}[("${label}")]\n`;
      }
      if (idx > 0) {
        chart += `    Proc_${idx} -->|"Transfers state"| Proc_${idx + 1}\n`;
      }
    });
    chart += '  end\n\n';

    // Stage 3: Horizontal deliverables side-by-side
    chart += '  subgraph Phase3 ["⚡ Stage 3: Key Deliverables & Outcomes"]\n';
    chart += '    direction LR\n';
    s3.forEach((pt, idx) => {
      const icon = ICONS[(idx + 4) % ICONS.length];
      const label = pt.sub ? `<b>${icon} ${pt.title}</b><br/><i>${pt.sub}</i>` : `${icon} ${pt.title}`;
      chart += `    Out_${idx + 1}(["${label}"])\n`;
    });
    if (s3.length > 1) {
      chart += `    ${s3.map((_, i) => `Out_${i + 1}`).join(' ~~~ ')}\n`;
    }
    chart += '  end\n\n';

    chart += '  Phase1 ==>|"Processes into"| Phase2\n';
    chart += '  Phase2 ==>|"Yields deliverables"| Phase3\n';
    return chart;
  }

  // 1-2 points fallback
  const p1 = pts[0] || { title: 'Core Foundation', sub: '' };
  const p2 = pts[1] || { title: 'Practical Deliverable', sub: '' };
  const lbl1 = p1.sub ? `<b>⚡ ${p1.title}</b><br/><i>${p1.sub}</i>` : `⚡ ${p1.title}`;
  const lbl2 = p2.sub ? `<b>🎯 ${p2.title}</b><br/><i>${p2.sub}</i>` : `🎯 ${p2.title}`;

  return `flowchart TD\n  subgraph Phase1 ["🌱 Stage 1: Foundation"]\n    Node_1(["${lbl1}"])\n  end\n  subgraph Phase2 ["🚀 Stage 2: Deliverables"]\n    Node_2(["${lbl2}"])\n  end\n  Phase1 ==>|"Drives"| Phase2\n`;
}

export function parseInfographicOutput(text) {
  if (!text) return [];

  // 1. Extract mermaid diagram block if present
  let mermaid = "";
  const mermaidMatch = text.match(/```(?:mermaid)?\s*([\s\S]*?)```/i);
  if (mermaidMatch) {
    const candidate = mermaidMatch[1].trim();
    if (
      candidate.startsWith('flowchart') ||
      candidate.startsWith('graph') ||
      candidate.startsWith('mindmap') ||
      candidate.startsWith('sequenceDiagram') ||
      candidate.startsWith('classDiagram') ||
      candidate.startsWith('stateDiagram')
    ) {
      mermaid = candidate;
    }
  }

  // 2. Extract bullet points
  const textWithoutCode = text.replace(/```[\s\S]*?```/g, '');
  const lines = textWithoutCode.split('\n');
  const bulletPoints = [];
  const genericLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(?:[\-•*]|\d+\.)\s+(.+)$/);
    if (match) {
      const clean = match[1].trim();
      if (clean.length > 2 && !clean.toLowerCase().startsWith('key takeaway')) {
        bulletPoints.push(clean);
      }
    } else if (
      !trimmed.startsWith('#') &&
      !trimmed.endsWith(':') &&
      !trimmed.toLowerCase().includes('takeaway') &&
      !trimmed.toLowerCase().includes('mermaid') &&
      !trimmed.toLowerCase().startsWith('here is') &&
      !trimmed.toLowerCase().startsWith('here are') &&
      trimmed.length > 10
    ) {
      genericLines.push(trimmed);
    }
  }

  const points = bulletPoints.length > 0 ? bulletPoints : genericLines;

  // If no mermaid diagram was extracted but points exist, synthesize a flowchart
  if (!mermaid && points.length > 0) {
    mermaid = generateMermaidFromPoints(points);
  }

  const result = points.length > 0 ? points : ['Visual overview generated.'];
  result.points = points;
  result.mermaid = mermaid;
  return result;
}
