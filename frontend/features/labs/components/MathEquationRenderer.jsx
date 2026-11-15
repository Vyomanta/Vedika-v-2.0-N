'use client';
import * as featureStyleFunctions from '@/features/labs/styles/MathEquationRenderer.370f8658.styles.js';

import inlineStyles from '@/features/labs/styles/MathEquationRenderer.styles';
import '@/features/labs/styles/MathEquationRenderer.css';


import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import 'katex/dist/katex.min.css';

let katex = null;
try {
  katex = require('katex');
} catch (e) {
  // Fallback if katex is initializing
}

// Safely render LaTeX math using KaTeX HTML string output
export function renderMathToHTML(tex, displayMode = false) {
  if (!tex || typeof tex !== 'string') return null;
  let cleanTex = tex.trim();
  if (!cleanTex) return null;

  // 1. Sanitize unescaped underscores inside \text{...}, \mathrm{...}, \mathbf{...} etc.
  cleanTex = cleanTex.replace(/\\(text|mathrm|mathbf|textit|operatorname)\{([^{}]+)\}/g, (_, tag, inner) => {
    return `\\${tag}{${inner.replace(/_/g, '\\_')}}`;
  });

  // 2. Sanitize multiple unescaped underscores in subscripts e.g. A_{cylinder_curved} -> A_{\text{cylinder\_curved}}
  cleanTex = cleanTex.replace(/_\{([a-zA-Z0-9]+)_([a-zA-Z0-9_]+)\}/g, (_, p1, p2) => {
    return `_{\\text{${p1}\\_${p2.replace(/_/g, '\\_')}}}`;
  });

  if (katex) {
    try {
      return katex.renderToString(cleanTex, {
        displayMode,
        throwOnError: false,
        trust: true,
        output: 'html'
      });
    } catch (err) {
      console.warn('[KaTeX Render Notice]', err);
    }
  }
  return null;
}

// Robust balanced brace extractor for standalone \boxed{...} not wrapped in math delimiters
export function wrapStandaloneBoxed(text) {
  if (!text || typeof text !== 'string') return text;
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text.startsWith('\\boxed{', i)) {
      let hasPrecedingDollar = false;
      let checkIdx = i - 1;
      while (checkIdx >= 0 && /\s/.test(text[checkIdx])) checkIdx--;
      if (checkIdx >= 0 && text[checkIdx] === '$') {
        hasPrecedingDollar = true;
      }

      if (hasPrecedingDollar) {
        result += '\\boxed{';
        i += 7;
        continue;
      }

      let depth = 1;
      let j = i + 7;
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }

      if (depth === 0) {
        const inner = text.slice(i + 7, j - 1);
        result += `\n\n$$\\boxed{${inner.trim()}}$$\n\n`;
        i = j;
        continue;
      }
    }
    result += text[i];
    i++;
  }
  return result;
}

// Clean up bare LaTeX math symbols outside math delimiters into clean readable Unicode
export function replaceBareLaTeXSymbols(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\\pi\b/g, 'π')
    .replace(/\\times\b/g, '×')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\pm\b/g, '±')
    .replace(/\\mp\b/g, '∓')
    .replace(/\\le(q)?\b/g, '≤')
    .replace(/\\ge(q)?\b/g, '≥')
    .replace(/\\neq\b/g, '≠')
    .replace(/\\div\b/g, '÷')
    .replace(/\\cdot\b/g, '·')
    .replace(/\\theta\b/g, 'θ')
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\\gamma\b/g, 'γ')
    .replace(/\\Delta\b/g, 'Δ')
    .replace(/\\delta\b/g, 'δ')
    .replace(/\\lambda\b/g, 'λ')
    .replace(/\\mu\b/g, 'μ')
    .replace(/\\sigma\b/g, 'σ')
    .replace(/\\omega\b/g, 'ω')
    .replace(/\\infty\b/g, '∞')
    .replace(/\\sqrt\b/g, '√')
    .replace(/\^\\circ\b/g, '°')
    .replace(/\\circ\b/g, '°');
}

