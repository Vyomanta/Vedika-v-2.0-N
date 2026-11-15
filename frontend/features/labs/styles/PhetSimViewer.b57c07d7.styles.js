export const s0 = ({isMobile,T}) => ({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: isMobile ? 'auto' : 800,
        background: '#090B13',
        color: T.text,
        borderRadius: isMobile ? 12 : 16,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-outfit), sans-serif',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)'
      });

export const s1 = ({isMobile}) => ({
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(15, 20, 32, 0.98)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: isMobile ? '10px 12px 8px' : '14px 20px',
        gap: 10
      });

export const s2 = ({isMobile}) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        });

export const s3 = ({isMobile}) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: isMobile ? 1 : 'none',
            minWidth: 0,
            maxWidth: isMobile ? '100%' : '460px'
          });

export const s4 = ({subjectMeta}) => ({
              background: subjectMeta.gradient,
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              flexShrink: 0
            });

export const s5 = ({isMobile}) => ({
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.07)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: isMobile ? '7px 28px 7px 10px' : '8px 32px 8px 12px',
                  borderRadius: 8,
                  fontSize: isMobile ? 12.5 : 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                });

export const s6 = ({currentViewMode,subjectMeta}) => ({
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: currentViewMode === 'phet' ? subjectMeta.accentColor : 'transparent',
                  color: currentViewMode === 'phet' ? '#fff' : '#999',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s'
                });

export const s7 = ({currentViewMode,subjectMeta}) => ({
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: currentViewMode === '3d' ? subjectMeta.accentColor : 'transparent',
                  color: currentViewMode === '3d' ? '#fff' : '#999',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s'
                });

export const s8 = ({isMobile}) => ({
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                padding: isMobile ? '6px 9px' : '8px 12px',
                borderRadius: 8,
                fontSize: isMobile ? 12 : 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              });

export const s9 = ({isFullscreen,subjectMeta,isMobile}) => ({
                background: isFullscreen ? subjectMeta.accentColor : 'rgba(255, 255, 255, 0.08)',
                border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isFullscreen ? '#000' : '#fff',
                padding: isMobile ? '6px 10px' : '8px 12px',
                borderRadius: 8,
                fontSize: isMobile ? 12 : 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              });

export const s10 = ({currentViewMode,subjectMeta}) => ({
                flex: 1,
                justifyContent: 'center',
                padding: '6px 8px',
                borderRadius: 7,
                border: 'none',
                background: currentViewMode === 'phet' ? subjectMeta.accentColor : 'transparent',
                color: currentViewMode === 'phet' ? '#fff' : '#999',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s'
              });

export const s11 = ({currentViewMode,subjectMeta}) => ({
                flex: 1,
                justifyContent: 'center',
                padding: '6px 8px',
                borderRadius: 7,
                border: 'none',
                background: currentViewMode === '3d' ? subjectMeta.accentColor : 'transparent',
                color: currentViewMode === '3d' ? '#fff' : '#999',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s'
              });

export const s12 = ({isMobile}) => ({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0D111A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: isMobile ? '8px 12px' : '10px 18px',
        gap: 12,
        zIndex: 40
      });

export const s13 = ({isMobile}) => ({ position: 'relative', width: isMobile ? '100%' : 'auto', minWidth: 260 });

