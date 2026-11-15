'use client';
import * as featureStyleFunctions from '@/features/video-tutor/styles/VideoAIExplainerCard.bd60ff48.styles.js';

import inlineStyles from '@/features/video-tutor/styles/VideoAIExplainerCard.styles';


import { useState } from 'react';
import { Clock, Check, Copy, Brain, HelpCircle, ChevronRight, BookOpen, Quote, Info } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function VideoAIExplainerCard({ explanation, onSeek, onAskFollowUp }) {
  const [copied, setCopied] = useState(false);

  if (!explanation) return null;

  const handleCopy = () => {
    const textToCopy = `[${explanation.timestamp || '00:00'}] ${explanation.summary}\n\nExplanation:\n${explanation.coreExplanation}\n\nKey Points:\n${(explanation.keyTakeaways || []).map((p) => `• ${p}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={featureStyleFunctions.s0({T})}>
      {/* Header bar with timestamp button (Matching Screenshot 1) */}
      <div style={featureStyleFunctions.s1({T})}>
        <div style={inlineStyles.s0}>
          <button
            type="button"
            onClick={() => onSeek && onSeek(explanation.seconds || 0)}
            style={featureStyleFunctions.s2({T})}
            title="Jump video to this timestamp"
          >
            <Clock size={14} style={featureStyleFunctions.s3({T})} />
            <span>{explanation.timestamp || '00:00'}</span>
            <ChevronRight size={12} style={inlineStyles.s1} />
          </button>
          <span style={featureStyleFunctions.s4({T})}>Timestamp Breakdown</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          style={featureStyleFunctions.s5({T})}
          title="Copy explanation"
        >
          {copied ? <Check size={14} style={featureStyleFunctions.s6({T})} /> : <Copy size={14} />}
          <span style={inlineStyles.s2}>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Summary Highlight (Matching Screenshot 1) */}
      <div style={featureStyleFunctions.s7({T})}>
        <Brain size={16} style={featureStyleFunctions.s8({T})} />
        <p style={featureStyleFunctions.s9({T})}>
          {explanation.summary}
        </p>
      </div>

      {/* Core Explanation (Matching Screenshot 1) */}
      {explanation.coreExplanation && (
        <div style={inlineStyles.s3}>
          <h4 style={featureStyleFunctions.s10({T})}>
            <BookOpen size={14} />
            WHAT IS BEING EXPLAINED RIGHT NOW
          </h4>
          <p style={featureStyleFunctions.s11({T})}>
            {explanation.coreExplanation}
          </p>
        </div>
      )}

      {/* Key Takeaways (Matching Screenshot 1) */}
      {Array.isArray(explanation.keyTakeaways) && explanation.keyTakeaways.length > 0 && (
        <div style={featureStyleFunctions.s12({T})}>
          <h4 style={featureStyleFunctions.s13({T})}>
            KEY CONCEPTS & TAKEAWAYS
          </h4>
          <ul style={inlineStyles.s4}>
            {explanation.keyTakeaways.map((point, idx) => (
              <li key={idx} style={featureStyleFunctions.s14({T})}>
                <span style={featureStyleFunctions.s15({T})} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Context In The Lesson (Matching Screenshot 1) */}
      {explanation.whyItMatters && (
        <div style={featureStyleFunctions.s16({T})}>
          <span style={featureStyleFunctions.s17({T})}>
            <Info size={14} style={featureStyleFunctions.s18({T})} />
            Context In The Lesson
          </span>
          <p style={featureStyleFunctions.s19({T})}>
            {explanation.whyItMatters}
          </p>
        </div>
      )}

      {/* Spoken Captions if available */}
      {explanation.transcriptSnippet && (
        <div style={featureStyleFunctions.s20({T})}>
          <div style={featureStyleFunctions.s21({T})}>
            <Quote size={12} style={featureStyleFunctions.s22({T})} />
            <span>Spoken Captions</span>
          </div>
          <pre style={featureStyleFunctions.s23({T})}>
            {explanation.transcriptSnippet}
          </pre>
        </div>
      )}

      {/* Suggested Follow-Ups */}
      {Array.isArray(explanation.suggestedFollowUps) && explanation.suggestedFollowUps.length > 0 && (
        <div style={featureStyleFunctions.s24({T})}>
          <span style={featureStyleFunctions.s25({T})}>
            Ask Vedika Follow-Up
          </span>
          <div style={inlineStyles.s5}>
            {explanation.suggestedFollowUps.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onAskFollowUp && onAskFollowUp(q)}
                style={featureStyleFunctions.s26({T})}
              >
                <HelpCircle size={12} style={featureStyleFunctions.s27({T})} />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
