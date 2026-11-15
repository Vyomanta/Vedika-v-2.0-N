export const s0 = ({T,isStackedLayout,isMobile}) => ({
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      background: T.bg,
      minHeight: '100%',
      height: isStackedLayout ? 'auto' : 'calc(100vh - 64px)',
      maxHeight: isStackedLayout ? 'none' : 'calc(100vh - 64px)',
      overflowY: isStackedLayout ? 'auto' : 'hidden',
      overflowX: 'hidden',
      fontFamily: 'var(--font-outfit), sans-serif',
      boxSizing: 'border-box',
      padding: isMobile ? '8px 10px' : '10px 20px'
    });

export const s1 = ({isStackedLayout}) => ({
        width: '100%',
        maxWidth: 1600,
        margin: '0 auto',
        height: isStackedLayout ? 'auto' : '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: isStackedLayout ? 'visible' : 'hidden'
      });

export const s2 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: T.muted,
                cursor: 'pointer',
                fontSize: 13,
                padding: '4px 2px',
                transition: 'color 0.15s'
              });

export const s3 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: T.s2,
                border: `1px solid ${T.border}`,
                color: T.text,
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'all 0.15s ease'
              });

export const s4 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: `${T.accent}15`,
                border: `1px solid ${T.accent}40`,
                color: T.accent,
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: 8,
                transition: 'all 0.15s'
              });

export const s5 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: T.green,
                fontSize: 12,
                fontWeight: 600,
                background: `${T.green}14`,
                border: `1px solid ${T.green}30`,
                padding: '6px 12px',
                borderRadius: 8
              });

export const s6 = ({T}) => ({
                  background: T.green,
                  color: '#000',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  transition: 'opacity 0.15s'
                });

export const s7 = ({T}) => ({
                  background: T.s2,
                  border: `1px solid ${T.border}`,
                  color: T.text,
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                });

export const s8 = ({isStackedLayout}) => ({
          display: 'flex',
          flex: 1,
          minHeight: 0,
          height: isStackedLayout ? 'auto' : 'calc(100% - 46px)',
          flexDirection: isStackedLayout ? 'column' : 'row',
          gap: isStackedLayout ? 16 : 14,
          alignItems: 'stretch',
          overflow: isStackedLayout ? 'visible' : 'hidden',
          overflowY: isStackedLayout ? 'auto' : 'hidden',
          width: '100%',
          boxSizing: 'border-box'
        });

export const s9 = ({isStackedLayout,isExpanded,T}) => ({
            flex: isStackedLayout ? 'none' : (isExpanded ? '0 0 calc(52% - 7px)' : '0 0 calc(94% - 7px)'),
            width: isStackedLayout ? '100%' : (isExpanded ? 'calc(52% - 7px)' : 'calc(94% - 7px)'),
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 14,
            border: `1px solid ${T.border}`,
            background: T.s1,
            overflow: 'hidden',
            minWidth: 0,
            height: isStackedLayout ? 'auto' : '100%',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box'
          });

export const s10 = ({isStackedLayout,T}) => ({
              padding: isStackedLayout ? '6px 10px' : '8px 14px',
              minHeight: 40,
              maxHeight: 40,
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: T.s2,
              gap: isStackedLayout ? 6 : 10,
              flexShrink: 0,
              boxSizing: 'border-box'
            });

export const s11 = ({isStackedLayout}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: isStackedLayout ? 6 : 8,
                minWidth: 0,
                overflow: 'hidden',
                flex: 1
              });

export const s12 = ({isStackedLayout,mod,T}) => ({
                  fontSize: isStackedLayout ? 10.5 : 11,
                  color: mod?.accent || T.accent,
                  background: `${mod?.accent || T.accent}18`,
                  padding: isStackedLayout ? '2px 6px' : '2px 8px',
                  borderRadius: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: isStackedLayout ? 1 : 0,
                  maxWidth: isStackedLayout ? 95 : 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                });

export const s13 = ({T,isStackedLayout}) => ({
                    color: T.text,
                    fontSize: isStackedLayout ? 12 : 13,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: isStackedLayout ? '1 1 auto' : 'initial'
                  });

export const s14 = ({T}) => ({
                    color: T.muted,
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  });

export const s15 = ({T}) => ({
                fontSize: 11,
                color: T.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
                whiteSpace: 'nowrap'
              });

export const s16 = ({isStackedLayout}) => ({
              flex: 1,
              minHeight: isStackedLayout ? 240 : 0,
              height: isStackedLayout ? 'auto' : 'calc(100% - 40px)',
              aspectRatio: isStackedLayout ? '16/9' : 'unset',
              background: '#000',
              overflow: 'hidden'
            });

