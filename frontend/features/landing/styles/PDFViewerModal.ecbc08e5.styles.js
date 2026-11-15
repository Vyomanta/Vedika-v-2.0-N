export const s0 = ({T}) => ({
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(7, 8, 15, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          color: T.text,
          fontFamily: 'var(--font-outfit), sans-serif'
        });

export const s1 = ({T}) => ({
          padding: '16px 24px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: T.s1,
          zIndex: 10000
        });

export const s2 = ({T}) => ({ fontSize: 16, fontWeight: 700, margin: 0, color: T.text });

export const s3 = ({T}) => ({ fontSize: 12, color: T.muted, margin: '2px 0 0 0' });

export const s4 = ({T}) => ({
              display: 'flex',
              alignItems: 'center',
              background: T.s3,
              borderRadius: 8,
              padding: '2px 8px',
              border: `1px solid ${T.border}`
            });

export const s5 = ({T}) => ({
                background: T.s3, border: `1px solid ${T.border}`, color: '#fff', cursor: 'pointer',
                width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
              });

export const s6 = ({T}) => ({
                background: T.accent, border: 'none', color: '#000', cursor: 'pointer',
                width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              });

export const s7 = ({T}) => ({
                background: T.s3, border: `1px solid ${T.border}`, color: '#fff', cursor: 'pointer',
                width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
              });

export const s8 = ({T}) => ({
                background: 'rgba(245, 91, 107, 0.15)', border: `1px solid ${T.red}`, color: T.red, cursor: 'pointer',
                width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              });

export const s9 = ({T}) => ({
                width: 32, height: 32, borderRadius: '50%',
                border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: 'spin 1s linear infinite'
              });

export const s10 = ({T}) => ({ fontSize: 13, color: T.muted });

export const s11 = ({zoom,rotation}) => ({
              width: '100%',
              height: '100%',
              border: 'none',
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            });
