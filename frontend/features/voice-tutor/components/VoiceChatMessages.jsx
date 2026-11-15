'use client';
import * as featureStyleFunctions from '@/features/voice-tutor/styles/VoiceChatMessages.41af51ec.styles.js';

import inlineStyles from '@/features/voice-tutor/styles/VoiceChatMessages.styles';


import { useRef, useEffect } from 'react';
import { T } from '@/shared/design-system/theme';

const sentimentColorMap = {
  'Struggling / Confused': T.amber,
  'Happy / Confident': T.green,
  'Curious / Inquisitive': T.accent,
  'Calm / Conversational': T.muted,
};

const sentimentEmojiMap = {
  'Struggling / Confused': '\uD83D\uDE1F',
  'Happy / Confident': '\uD83D\uDE0A',
  'Curious / Inquisitive': '\uD83E\uDD14',
  'Calm / Conversational': '\uD83D\uDE10',
};

export default function VoiceChatMessages({ conversation }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div ref={scrollRef} style={inlineStyles.s0}>
      {conversation.length === 0 ? (
        <div style={featureStyleFunctions.s0({T})}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={inlineStyles.s1}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p style={inlineStyles.s2}>No messages yet</p>
          <p style={inlineStyles.s3}>Tap the microphone to start your tutoring session</p>
        </div>
      ) : (
        conversation.map((turn) => {
          const isStudent = turn.sender === 'student';
          return (
            <div key={turn.id} style={featureStyleFunctions.s1({isStudent})}>
              {/* Avatar */}
              <div style={featureStyleFunctions.s2({isStudent,T})}>
                {isStudent ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={featureStyleFunctions.s3({T})}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={inlineStyles.s4}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>

              {/* Message */}
              <div style={inlineStyles.s5}>
                <div style={featureStyleFunctions.s4({isStudent,T})}>
                  {isStudent ? 'YOU' : 'AI TUTOR'}
                </div>
                <div style={featureStyleFunctions.s5({isStudent,T})}>
                  <p style={inlineStyles.s6}>{turn.text}</p>
                  {isStudent && turn.sentiment && (
                    <div style={inlineStyles.s7}>
                      <span style={inlineStyles.s8}>{sentimentEmojiMap[turn.sentiment.label] || '\uD83D\uDE10'}</span>
                      <span style={featureStyleFunctions.s6({T})}>{turn.sentiment.label}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
