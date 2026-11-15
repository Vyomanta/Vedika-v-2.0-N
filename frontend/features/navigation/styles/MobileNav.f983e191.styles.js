export const s0 = ({Z_BAR,T}) => ({
        position: 'fixed', top: 0, left: 0, right: 0, height: 48, zIndex: Z_BAR,
        background: T.s1, borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px',
      });

export const s1 = ({T}) => ({
          width: 36, height: 36, borderRadius: 8,
          background: 'none', border: 'none', color: T.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        });

export const s2 = ({T}) => ({ color: T.text, fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' });

export const s3 = ({T}) => ({
          width: 36, height: 36, borderRadius: 8,
          background: 'none', border: 'none', color: T.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        });

export const s4 = ({Z_OVERLAY}) => ({
          position: 'fixed', inset: 0, zIndex: Z_OVERLAY,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        });

export const s5 = ({T}) => ({
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              width: '100%',
              maxWidth: 300,
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: 16,
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            });

export const s6 = ({T}) => ({
                width: 32, height: 32, borderRadius: 8,
                background: `${T.s2}`, border: 'none', color: T.muted,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              });

export const s7 = ({accent,T,dropdownOpen}) => ({
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 13px',
                    borderRadius: 9,
                    background: `${accent || T.accent}12`,
                    border: `1px solid ${(accent || T.accent) + '30'}`,
                    color: accent || T.accent,
                    cursor: 'pointer',
                    fontSize: 13.5,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    marginBottom: dropdownOpen ? 4 : 8,
                  });

export const s8 = ({dropdownOpen}) => ({
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    });

export const s9 = ({dropdownOpen,T}) => ({
                  maxHeight: dropdownOpen ? '650px' : '0px',
                  opacity: dropdownOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginTop: dropdownOpen ? 4 : 0,
                  marginBottom: dropdownOpen ? 12 : 0,
                  paddingBottom: dropdownOpen ? 12 : 0,
                  borderBottom: dropdownOpen ? `1px solid ${T.border}` : 'none',
                });

export const s10 = ({activeItem,accent,T}) => ({
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 11,
                          padding: '9px 13px',
                          borderRadius: 8,
                          background: activeItem ? `${accent || T.accent}12` : 'transparent',
                          border: 'none',
                          color: activeItem ? (accent || T.accent) : T.text,
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: activeItem ? 600 : 400,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                        });

export const s11 = ({extras}) => ({ marginBottom: extras ? 12 : 0 });

export const s12 = ({isActive,accent,T}) => ({
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10, marginBottom: 4,
                        background: isActive ? `${accent || T.accent}18` : 'transparent',
                        border: isActive ? `1px solid ${(accent || T.accent) + '30'}` : 'none',
                        color: isActive ? (accent || T.accent) : T.text,
                        cursor: 'pointer', fontSize: 14,
                        fontWeight: isActive ? 600 : 400,
                        fontFamily: 'inherit', textAlign: 'left',
                        transition: 'all 0.15s',
                      });

export const s13 = ({T}) => ({ borderTop: `1px solid ${T.border}`, paddingTop: 12 });

export const s14 = ({i,extraList}) => ({ marginBottom: i < extraList.length - 1 ? 12 : 0 });