export const s14 = ({isFeatureDropdownOpen,subjectMeta,isMobile}) => ({
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isFeatureDropdownOpen ? subjectMeta.accentColor : 'rgba(255, 255, 255, 0.12)'}`,
              borderRadius: 10,
              padding: isMobile ? '7px 11px' : '8px 14px',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: isFeatureDropdownOpen ? `0 0 16px ${subjectMeta.glowColor || 'rgba(0,212,255,0.3)'}` : 'none',
              transition: 'all 0.2s ease'
            });

export const s15 = ({subjectMeta}) => ({
                width: 30,
                height: 30,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${subjectMeta.accentColor}33, ${subjectMeta.accentColor}11)`,
                border: `1px solid ${subjectMeta.accentColor}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: subjectMeta.accentColor,
                flexShrink: 0
              });

export const s16 = ({isMobile}) => ({
                  fontSize: isMobile ? 13 : 13.5,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                });

export const s17 = ({subjectMeta}) => ({
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: `${subjectMeta.accentColor}22`,
                    color: subjectMeta.accentColor,
                    border: `1px solid ${subjectMeta.accentColor}44`,
                    flexShrink: 0
                  });

export const s18 = ({isFeatureDropdownOpen}) => ({
                  transform: isFeatureDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                });

export const s19 = ({isMobile,subjectMeta}) => ({
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              width: isMobile ? '100%' : 340,
              background: '#0B0F19',
              border: `1px solid ${subjectMeta.accentColor}66`,
              borderRadius: 12,
              padding: '6px',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(0,0,0,0.5)',
              zIndex: 70,
              backdropFilter: 'blur(20px)'
            });

export const s20 = ({subjectMeta}) => ({ fontSize: 10, color: subjectMeta.accentColor, fontWeight: 700 });

export const s21 = ({isSelected,subjectMeta}) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: isSelected ? `1px solid ${subjectMeta.accentColor}55` : '1px solid transparent',
                        background: isSelected ? `linear-gradient(90deg, ${subjectMeta.accentColor}22, rgba(255,255,255,0.03))` : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#CBD5E1',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s'
                      });

export const s22 = ({isSelected,subjectMeta}) => ({
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isSelected ? subjectMeta.accentColor : 'rgba(255,255,255,0.06)',
                          color: isSelected ? '#000' : '#8892B0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        });

export const s23 = ({isSelected}) => ({ fontSize: 13, fontWeight: 700, color: isSelected ? '#fff' : '#E2E8F0', display: 'flex', alignItems: 'center', gap: 6 });

export const s24 = ({isSelected,subjectMeta}) => ({
                              fontSize: 9.5,
                              padding: '1px 5px',
                              borderRadius: 6,
                              background: isSelected ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.06)',
                              color: isSelected ? subjectMeta.accentColor : '#8892B0',
                              fontWeight: 600,
                              flexShrink: 0
                            });

export const s25 = ({isSelected,subjectMeta}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: isSelected ? `1px solid ${subjectMeta.accentColor}` : '1px solid rgba(255,255,255,0.06)',
                    background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: isSelected ? subjectMeta.accentColor : '#8892B0',
                    fontSize: 12.5,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  });

export const s26 = ({isMobile}) => ({
            width: '100%',
            height: isMobile ? 'clamp(440px, calc(100svh - 220px), 640px)' : 740,
            minHeight: isMobile ? 420 : 700,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          });

export const s27 = ({subjectMeta}) => ({
                      background: subjectMeta.accentColor,
                      color: '#000',
                      fontWeight: 800,
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    });

export const s28 = ({isMobile}) => ({
                  width: '100%',
                  height: isMobile ? '100%' : 'calc(100% + 44px)',
                  marginBottom: isMobile ? 0 : '-44px',
                  minHeight: isMobile ? 420 : 744,
                  border: 'none',
                  background: '#000',
                  touchAction: 'manipulation'
                });

export const s29 = ({subjectMeta}) => ({
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    zIndex: 9,
                    background: 'rgba(11, 15, 25, 0.92)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${subjectMeta.accentColor}77`,
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
                  });

export const s30 = ({isMobile}) => ({ padding: isMobile ? '16px 12px' : 28, background: '#0A0E17', overflowY: 'auto', flex: 1 });

export const s31 = ({isMobile}) => ({ fontSize: isMobile ? 22 : 28 });

export const s32 = ({isMobile}) => ({ color: '#fff', fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: 0 });

export const s33 = ({isMobile}) => ({ color: '#aaa', fontSize: isMobile ? 13 : 14, margin: '2px 0 0 0' });

