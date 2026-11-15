export const s0 = ({isMobile}) => ({ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%', padding: isMobile ? '6px 6px 70px' : '16px 16px 90px', boxSizing: 'border-box', background: '#07080F' });

export const s1 = ({isStacked}) => ({
      display: 'flex',
      flexDirection: isStacked ? 'column' : 'row',
      flex: 1,
      minHeight: '100%',
      minHeight: isStacked ? 'auto' : 'calc(100vh - 54px)',
      background: '#07080F',
      color: '#DDE3F2',
      fontFamily: 'var(--font-outfit), sans-serif',
      boxSizing: 'border-box',
      paddingBottom: 90
    });

export const s2 = ({isStacked}) => ({
        width: isStacked ? '100%' : 360,
        minHeight: isStacked ? 'auto' : 700,
        background: '#0C0F1C',
        borderRight: isStacked ? 'none' : '1px solid rgba(255,255,255,0.06)',
        borderBottom: isStacked ? '1px solid rgba(255,255,255,0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        order: isStacked ? 2 : 1,
        zIndex: 5
      });

export const s3 = ({selectedOrganelleId,o,T}) => ({
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: selectedOrganelleId === o.id ? `${T.accent}12` : '#131824',
                      color: selectedOrganelleId === o.id ? T.accent : '#8892B0',
                      cursor: 'pointer',
                      fontSize: 12.5,
                      fontWeight: 700,
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    });

export const s4 = ({o}) => ({ width: 8, height: 8, borderRadius: '50%', background: '#' + o.color.toString(16) });

export const s5 = ({T}) => ({ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.accent, fontWeight: 800, textTransform: 'uppercase' });

export const s6 = ({isPlaying}) => ({
                background: isPlaying ? 'rgba(155, 110, 248, 0.1)' : '#9B6EF8',
                border: 'none',
                color: isPlaying ? '#9B6EF8' : '#ffffff',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 700
              });

export const s7 = ({timeScale,item}) => ({
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: 'none',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: timeScale === item.val ? '#1E293B' : 'transparent',
                  color: timeScale === item.val ? '#9B6EF8' : '#647298',
                  transition: 'all 0.15s'
                });

export const s8 = ({isStacked}) => ({
        flex: 1,
        width: '100%',
        minHeight: isStacked ? 380 : 700,
        height: isStacked ? 440 : '100%',
        order: isStacked ? 1 : 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      });

export const s9 = ({isStacked}) => ({ width: '100%', height: isStacked ? 440 : '100%', minHeight: isStacked ? 380 : 700, zIndex: 1 });
