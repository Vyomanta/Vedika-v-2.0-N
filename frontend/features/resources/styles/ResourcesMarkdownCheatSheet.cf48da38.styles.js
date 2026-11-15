export const s0 = ({T}) => ({
              background: '#07080F', border: `1px solid ${T.border}`, padding: 12, borderRadius: 8,
              overflowX: 'auto', margin: 0, fontFamily: 'monospace', fontSize: 12.5, color: '#A7F3D0'
            });

export const s1 = ({T}) => ({
                position: 'absolute', top: 6, right: 6, padding: 6, background: T.s3, border: `1px solid ${T.border}`,
                color: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex'
              });

export const s2 = ({T}) => ({ fontSize: 13, color: T.text, marginLeft: 16, marginBottom: 4 });

export const s3 = ({T}) => ({ fontSize: 13, color: T.muted, margin: '4px 0', lineHeight: 1.4 });

export const s4 = ({T}) => ({
          width: 32, height: 32, borderRadius: '50%',
          border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: 'spin 1s linear infinite'
        });

export const s5 = ({T}) => ({ fontSize: 13, color: T.muted });

export const s6 = ({T}) => ({
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', color: T.muted,
            fontSize: 14, cursor: 'pointer', fontWeight: 500, width: 'fit-content'
          });

export const s7 = ({T}) => ({ fontSize: 'clamp(22px, 5.5vw, 32px)', fontWeight: 800, color: T.text, margin: '0 0 6px 0', textTransform: 'capitalize' });

export const s8 = ({T}) => ({ color: T.muted, fontSize: 'clamp(13.5px, 3.5vw, 15px)', margin: '0 auto', maxWidth: 700, lineHeight: 1.5 });

export const s9 = ({T}) => ({ fontSize: 11, background: 'rgba(59, 130, 246, 0.12)', color: T.accent, padding: '4px 10px', borderRadius: 20 });

export const s10 = ({T}) => ({ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 'clamp(16px, 3vw, 24px) clamp(12px, 2.5vw, 20px)' });

export const s11 = ({T}) => ({ fontSize: 20, fontWeight: 700, color: T.accent, margin: '0 0 16px 0', borderBottom: `1px solid ${T.border}`, paddingBottom: 6 });

export const s12 = ({T}) => ({
                  background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 10, padding: 16,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                });

export const s13 = ({T}) => ({ fontSize: 14.5, fontWeight: 700, color: T.text, margin: 0 });
