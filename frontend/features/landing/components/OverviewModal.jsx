'use client';
import * as featureStyleFunctions from '@/features/landing/styles/OverviewModal.fa443dbd.styles.js';

import inlineStyles from '@/features/landing/styles/OverviewModal.styles';


import React, { useEffect } from 'react';
import { X, BookOpen, Sparkles, Clock, FileText, CheckCircle } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function OverviewModal({
  isOpen,
  onClose,
  lesson,
  mod,
  onOpenPdf
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lesson) return null;

  return (
    <div
      onClick={onClose}
      style={inlineStyles.s0}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={featureStyleFunctions.s0({T})}
      >
        {/* Modal Header */}
        <div style={featureStyleFunctions.s1({T})}>
          <div style={inlineStyles.s1}>
            <div style={featureStyleFunctions.s2({mod,T})}>
              <BookOpen size={17} />
            </div>
            <div style={inlineStyles.s2}>
              <div style={inlineStyles.s3}>
                <span style={featureStyleFunctions.s3({mod,T})}>
                  {mod?.emoji} {mod?.title}
                </span>
                <span style={featureStyleFunctions.s4({T})}>
                  <Clock size={11} /> {lesson.dur}
                </span>
              </div>
              <h3 style={featureStyleFunctions.s5({T})}>
                {lesson.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            style={featureStyleFunctions.s6({T})}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = T.muted;
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div style={inlineStyles.s4}>
          {/* Section: Overview */}
          <div>
            <div style={featureStyleFunctions.s7({T})}>
              <BookOpen size={14} color={T.accent} />
              <span>Overview</span>
            </div>
            <div style={featureStyleFunctions.s8({T})}>
              {lesson.overview || 'Welcome to this lesson. Learn core concepts and reinforce your understanding.'}
            </div>
          </div>

          {/* Section: Key Points */}
          <div>
            <div style={featureStyleFunctions.s9({T})}>
              <Sparkles size={14} color={T.green} />
              <span>Key Points</span>
            </div>

            {lesson.pts && lesson.pts.length > 0 ? (
              <div style={inlineStyles.s5}>
                {lesson.pts.map((point, idx) => (
                  <div
                    key={idx}
                    style={featureStyleFunctions.s10({T})}
                  >
                    <div style={featureStyleFunctions.s11({mod,T})}>
                      {idx + 1}
                    </div>
                    <span style={featureStyleFunctions.s12({T})}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={featureStyleFunctions.s13({T})}>
                No specific key points recorded for this lesson.
              </div>
            )}
          </div>

          {/* Optional PDF Study Resource */}
          {lesson.pdf && onOpenPdf && (
            <div style={featureStyleFunctions.s14({T})}>
              <div style={inlineStyles.s6}>
                <FileText size={18} color={T.accent} />
                <div>
                  <div style={featureStyleFunctions.s15({T})}>Attached Curriculum PDF</div>
                  <div style={featureStyleFunctions.s16({T})}>View reference document for this lesson</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenPdf();
                }}
                style={featureStyleFunctions.s17({T})}
              >
                Open PDF
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={featureStyleFunctions.s18({T})}>
          <button
            onClick={onClose}
            style={featureStyleFunctions.s19({T})}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
