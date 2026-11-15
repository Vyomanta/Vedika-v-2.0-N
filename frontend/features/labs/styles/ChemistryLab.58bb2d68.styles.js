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

export const s3 = ({isDripping,baseAdded}) => ({
                  background: isDripping ? '#F55B6B' : '#22C5A0',
                  color: '#000000',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: baseAdded >= 50 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  opacity: baseAdded >= 50 ? 0.5 : 1
                });

export const s4 = ({titrationPh}) => ({ color: titrationPh > 8.2 ? '#F55B6B' : '#22C5A0', fontFamily: 'monospace' });

export const s5 = ({isPartitionOpen}) => ({
                  background: isPartitionOpen ? 'rgba(255,255,255,0.06)' : '#5B8CF8',
                  color: isPartitionOpen ? '#DDE3F2' : '#ffffff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5
                });

export const s6 = ({selectedProperty,prop}) => ({
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.06)',
                        background: selectedProperty === prop.val ? 'rgba(34, 197, 160, 0.1)' : '#131824',
                        color: selectedProperty === prop.val ? '#22C5A0' : '#8892B0',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      });

export const s7 = ({isPlaying}) => ({
                background: isPlaying ? 'rgba(34, 197, 160, 0.1)' : '#22C5A0',
                border: 'none',
                color: isPlaying ? '#22C5A0' : '#000000',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 700
              });

export const s8 = ({timeScale,item}) => ({
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: 'none',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: timeScale === item.val ? '#1E293B' : 'transparent',
                  color: timeScale === item.val ? '#22C5A0' : '#647298',
                  transition: 'all 0.15s'
                });

export const s9 = ({isStacked}) => ({
        flex: 1,
        width: '100%',
        minHeight: isStacked ? 340 : 700,
        height: isStacked ? 380 : '100%',
        order: isStacked ? 1 : 2,
        position: 'relative'
      });

export const s10 = ({isStacked}) => ({ width: '100%', height: isStacked ? 380 : '100%', minHeight: isStacked ? 340 : 700, zIndex: 1 });
