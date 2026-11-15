export const s0 = ({T}) => ({
      background: `linear-gradient(135deg, ${T.s2}cc, ${T.s1}aa)`,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: '16px 20px',
      marginBottom: 16,
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    });

export const s1 = ({T}) => ({ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${T.border}`, paddingBottom: 10, justifyContent: 'space-between' });

export const s2 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: '0.04em', textTransform: 'uppercase' });

export const s3 = ({bugCount,T}) => ({
            background: bugCount > 0 ? `${T.red}18` : `${T.green}18`,
            border: `1px solid ${bugCount > 0 ? T.red + '40' : T.green + '40'}`,
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 700,
            color: bugCount > 0 ? T.red : T.green
          });

export const s4 = ({T}) => ({ background: T.s3, borderRadius: 10, padding: '10px 12px', border: `1px solid ${T.border}` });

export const s5 = ({T}) => ({ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 });

export const s6 = ({T}) => ({ fontSize: 14, fontWeight: 800, color: T.amber });

export const s7 = ({T}) => ({ background: T.s3, borderRadius: 10, padding: '10px 12px', border: `1px solid ${T.border}` });

export const s8 = ({T}) => ({ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 });

export const s9 = ({T}) => ({ fontSize: 14, fontWeight: 800, color: T.purple });

export const s10 = ({T}) => ({ background: T.s3, borderRadius: 10, padding: '10px 12px', border: `1px solid ${T.border}` });

export const s11 = ({T}) => ({ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 });

export const s12 = ({sevColor}) => ({ fontSize: 14, fontWeight: 800, color: sevColor });

export const s13 = ({T}) => ({ background: T.s3, borderRadius: 10, padding: '10px 12px', border: `1px solid ${T.border}` });

export const s14 = ({T}) => ({ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 });

export const s15 = ({optColor}) => ({ fontSize: 14, fontWeight: 800, color: optColor });

export const s16 = ({T}) => ({ fontSize: 10.5, color: T.muted, fontWeight: 600 });

export const s17 = ({T}) => ({
              background: `${T.accent}12`,
              border: `1px solid ${T.accent}30`,
              color: T.accent,
              borderRadius: 6,
              padding: '1px 8px',
              fontSize: 10.5,
              fontWeight: 600
            });

export const s18 = ({T}) => ({ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: 6 });

export const s19 = ({T,modeColors,mode}) => ({ width: '100%', appearance: 'none', background: T.s2, border: `1px solid ${modeColors[mode] + '50' || T.border}`, borderRadius: 8, padding: '8px 12px', color: modeColors[mode] || T.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' });

export const s20 = ({T}) => ({ background: T.s1, color: T.text });

export const s21 = ({T}) => ({ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: 6 });

export const s22 = ({T,length}) => ({ width: '100%', appearance: 'none', background: T.s2, border: `1px solid ${length === 'Short' ? T.amber + '50' : length === 'Medium' ? T.accent + '50' : T.purple + '50'}`, borderRadius: 8, padding: '8px 12px', color: length === 'Short' ? T.amber : length === 'Medium' ? T.accent : T.purple, fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' });

export const s23 = ({T}) => ({ background: T.s1, color: T.text });

export const s24 = ({T}) => ({ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 });

export const s25 = ({T}) => ({ fontSize: 10, color: T.dim, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 4px', marginBottom: 4 });

export const s26 = ({isActive,T}) => ({
                        width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: 'none',
                        background: isActive ? `${T.amber}15` : 'transparent',
                        color: isActive ? T.text : T.muted, cursor: 'pointer', fontSize: 12,
                        display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit',
                      });

export const s27 = ({T}) => ({
                        width: 20, height: 20, borderRadius: 6,
                        background: `${T.amber}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      });

export const s28 = ({isActive}) => ({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400, flex: 1 });

export const s29 = ({T}) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: T.bg, color: T.text });

export const s30 = ({T}) => ({ marginTop: 16, fontSize: 14, color: T.muted, fontWeight: 500 });

export const s31 = ({bgTheme,T}) => ({ display: 'flex', height: '100%', maxHeight: '100%', width: '100%', background: bgTheme === 'black' ? '#000000' : T.bg, overflow: 'hidden' });