export const s17 = ({isStackedLayout,isExpanded}) => ({
            flex: isStackedLayout
              ? 'none'
              : (isExpanded ? '0 0 calc(48% - 7px)' : '0 0 calc(6% - 7px)'),
            width: isStackedLayout
              ? '100%'
              : (isExpanded ? 'calc(48% - 7px)' : 'calc(6% - 7px)'),
            maxWidth: isStackedLayout
              ? '100%'
              : (isExpanded ? 'calc(48% - 7px)' : 'calc(6% - 7px)'),
            flexShrink: 0,
            display: 'flex',
            flexDirection: isStackedLayout ? 'column' : 'row',
            alignItems: 'stretch',
            height: isStackedLayout ? 'auto' : '100%',
            minHeight: 'auto',
            minWidth: 0,
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            gap: 0
          });

export const s18 = ({T}) => ({
                width: '100%',
                borderRadius: '16px',
                border: `1px solid ${T.border || 'rgba(255,255,255,0.1)'}`,
                background: T.s1 || '#0A0E1A',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
              });

export const s19 = ({T}) => ({
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 4,
                  background: T.s2 || '#0E1322',
                  padding: '6px',
                  boxSizing: 'border-box',
                  width: '100%'
                });

export const s20 = ({T}) => ({
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 3,
                          padding: '8px 2px',
                          borderRadius: 10,
                          border: '1.5px solid transparent',
                          background: 'transparent',
                          color: T.muted || '#94A3B8',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          position: 'relative',
                          boxSizing: 'border-box'
                        });

export const s21 = ({tab}) => ({
                              position: 'absolute',
                              top: -5,
                              right: -9,
                              fontSize: 9,
                              fontWeight: 800,
                              padding: '0 4px',
                              borderRadius: 8,
                              background: tab.color,
                              color: '#FFFFFF'
                            });

export const s22 = ({T}) => ({ fontSize: 10.5, fontWeight: 600, color: T.text || '#E2E8F0', whiteSpace: 'nowrap' });

export const s23 = ({isStackedLayout}) => ({
                  flex: isStackedLayout ? 'none' : 1,
                  width: '100%',
                  minWidth: 0,
                  height: isStackedLayout ? 'auto' : '100%',
                  maxHeight: isStackedLayout ? 'min(440px, calc(100vh - 270px))' : '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  zIndex: 1
                });

export const s24 = ({tabBorderRadius,isActive,tab,T}) => ({
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 2,
                              padding: '8px 2px 7px 2px',
                              borderRadius: tabBorderRadius,
                              borderTop: isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent',
                              borderLeft: isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent',
                              borderRight: isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent',
                              borderBottom: isActive ? `2.5px solid ${T.s1}` : '1.5px solid transparent',
                              background: isActive ? T.s1 : 'rgba(255, 255, 255, 0.04)',
                              boxShadow: isActive ? `0 -4px 16px ${tab.color}20` : 'none',
                              color: isActive ? '#FFFFFF' : (T.muted || '#94A3B8'),
                              cursor: 'pointer',
                              transition: 'all 0.18s ease',
                              position: 'relative',
                              boxSizing: 'border-box',
                              zIndex: isActive ? 6 : 2
                            });

export const s25 = ({isActive,tab}) => ({ color: isActive ? tab.color : 'inherit', transition: 'color 0.2s' });

export const s26 = ({tab}) => ({
                                  position: 'absolute',
                                  top: -5,
                                  right: -9,
                                  fontSize: 9,
                                  fontWeight: 800,
                                  padding: '0 4px',
                                  borderRadius: 8,
                                  background: tab.color,
                                  color: '#FFFFFF'
                                });

export const s27 = ({isActive,T}) => ({
                              fontSize: 10.5,
                              fontWeight: isActive ? 700 : 500,
                              textAlign: 'center',
                              lineHeight: 1.15,
                              color: isActive ? '#FFFFFF' : (T.text || '#E2E8F0'),
                              whiteSpace: 'nowrap'
                            });

export const s28 = ({isActive,tab}) => ({
                              fontSize: 8.5,
                              opacity: isActive ? 0.95 : 0.6,
                              textAlign: 'center',
                              lineHeight: 1.1,
                              color: isActive ? tab.color : 'inherit',
                              whiteSpace: 'nowrap'
                            });

