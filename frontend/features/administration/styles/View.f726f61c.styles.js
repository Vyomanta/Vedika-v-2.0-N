export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 1100,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({T,isMobile}) => ({
            color: T.text,
            fontSize: isMobile ? 22 : 28,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          });

export const s2 = ({T,isMobile}) => ({ color: T.muted, fontSize: isMobile ? 13.5 : 14.5, marginTop: 4, margin: 0 });

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

export const s4 = ({}) => ({
            background: 'rgba(155, 110, 248, 0.05)',
            border: `1px solid rgba(155, 110, 248, 0.15)`,
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 24,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'border-color 0.2s'
          });

export const s5 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.text });

export const s6 = ({T}) => ({ display: 'flex', width: 8, height: 8, background: T.purple, borderRadius: '50%' });

export const s7 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: T.purple, fontWeight: 600 });

export const s8 = ({isMobile}) => ({
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 20,
        marginBottom: 32
      });

export const s9 = ({T}) => ({
                background: T.s1,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              });

export const s10 = ({sc}) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${sc.color}15`,
                  border: `1px solid ${sc.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                });

export const s11 = ({T}) => ({ color: T.text, fontSize: 15, fontWeight: 700, margin: 0 });

export const s12 = ({T}) => ({ color: T.muted, fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.4 });

export const s13 = ({sc}) => ({
                  fontSize: 22,
                  fontWeight: 800,
                  color: sc.color,
                  letterSpacing: '-0.03em',
                  background: `${sc.color}08`,
                  padding: '4px 10px',
                  borderRadius: 8
                });

export const s14 = ({T}) => ({
        background: T.s1,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: 20,
        textAlign: 'center',
        color: T.muted,
        fontSize: 12.5
      });
