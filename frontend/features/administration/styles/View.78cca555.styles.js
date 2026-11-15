export const s0 = ({isMobile,T}) => ({
      padding: isMobile ? '70px 16px 32px' : '36px 40px',
      maxWidth: 1060,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif',
      color: T.text
    });

export const s1 = ({isMobile}) => ({ fontSize: isMobile ? 21 : 26, fontWeight: 700, margin: 0 });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '6px 0 0 0' });

export const s3 = ({T,isMobile}) => ({
          background: T.s1,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: isMobile ? 18 : 22,
          marginBottom: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        });

export const s4 = ({isMobile}) => ({ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, alignItems: isMobile ? 'stretch' : 'center' });

export const s5 = ({T}) => ({
              flex: 1,
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: '11px 14px',
              color: T.text,
              fontSize: 13.5
            });

export const s6 = ({T}) => ({
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: '11px 14px',
              color: T.text,
              fontSize: 13,
              fontWeight: 600,
              minWidth: 130
            });

export const s7 = ({isGenerating,programTitle}) => ({
              background: 'linear-gradient(135deg, #A855F7, #6366F1)',
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              padding: '11px 20px',
              fontSize: 13,
              fontWeight: 700,
              cursor: (isGenerating || !programTitle.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isGenerating || !programTitle.trim()) ? 0.65 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            });

export const s8 = ({T}) => ({ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em' });

export const s9 = ({T}) => ({
                background: T.s1,
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              });

export const s10 = ({T}) => ({ margin: 0, fontSize: 15, fontWeight: 700, color: T.text });

export const s11 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s12 = ({T}) => ({
                      background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`,
                      color: T.text, padding: '5px 10px', borderRadius: 6, fontSize: 11.5,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                    });

export const s13 = ({T}) => ({ margin: 0, fontSize: 12.5, color: T.muted, lineHeight: 1.5 });

export const s14 = ({T}) => ({
                  marginTop: 6, padding: 12, borderRadius: 8, background: T.bg,
                  border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 8
                });

export const s15 = ({T}) => ({ color: T.text });

export const s16 = ({T}) => ({ color: T.muted });

export const s17 = ({T}) => ({
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12
            });

export const s18 = ({T}) => ({ margin: 0, fontSize: 14.5, fontWeight: 700, color: T.text });

export const s19 = ({T}) => ({ fontSize: 11.5, color: T.muted });

export const s20 = ({T}) => ({ margin: '6px 0 0 0', fontSize: 12.5, color: T.muted });
