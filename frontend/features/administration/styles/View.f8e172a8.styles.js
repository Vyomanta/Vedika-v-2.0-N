export const s0 = ({T}) => ({
        background: T.s1,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: 20,
        marginBottom: 20
      });

export const s1 = ({T}) => ({
          color: T.text,
          fontSize: 14,
          fontWeight: 700,
          margin: '0 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: T.purple
        });

export const s2 = ({T}) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: T.s2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.15s'
              });

export const s3 = ({T}) => ({ color: T.text, fontSize: 13.5, fontWeight: 600 });

export const s4 = ({T}) => ({ color: T.muted, fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4 });

export const s5 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1000,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s6 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: '-0.04em' });

export const s7 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '4px 0 0' });

export const s8 = ({T}) => ({
            width: '100%',
            background: T.s1,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: '14px 16px 14px 48px',
            color: T.text,
            fontSize: 14.5,
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          });

export const s9 = ({T}) => ({
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${T.border}`,
            borderTopColor: T.purple,
            animation: 'spin 0.8s linear infinite'
          });

export const s10 = ({T}) => ({
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

export const s11 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s12 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: 0, lineHeight: 1.5 });

export const s13 = ({T}) => ({
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

export const s14 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s15 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 300, margin: 0, lineHeight: 1.5 });
