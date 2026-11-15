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

export const s4 = ({selectedCategory,cat,T}) => ({
              background: selectedCategory === cat ? T.purple : T.s2,
              color: selectedCategory === cat ? '#fff' : T.text,
              border: selectedCategory === cat ? `1px solid ${T.purple}` : `1px solid ${T.border}`,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            });

export const s5 = ({T}) => ({
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(155, 110, 248, 0.2)',
            borderTopColor: T.purple,
            animation: 'spin 1s linear infinite'
          });

export const s6 = ({T}) => ({
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

export const s7 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s8 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 320, margin: '0 0 16px 0' });

export const s9 = ({T}) => ({
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

export const s10 = ({gridColumns}) => ({
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: 20
        });

export const s11 = ({T}) => ({
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

export const s12 = ({T}) => ({ color: T.text, fontSize: 15.5, fontWeight: 700, margin: 0, lineHeight: 1.3 });

export const s13 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s14 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 3, borderRadius: 4 });

export const s15 = ({T}) => ({
                    fontSize: 10,
                    background: `${T.accent}14`,
                    border: `1px solid ${T.accent}30`,
                    color: T.accent,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 700
                  });

export const s16 = ({T}) => ({
                    fontSize: 10,
                    background: `${T.purple}12`,
                    border: `1px solid ${T.purple}25`,
                    color: T.purple,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 700
                  });

export const s17 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted });

export const s18 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted });

export const s19 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted });

export const s20 = ({T}) => ({
                fontSize: 11,
                color: T.muted,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 12,
                marginTop: 4
              });

export const s21 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 620,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.75)',
            maxHeight: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column'
          });

export const s22 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s23 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s24 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

export const s25 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s26 = ({T}) => ({
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: T.text,
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit'
                    });

export const s27 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s28 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding: '9px 12px',
                        color: T.text,
                        fontSize: 13,
                        outline: 'none',
                        fontFamily: 'inherit'
                      });

export const s29 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s30 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding: '9px 12px',
                        color: T.text,
                        fontSize: 13,
                        outline: 'none',
                        fontFamily: 'inherit'
                      });

export const s31 = ({T}) => ({ fontSize: 11, fontWeight: 600, color: T.text });

export const s32 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding: '8px 10px',
                        color: T.text,
                        fontSize: 12,
                        outline: 'none',
                        fontFamily: 'inherit'
                      });

export const s33 = ({T}) => ({ fontSize: 11, fontWeight: 600, color: T.text });

export const s34 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding: '8px 10px',
                        color: T.text,
                        fontSize: 12,
                        outline: 'none',
                        fontFamily: 'inherit'
                      });

export const s35 = ({T}) => ({ fontSize: 11, fontWeight: 600, color: T.text });

export const s36 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding: '8px 10px',
                        color: T.text,
                        fontSize: 12,
                        outline: 'none',
                        fontFamily: 'inherit'
                      });

export const s37 = ({T}) => ({ fontSize: 11, fontWeight: 600, color: T.text });

export const s38 = ({T}) => ({
                        background: T.s2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        padding: '8px 10px',
                        color: T.text,
                        fontSize: 12,
                        outline: 'none',
                        fontFamily: 'inherit'
                      });

export const s39 = ({T}) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderBottom: `1px solid ${T.border}`, paddingBottom: 6 });

export const s40 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.purple });

export const s41 = ({T}) => ({
                      background: 'rgba(155, 110, 248, 0.1)',
                      border: `1px solid rgba(155, 110, 248, 0.25)`,
                      color: T.purple,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 6,
                      cursor: 'pointer'
                    });

export const s42 = ({T}) => ({ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 });

export const s43 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.text });

export const s44 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.red, fontSize: 11 });

export const s45 = ({T}) => ({
                          width: '100%',
                          background: T.s1,
                          border: `1px solid ${T.border}`,
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: T.text,
                          fontSize: 12.5,
                          outline: 'none',
                          fontFamily: 'inherit'
                        });

export const s46 = ({T}) => ({ accentColor: T.green, cursor: 'pointer' });

export const s47 = ({T,isCorrect}) => ({
                                  flex: 1,
                                  background: T.s1,
                                  border: `1px solid ${isCorrect ? T.green : T.border}`,
                                  borderRadius: 8,
                                  padding: '7px 10px',
                                  color: T.text,
                                  fontSize: 12,
                                  outline: 'none',
                                  fontFamily: 'inherit'
                                });

export const s48 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                padding: '16px 20px',
                background: T.s1
              });

export const s49 = ({T}) => ({
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  });

export const s50 = ({T,saving}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1
                  });