// Pre-parse Markdown text to extract block math and inline math
export function parseLaTeXInText(content) {
  if (!content) return '';
  let str = String(content);

  // Convert literal '\\n' strings into actual line breaks
  str = str.replace(/\\n/g, '\n');

  // Sanitize unescaped underscores inside text and subscript commands
  str = str.replace(/\\(text|mathrm|mathbf|textit|operatorname)\{([^{}]+)\}/g, (_, tag, inner) => {
    return `\\${tag}{${inner.replace(/_/g, '\\_')}}`;
  });
  str = str.replace(/_\{([a-zA-Z0-9]+)_([a-zA-Z0-9_]+)\}/g, (_, p1, p2) => {
    return `_{\\text{${p1}\\_${p2.replace(/_/g, '\\_')}}}`;
  });

  // Normalize LaTeX block delimiters \[ ... \] and inline \( ... \)
  str = str
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => ` $${formula.trim()}$ `);

  // Clean up any repeated dollar signs (e.g. $$$$ or $$$ -> $$)
  str = str.replace(/\${3,}/g, '$$');

  // Wrap standalone \boxed{...} that isn't inside math delimiters
  str = wrapStandaloneBoxed(str);

  // Normalize empty lines inside $$ ... $$ to prevent Markdown paragraph splitting
  str = str.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    const compactFormula = formula.replace(/\n\s*\n+/g, '\n').trim();
    return `\n\n$$${compactFormula}$$\n\n`;
  });

  return str;
}

// Individual KaTeX rendered block/inline component with theme sensitivity
export function KaTeXSpan({ math, displayMode = false, style = {}, theme = {} }) {
  const html = useMemo(() => renderMathToHTML(math, displayMode), [math, displayMode]);

  const textColor = theme.text || 'inherit';
  const blockBg = theme.s2 || 'rgba(91, 140, 248, 0.08)';
  const blockBorder = theme.border || 'rgba(91, 140, 248, 0.25)';

  if (html) {
    return (
      <span
        style={featureStyleFunctions.s0({displayMode,textColor,blockBg,blockBorder,style})}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Graceful fallback display if KaTeX string output fails
  return (
    <span
      style={featureStyleFunctions.s1({theme,displayMode,style})}
    >
      {math}
    </span>
  );
}

// Helper to visually render flipped/reversed characters for Mirror and Water Images notation e.g. G(rev) -> horizontally mirrored G, R(flip) -> vertically inverted R
export function renderFlippedCharacters(text) {
  if (typeof text !== 'string') return text;
  if (!/\((?:rev|flip|mirror|inverted|flipped|reverse)\)|(?:\(reversed [A-Za-z0-9]\))/i.test(text)) {
    return text;
  }

  const regex = /([A-Za-z0-9#@$%&*!?])\((rev|flip|mirror|inverted|flipped|reverse)\)|(?:\(reversed ([A-Za-z0-9])\))/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const char = match[1] || match[3];
    const tag = (match[2] || 'rev').toLowerCase();
    const isWaterFlip = tag === 'flip' || tag === 'inverted' || tag === 'upside-down';

    parts.push(
      <span
        key={match.index}
        style={featureStyleFunctions.s2({isWaterFlip})}
      >
        {char}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// Universal recursive child renderer for LaTeX inline ($...$) and block ($$...$$) math
export function renderTextWithMath(children, theme = {}) {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      const parts = child.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
          const math = part.slice(2, -2).trim();
          return <KaTeXSpan key={idx} math={math} displayMode={true} theme={theme} />;
        }
        if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
          const math = part.slice(1, -1).trim();
          return <KaTeXSpan key={idx} math={math} displayMode={false} theme={theme} />;
        }

        // Format Step / Case / Equation / Condition / Given headers as bold badges
        const stepMatch = part.match(/^(Step\s*\d+:?|Case\s*\d+:?|Equation\s*\(?\d+\)?:?|Condition\s*\d+:?|Option\s*[A-Z]:?|Given:?|Formula:?|Formulas\s*Used:?|Required:?)/i);
        if (stepMatch) {
          const matchedStr = stepMatch[0];
          const restStr = part.slice(matchedStr.length);
          return (
            <React.Fragment key={idx}>
              <span
                style={featureStyleFunctions.s3({theme})}
              >
                {matchedStr}
              </span>
              {renderFlippedCharacters(replaceBareLaTeXSymbols(restStr))}
            </React.Fragment>
          );
        }

        return renderFlippedCharacters(replaceBareLaTeXSymbols(part));
      });
    }
    if (React.isValidElement(child) && child.props && child.props.children) {
      return React.cloneElement(child, {
        children: renderTextWithMath(child.props.children, theme)
      });
    }
    return child;
  });
}