export const s29 = ({isStackedLayout,panelBorderRadius,panelColor,T}) => ({
                    flex: 1,
                    width: '100%',
                    minWidth: 0,
                    height: isStackedLayout ? 'auto' : '100%',
                    maxHeight: isStackedLayout ? 'min(440px, calc(100vh - 270px))' : '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: panelBorderRadius,
                    border: `1.5px solid ${panelColor}`,
                    background: T.s1,
                    padding: 0,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${panelColor}15`,
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    position: 'relative',
                    zIndex: 3
                  });

export const s30 = ({panelColor}) => ({
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          background: `${panelColor}15`,
                          border: `1px solid ${panelColor}35`,
                          borderRadius: 6,
                          color: panelColor,
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        });

export const s31 = ({T}) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 14px 10px 14px',
                        borderBottom: `1px solid ${T.border}`,
                        flexShrink: 0
                      });

export const s32 = ({panelColor}) => ({
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: `${panelColor}20`,
                            color: panelColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          });

export const s33 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.2 });

export const s34 = ({T}) => ({ fontSize: 10, color: T.muted });

export const s35 = ({panelColor}) => ({
                            background: `${panelColor}12`,
                            border: `1px solid ${panelColor}30`,
                            borderRadius: 6,
                            color: panelColor,
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          });

export const s36 = ({isStackedLayout}) => ({
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    padding: isStackedLayout ? '12px' : '14px',
                    boxSizing: 'border-box'
                  });

export const s37 = ({T}) => ({
                          padding: 14,
                          borderRadius: 12,
                          background: T.s2,
                          border: `1px solid ${T.border}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8
                        });

export const s38 = ({panelColor}) => ({
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 12,
                              background: `${panelColor}20`,
                              color: panelColor,
                              border: `1px solid ${panelColor}40`
                            });

export const s39 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s40 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.text });

export const s41 = ({T}) => ({ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 });

export const s42 = ({T}) => ({
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: 11.5,
                            color: T.muted
                          });

export const s43 = ({panelColor}) => ({ color: panelColor, fontWeight: 600, fontSize: 11 });

export const s44 = ({panelColor,explainerLoading}) => ({
                            width: '100%',
                            padding: '11px 16px',
                            borderRadius: 10,
                            background: panelColor,
                            color: '#fff',
                            border: 'none',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: explainerLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: `0 4px 14px ${panelColor}40`,
                            transition: 'opacity 0.15s'
                          });

export const s45 = ({T}) => ({
                            borderRadius: 12,
                            background: T.s2,
                            border: `1px solid ${T.border}`,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          });

export const s46 = ({panelColor}) => ({ color: panelColor, flexShrink: 0 });

export const s47 = ({T}) => ({ fontWeight: 700, color: T.text, fontSize: 12.5 });

export const s48 = ({panelColor}) => ({
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    color: panelColor,
                                    background: `${panelColor}15`,
                                    padding: '2px 6px',
                                    borderRadius: 6
                                  });

export const s49 = ({panelColor}) => ({ display: 'flex', alignItems: 'center', gap: 5, color: panelColor, fontSize: 12, fontWeight: 600 });