export const s32 = ({isMobile,leftNavView}) => ({
                position: 'fixed',
                bottom: 84,
                left: 20,
                top: 'auto',
                height: 'auto',
                maxHeight: 'calc(100vh - 120px)',
                width: isMobile ? 'calc(100vw - 40px)' : (leftNavView === 'history' ? 340 : 260),
                background: 'rgba(10, 18, 38, 0.94)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 20,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 24px rgba(56, 189, 248, 0.2)',
                zIndex: 1100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: 12,
                padding: '14px 12px',
                animation: 'slideInLeftDrawer 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                overflowY: 'auto'
              });

export const s33 = ({isPlaygroundOpen}) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '9px 14px',
                          borderRadius: 14,
                          background: isPlaygroundOpen ? 'rgba(6, 182, 212, 0.22)' : 'transparent',
                          border: isPlaygroundOpen ? '1px solid rgba(6, 182, 212, 0.45)' : '1px solid transparent',
                          color: isPlaygroundOpen ? '#38BDF8' : '#E2E8F0',
                          fontSize: 13,
                          fontWeight: isPlaygroundOpen ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        });

export const s34 = ({activeTab}) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '9px 14px',
                          borderRadius: 14,
                          background: activeTab === 'text' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                          border: activeTab === 'text' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
                          color: activeTab === 'text' ? '#FFFFFF' : '#94A3B8',
                          fontSize: 13,
                          fontWeight: activeTab === 'text' ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        });

export const s35 = ({activeTab}) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '9px 14px',
                          borderRadius: 14,
                          background: activeTab === 'voice' ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                          border: activeTab === 'voice' ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid transparent',
                          color: activeTab === 'voice' ? '#FFFFFF' : '#94A3B8',
                          fontSize: 13,
                          fontWeight: activeTab === 'voice' ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        });

export const s36 = ({isCur,th}) => ({
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '7px 10px',
                                  borderRadius: 10,
                                  background: isCur ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                                  border: isCur ? `1.5px solid ${th.border || '#38BDF8'}` : '1px solid rgba(255, 255, 255, 0.07)',
                                  color: isCur ? '#FFFFFF' : '#94A3B8',
                                  fontSize: 11.5,
                                  fontWeight: isCur ? 700 : 500,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.15s',
                                  gridColumn: th.id === 'black' ? 'span 2' : 'span 1'
                                });

export const s37 = ({th}) => ({ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: th.color || '#38BDF8' });