export const s34 = ({isMobile}) => ({
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                padding: isMobile ? '14px 16px' : 20,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: 20
              });

export const s35 = ({subjectMeta,isMobile}) => ({ color: subjectMeta.accentColor, fontSize: isMobile ? 15 : 16, fontWeight: 700, margin: '0 0 12px 0' });

export const s36 = ({isMobile}) => ({ paddingLeft: 18, margin: 0, color: '#DDD', fontSize: isMobile ? 13 : 14, lineHeight: 1.7 });

export const s37 = ({isMobile}) => ({ display: 'flex', justifyContent: isMobile ? 'stretch' : 'flex-end' });

export const s38 = ({isMobile,subjectMeta}) => ({
                    width: isMobile ? '100%' : 'auto',
                    background: subjectMeta.gradient,
                    color: '#fff',
                    border: 'none',
                    padding: '11px 22px',
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  });

export const s39 = ({isMobile}) => ({ padding: isMobile ? '16px 12px' : 28, background: '#0A0E17', overflowY: 'auto', flex: 1 });

export const s40 = ({isMobile}) => ({ color: '#fff', fontSize: isMobile ? 18 : 20, fontWeight: 800, marginBottom: 16 });

export const s41 = ({isMobile}) => ({
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 14
              });

export const s42 = ({subjectMeta,isMobile}) => ({
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: `1px solid ${subjectMeta.accentColor}`,
                    borderRadius: 12,
                    padding: isMobile ? '14px 16px' : 18,
                    textAlign: 'center'
                  });

export const s43 = ({isMobile}) => ({ color: '#fff', fontSize: isMobile ? 16 : 18, fontWeight: 700, margin: '8px 0 0 0', fontFamily: 'monospace' });

export const s44 = ({isMobile}) => ({ padding: isMobile ? '16px 12px' : 28, background: '#0A0E17', overflowY: 'auto', flex: 1 });

export const s45 = ({isMobile}) => ({ color: '#fff', fontSize: isMobile ? 18 : 20, fontWeight: 800, marginBottom: 16 });

export const s46 = ({isMobile}) => ({
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: isMobile ? '14px 16px' : 18
                  });

export const s47 = ({subjectMeta,isMobile}) => ({ color: subjectMeta.accentColor, fontSize: isMobile ? 14 : 15, fontWeight: 700, margin: '0 0 10px 0' });

export const s48 = ({isMobile}) => ({
                        width: isMobile ? '100%' : 'auto',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '8px 14px',
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      });

export const s49 = ({isMobile}) => ({ padding: isMobile ? '14px 10px' : 24, background: '#0A0E17', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 450 });

export const s50 = ({msg,isMobile,subjectMeta}) => ({
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: isMobile ? '94%' : '85%',
                    background: msg.sender === 'user' ? subjectMeta.accentColor : 'rgba(255, 255, 255, 0.07)',
                    color: '#fff',
                    padding: isMobile ? '11px 14px' : '14px 18px',
                    borderRadius: 12,
                    fontSize: isMobile ? 13 : 14,
                    lineHeight: 1.6,
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                  });

export const s51 = ({subjectMeta}) => ({ color: subjectMeta.accentColor });

export const s52 = ({isMobile}) => ({ fontSize: isMobile ? 13 : 13.5, lineHeight: 1.6 });

export const s53 = ({subjectMeta}) => ({ alignSelf: 'flex-start', color: subjectMeta.accentColor, fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 });

export const s54 = ({isMobile}) => ({
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  borderRadius: 8,
                  fontSize: isMobile ? 13 : 14,
                  outline: 'none'
                });

export const s55 = ({subjectMeta,isMobile}) => ({
                  background: subjectMeta.gradient,
                  color: '#fff',
                  border: 'none',
                  padding: isMobile ? '0 16px' : '0 20px',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0
                });
