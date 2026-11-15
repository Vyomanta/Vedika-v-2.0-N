export const s0 = ({T}) => ({
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 16,
      border: `1px solid ${T.border}`,
      background: T.s1,
      padding: 14,
      color: T.text,
      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
      gap: 12
    });

export const s1 = ({T}) => ({
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: 8,
        paddingBottom: 10,
        borderBottom: `1px solid ${T.border}`
      });

export const s2 = ({T}) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 8,
              background: `${T.accent}15`,
              padding: '4px 10px',
              fontSize: 12,
              fontFamily: 'monospace',
              fontWeight: 600,
              color: T.accent,
              border: `1px solid ${T.accent}35`,
              cursor: 'pointer'
            });

export const s3 = ({T}) => ({ color: T.accent });

export const s4 = ({T}) => ({ fontSize: 12, color: T.muted });

export const s5 = ({T}) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            fontSize: 12,
            color: T.muted,
            cursor: 'pointer'
          });

export const s6 = ({T}) => ({ color: T.green || '#0D9488' });

export const s7 = ({T}) => ({
        borderRadius: 12,
        background: T.s2,
        padding: 12,
        border: `1px solid ${T.accent}30`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10
      });

export const s8 = ({T}) => ({ color: T.accent, flexShrink: 0, marginTop: 2 });

export const s9 = ({T}) => ({ fontSize: 12.5, fontWeight: 500, lineHeight: 1.6, color: T.text, margin: 0 });

export const s10 = ({T}) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: T.accent,
            margin: 0
          });

export const s11 = ({T}) => ({ fontSize: 12.5, lineHeight: 1.6, color: T.text, opacity: 0.9, margin: 0 });

export const s12 = ({T}) => ({ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: `1px solid ${T.border}` });

export const s13 = ({T}) => ({
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: T.muted,
            margin: 0
          });

export const s14 = ({T}) => ({ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: T.text });

export const s15 = ({T}) => ({ height: 6, width: 6, borderRadius: '50%', background: T.accent, flexShrink: 0, marginTop: 5 });

export const s16 = ({T}) => ({
          borderRadius: 12,
          background: T.s2,
          padding: 12,
          border: `1px solid ${T.border}`,
          fontSize: 12
        });

export const s17 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: T.text, marginBottom: 4 });

export const s18 = ({T}) => ({ color: T.accent });

export const s19 = ({T}) => ({ color: T.muted, lineHeight: 1.5, fontSize: 11.5, margin: 0 });

export const s20 = ({T}) => ({
          borderRadius: 12,
          background: T.s2,
          padding: 10,
          border: `1px solid ${T.border}`,
          fontSize: 11
        });

export const s21 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 4, color: T.muted, marginBottom: 4 });

export const s22 = ({T}) => ({ color: T.accent });

export const s23 = ({T}) => ({
            fontFamily: 'monospace',
            color: T.text,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
            maxHeight: 96,
            overflowY: 'auto',
            margin: 0
          });

export const s24 = ({T}) => ({ paddingTop: 10, borderTop: `1px solid ${T.border}` });

export const s25 = ({T}) => ({ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.muted, display: 'block', marginBottom: 6 });

export const s26 = ({T}) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.s2,
                  padding: '5px 10px',
                  fontSize: 12,
                  color: T.text,
                  cursor: 'pointer',
                  textAlign: 'left'
                });

export const s27 = ({T}) => ({ color: T.accent, flexShrink: 0 });
