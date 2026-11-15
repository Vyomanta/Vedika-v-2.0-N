'use client';
import * as featureStyleFunctions from '@/features/video-tutor/styles/YouTubeTutorPanel.855284b8.styles.js';

import inlineStyles from '@/features/video-tutor/styles/YouTubeTutorPanel.styles';


import { useState } from 'react';
import { 
  Sparkles, Send, Clock, HelpCircle, ChevronDown, ChevronUp, 
  BookOpen, AlertCircle, CheckCircle2, MessageSquare, Loader2
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function YouTubeTutorPanel({ videoId, title = 'Video Lesson', getCurrentTime }) {
  const [isOpen, setIsOpen] = useState(true);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('explain'); // 'explain' | 'chat'

  const handleExplainCurrentMoment = async () => {
    if (!videoId) return;
    const currentSeconds = typeof getCurrentTime === 'function' ? getCurrentTime() : 0;
    setExplaining(true);
    try {
      const res = await fetch('/api/youtube/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          title,
          timestamp: currentSeconds
        })
      });
      const data = await res.json();
      setExplanation(data);
      setActiveTab('explain');
    } catch (err) {
      console.error('Explain moment error:', err);
    } finally {
      setExplaining(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim() || chatLoading || !videoId) return;

    const userText = chatQuestion.trim();
    const currentSeconds = typeof getCurrentTime === 'function' ? getCurrentTime() : 0;
    const newHistory = [...chatHistory, { role: 'user', text: userText }];
    setChatHistory(newHistory);
    setChatQuestion('');
    setChatLoading(true);

    try {
      const jwtToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
      const headers = { 'Content-Type': 'application/json' };
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }
      const res = await fetch('/api/youtube/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          videoId,
          title,
          question: userText,
          timestamp: currentSeconds,
          history: newHistory
        })
      });
      const data = await res.json();
      setChatHistory([...newHistory, { role: 'model', text: data.answer || 'I am here to help you study this video.' }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory([...newHistory, { role: 'model', text: 'Error connecting to video tutor service.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!videoId) return null;

  return (
    <div style={featureStyleFunctions.s0({T})}>
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={featureStyleFunctions.s1({T,isOpen})}
      >
        <div style={inlineStyles.s0}>
          <div style={featureStyleFunctions.s2({T})}>
            <Sparkles size={15} color={T.purple} />
          </div>
          <div>
            <h4 style={featureStyleFunctions.s3({T})}>
              AI Video Learning Companion
            </h4>
            <span style={featureStyleFunctions.s4({T})}>
              Instant timestamp explanations and interactive study Q&A
            </span>
          </div>
        </div>

        <div style={inlineStyles.s1}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExplainCurrentMoment();
            }}
            disabled={explaining}
            style={featureStyleFunctions.s5({T,explaining})}
          >
            {explaining ? <Loader2 size={13} className="animate-spin" /> : <Clock size={13} />}
            {explaining ? 'Analyzing...' : 'Explain Current Timestamp'}
          </button>
          {isOpen ? <ChevronUp size={18} color={T.muted} /> : <ChevronDown size={18} color={T.muted} />}
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={inlineStyles.s2}>
          {/* Tabs */}
          <div style={inlineStyles.s3}>
            <button
              onClick={() => setActiveTab('explain')}
              style={featureStyleFunctions.s6({activeTab,T})}
            >
              Timestamp Explanation
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={featureStyleFunctions.s7({activeTab,T})}
            >
              Ask Questions {chatHistory.length > 0 && `(${chatHistory.length})`}
            </button>
          </div>

          {/* Explanation Tab */}
          {activeTab === 'explain' && (
            <div>
              {explanation ? (
                <div style={inlineStyles.s4}>
                  <div style={featureStyleFunctions.s8({T})}>
                    <Clock size={14} /> Paused Moment: {explanation.timestamp}
                  </div>

                  <div style={featureStyleFunctions.s9({T})}>
                    <h5 style={featureStyleFunctions.s10({T})}>Summary</h5>
                    <p style={featureStyleFunctions.s11({T})}>
                      {explanation.summary}
                    </p>
                  </div>

                  <div>
                    <h5 style={featureStyleFunctions.s12({T})}>Core Concept</h5>
                    <p style={featureStyleFunctions.s13({T})}>
                      {explanation.coreExplanation}
                    </p>
                  </div>

                  {Array.isArray(explanation.keyTakeaways) && explanation.keyTakeaways.length > 0 && (
                    <div>
                      <h5 style={featureStyleFunctions.s14({T})}>Key Takeaways</h5>
                      <ul style={featureStyleFunctions.s15({T})}>
                        {explanation.keyTakeaways.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {explanation.whyItMatters && (
                    <div style={featureStyleFunctions.s16({T})}>
                      <strong>Why this matters:</strong> {explanation.whyItMatters}
                    </div>
                  )}
                </div>
              ) : (
                <div style={featureStyleFunctions.s17({T})}>
                  <BookOpen size={36} color={T.muted} style={inlineStyles.s5} />
                  <p style={inlineStyles.s6}>
                    Click &ldquo;Explain Current Timestamp&rdquo; while watching the lesson to get an instant AI breakdown of what is being demonstrated.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Q&A Chat Tab */}
          {activeTab === 'chat' && (
            <div>
              <div style={inlineStyles.s7}>
                {chatHistory.length === 0 ? (
                  <div style={featureStyleFunctions.s18({T})}>
                    <MessageSquare size={28} style={inlineStyles.s8} />
                    Ask anything about what is covered in this video lesson.
                  </div>
                ) : (
                  chatHistory.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      style={featureStyleFunctions.s19({msg})}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div style={featureStyleFunctions.s20({T})}>
                    <Loader2 size={12} className="animate-spin" /> Thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChat} style={inlineStyles.s9}>
                <input
                  type="text"
                  placeholder="Ask a question about this video..."
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  style={featureStyleFunctions.s21({T})}
                />
                <button
                  type="submit"
                  disabled={!chatQuestion.trim() || chatLoading}
                  style={featureStyleFunctions.s22({T,chatQuestion,chatLoading})}
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
