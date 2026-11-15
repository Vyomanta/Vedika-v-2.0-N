export const s0 = ({isMobile}) => ({
      minHeight: '100%',
      height: isMobile ? 'auto' : 'calc(100vh - 54px)',
      maxHeight: isMobile ? 'none' : 'calc(100vh - 54px)',
      overflowY: isMobile ? 'auto' : 'hidden',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? '12px 14px' : '24px 32px 16px 32px',
      maxWidth: 1320,
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({isMobile}) => ({ marginBottom: isMobile ? 10 : 14, flexShrink: 0 });

export const s2 = ({T}) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: T.s1,
              border: `1px solid ${T.border}`,
              color: T.text,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            });

export const s3 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 19 : 25, fontWeight: 700, margin: 0, letterSpacing: '-0.03em' });

export const s4 = ({T,isMobile}) => ({ color: T.muted, fontSize: isMobile ? 12 : 13, margin: '2px 0 0' });

export const s5 = ({T,isMobile}) => ({
        background: T.s1,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: isMobile ? '8px 10px' : '10px 14px',
        marginBottom: isMobile ? 12 : 16,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 8 : 12,
        alignItems: 'stretch',
        flexShrink: 0
      });

export const s6 = ({T}) => ({
              width: '100%',
              background: T.s2,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '8px 12px 8px 36px',
              color: T.text,
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box'
            });

export const s7 = ({isMobile}) => ({
          display: 'flex',
          gap: 8,
          width: isMobile ? '100%' : 'auto',
          flexShrink: 0
        });

export const s8 = ({T,isMobile}) => ({
              background: T.s2,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '7px 10px',
              color: T.text,
              fontSize: 12,
              outline: 'none',
              fontFamily: 'inherit',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? 0 : 130
            });

export const s9 = ({T,isMobile}) => ({
              background: T.s2,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '7px 10px',
              color: T.text,
              fontSize: 12,
              outline: 'none',
              fontFamily: 'inherit',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? 0 : 130
            });

export const s10 = ({T}) => ({
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid rgba(91, 140, 248, 0.2)',
              borderTopColor: T.accent,
              animation: 'spin 1s linear infinite'
            });

export const s11 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: '48px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          });

export const s12 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s13 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: 0 });

export const s14 = ({isMobile,isTablet}) => ({
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
            gap: isMobile ? 12 : 18,
            alignItems: 'stretch',
            width: '100%'
          });

export const s15 = ({T,isSelected,isMobile}) => ({
                    background: T.s1,
                    border: `1px solid ${isSelected ? T.accent : T.border}`,
                    borderRadius: 14,
                    padding: isMobile ? '14px 16px' : '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: isMobile ? 145 : 180,
                    gap: isMobile ? 12 : 16,
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  });

export const s16 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 });

export const s17 = ({T}) => ({ color: T.accent, fontSize: 13, fontWeight: 600, marginTop: 4, marginBottom: 12 });

export const s18 = ({T}) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.muted, background: T.s2, padding: '3px 8px', borderRadius: 4 });

export const s19 = ({T}) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.muted, background: T.s2, padding: '3px 8px', borderRadius: 4 });

export const s20 = ({T}) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.muted, background: T.s2, padding: '3px 8px', borderRadius: 4 });

export const s21 = ({T}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: 12,
                    marginTop: 4
                  });

export const s22 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.muted });

export const s23 = ({T}) => ({
                      color: T.accent,
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    });

export const s24 = ({isMobile}) => ({
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(7, 8, 15, 0.88)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: isMobile ? '20px 12px' : '76px 20px 24px 20px',
          boxSizing: 'border-box'
        });

export const s25 = ({T,isMobile}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 580,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.75)',
            maxHeight: isMobile ? 'calc(100dvh - 32px)' : 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column'
          });

export const s26 = ({isMobile,T}) => ({
              padding: isMobile ? '14px 16px' : '18px 24px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16
            });

export const s27 = ({T,isMobile}) => ({ margin: 0, color: T.text, fontSize: isMobile ? 16 : 18, fontWeight: 700, lineHeight: 1.3 });

export const s28 = ({T,isMobile}) => ({ color: T.accent, fontSize: isMobile ? 13 : 14, fontWeight: 600, marginTop: 4 });

export const s29 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s30 = ({isMobile}) => ({ padding: isMobile ? '16px 14px' : 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 });

export const s31 = ({isMobile,T}) => ({
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 12,
                background: T.s2,
                padding: isMobile ? 10 : 14,
                borderRadius: 8,
                border: `1px solid ${T.border}`
              });

export const s32 = ({T}) => ({ fontSize: 12.5, color: T.muted });

export const s33 = ({T}) => ({ color: T.text, marginLeft: 4 });

export const s34 = ({T}) => ({ fontSize: 12.5, color: T.muted });

export const s35 = ({T}) => ({ color: T.text, marginLeft: 4 });

export const s36 = ({T}) => ({ fontSize: 12.5, color: T.muted });

export const s37 = ({T}) => ({ color: T.text, marginLeft: 4 });

export const s38 = ({T}) => ({ fontSize: 12.5, color: T.muted });

export const s39 = ({T}) => ({ color: T.text, marginLeft: 4 });

export const s40 = ({T}) => ({ color: T.text, fontSize: 13.5, fontWeight: 700, margin: '0 0 8px 0' });

export const s41 = ({T}) => ({
                    color: T.text,
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    fontFamily: 'inherit'
                  });

export const s42 = ({T}) => ({
              padding: '16px 24px',
              borderTop: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s43 = ({T}) => ({
                      color: T.muted,
                      fontSize: 12,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    });

export const s44 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s45 = ({T}) => ({
                    background: T.accent,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  });
