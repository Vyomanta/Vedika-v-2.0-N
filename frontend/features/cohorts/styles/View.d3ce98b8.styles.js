export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1200,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: '-0.04em' });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '4px 0 0' });

export const s3 = ({T}) => ({
            background: T.purple,
            color: '#fff',
            border: 'none',
            padding: '9px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(155, 110, 248, 0.2)'
          });

export const s4 = ({T}) => ({
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(155, 110, 248, 0.2)',
            borderTopColor: T.purple,
            animation: 'spin 1s linear infinite'
          });

export const s5 = ({T}) => ({
          background: T.s1,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: '64px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: 320
        });

export const s6 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s7 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 320, margin: '0 0 16px 0' });

export const s8 = ({T}) => ({
              background: T.purple,
              color: '#fff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            });

export const s9 = ({gridColumns}) => ({
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: 20
        });

export const s10 = ({T}) => ({
                background: T.s1,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                position: 'relative'
              });

export const s11 = ({T}) => ({ color: T.text, fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 });

export const s12 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s13 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s14 = ({batch,T}) => ({
                    fontSize: 10,
                    background: batch.medium === 'Online' ? `${T.accent}18` : `${T.green}18`,
                    border: `1px solid ${batch.medium === 'Online' ? T.accent : T.green}25`,
                    color: batch.medium === 'Online' ? T.accent : T.green,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 700
                  });

export const s15 = ({T}) => ({ fontSize: 10, background: `${T.muted}18`, border: `1px solid ${T.muted}25`, color: T.muted, padding: '2px 8px', borderRadius: 20, fontWeight: 700 });

export const s16 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T.muted });

export const s17 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T.muted });

export const s18 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T.muted });

export const s19 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: T.muted,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 12,
                marginTop: 4
              });

export const s20 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          });

export const s21 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s22 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s23 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s24 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s25 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s26 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s27 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s28 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s29 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s30 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s31 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s32 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s33 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s34 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s35 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s36 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s37 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s38 = ({T}) => ({ accentColor: T.purple, width: 16, height: 16 });

export const s39 = ({T}) => ({ fontSize: 12.5, color: T.text, cursor: 'pointer' });

export const s40 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
                marginTop: 8
              });

export const s41 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s42 = ({T}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer'
                  });
