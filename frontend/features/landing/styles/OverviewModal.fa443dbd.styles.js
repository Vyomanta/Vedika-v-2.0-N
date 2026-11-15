export const s0 = ({T}) => ({
          width: '100%',
          maxWidth: 620,
          maxHeight: '85vh',
          background: T.s1 || '#0C0F1C',
          border: `1px solid ${T.border || 'rgba(255,255,255,0.1)'}`,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        });

export const s1 = ({T}) => ({
          padding: '16px 20px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: T.s2 || '#111827'
        });

export const s2 = ({mod,T}) => ({
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${mod?.accent || T.accent}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: mod?.accent || T.accent,
              flexShrink: 0
            });

export const s3 = ({mod,T}) => ({
                  fontSize: 11,
                  fontWeight: 700,
                  color: mod?.accent || T.accent,
                  background: `${mod?.accent || T.accent}18`,
                  padding: '1px 7px',
                  borderRadius: 8
                });

export const s4 = ({T}) => ({ fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', gap: 3 });

export const s5 = ({T}) => ({
                margin: '3px 0 0',
                fontSize: 15,
                fontWeight: 700,
                color: T.text,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              });

export const s6 = ({T}) => ({
              background: 'transparent',
              border: 'none',
              color: T.muted,
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s'
            });

export const s7 = ({T}) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: T.text,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 8
            });

export const s8 = ({T}) => ({
              background: T.s2,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: '14px 16px',
              color: T.muted,
              fontSize: 13,
              lineHeight: 1.65
            });

export const s9 = ({T}) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: T.text,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 8
            });

export const s10 = ({T}) => ({
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      background: T.s2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: '10px 14px'
                    });

export const s11 = ({mod,T}) => ({
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: `${mod?.accent || T.accent}20`,
                      border: `1px solid ${mod?.accent || T.accent}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: mod?.accent || T.accent,
                      fontSize: 10,
                      fontWeight: 700,
                      marginTop: 1
                    });

export const s12 = ({T}) => ({ color: T.text, fontSize: 13, lineHeight: 1.5 });

export const s13 = ({T}) => ({
                color: T.muted,
                fontSize: 12.5,
                background: T.s2,
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${T.border}`
              });

export const s14 = ({T}) => ({
              background: `linear-gradient(135deg, ${T.accent}12 0%, ${T.purple}12 100%)`,
              border: `1px solid ${T.accent}35`,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            });

export const s15 = ({T}) => ({ fontSize: 12.5, fontWeight: 700, color: T.text });

export const s16 = ({T}) => ({ fontSize: 11, color: T.muted });

export const s17 = ({T}) => ({
                  background: T.accent,
                  color: '#fff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                });

export const s18 = ({T}) => ({
          padding: '12px 20px',
          borderTop: `1px solid ${T.border}`,
          background: T.s2 || '#111827',
          display: 'flex',
          justifyContent: 'flex-end'
        });

export const s19 = ({T}) => ({
              background: T.s3 || 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: '7px 18px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s'
            });