export const s38 = ({isActive}) => ({
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 6,
                                  padding: '9px 11px',
                                  borderRadius: 12,
                                  background: isActive ? 'rgba(6, 182, 212, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                                  border: `1px solid ${isActive ? 'rgba(6, 182, 212, 0.55)' : 'rgba(255, 255, 255, 0.07)'}`,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                });

export const s39 = ({isActive}) => ({
                                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                                    fontSize: 12,
                                    fontWeight: isActive ? 700 : 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1
                                  });

export const s40 = ({modeColors,session,T}) => ({
                                        background: `${modeColors[session.mode] || T.amber}25`,
                                        color: modeColors[session.mode] || '#F59E0B',
                                        padding: '1px 5px',
                                        borderRadius: 4,
                                        fontWeight: 600
                                      });

export const s41 = ({bgTheme}) => ({ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', background: bgTheme === 'black' ? '#000000' : 'transparent' });

export const s42 = ({isMobile}) => ({
                    position: 'absolute',
                    top: 14,
                    left: isMobile ? 12 : 20,
                    zIndex: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.68)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(6, 182, 212, 0.35)',
                    color: '#E2E8F0',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.15s ease'
                  });

export const s43 = ({isMobile}) => ({
                  position: 'absolute',
                  top: 14,
                  right: isMobile ? 12 : 20,
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '4px 8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                });

export const s44 = ({isPlaygroundOpen}) => ({
                      background: isPlaygroundOpen ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                      border: isPlaygroundOpen ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid transparent',
                      color: isPlaygroundOpen ? '#38BDF8' : '#CBD5E1',
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      transition: 'all 0.15s',
                      fontFamily: 'inherit'
                    });

export const s45 = ({activeTab}) => ({
                        border: 'none',
                        background: activeTab === 'text' ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                        color: activeTab === 'text' ? '#FFFFFF' : '#94A3B8',
                        borderRadius: 8,
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: activeTab === 'text' ? 700 : 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      });

export const s46 = ({activeTab}) => ({
                        border: 'none',
                        background: activeTab === 'voice' ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                        color: activeTab === 'voice' ? '#FFFFFF' : '#94A3B8',
                        borderRadius: 8,
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: activeTab === 'voice' ? 700 : 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      });

export const s47 = ({isMobile}) => ({ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', padding: isMobile ? '16px 14px 110px' : '24px 24px 125px' });

export const s48 = ({rGap,msgMaxW}) => ({ display: 'flex', gap: rGap, marginBottom: 24, maxWidth: msgMaxW });

export const s49 = ({isMobile}) => ({ width: isMobile ? 32 : 38, height: isMobile ? 32 : 38, borderRadius: '50%', background: 'rgba(6, 182, 212, 0.18)', border: '1px solid rgba(6, 182, 212, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s50 = ({isMobile,bubbleMaxW}) => ({
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          width: 'fit-content',
                          maxWidth: isMobile ? '92%' : bubbleMaxW
                        });

export const s51 = ({isMobile}) => ({
                            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 25%, #7C3AED 55%, #9333EA 80%, #C026D3 100%)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '18px 18px 4px 18px',
                            padding: isMobile ? '10px 14px' : '12px 18px',
                            color: '#FFFFFF',
                            fontSize: isMobile ? 13.5 : 14,
                            fontWeight: 500,
                            lineHeight: 1.55,
                            width: 'fit-content',
                            maxWidth: '100%',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            textAlign: 'left',
                            boxShadow: '0 6px 20px -4px rgba(124, 58, 237, 0.3), 0 2px 6px rgba(0, 0, 0, 0.22)'
                          });

export const s52 = ({T}) => ({ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, borderTop: `1px solid ${T.border}`, paddingTop: 8 });

export const s53 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.muted });

export const s54 = ({T}) => ({ fontWeight: 500, color: T.text });

export const s55 = ({T}) => ({ fontSize: 10, color: T.dim, marginTop: 4, textAlign: 'right' });

export const s56 = ({msgMaxW}) => ({ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: msgMaxW, marginBottom: 20 });

export const s57 = ({T}) => ({ width: 26, height: 26, borderRadius: '50%', background: `${T.amber}25`, border: `1px solid ${T.amber}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s58 = ({T}) => ({ fontSize: 11, color: T.amber, fontWeight: 700, letterSpacing: '0.05em' });

export const s59 = ({bubbleMaxW,isMobile}) => ({
                            maxWidth: bubbleMaxW,
                            background: 'linear-gradient(135deg, rgba(10, 77, 74, 0.95) 0%, rgba(12, 80, 95, 0.95) 32%, rgba(16, 68, 107, 0.95) 68%, rgba(24, 40, 72, 0.95) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            borderRadius: '18px',
                            padding: isMobile ? '12px 14px' : '16px 20px',
                            color: '#F8FAFC',
                            fontSize: isMobile ? 13.5 : 14,
                            lineHeight: 1.7,
                            boxShadow: '0 10px 32px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(12, 80, 95, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
                          });

export const s60 = ({T}) => ({ marginTop: 16, background: T.s1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' });

export const s61 = ({T}) => ({ fontSize: 12, color: T.muted });

export const s62 = ({T}) => ({ background: 'none', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer' });

export const s63 = ({T}) => ({ color: T.text, fontSize: 14, fontWeight: 600, marginBottom: 14, lineHeight: 1.5 });

export const s64 = ({bg,bd,cl,answered}) => ({ background: bg, border: `1px solid ${bd}`, borderRadius: 9, padding: '10px 14px', color: cl, fontSize: 13, cursor: answered ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s' });

export const s65 = ({msg,T}) => ({ fontSize: 13, color: msg.features.quiz.currentAnswer === msg.features.quiz.questions[msg.features.quiz.currentIdx].correct ? T.green : T.red, fontWeight: 600 });

export const s66 = ({T}) => ({ background: T.s3, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 7, padding: '6px 14px', fontSize: 12, cursor: 'pointer' });

export const s67 = ({T}) => ({ background: T.accent, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 });

export const s68 = ({T}) => ({ fontSize: 12, color: T.muted });

export const s69 = ({T}) => ({ textAlign: 'center', padding: '20px 0', color: T.muted });

export const s70 = ({T}) => ({ fontSize: 12, color: T.muted });

export const s71 = ({T}) => ({ background: 'none', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer' });

export const s72 = ({msg,T}) => ({ background: msg.features.flashcards.flipped ? `${T.amber}15` : T.s3, border: `1px solid ${msg.features.flashcards.flipped ? T.amber + '40' : T.border}`, borderRadius: 14, padding: '32px 24px', minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.3s' });

export const s73 = ({T}) => ({ fontSize: 11, color: T.muted, letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' });

export const s74 = ({T,msg}) => ({ fontSize: 15, color: T.text, fontWeight: msg.features.flashcards.flipped ? 400 : 600, lineHeight: 1.6 });

export const s75 = ({T}) => ({ marginTop: 12, fontSize: 11, color: T.dim });

export const s76 = ({T}) => ({ background: T.s3, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 13 });

export const s77 = ({T}) => ({ background: T.s3, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 13 });

export const s78 = ({msg,i,T}) => ({ width: 6, height: 6, borderRadius: '50%', background: msg.features.flashcards.currentIdx === i ? T.amber : T.dim, transition: 'all 0.2s' });

export const s79 = ({T}) => ({ textAlign: 'center', padding: '20px 0', color: T.muted });

export const s80 = ({T}) => ({ background: `${T.green}10`, border: `1px solid ${T.green}30`, borderRadius: 10, padding: '14px 18px' });

export const s81 = ({T}) => ({ fontSize: 11, color: T.green, fontWeight: 700, letterSpacing: '0.05em' });

export const s82 = ({T}) => ({ background: 'none', border: `1px solid ${T.green}40`, color: T.green, borderRadius: 6, padding: '2px 10px', fontSize: 11, cursor: 'pointer' });

export const s83 = ({T}) => ({ color: T.text, fontSize: 14, lineHeight: 1.7 });

export const s84 = ({T}) => ({ textAlign: 'center', padding: '20px 0', color: T.muted });

export const s85 = ({T}) => ({ background: `${T.accent}10`, border: `1px solid ${T.accent}30`, borderRadius: 10, padding: '14px 18px' });

export const s86 = ({T}) => ({ fontSize: 11, color: T.accent, fontWeight: 700, letterSpacing: '0.05em' });

export const s87 = ({T}) => ({ background: 'none', border: `1px solid ${T.accent}40`, color: T.accent, borderRadius: 6, padding: '2px 10px', fontSize: 11, cursor: 'pointer' });

export const s88 = ({T}) => ({ color: T.text, fontSize: 14, lineHeight: 1.7 });

export const s89 = ({T}) => ({ textAlign: 'center', padding: '20px 0', color: T.muted });

export const s90 = ({isActive,s,loading}) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    padding: '6px 12px',
                                    borderRadius: 16,
                                    background: isActive ? s.color : (loading ? '#0f172a' : '#050814'),
                                    border: isActive ? `1px solid ${s.color}` : `1px solid ${s.color}65`,
                                    color: isActive ? '#fff' : (s.color === '#64748B' ? '#e2e8f0' : s.color),
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s',
                                    boxShadow: isActive ? `0 2px 10px ${s.color}50` : '0 2px 8px rgba(0,0,0,0.7)'
                                  });

export const s91 = ({msgMaxW}) => ({ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: msgMaxW, marginBottom: 20 });

export const s92 = ({T}) => ({ width: 26, height: 26, borderRadius: '50%', background: `${T.amber}25`, border: `1px solid ${T.amber}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s93 = ({T}) => ({ fontSize: 11, color: T.amber, fontWeight: 700, letterSpacing: '0.05em' });

export const s94 = ({bubbleMaxW,isMobile}) => ({
                    maxWidth: bubbleMaxW,
                    background: 'linear-gradient(135deg, rgba(10, 77, 74, 0.95) 0%, rgba(12, 80, 95, 0.95) 32%, rgba(16, 68, 107, 0.95) 68%, rgba(24, 40, 72, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '18px',
                    padding: isMobile ? '12px 14px' : '16px 20px',
                    boxShadow: '0 10px 32px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(12, 80, 95, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
                  });

export const s95 = ({msgMaxW}) => ({ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: msgMaxW, marginBottom: 20 });

export const s96 = ({T}) => ({ width: 26, height: 26, borderRadius: '50%', background: `${T.amber}25`, border: `1px solid ${T.amber}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export const s97 = ({T}) => ({ fontSize: 11, color: T.amber, fontWeight: 700, letterSpacing: '0.05em' });

export const s98 = ({T}) => ({ maxWidth: 720, marginBottom: 16, color: T.red, fontSize: 12, background: `${T.red}12`, padding: '10px 14px', borderRadius: 8, border: `1px solid ${T.red}30` });

export const s99 = ({T}) => ({ maxWidth: 720, marginBottom: 10, color: T.red, fontSize: 11, background: `${T.red}12`, padding: '8px 12px', borderRadius: 6, border: `1px solid ${T.red}20` });

export const s100 = ({msgMaxW}) => ({ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, maxWidth: msgMaxW });

export const s101 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 6, background: T.s2, border: `1px solid ${T.border}`, padding: '4px 10px', borderRadius: 14, fontSize: 11 });

export const s102 = ({T}) => ({ color: T.muted });

export const s103 = ({T}) => ({ color: T.text, fontWeight: 500 });

export const s104 = ({doc,T}) => ({ 
                        fontSize: 9, 
                        fontWeight: 700, 
                        color: doc.status === 'completed' ? T.green : doc.status === 'failed' ? T.red : T.amber,
                        textTransform: 'uppercase'
                      });

export const s105 = ({T}) => ({ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', padding: 0, marginLeft: 4 });

export const s106 = ({isMobile}) => ({
              position: 'absolute',
              bottom: isMobile ? 96 : 112,
              left: 0,
              right: 0,
              margin: '0 auto',
              width: 'fit-content',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 20,
              padding: '4px 14px',
              color: '#CBD5E1',
              fontSize: 11.5,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              zIndex: 32,
              boxShadow: 'none',
              transition: 'none'
            });

export const s107 = ({isMobile}) => ({
            position: 'absolute',
            bottom: isMobile ? 10 : 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? 'calc(100% - 24px)' : 'min(840px, calc(100% - 48px))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            zIndex: 35,
            pointerEvents: 'none',
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          });

export const s108 = ({isInputFocused,isMobile}) => ({
                pointerEvents: 'auto',
                flex: 1,
                minWidth: 0,
                background: isInputFocused 
                  ? 'linear-gradient(135deg, rgba(26, 22, 52, 0.96) 0%, rgba(18, 24, 46, 0.96) 50%, rgba(14, 34, 54, 0.96) 100%)'
                  : 'linear-gradient(135deg, rgba(18, 16, 36, 0.94) 0%, rgba(14, 18, 32, 0.94) 50%, rgba(12, 24, 40, 0.94) 100%)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: isInputFocused ? '1px solid rgba(6, 182, 212, 0.55)' : '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: 18,
                padding: isMobile ? '10px 12px' : '12px 16px',
                boxShadow: isInputFocused
                  ? '0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.22), 0 0 18px rgba(99, 102, 241, 0.15)'
                  : '0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 25px rgba(6, 182, 212, 0.14)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                animation: 'fadeSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              });

export const s109 = ({isSelected,opt}) => ({
                          padding: '8px 14px',
                          background: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                          borderLeft: `3px solid ${isSelected ? opt.color : 'transparent'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'all 0.15s'
                        });

export const s110 = ({opt}) => ({ fontWeight: 700, color: opt.color, fontSize: 12.5 });

export const s111 = ({showLeftNav}) => ({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'none',
                          border: 'none',
                          color: showLeftNav ? '#06B6D4' : '#94A3B8',
                          cursor: 'pointer',
                          padding: 6,
                          borderRadius: 8,
                          transition: 'all 0.15s'
                        });

export const s112 = ({uploading}) => ({
                          background: 'none',
                          border: 'none',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          color: uploading ? '#06B6D4' : '#94A3B8',
                          padding: 6,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.15s'
                        });

export const s113 = ({modeColors,mode,T}) => ({ width: 5, height: 5, borderRadius: '50%', background: modeColors[mode] || T.amber, flexShrink: 0 });

export const s114 = ({isConfigOpen}) => ({ transform: isConfigOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' });

export const s115 = ({isSel,modeColors,m}) => ({
                                        padding: '5px 8px',
                                        borderRadius: 8,
                                        fontSize: 11,
                                        fontWeight: isSel ? 700 : 500,
                                        background: isSel ? `${modeColors[m] || '#06B6D4'}25` : 'rgba(255, 255, 255, 0.04)',
                                        border: isSel ? `1px solid ${modeColors[m] || '#06B6D4'}` : '1px solid transparent',
                                        color: isSel ? (modeColors[m] || '#FFFFFF') : '#94A3B8',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.12s'
                                      });

export const s116 = ({isSel}) => ({
                                        flex: 1,
                                        padding: '5px 8px',
                                        borderRadius: 8,
                                        fontSize: 11,
                                        fontWeight: isSel ? 700 : 500,
                                        background: isSel ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                        border: isSel ? '1px solid #06B6D4' : '1px solid transparent',
                                        color: isSel ? '#FFFFFF' : '#94A3B8',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.12s'
                                      });

export const s117 = ({loading}) => ({
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          background: loading ? '#334155' : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #9333EA 75%, #C026D3 100%)',
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 12px rgba(124, 58, 237, 0.35)',
                          transition: 'all 0.15s ease'
                        });

export const s118 = ({showLeftNav}) => ({
                      background: showLeftNav ? 'rgba(6, 182, 212, 0.25)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: showLeftNav ? '#22D3EE' : '#94A3B8',
                      padding: 6,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    });

export const s119 = ({uploading}) => ({
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 8,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      color: uploading ? '#06B6D4' : '#94A3B8',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    });

export const s120 = ({modeColors,mode,T}) => ({ width: 5, height: 5, borderRadius: '50%', background: modeColors[mode] || T.amber, flexShrink: 0 });

export const s121 = ({isConfigOpen}) => ({ transform: isConfigOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' });

export const s122 = ({isSel,modeColors,m}) => ({
                                      padding: '5px 8px',
                                      borderRadius: 8,
                                      fontSize: 11,
                                      fontWeight: isSel ? 700 : 500,
                                      background: isSel ? `${modeColors[m] || '#06B6D4'}25` : 'rgba(255, 255, 255, 0.04)',
                                      border: isSel ? `1px solid ${modeColors[m] || '#06B6D4'}` : '1px solid transparent',
                                      color: isSel ? (modeColors[m] || '#FFFFFF') : '#94A3B8',
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                      transition: 'all 0.12s'
                                    });

export const s123 = ({isSel}) => ({
                                      flex: 1,
                                      padding: '5px 8px',
                                      borderRadius: 8,
                                      fontSize: 11,
                                      fontWeight: isSel ? 700 : 500,
                                      background: isSel ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                                      border: isSel ? '1px solid #06B6D4' : '1px solid transparent',
                                      color: isSel ? '#FFFFFF' : '#94A3B8',
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                      transition: 'all 0.12s'
                                    });

export const s124 = ({loading}) => ({
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: loading ? '#334155' : 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: 'none',
                        transition: 'none'
                      });

export const s125 = ({isMobile}) => ({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(4, 5, 8, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '8px' : '40px'
              });

export const s126 = ({isMobile}) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '10px 14px' : '12px 18px',
                  background: '#080A0E',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  flexShrink: 0
                });
