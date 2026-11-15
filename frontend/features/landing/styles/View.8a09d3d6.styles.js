export const s0 = ({activeLab}) => ({
        '--active-color': activeLab.color,
        '--active-color-rgb': activeLab.colorRgb,
        '--active-glow': activeLab.glowColor
      });

export const s1 = ({isMobile,activeLab}) => ({
          position: 'absolute',
          top: isMobile ? 12 : 16,
          left: isMobile ? 12 : 24,
          zIndex: 60,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: isMobile ? '6px 12px' : '7px 14px',
          borderRadius: 9999,
          background: 'rgba(11, 15, 25, 0.78)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${activeLab.color}55`,
          color: '#F8FAFC',
          fontSize: isMobile ? 11.5 : 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          transition: 'all 0.15s ease'
        });

export const s2 = ({activeLab}) => ({ color: activeLab.color });

export const s3 = ({isFeaturesDropdownOpen,activeLab}) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isFeaturesDropdownOpen ? activeLab.color : 'rgba(255, 255, 255, 0.12)'}`,
                  color: '#fff',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer'
                });

export const s4 = ({isFeaturesDropdownOpen}) => ({
                    transform: isFeaturesDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  });

export const s5 = ({activeLab}) => ({
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 290,
                  background: '#0B0F19',
                  border: `1px solid ${activeLab.color}66`,
                  borderRadius: 14,
                  padding: 6,
                  boxShadow: '0 20px 48px rgba(0,0,0,0.85)',
                  zIndex: 50,
                  backdropFilter: 'blur(20px)',
                  maxHeight: '55vh',
                  overflowY: 'auto'
                });

export const s6 = ({activeLab}) => ({ color: activeLab.color });

export const s7 = ({activeLab}) => ({
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: activeLab.color,
                            flexShrink: 0
                          });

export const s8 = ({activeLab}) => ({ fontSize: 9, padding: '1px 5px', borderRadius: 6, background: `${activeLab.color}22`, color: activeLab.color, fontWeight: 700 });
