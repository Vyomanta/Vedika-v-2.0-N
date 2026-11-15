export const s0 = ({containerPadding}) => ({
      padding: containerPadding,
      maxWidth: 900,
      margin: '0 auto',
      fontFamily: 'var(--font-outfit), sans-serif'
    });

export const s1 = ({T,isMobile}) => ({ color: T.text, fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, letterSpacing: '-0.04em' });

export const s2 = ({T}) => ({ color: T.muted, fontSize: 13.5, margin: '4px 0 0' });

export const s3 = ({T}) => ({
              background: 'transparent',
              color: T.purple,
              border: `1px solid ${T.border}`,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.2s'
            });

export const s4 = ({isSelected,T}) => ({
                background: isSelected ? T.purple : T.s1,
                color: isSelected ? '#fff' : T.muted,
                border: `1px solid ${isSelected ? T.purple : T.border}`,
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              });

export const s5 = ({T}) => ({
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `2px solid ${T.border}`,
            borderTopColor: T.purple,
            animation: 'spin 1s linear infinite'
          });

export const s6 = ({T}) => ({
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

export const s7 = ({T}) => ({ color: T.text, fontSize: 16, margin: '0 0 6px 0' });

export const s8 = ({T}) => ({ color: T.muted, fontSize: 13, maxWidth: 280, margin: 0, lineHeight: 1.5 });

export const s9 = ({isUnread,T}) => ({
                  background: isUnread ? `rgba(155, 110, 248, 0.03)` : T.s1,
                  border: `1px solid ${isUnread ? T.purple : T.border}`,
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'background 0.2s'
                });

export const s10 = ({isUnread,T}) => ({
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isUnread ? `${T.purple}12` : T.s2,
                    border: `1px solid ${isUnread ? `${T.purple}20` : T.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  });

export const s11 = ({T}) => ({ color: T.text, fontSize: 13.5, fontWeight: 700 });

export const s12 = ({T}) => ({
                          display: 'inline-block',
                          width: 6,
                          height: 6,
                          background: T.purple,
                          borderRadius: '50%'
                        });

export const s13 = ({T}) => ({ color: T.muted, fontSize: 12.5, margin: '4px 0 0', lineHeight: 1.4 });

export const s14 = ({T}) => ({ color: T.dim, fontSize: 11, display: 'inline-block', marginTop: 6 });

export const s15 = ({T}) => ({
                      background: 'transparent',
                      border: 'none',
                      color: T.muted,
                      cursor: 'pointer',
                      padding: 6,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    });
