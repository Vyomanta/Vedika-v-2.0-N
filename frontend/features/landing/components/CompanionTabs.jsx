'use client';
import * as featureStyleFunctions from '@/features/landing/styles/CompanionTabs.041fdf27.styles.js';

import inlineStyles from '@/features/landing/styles/CompanionTabs.styles';


import React from 'react';
import { Bot, BookMarked, MessageSquare, Award, ChevronRight, Minimize2 } from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export const TABS = [
  {
    id: 'ask_vedika',
    label: 'Ask Vedika',
    subtitle: 'AI Explanation',
    Icon: Bot,
    color: '#A855F7' // Vedika AI Purple
  },
  {
    id: 'notes',
    label: 'Personal Notes',
    subtitle: 'Timestamped',
    Icon: BookMarked,
    color: '#00D4FF' // Vedika Labs Physics Cyan
  },
  {
    id: 'qa',
    label: 'Lesson Q&A',
    subtitle: 'Ask Video',
    Icon: MessageSquare,
    color: '#10B981' // Vedika AI Viva Green / Emerald
  },
  {
    id: 'quiz',
    label: 'Practice Quiz',
    subtitle: 'AI Test',
    Icon: Award,
    color: '#F59E0B' // Vedika AI Puzzle / Labs Biology Amber
  }
];

export default function CompanionTabs({
  activeTab = 'ask_vedika',
  onSelectTab,
  notesCount = 0,
  qaCount = 0,
  vertical = false,
  isExpanded = false,
  onCollapse
}) {
  // VERTICAL COLUMN MODE: Shown beside the lesson player / drawer
  if (vertical) {
    return (
      <div style={inlineStyles.s0}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;
          const count = tab.id === 'notes' ? notesCount : tab.id === 'qa' ? qaCount : 0;
          const isMerged = isActive && isExpanded;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              title={`${tab.label} (${tab.subtitle})`}
              style={featureStyleFunctions.s0({isMerged,isActive,tab,T})}
            >
              {isMerged && (
                <>
                  {/* Smooth top concave fillet curve blending into panel */}
                  <svg
                    style={inlineStyles.s1}
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M 0,0 A 16 16 0 0 0 16,16 L 0,16 Z"
                      fill={T.s1}
                    />
                    <line x1="0" y1="0" x2="0" y2="16" stroke={T.s1} strokeWidth="3" />
                    <path
                      d="M 0,0 A 16 16 0 0 0 16,16"
                      fill="none"
                      stroke={tab.color}
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Smooth bottom concave fillet curve blending into panel */}
                  <svg
                    style={inlineStyles.s2}
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M 16,0 A 16 16 0 0 0 0,16 L 0,0 Z"
                      fill={T.s1}
                    />
                    <line x1="0" y1="0" x2="0" y2="16" stroke={T.s1} strokeWidth="3" />
                    <path
                      d="M 16,0 A 16 16 0 0 0 0,16"
                      fill="none"
                      stroke={tab.color}
                      strokeWidth="1.5"
                    />
                  </svg>
                </>
              )}
              <div style={inlineStyles.s3}>
                <Icon size={20} style={featureStyleFunctions.s1({isActive,tab})} />
                {count > 0 && (
                  <span style={featureStyleFunctions.s2({tab})}>
                    {count}
                  </span>
                )}
              </div>
              <span style={featureStyleFunctions.s3({isActive,T})}>
                {tab.label}
              </span>
              <span style={featureStyleFunctions.s4({isActive,tab})}>
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // HORIZONTAL ROW MODE: Shown when sidebar is in 50-50 expanded state
  return (
    <div style={inlineStyles.s4}>
      <div style={featureStyleFunctions.s5({T})}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;
          const count = tab.id === 'notes' ? notesCount : tab.id === 'qa' ? qaCount : 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              style={featureStyleFunctions.s6({isActive,tab,T})}
            >
              <div style={inlineStyles.s5}>
                <Icon size={14} style={featureStyleFunctions.s7({isActive,tab})} />
                <span style={featureStyleFunctions.s8({isActive})}>
                  {tab.label}
                </span>
                {count > 0 && (
                  <span style={featureStyleFunctions.s9({isActive,tab,T})}>
                    {count}
                  </span>
                )}
              </div>
              <span style={featureStyleFunctions.s10({isActive})}>
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          title="Minimize to 10% sidebar (90-10 view)"
          style={featureStyleFunctions.s11({T})}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#FFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.s2 || '#0E1322';
            e.currentTarget.style.color = T.muted || '#94A3B8';
          }}
        >
          <Minimize2 size={13} />
          <span>90:10</span>
        </button>
      )}
    </div>
  );
}