export const s50 = ({T}) => ({
                                padding: '0 14px 14px 14px',
                                borderTop: `1px solid ${T.border}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                                fontSize: 12.5,
                                lineHeight: 1.55,
                                paddingTop: 12
                              });

export const s51 = ({T}) => ({ color: T.text, lineHeight: 1.6 });

export const s52 = ({T}) => ({ fontWeight: 700, fontSize: 11.5, color: T.muted });

export const s53 = ({panelColor}) => ({
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          gap: 8,
                                          padding: '5px 8px',
                                          borderRadius: 6,
                                          background: `${panelColor}0a`,
                                          border: `1px solid ${panelColor}18`
                                        });

export const s54 = ({panelColor}) => ({ color: panelColor, fontWeight: 700, lineHeight: 1.2 });

export const s55 = ({T}) => ({ color: T.text, lineHeight: 1.45, fontSize: 12 });

export const s56 = ({panelColor}) => ({
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 3,
                                            padding: '3px 8px',
                                            borderRadius: 5,
                                            border: `1px solid ${panelColor}35`,
                                            background: `${panelColor}15`,
                                            color: panelColor,
                                            fontSize: 10.5,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            transition: 'all 0.15s ease'
                                          });

export const s57 = ({isPointsSaved,panelColor}) => ({
                                    marginTop: 8,
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    background: isPointsSaved ? '#10B981' : `${panelColor}15`,
                                    border: `1px solid ${isPointsSaved ? '#10B981' : `${panelColor}40`}`,
                                    color: isPointsSaved ? '#fff' : panelColor,
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  });

export const s58 = ({noteFilter,panelColor,T}) => ({
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: `1px solid ${noteFilter === 'lesson' ? panelColor : 'transparent'}`,
                                background: noteFilter === 'lesson' ? panelColor : T.s2,
                                color: noteFilter === 'lesson' ? '#0A0E1A' : T.muted,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              });

export const s59 = ({noteFilter,panelColor,T}) => ({
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: `1px solid ${noteFilter === 'course' ? panelColor : 'transparent'}`,
                                background: noteFilter === 'course' ? panelColor : T.s2,
                                color: noteFilter === 'course' ? '#0A0E1A' : T.muted,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              });

export const s60 = ({panelColor}) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                background: `${panelColor}15`,
                                border: `1px solid ${panelColor}35`,
                                borderRadius: 6,
                                padding: '3px 8px',
                                color: panelColor,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer'
                              });

export const s61 = ({T,isDictating,panelColor}) => ({
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: T.s2,
                              border: `1px solid ${isDictating ? panelColor : T.border}`,
                              color: T.text,
                              fontSize: 12,
                              outline: 'none'
                            });

export const s62 = ({isDictating,panelColor,T}) => ({
                              padding: '0 10px',
                              borderRadius: 8,
                              border: `1px solid ${isDictating ? panelColor : T.border}`,
                              background: isDictating ? `${panelColor}25` : T.s2,
                              color: isDictating ? panelColor : T.muted,
                              cursor: 'pointer'
                            });

export const s63 = ({panelColor,newNoteText}) => ({
                              padding: '0 12px',
                              borderRadius: 8,
                              border: 'none',
                              background: panelColor,
                              color: '#0A0E1A',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: newNoteText.trim() ? 'pointer' : 'default',
                              opacity: newNoteText.trim() ? 1 : 0.6,
                              boxShadow: newNoteText.trim() ? `0 2px 8px ${panelColor}40` : 'none'
                            });

export const s64 = ({panelColor}) => ({
                            padding: '6px 10px',
                            borderRadius: 7,
                            background: `${panelColor}18`,
                            border: `1px solid ${panelColor}55`,
                            color: panelColor,
                            fontSize: 11.5,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 6
                          });

export const s65 = ({T}) => ({ textAlign: 'center', padding: '24px 12px', color: T.muted, fontSize: 12 });

export const s66 = ({panelColor}) => ({ color: panelColor, margin: '0 auto 8px', opacity: 0.85 });

export const s67 = ({isHighlighted,panelColor,T}) => ({
                                    padding: 10,
                                    borderRadius: 8,
                                    background: isHighlighted ? `${panelColor}10` : T.s2,
                                    border: `1px solid ${isHighlighted ? panelColor : T.border}`,
                                    boxShadow: isHighlighted ? `0 0 12px ${panelColor}25` : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                    transition: 'all 0.2s ease'
                                  });

export const s68 = ({panelColor}) => ({
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          background: panelColor,
                                          color: '#0A0E1A',
                                          fontSize: 10.5,
                                          fontWeight: 800,
                                          borderRadius: 4,
                                          padding: '2px 7px',
                                          letterSpacing: '0.02em'
                                        });

export const s69 = ({panelColor}) => ({
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 4,
                                          background: `${panelColor}15`,
                                          border: `1px solid ${panelColor}40`,
                                          color: panelColor,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          borderRadius: 4,
                                          padding: '2px 6px',
                                          cursor: 'pointer'
                                        });

export const s70 = ({panelColor}) => ({ fill: panelColor });

export const s71 = ({T}) => ({ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 2 });

export const s72 = ({T}) => ({ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 2 });

export const s73 = ({T}) => ({
                                  fontSize: 12.5,
                                  color: T.text,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 5
                                });

export const s74 = ({panelColor}) => ({ color: panelColor, fontSize: 13, lineHeight: '18px', userSelect: 'none', flexShrink: 0 });

export const s75 = ({T}) => ({
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          overflowY: 'auto',
                          padding: 10,
                          borderRadius: 10,
                          background: T.s2,
                          border: `1px solid ${T.border}`,
                          minHeight: 180
                        });

export const s76 = ({T}) => ({ textAlign: 'center', padding: '24px 12px', color: T.muted, fontSize: 12 });

export const s77 = ({panelColor}) => ({ color: panelColor, margin: '0 auto 8px' });

export const s78 = ({m}) => ({
                                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                  maxWidth: '88%',
                                  padding: '10px 14px',
                                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px',
                                  background: m.role === 'user' 
                                    ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 25%, #7C3AED 55%, #9333EA 80%, #C026D3 100%)' 
                                    : 'linear-gradient(135deg, rgba(10, 77, 74, 0.95) 0%, rgba(12, 80, 95, 0.95) 32%, rgba(16, 68, 107, 0.95) 68%, rgba(24, 40, 72, 0.95) 100%)',
                                  color: '#F8FAFC',
                                  fontSize: 12,
                                  lineHeight: 1.55,
                                  border: m.role === 'user' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(56, 189, 248, 0.25)',
                                  boxShadow: m.role === 'user' ? '0 6px 20px -4px rgba(124, 58, 237, 0.3), 0 2px 6px rgba(0, 0, 0, 0.22)' : '0 10px 32px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(12, 80, 95, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
                                });

export const s79 = ({panelColor}) => ({ display: 'flex', alignItems: 'center', gap: 6, color: panelColor, fontSize: 11.5 });

export const s80 = ({T}) => ({
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: T.s2,
                              border: `1px solid ${T.border}`,
                              color: T.text,
                              fontSize: 12,
                              outline: 'none'
                            });

export const s81 = ({panelColor,chatLoading,chatQuestion}) => ({
                              padding: '0 14px',
                              borderRadius: 8,
                              border: 'none',
                              background: panelColor,
                              color: '#fff',
                              cursor: chatLoading || !chatQuestion.trim() ? 'default' : 'pointer',
                              opacity: chatLoading || !chatQuestion.trim() ? 0.6 : 1,
                              boxShadow: chatQuestion.trim() ? `0 2px 8px ${panelColor}40` : 'none'
                            });

export const s82 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.text });

export const s83 = ({T}) => ({ fontSize: 12, color: T.muted, margin: 0 });

export const s84 = ({panelColor}) => ({
                                background: panelColor,
                                color: '#0A0E1A',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: 8,
                                fontSize: 12.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: `0 4px 14px ${panelColor}40`
                              });

export const s85 = ({panelColor}) => ({ textAlign: 'center', padding: '36px 12px', color: panelColor, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 });

export const s86 = ({T}) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: T.muted });

export const s87 = ({panelColor}) => ({
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 10,
                                background: `${panelColor}20`,
                                color: panelColor,
                                border: `1px solid ${panelColor}40`
                              });

export const s88 = ({panelColor}) => ({ background: 'none', border: 'none', color: panelColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 });

export const s89 = ({T}) => ({ fontSize: 13, fontWeight: 700, color: T.text });

export const s90 = ({optBg,optBorder,T,aiQuizAns}) => ({
                                      padding: '8px 12px',
                                      borderRadius: 8,
                                      background: optBg,
                                      border: `1px solid ${optBorder}`,
                                      color: T.text,
                                      fontSize: 12,
                                      textAlign: 'left',
                                      cursor: aiQuizAns !== null ? 'default' : 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8
                                    });

export const s91 = ({T}) => ({ fontWeight: 700, color: T.muted });

export const s92 = ({aiQuizAns,aiQuiz,aiQuizIdx}) => ({ fontSize: 11.5, fontWeight: 700, color: aiQuizAns === aiQuiz.questions[aiQuizIdx].ans ? '#10B981' : '#EF4444' });

export const s93 = ({panelColor}) => ({
                                      background: panelColor,
                                      color: '#0A0E1A',
                                      border: 'none',
                                      padding: '6px 14px',
                                      borderRadius: 6,
                                      fontSize: 11.5,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      boxShadow: `0 2px 8px ${panelColor}35`
                                    });

export const s94 = ({isExpanded}) => ({
              width: isExpanded ? '92px' : '100%',
              flex: isExpanded ? '0 0 92px' : 1,
              maxWidth: isExpanded ? '92px' : '100%',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: '6px 0',
              overflow: 'visible',
              minWidth: 0,
              height: '100%',
              boxSizing: 'border-box',
              position: 'relative',
              zIndex: 2
            });

export const s95 = ({notesTabColor}) => ({
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: '#0D1424',
          border: `1px solid ${notesTabColor}`,
          boxShadow: `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px ${notesTabColor}40`,
          borderRadius: 12,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#fff',
          animation: 'fadeInUp 0.25s ease-out'
        });

export const s96 = ({notesTabColor}) => ({
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `${notesTabColor}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: notesTabColor,
            flexShrink: 0
          });

export const s97 = ({T}) => ({ fontSize: 11, color: T.muted });

export const s98 = ({notesTabColor}) => ({
              marginLeft: 8,
              padding: '6px 12px',
              borderRadius: 6,
              background: notesTabColor,
              color: '#0A0E1A',
              fontSize: 11,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            });

export const s99 = ({T}) => ({
              background: 'transparent',
              border: 'none',
              color: T.muted,
              cursor: 'pointer',
              padding: 4
            });
