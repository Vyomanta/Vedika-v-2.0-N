export const s0 = ({T}) => ({
        width: '100%',
        maxWidth: 400,
        background: T.s1 || 'rgba(255,255,255,0.02)',
        border: `1px solid ${T.border || 'rgba(255,255,255,0.05)'}`,
        borderRadius: 16,
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      });

export const s1 = ({T}) => ({
          width: 52, height: 52, borderRadius: 14,
          background: `linear-gradient(135deg, ${T.accent || '#5B8CF8'} 0%, ${T.purple || '#9B6EF8'} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(91, 140, 248, 0.2)'
        });

export const s2 = ({error,T}) => ({ fontSize: 13.5, color: error ? (T.red || '#F55B6B') : (T.muted || '#647298'), margin: 0, lineHeight: 1.5 });

export const s3 = ({T}) => ({
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.1)',
            borderTopColor: T.accent || '#5B8CF8',
            animation: 'spin 1s linear infinite'
          });
