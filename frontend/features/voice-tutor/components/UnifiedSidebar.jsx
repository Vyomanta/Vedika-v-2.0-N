'use client';
import * as featureStyleFunctions from '@/features/voice-tutor/styles/UnifiedSidebar.dcb93520.styles.js';

import inlineStyles from '@/features/voice-tutor/styles/UnifiedSidebar.styles';


import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/shared/design-system/theme';
import { Brain, Zap, ArrowLeft, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';

function getDateLabel(dateStr) {
  if (!dateStr) return 'Older';
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekStart) return 'This Week';
  return 'Older';
}

export default function UnifiedSidebar({ sessions, currentSessionId, onSelectSession, onBack, mobileTopOffset, showMenuButton = true }) {
  const router = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const [open, setOpen] = useState(false);

  // Read collapsed state from localStorage (only in desktop)
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCollapsed(localStorage.getItem('tutor_sidebar_collapsed') === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutor_sidebar_collapsed', String(nextState));
    }
  };

  const grouped = useMemo(() => {
    const groups = {};
    if (!sessions) return groups;
    for (const session of sessions) {
      const label = getDateLabel(session.timestamp || session.startedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(session);
    }
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => {
        const ta = new Date(a.timestamp || a.startedAt).getTime();
        const tb = new Date(b.timestamp || b.startedAt).getTime();
        return tb - ta;
      });
    }
    return groups;
  }, [sessions]);

  const orderedGroups = ['Today', 'Yesterday', 'This Week', 'Older'];

  const handleBack = () => {
    if (onBack) onBack();
    else router.push('/');
    if (isMobile) setOpen(false);
  };

  const handleSelect = (session) => {
    onSelectSession(session);
    if (isMobile) setOpen(false);
  };

  const sidebarContent = (
    <div style={featureStyleFunctions.s0({isMobile,isCollapsed,T})}>
      {/* Floating Toggle Button (Desktop only) */}
      {!isMobile && (
        <button
          onClick={toggleCollapse}
          style={featureStyleFunctions.s1({T})}
          onMouseEnter={e => e.currentTarget.style.color = T.accent}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}
          title={isCollapsed ? "Expand History" : "Collapse History"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}

      {/* Header Area */}
      <div style={featureStyleFunctions.s2({isCollapsed,isMobile,T})}>
        {/* Back Button */}
        <div style={featureStyleFunctions.s3({isCollapsed,isMobile})}>
          <button onClick={handleBack} style={featureStyleFunctions.s4({T})} title="Back to Home">
            <ArrowLeft size={14} />
            {(!isCollapsed || isMobile) && <span>Back to Home</span>}
          </button>
          {isMobile && (
            <button onClick={() => setOpen(false)} style={featureStyleFunctions.s5({T})}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Brand/Title */}
        <div style={featureStyleFunctions.s6({isCollapsed,isMobile})}>
          <div style={featureStyleFunctions.s7({T})} title="Tutor History">
            <Brain size={16} color={T.purple} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <div style={featureStyleFunctions.s8({T})}>AI TUTOR</div>
              <div style={featureStyleFunctions.s9({T})}>Tutor History</div>
            </div>
          )}
        </div>
      </div>

      {/* Session Navigation */}
      <nav style={featureStyleFunctions.s10({isCollapsed,isMobile})}>
        {orderedGroups.map((group) => {
          const items = grouped[group];
          if (!items || items.length === 0) return null;
          return (
            <div key={group} style={inlineStyles.s0}>
              {(!isCollapsed || isMobile) && (
                <div style={featureStyleFunctions.s11({T})}>
                  {group}
                </div>
              )}
              {items.map((session) => {
                const isActive = session.id === currentSessionId;
                const isVoice = session.type === 'voice';
                return (
                  <button
                    key={session.type + '-' + session.id}
                    onClick={() => handleSelect(session)}
                    style={featureStyleFunctions.s12({isActive,T,isCollapsed,isMobile})}
                    title={session.label || 'Untitled'}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.s2; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={featureStyleFunctions.s13({isVoice,T})}>
                      {isVoice ? <Zap size={11} color={T.accent} /> : <Brain size={11} color={T.purple} />}
                    </span>
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span style={featureStyleFunctions.s14({isActive})}>
                          {session.label || 'Untitled'}
                        </span>
                        <span style={featureStyleFunctions.s15({T})}>{isVoice ? 'Voice' : 'Text'}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
        {(!sessions || sessions.length === 0) && (
          <div style={featureStyleFunctions.s16({T})}>
            {isCollapsed && !isMobile ? '—' : 'No sessions yet'}
          </div>
        )}
      </nav>

      {/* Settings Area */}
      <div style={featureStyleFunctions.s17({T,isCollapsed,isMobile})}>
        <button style={featureStyleFunctions.s18({T})}
          title="Settings"
          onMouseEnter={e => { e.currentTarget.style.background = T.s2; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <Settings size={14} />
        </button>
      </div>
    </div>
  );

  if (isMobile && !showMenuButton) {
    return sidebarContent;
  }

  if (isMobile) {
    return (
      <>
        {!open && (
          <button onClick={() => setOpen(true)} style={featureStyleFunctions.s19({mobileTopOffset,T})}>
            <Menu size={20} />
          </button>
        )}
        {open && (
          <div style={inlineStyles.s1}>
            <div style={inlineStyles.s2}>{sidebarContent}</div>
            <div style={inlineStyles.s3} onClick={() => setOpen(false)} />
          </div>
        )}
      </>
    );
  }

  return sidebarContent;
}
