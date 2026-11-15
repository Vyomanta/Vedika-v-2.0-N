export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1000,
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
        display: 'flex',
        borderBottom: `1px solid ${T.border}`,
        marginBottom: 24,
        gap: 16
      });

export const s5 = ({activeTab,T}) => ({
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'issued' ? `2px solid ${T.purple}` : '2px solid transparent',
            color: activeTab === 'issued' ? T.text : T.muted,
            padding: '8px 12px 12px 12px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          });

export const s6 = ({activeTab,T}) => ({
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'settings' ? `2px solid ${T.purple}` : '2px solid transparent',
            color: activeTab === 'settings' ? T.text : T.muted,
            padding: '8px 12px 12px 12px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          });

export const s7 = ({T}) => ({
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `2px solid ${T.border}`,
            borderTopColor: T.purple,
            animation: 'spin 1s linear infinite'
          });

export const s8 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: '64px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          });

export const s9 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s10 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 320, margin: '0 0 16px 0', lineHeight: 1.5 });

export const s11 = ({T}) => ({
                background: T.purple,
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              });

export const s12 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            overflowX: 'auto'
          });

export const s13 = ({T}) => ({ borderBottom: `1px solid ${T.border}`, color: T.muted, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.05em' });

export const s14 = ({T}) => ({ borderBottom: `1px solid ${T.border}` });

export const s15 = ({T}) => ({ padding: '16px 20px', color: T.text, fontWeight: 600 });

export const s16 = ({T}) => ({ padding: '16px 20px', color: T.muted });

export const s17 = ({T}) => ({ padding: '16px 20px', color: T.muted });

export const s18 = ({T}) => ({ padding: '16px 20px', color: T.dim, fontFamily: 'monospace' });

export const s19 = ({T}) => ({
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 20,
                        background: 'rgba(34, 197, 160, 0.12)',
                        color: T.green,
                        border: `1px solid rgba(34, 197, 160, 0.25)`
                      });

export const s20 = ({T}) => ({
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: T.muted, padding: 4, borderRadius: 4, transition: 'all 0.2s'
                        });

export const s21 = ({T}) => ({
          background: T.s1,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        });

export const s22 = ({T}) => ({
            fontSize: 15,
            fontWeight: 700,
            color: T.text,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          });

export const s23 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 });

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

export const s28 = ({T}) => ({ border: 'none', borderTop: `1px solid ${T.border}`, margin: '8px 0' });

export const s29 = ({T}) => ({ color: T.text, fontSize: 13, fontWeight: 700, margin: '0 0 2px 0' });

export const s30 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: T.muted });

export const s31 = ({T}) => ({ accentColor: T.purple, width: 16, height: 16 });

export const s32 = ({config,T}) => ({ color: config.require_passing_quiz ? T.text : T.muted });

export const s33 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: T.muted });

export const s34 = ({T}) => ({ accentColor: T.purple, width: 16, height: 16 });

export const s35 = ({config,T}) => ({ color: config.require_assignments_submitted ? T.text : T.muted });

export const s36 = ({T}) => ({
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: `1px solid ${T.border}`,
            paddingTop: 16,
            marginTop: 8
          });

export const s37 = ({T}) => ({
                background: T.purple,
                color: '#fff',
                border: 'none',
                padding: '9px 20px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              });

export const s38 = ({T}) => ({
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          });

export const s39 = ({T}) => ({
              padding: '16px 20px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            });

export const s40 = ({T}) => ({ margin: 0, color: T.text, fontSize: 16, fontWeight: 700 });

export const s41 = ({T}) => ({ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 0 });

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
                    fontFamily: 'inherit'
                  });

export const s46 = ({T}) => ({ fontSize: 12, fontWeight: 600, color: T.text });

export const s47 = ({T}) => ({
                    background: T.s2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: T.text,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'inherit'
                  });

export const s48 = ({T}) => ({
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
                marginTop: 8
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

export const s50 = ({T}) => ({
                    background: T.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer'
                  });
