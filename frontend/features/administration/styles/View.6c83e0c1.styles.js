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

export const s7 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: '0 0 16px 0' });

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

export const s11 = ({T}) => ({ color: T.text, fontSize: 15.5, fontWeight: 700, margin: 0, lineHeight: 1.3 });

export const s12 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s13 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s14 = ({T}) => ({ color: T.purple, fontSize: 13, fontWeight: 600 });

export const s15 = ({T}) => ({ fontSize: 9, background: `${T.red}18`, border: `1px solid ${T.red}25`, color: T.red, padding: '2px 6px', borderRadius: 4, fontWeight: 700 });

export const s16 = ({T}) => ({
                    color: T.muted,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    margin: '0 0 16px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  });

export const s17 = ({T}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 10.5,
                    color: T.accent,
                    background: `${T.accent}12`,
                    border: `1px solid ${T.accent}25`,
                    padding: '3px 8px',
                    borderRadius: 20
                  });

export const s18 = ({T}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 10.5,
                    color: T.green,
                    background: `${T.green}12`,
                    border: `1px solid ${T.green}25`,
                    padding: '3px 8px',
                    borderRadius: 20
                  });

export const s19 = ({T}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 10.5,
                    color: T.amber,
                    background: `${T.amber}12`,
                    border: `1px solid ${T.amber}25`,
                    padding: '3px 8px',
                    borderRadius: 20
                  });

export const s20 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: T.muted,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 12,
                marginTop: 4
              });

export const s21 = ({T}) => ({ color: T.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 });

export const s22 = ({T}) => ({
              background: 'transparent',
              border: `2px dashed ${T.border}`,
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              minHeight: 200,
              transition: 'all 0.2s',
              textAlign: 'center'
            });

export const s23 = ({T}) => ({ fontSize: 13, fontWeight: 600, color: T.text });

export const s24 = ({T}) => ({ fontSize: 11, color: T.muted, marginTop: 4 });

export const s25 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          });

export const s26 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s27 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s28 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s29 = ({T}) => ({
                  background: 'rgba(245, 91, 107, 0.1)',
                  border: `1px solid rgba(245, 91, 107, 0.25)`,
                  color: T.red,
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
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

export const s38 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s39 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s40 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s41 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s42 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s43 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s44 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s45 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit',
                    minHeight: 100,
                    resize: 'vertical'
                  });

export const s46 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
                marginTop: 8
              });

export const s47 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s48 = ({T}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer'
                  });