// Main Component: Renders full AI response with KaTeX math equation support & custom theme
export default function MathEquationRenderer({ content, theme = {} }) {
  const parsedContent = useMemo(() => parseLaTeXInText(content), [content]);

  const T = {
    text: theme.text || 'var(--text, #0F172A)',
    muted: theme.muted || 'var(--muted, #64748B)',
    purple: theme.purple || 'var(--purple, #8B5CF6)',
    accent: theme.accent || 'var(--accent, #3B82F6)',
    green: theme.green || 'var(--green, #10B981)',
    s2: theme.s2 || 'var(--s2, rgba(0, 0, 0, 0.03))',
    border: theme.border || 'var(--border, rgba(0, 0, 0, 0.08))'
  };

  return (
    <div style={featureStyleFunctions.s4({T})}>
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => {
            const txt = String(children);
            if (txt.toLowerCase().includes('final answer')) {
              return (
                <div
                  style={featureStyleFunctions.s5({T})}
                >
                  <CheckCircle2 size={22} /> {renderTextWithMath(children, T)}
                </div>
              );
            }

            return (
              <h3
                style={featureStyleFunctions.s6({T})}
              >
                <Zap size={18} color={T.purple} /> {renderTextWithMath(children, T)}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4
              style={featureStyleFunctions.s7({T})}
            >
              <ChevronRight size={16} color={T.accent} /> {renderTextWithMath(children, T)}
            </h4>
          ),
          code: ({ inline, className, children }) => {
            const rawStr = String(children).replace(/\n$/, '');

            if (className === 'language-math' || className === 'language-latex') {
              return <KaTeXSpan math={rawStr} displayMode={true} theme={T} />;
            }

            const isMultiLine = rawStr.includes('\n');
            const isInlineCode = inline === true || (!isMultiLine && !className);

            if (isInlineCode) {
              const isInlineMath = rawStr.startsWith('$') && rawStr.endsWith('$') && rawStr.length > 2;
              if (isInlineMath) {
                return <KaTeXSpan math={rawStr.slice(1, -1)} displayMode={false} theme={T} />;
              }

              return (
                <code
                  style={inlineStyles.s0}
                >
                  {rawStr}
                </code>
              );
            }

            return (
              <pre
                style={featureStyleFunctions.s8({T})}
              >
                <code>{rawStr}</code>
              </pre>
            );
          },
          p: ({ children }) => (
            <p style={featureStyleFunctions.s9({T})}>{renderTextWithMath(children, T)}</p>
          ),
          li: ({ children }) => (
            <li style={featureStyleFunctions.s10({T})}>{renderTextWithMath(children, T)}</li>
          ),
          strong: ({ children }) => (
            <strong style={featureStyleFunctions.s11({T})}>{renderTextWithMath(children, T)}</strong>
          ),
          em: ({ children }) => (
            <em style={inlineStyles.s1}>{renderTextWithMath(children, T)}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote style={featureStyleFunctions.s12({T})}>
              {renderTextWithMath(children, T)}
            </blockquote>
          ),
          td: ({ children }) => <td style={featureStyleFunctions.s13({T})}>{renderTextWithMath(children, T)}</td>,
          th: ({ children }) => <th style={featureStyleFunctions.s14({T})}>{renderTextWithMath(children, T)}</th>
        }}
      >
        {parsedContent}
      </ReactMarkdown>
    </div>
  );
}
