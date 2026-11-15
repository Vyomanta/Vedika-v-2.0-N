export const s0 = ({T}) => ({
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: `${T.accent}14`,
          border: `1px solid ${T.accent}30`,
          color: T.accent,
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 0
        });

export const s1 = ({isMobile,T}) => ({
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: isMobile ? 'auto' : '100%',
          minHeight: '100%',
          maxHeight: isMobile ? 'none' : '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: T.bg,
          boxSizing: 'border-box'
        });

export const s2 = ({isMobile}) => ({
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '20px 16px' : '28px 36px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        });

export const s3 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: T.muted,
                cursor: 'pointer',
                fontSize: 13,
                padding: 0,
                transition: 'color 0.2s'
              });

export const s4 = ({isPlaygroundOpen,T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isPlaygroundOpen ? `${T.accent}15` : 'transparent',
                border: `1px solid ${isPlaygroundOpen ? T.accent : 'var(--border)'}`,
                color: isPlaygroundOpen ? T.accent : 'var(--text)',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 8,
                transition: 'all 0.15s'
              });

export const s5 = ({T}) => ({ fontSize: 11.5, color: T.accent, background: `${T.accent}15`, padding: '3px 10px', borderRadius: 20, fontWeight: 600 });

export const s6 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s7 = ({T}) => ({ color: T.text, fontSize: 24, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.03em' });

export const s8 = ({T}) => ({ color: T.muted, margin: 0, fontSize: 14, lineHeight: 1.5 });

export const s9 = ({T}) => ({
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: `${T.accent}12`, border: `1px solid ${T.accent}40`,
                    color: T.accent, padding: '7px 14px', borderRadius: 8,
                    fontSize: 12.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                  });

export const s10 = ({T}) => ({
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: '40px 24px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16
            });

export const s11 = ({T}) => ({
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${T.accent} 0%, #3B82F6 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
                marginBottom: 8
              });

export const s12 = ({T}) => ({ color: T.text, fontSize: 18, fontWeight: 700, margin: 0 });

export const s13 = ({T}) => ({ color: T.muted, fontSize: 13.5, maxWidth: 420, margin: 0, lineHeight: 1.5 });

export const s14 = ({isEnrolling,T}) => ({
                  background: isEnrolling ? T.dim : T.accent,
                  color: '#000',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isEnrolling ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(91, 140, 248, 0.3)',
                  transition: 'all 0.2s',
                  marginTop: 8
                });

export const s15 = ({T}) => ({
                  background: `linear-gradient(135deg, ${T.purple}12 0%, ${T.accent}12 100%)`,
                  border: `1px solid ${T.purple}30`,
                  borderRadius: 16,
                  padding: '24px 20px',
                  textAlign: 'center',
                  marginBottom: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12
                });

export const s16 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: 0 });

export const s17 = ({T}) => ({ color: T.muted, fontSize: 13, margin: 0, maxWidth: 460 });

export const s18 = ({T}) => ({
                      background: `linear-gradient(135deg, ${T.purple} 0%, ${T.accent} 100%)`,
                      color: '#fff',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(155, 110, 248, 0.2)'
                    });

export const s19 = ({T}) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, color: T.muted });

export const s20 = ({T}) => ({ fontWeight: 600, color: T.accent });

export const s21 = ({T}) => ({ background: T.s3, borderRadius: 99, height: 6, marginTop: 8, width: '100%', overflow: 'hidden' });

export const s22 = ({T,progressPercent}) => ({
                    background: T.accent, height: '100%', borderRadius: 99,
                    width: `${progressPercent}%`, transition: 'width 0.4s'
                  });

export const s23 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' });

export const s24 = ({T}) => ({
                        padding: '16px 20px', borderBottom: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      });

