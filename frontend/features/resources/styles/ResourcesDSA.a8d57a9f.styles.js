export const s0 = ({T}) => ({
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', color: T.muted,
            fontSize: 14, cursor: 'pointer', fontWeight: 500, width: 'fit-content'
          });

export const s1 = ({T}) => ({
            fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800, color: T.text, margin: '0 0 10px 0', letterSpacing: '-0.03em',
            background: `linear-gradient(to right, #F97316 0%, #EF4444 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 'clamp(13.5px, 3.5vw, 16px)', margin: 0 });

export const s3 = ({gradient}) => ({
              background: gradient, borderRadius: 16, padding: '36px 24px', cursor: 'pointer',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column',
              minHeight: 240, justifyContent: 'space-between', position: 'relative', overflow: 'hidden'
            });
