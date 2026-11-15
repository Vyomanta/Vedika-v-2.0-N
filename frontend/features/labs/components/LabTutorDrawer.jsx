'use client';
import * as featureStyleFunctions from '@/features/labs/styles/LabTutorDrawer.24ca4b78.styles.js';

import inlineStyles from '@/features/labs/styles/LabTutorDrawer.styles';


import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, RefreshCw, BookOpen, HelpCircle, ChevronRight, 
  Sparkles, Award, Atom, Minimize2, Maximize2 
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import MathEquationRenderer from '@/components/labs/MathEquationRenderer';

export default function LabTutorDrawer({
  subject = 'physics',
  experiment = null,
  isOpen = false,
  onClose,
  initialQuestion = ''
}) {
  const [query, setQuery] = useState(initialQuestion || '');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat' | 'viva'
  const chatBottomRef = useRef(null);

  // Initialize greeting on open or experiment change
  useEffect(() => {
    if (experiment) {
      const formulas = experiment.keyFormulas?.length 
        ? `\n\n📐 **Key Formulas:** ${experiment.keyFormulas.join(', ')}`
        : '';
      const objectives = experiment.objectives?.length
        ? `\n\n🎯 **Objectives:**\n${experiment.objectives.slice(0, 3).map(o => `• ${o}`).join('\n')}`
        : '';

      setMessages([
        {
          sender: 'ai',
          text: `Hello! I am your AI Science Tutor for **${experiment.title || 'Virtual Labs'}** (${subject.toUpperCase()}).${objectives}${formulas}\n\nAsk me any questions about the theory, procedures, or select a viva question to see a step-by-step breakdown!`
        }
      ]);
    } else {
      setMessages([
        {
          sender: 'ai',
          text: `Hello! I am your AI Science & Virtual Lab Tutor for ${subject.toUpperCase()}. Ask any question regarding scientific principles, formulas, or experiment setups.`
        }
      ]);
    }
  }, [experiment?.id, subject]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleSend = async (questionText, options = {}) => {
    const q = questionText || query;
    if (!q.trim() || isThinking) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);
    setActiveSubTab('chat');

    try {
      const res = await fetch('/api/labs/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          experiment: experiment || { title: `${subject} Lab` },
          userQuery: q,
          vivaQuestion: options.vivaQuestion || null,
          questionIndex: options.questionIndex || null,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!res.ok) throw new Error(`Tutor error: ${res.status}`);
      const data = await res.json();
      const reply = data.reply || data.response || 'No response from tutor.';
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.warn('[LabTutorDrawer API Error]:', err);
      // Local fallback
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `### Guidance for ${experiment?.title || 'Experiment'}\n\n` +
                `**Scientific Core:** This experiment demonstrates fundamental principles governing **${subject}**.\n\n` +
                `**Procedure & Observation:** Verify parameter adjustments and observe how changes reflect across measured meters and readings.`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={featureStyleFunctions.s0({T})}>
      {/* Header */}
      <div style={featureStyleFunctions.s1({T})}>
        <div style={inlineStyles.s0}>
          <div style={featureStyleFunctions.s2({T})}>
            <Bot size={18} />
          </div>
          <div>
            <div style={featureStyleFunctions.s3({T})}>
              Virtual Lab AI Tutor
            </div>
            <div style={featureStyleFunctions.s4({T})}>
              {experiment?.title ? experiment.title.slice(0, 30) : `${subject.toUpperCase()} Assistant`}
            </div>
          </div>
        </div>

        <div style={inlineStyles.s1}>
          <button
            onClick={onClose}
            style={featureStyleFunctions.s5({T})}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Mode Subtabs */}
      {experiment?.guidedQuestions?.length > 0 && (
        <div style={featureStyleFunctions.s6({T})}>
          <button
            onClick={() => setActiveSubTab('chat')}
            style={featureStyleFunctions.s7({activeSubTab,T})}
          >
            Ask Tutor
          </button>
          <button
            onClick={() => setActiveSubTab('viva')}
            style={featureStyleFunctions.s8({activeSubTab,T})}
          >
            Viva Questions ({experiment.guidedQuestions.length})
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {activeSubTab === 'viva' && experiment?.guidedQuestions?.length > 0 ? (
        <div style={inlineStyles.s2}>
          <div style={featureStyleFunctions.s9({T})}>
            Click any question to receive a guided theoretical and experimental walkthrough:
          </div>
          {experiment.guidedQuestions.map((q, idx) => (
            <div
              key={idx}
              onClick={() => handleSend(`Answer Viva Question Q${idx + 1}: ${q}`, {
                vivaQuestion: q,
                questionIndex: idx + 1
              })}
              style={featureStyleFunctions.s10({T})}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.purple || '#7C3AED';
                e.currentTarget.style.background = `${T.purple || '#7C3AED'}0f`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border || 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = T.s2 || '#13172b';
              }}
            >
              <div style={featureStyleFunctions.s11({T})}>
                Q{idx + 1}
              </div>
              <div style={featureStyleFunctions.s12({T})}>
                {q}
              </div>
              <ChevronRight size={14} color={T.muted || '#8892b0'} />
            </div>
          ))}
        </div>
      ) : (
        <div style={inlineStyles.s3}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={featureStyleFunctions.s13({msg,T})}
            >
              <div style={inlineStyles.s4}>
                {msg.sender === 'user' ? (
                  'You'
                ) : (
                  <>
                    <Bot size={13} style={featureStyleFunctions.s14({T})} />
                    <span>AI Tutor</span>
                  </>
                )}
              </div>
              <div style={inlineStyles.s5}>
                {msg.sender === 'ai' ? (
                  <MathEquationRenderer content={msg.text} />
                ) : (
                  <div style={inlineStyles.s6}>{msg.text}</div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div style={featureStyleFunctions.s15({T})}>
              <RefreshCw size={13} style={inlineStyles.s7} />
              Formulating scientific explanation...
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
      )}

      {/* Query Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={featureStyleFunctions.s16({T})}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about this experiment..."
          disabled={isThinking}
          style={featureStyleFunctions.s17({T})}
        />
        <button
          type="submit"
          disabled={!query.trim() || isThinking}
          style={featureStyleFunctions.s18({query,isThinking,T})}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