export const s25 = ({mod,T}) => ({
                            width: 36, height: 36, borderRadius: 9,
                            background: `${mod.accent || T.accent}18`, border: `1px solid ${mod.accent || T.accent}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                          });

export const s26 = ({T}) => ({ color: T.text, fontWeight: 600, fontSize: 14 });

export const s27 = ({T}) => ({ color: T.muted, fontSize: 12 });

export const s28 = ({mod,T}) => ({ fontSize: 10, color: mod.accent || T.accent, fontWeight: 700, position: 'relative' });

export const s29 = ({li,mod,T}) => ({
                              width: '100%', display: 'flex', alignItems: 'center',
                              justifyContent: 'space-between', padding: '13px 20px',
                              background: 'transparent', border: 'none',
                              borderBottom: li < mod.lessons.length - 1 ? `1px solid ${T.border}` : 'none',
                              cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                              textDecoration: 'none'
                            });

export const s30 = ({T}) => ({ color: T.text, fontSize: 13.5, fontWeight: 500 });

export const s31 = ({T}) => ({ color: T.muted, fontSize: 12, marginTop: 1, display: 'flex', alignItems: 'center', gap: 5 });

export const s32 = ({T}) => ({ fontSize: 11, color: T.green, background: `${T.green}18`, padding: '2px 8px', borderRadius: 20 });

export const s33 = ({isMobile,T}) => ({
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: isMobile ? 'auto' : '100%',
      minHeight: '100%',
      maxHeight: isMobile ? 'none' : '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: T.bg,
      boxSizing: 'border-box'
    });

export const s34 = ({isMobile}) => ({
        width: '100%',
        maxWidth: 1440,
        margin: '0 auto',
        padding: isMobile ? '8px 12px 24px' : '10px 24px 6px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: isMobile ? 'auto' : '100%',
        justifyContent: 'flex-start'
      });

export const s35 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: 10, width: isMobile ? '100%' : 'auto', flex: isMobile ? '1 1 100%' : '0 0 auto' });

export const s36 = ({T}) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 13px',
                borderRadius: 10,
                background: T.s2,
                border: `1px solid ${T.border}`,
                color: T.text,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              });

export const s37 = ({isMobile}) => ({ position: 'relative', width: isMobile ? '100%' : 300, flex: isMobile ? 1 : 'none', flexShrink: 0 });

export const s38 = ({T}) => ({ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.muted });

export const s39 = ({T}) => ({
                width: '100%',
                padding: '7px 32px 7px 34px',
                borderRadius: 10,
                background: T.s2,
                border: `1px solid ${T.border}`,
                color: T.text,
                fontSize: 12.5,
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease'
              });

export const s40 = ({T}) => ({
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center'
                });

export const s41 = ({isPlaygroundOpen,T,isMobile}) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: isPlaygroundOpen ? `${T.accent}15` : T.s2,
              border: `1px solid ${isPlaygroundOpen ? T.accent : T.border}`,
              color: isPlaygroundOpen ? T.accent : T.text,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: 10,
              transition: 'all 0.15s',
              marginLeft: isMobile ? 0 : 'auto'
            });

export const s42 = ({T}) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: T.s2,
                border: `1px solid ${T.accent}`,
                color: T.accent,
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s'
              });

export const s43 = ({T}) => ({
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: T.s2,
                border: `1px solid ${T.border}`,
                color: T.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s'
              });

export const s44 = ({isSelected,T}) => ({
                    background: isSelected ? T.accent : T.s2,
                    color: isSelected ? '#fff' : T.text,
                    border: isSelected ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
                    padding: '6px 16px',
                    borderRadius: 20,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  });

export const s45 = ({T}) => ({
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: T.s2,
                border: `1px solid ${T.border}`,
                color: T.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s'
              });

export const s46 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, padding: '48px 20px', textAlign: 'center', marginBottom: 24 });

export const s47 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' });

export const s48 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 360, margin: '0 auto 16px auto' });

export const s49 = ({T}) => ({ background: T.accent, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' });

export const s50 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, padding: '48px 20px', textAlign: 'center', marginBottom: 24 });

export const s51 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' });

export const s52 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 360, margin: '0 auto 16px auto' });

export const s53 = ({T}) => ({ background: T.accent, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' });

export const s54 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, padding: '48px 20px', textAlign: 'center', marginBottom: 24 });

export const s55 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' });

export const s56 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 360, margin: '0 auto 16px auto' });
