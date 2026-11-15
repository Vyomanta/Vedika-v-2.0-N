'use client';
import * as featureStyleFunctions from '@/features/navigation/styles/Sidebar.310657c5.styles.js';

import inlineStyles from '@/features/navigation/styles/Sidebar.styles';


import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen, Brain, Code2, BarChart3, Home, Zap, LogOut, Briefcase, Award, FileText, FolderOpen, Sun, Moon,
  ChevronLeft, ChevronRight, ChevronDown, Plus, FlaskConical, Dna, Atom
} from 'lucide-react';
import { T, getTheme, setTheme } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import MobileNav from '@/components/MobileNav';

const NAV = [
  { id: '/',              Icon: Home,          label: 'Dashboard'     },
  { id: '/courses',       Icon: BookOpen,      label: 'Courses'       },
  { id: '/vedika-ai',     Icon: Brain,         label: 'Vedika AI'     },
  { id: '/vedika-labs',   Icon: FlaskConical,  label: 'Vedika Labs'   },
  { id: '/jobs',          Icon: Briefcase,     label: 'Jobs'          },
  { id: '/progress',      Icon: BarChart3,     label: 'Progress'      },
];

export default function Sidebar({ isCollapsed = false, onToggleCollapse }) {
  const pathname = usePathname();
  const router   = useRouter();
  const isMobile = useMediaQuery(isMobileMQ);
  const isGeneralTutor = pathname.startsWith('/vedika-ai/ask');
  const isCodingTutor = pathname.startsWith('/vedika-ai/code');
  const isTutorPage = isGeneralTutor || isCodingTutor;

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('frappe_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Group date labels for history
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

  // Load tutor session history initially or on route changes
  const loadTutorSessions = () => {
    if (!isTutorPage) return;
    const textKey = isGeneralTutor ? 'general-tutor-sessions' : 'coding-tutor-sessions';
    const activeKey = isGeneralTutor ? 'current-general-tutor-session-id' : 'current-coding-tutor-session-id';

    try {
      const rawText = localStorage.getItem(textKey);
      const textSess = rawText ? JSON.parse(rawText) : [];

      const all = [...textSess];
      all.sort((a, b) => {
        const ta = new Date(a.timestamp || 0).getTime();
        const tb = new Date(b.timestamp || 0).getTime();
        return tb - ta;
      });
      setSessions(all);

      const activeId = typeof window !== 'undefined' ? (sessionStorage.getItem(activeKey) || null) : null;
      setCurrentSessionId(activeId);
    } catch (e) {
      console.error('Error loading sessions in Sidebar:', e);
    }
  };

  useEffect(() => {
    loadTutorSessions();
    setDropdownOpen(false); // Reset dropdown on navigate
  }, [pathname]);

  // Synchronize tutor state on custom event update from GeneralTutor / CodingTutor
  useEffect(() => {
    const handleStateUpdate = (e) => {
      const { currentSessionId: eventSid, textSessions, type } = e.detail;
      const expectedType = isGeneralTutor ? 'general-tutor' : 'coding-tutor';
      if (type !== expectedType) return;

      const all = [...(textSessions || [])];
      all.sort((a, b) => {
        const ta = new Date(a.timestamp || 0).getTime();
        const tb = new Date(b.timestamp || 0).getTime();
        return tb - ta;
      });
      setSessions(all);
      setCurrentSessionId(eventSid);
    };

    window.addEventListener('tutor-state-update', handleStateUpdate);
    return () => {
      window.removeEventListener('tutor-state-update', handleStateUpdate);
    };
  }, [isGeneralTutor, isCodingTutor]);

  const handleSelectSession = (session) => {
    const eventName = isGeneralTutor ? 'select-general-tutor-session' : 'select-coding-tutor-session';
    window.dispatchEvent(new CustomEvent(eventName, { detail: session }));
  };

  const handleNewSession = () => {
    const eventName = isGeneralTutor ? 'new-general-tutor-session' : 'new-coding-tutor-session';
    window.dispatchEvent(new Event(eventName));
  };

  const groupedSessions = useMemo(() => {
    const groups = {};
    for (const session of sessions) {
      const label = getDateLabel(session.timestamp || session.startedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(session);
    }
    return groups;
  }, [sessions]);

  const orderedGroups = ['Today', 'Yesterday', 'This Week', 'Older'];

  // Inject padding so content clears the fixed MobileNav top bar
  useEffect(() => {
    if (isMobile && !isTutorPage) {
      const el = document.createElement('style');
      el.id = 'sidebar-mobile-pad';
      el.textContent = '.sidebar-content-area { padding-top: 48px !important; }';
      document.head.appendChild(el);
      return () => { document.getElementById('sidebar-mobile-pad')?.remove(); };
    }
  }, [isMobile, isTutorPage]);

  if (isMobile && isTutorPage) return null;

  const isActive = (navId) => {
    if (navId === '/') return pathname === '/';
    return pathname.startsWith(navId);
  };

  // ── Mobile: fixed top bar + centered menu ──
  if (isMobile) {
    return (
      <MobileNav
        title="AI TUTOR"
        accent={T.accent}
        items={[
          ...NAV.map(({ id, Icon, label }) => ({
            href: id, Icon, label,
          })),
          {
            label: 'Log Out',
            Icon: LogOut,
            onClick: () => {
              localStorage.removeItem('frappe_user');
              localStorage.removeItem('frappe_sid');
              window.location.href = '/login';
            }
          }
        ]}
      />
    );
  }

  // ── Desktop: vertical sidebar ──
  return (
    <div style={featureStyleFunctions.s0({isCollapsed,T})}>
      {/* Floating Toggle Button */}
      <button
        onClick={onToggleCollapse}
        style={featureStyleFunctions.s1({T})}
        onMouseEnter={e => e.currentTarget.style.color = T.accent}
        onMouseLeave={e => e.currentTarget.style.color = T.muted}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div style={featureStyleFunctions.s2({isCollapsed,T})}>
        <div style={featureStyleFunctions.s3({isCollapsed})}>
          <div style={featureStyleFunctions.s4({isCollapsed})}>
            <div style={featureStyleFunctions.s5({T})}>
              <Zap size={18} color={T.accent} />
            </div>
            {!isCollapsed && (
              <div>
                <div style={featureStyleFunctions.s6({T})}>AI TUTOR</div>
                <div style={featureStyleFunctions.s7({T})}>Learning Platform</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
              style={featureStyleFunctions.s8({T})}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.accent; e.currentTarget.style.background = `${T.accent}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = `${T.accent}12`; }}
              title={`Switch to ${getTheme() === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {getTheme() === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
            style={featureStyleFunctions.s9({T})}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.accent; e.currentTarget.style.background = `${T.accent}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = `${T.accent}12`; }}
            title={`Switch to ${getTheme() === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {getTheme() === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <div 
        className="no-scrollbar"
        style={featureStyleFunctions.s10({isCollapsed})}
      >
        {isTutorPage ? (
          <>
            {isCollapsed ? (
              <button
                onClick={onToggleCollapse}
                style={featureStyleFunctions.s11({T})}
                title={`Expand for ${isGeneralTutor ? 'Ask your AI Tutor' : 'Code With AI Tutor'}`}
              >
                {isGeneralTutor ? <Brain size={16} /> : <Code2 size={16} />}
              </button>
            ) : (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={featureStyleFunctions.s12({T,dropdownOpen})}
              >
                <div style={inlineStyles.s0}>
                  {isGeneralTutor ? <Brain size={16} /> : <Code2 size={16} />}
                  <span>{isGeneralTutor ? 'Ask your AI Tutor' : 'Code with AI Tutor'}</span>
                </div>
                <ChevronDown
                  size={14}
                  style={featureStyleFunctions.s13({dropdownOpen})}
                />
              </button>
            )}

            {/* Dropdown Items (Animate height & opacity) */}
            {!isCollapsed && (
              <div style={featureStyleFunctions.s14({dropdownOpen,T})}>
                {NAV.map(({ id, Icon, label }) => {
                  const active = isActive(id);
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        router.push(id);
                        setDropdownOpen(false);
                      }}
                      style={featureStyleFunctions.s15({active,T})}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.s2; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Icon size={15} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tutor Session History */}
            {isCollapsed ? (
              <div style={inlineStyles.s1}>
                <button
                  onClick={handleNewSession}
                  style={featureStyleFunctions.s16({T})}
                  title="New Chat"
                >
                  <Plus size={14} />
                </button>
                {sessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  const isVoice = session.messages?.some(m => m.isVoice || m.sender === 'student') || session.type === 'voice';
                  return (
                    <button
                      key={'session-' + session.id}
                      onClick={() => handleSelectSession(session)}
                      style={featureStyleFunctions.s17({isActive,T})}
                      title={session.label || 'Untitled'}
                    >
                      <span style={featureStyleFunctions.s18({isVoice,T})}>
                        {isVoice ? <Zap size={11} color={T.accent} /> : <Brain size={11} color={T.purple} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                {/* "+ New Chat" Button */}
                <button
                  onClick={handleNewSession}
                  style={featureStyleFunctions.s19({T})}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.color = T.accent;
                    e.currentTarget.style.background = `${T.accent}05`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Plus size={14} />
                  <span>New Chat</span>
                </button>

                {/* History List */}
                <div style={inlineStyles.s2}>
                  {orderedGroups.map((group) => {
                    const items = groupedSessions[group];
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={group} style={inlineStyles.s3}>
                        <div style={featureStyleFunctions.s20({T})}>
                          {group}
                        </div>
                        <div style={inlineStyles.s4}>
                          {items.map((session) => {
                            const isActive = session.id === currentSessionId;
                            const isVoice = session.messages?.some(m => m.isVoice || m.sender === 'student') || session.type === 'voice';
                            return (
                              <button
                                key={'session-' + session.id}
                                onClick={() => handleSelectSession(session)}
                                style={featureStyleFunctions.s21({isActive,T})}
                                title={session.label || 'Untitled'}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.s2; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                              >
                                <span style={featureStyleFunctions.s22({isVoice,T})}>
                                  {isVoice ? <Zap size={11} color={T.accent} /> : <Brain size={11} color={T.purple} />}
                                </span>
                                <span style={featureStyleFunctions.s23({isActive})}>
                                  {session.label || 'Untitled'}
                                </span>
                                <span style={featureStyleFunctions.s24({T})}>
                                  {isVoice ? 'Voice/Text' : 'Text'}
                                  </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {sessions.length === 0 && (
                    <div style={featureStyleFunctions.s25({T})}>
                      No sessions yet
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {NAV.map(({ id, Icon, label }) => {
              const active = isActive(id);
              return (
                <button key={id} onClick={() => router.push(id)} style={featureStyleFunctions.s26({isCollapsed,active,T})}
                title={isCollapsed ? label : ""}
                >
                  <Icon size={16} />
                  {!isCollapsed && label}
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* User Profile */}
      <div style={featureStyleFunctions.s27({T,isCollapsed})}>
        <div style={featureStyleFunctions.s28({isCollapsed})}>
          <div style={featureStyleFunctions.s29({isCollapsed})}>
            <div style={featureStyleFunctions.s30({T})}>
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <div>
                <div style={featureStyleFunctions.s31({T})}>{user?.name || 'Student'}</div>
                <div style={featureStyleFunctions.s32({T})}>Free Plan</div>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('frappe_user');
              window.location.href = '/login';
            }}
            style={featureStyleFunctions.s33({T})}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.red; e.currentTarget.style.background = 'rgba(245, 91, 107, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = 'transparent'; }}
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
