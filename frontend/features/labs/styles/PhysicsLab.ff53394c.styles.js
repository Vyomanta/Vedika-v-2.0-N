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

export const s3 = ({pendulumGravity,preset}) => ({
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.06)',
                        background: pendulumGravity === preset.val ? 'rgba(91, 140, 248, 0.1)' : '#131824',
                        color: pendulumGravity === preset.val ? '#5B8CF8' : '#8892B0',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      });

export const s4 = ({isPlaying}) => ({
                background: isPlaying ? 'rgba(91, 140, 248, 0.1)' : '#5B8CF8',
                border: 'none',
                color: isPlaying ? '#5B8CF8' : '#000000',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 700
              });

export const s5 = ({timeScale,item}) => ({
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: 'none',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: timeScale === item.val ? '#1E293B' : 'transparent',
                  color: timeScale === item.val ? '#5B8CF8' : '#647298',
                  transition: 'all 0.15s'
                });

export const s6 = ({isStacked}) => ({
        flex: 1,
        width: '100%',
        minHeight: isStacked ? 340 : 700,
        height: isStacked ? 380 : '100%',
        order: isStacked ? 1 : 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      });

export const s7 = ({isStacked}) => ({ width: '100%', height: isStacked ? 380 : '100%', minHeight: isStacked ? 340 : 700, zIndex: 1 });

export const s8 = ({pendulumEnergy}) => ({
                  height: '100%',
                  background: '#22C5A0',
                  width: `${Math.min(100, (pendulumEnergy.ke / (pendulumEnergy.te || 1)) * 100)}%`,
                  transition: 'width 0.05s linear'
                });

export const s9 = ({pendulumEnergy}) => ({
                  height: '100%',
                  background: '#5B8CF8',
                  width: `${Math.min(100, (pendulumEnergy.pe / (pendulumEnergy.te || 1)) * 100)}%`,
                  transition: 'width 0.05s linear'
                });

export const s10 = ({springEnergy}) => ({
                  height: '100%',
                  background: '#22C5A0',
                  width: `${Math.min(100, (springEnergy.ke / (springEnergy.te || 1)) * 100)}%`,
                  transition: 'width 0.05s linear'
                });

export const s11 = ({springEnergy}) => ({
                  height: '100%',
                  background: '#5B8CF8',
                  width: `${Math.min(100, (springEnergy.pe / (springEnergy.te || 1)) * 100)}%`,
                  transition: 'width 0.05s linear'
                });
