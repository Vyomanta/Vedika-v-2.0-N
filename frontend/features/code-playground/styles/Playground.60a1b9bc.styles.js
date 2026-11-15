export const s0 = ({isMobile}) => ({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '100%',
      background: '#040508',
      border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 0,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    });

export const s1 = ({isMobile}) => ({
        padding: isMobile ? '8px 12px' : '12px 16px',
        background: '#080A0E',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        flexShrink: 0
      });

export const s2 = ({isReady,isRunning,isTracing}) => ({
              background: (!isReady || isRunning || isTracing) ? 'rgba(255, 255, 255, 0.08)' : '#22C5A0',
              color: '#000',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: (!isReady || isRunning || isTracing) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              opacity: (!isReady || isRunning || isTracing) ? 0.6 : 1,
              transition: 'opacity 0.15s',
              fontFamily: 'inherit'
            });

export const s3 = ({isReady,isRunning,isTracing}) => ({
                background: (!isReady || isRunning || isTracing) ? 'rgba(255, 255, 255, 0.08)' : '#9B6EF8',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: (!isReady || isRunning || isTracing) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                opacity: (!isReady || isRunning || isTracing) ? 0.6 : 1,
                transition: 'all 0.15s',
                fontFamily: 'inherit'
              });

export const s4 = ({isMobile}) => ({ display: 'flex', flex: 1, minHeight: 0, height: isMobile ? 'calc(100% - 42px)' : 'calc(100% - 48px)', overflow: isMobile ? 'auto' : 'hidden', flexDirection: isMobile ? 'column' : 'row', WebkitOverflowScrolling: 'touch' });

export const s5 = ({isMobile,mainSplitPercent}) => ({
          width: isMobile ? '100%' : `${mainSplitPercent}%`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#06080C',
          overflow: 'hidden'
        });

export const s6 = ({isMobile,leftSplitPercent}) => ({ height: isMobile ? '55%' : `${leftSplitPercent}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden' });

export const s7 = ({isDraggingLeftRef}) => ({
                height: 6,
                cursor: 'row-resize',
                background: isDraggingLeftRef.current ? 'rgba(91, 140, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                zIndex: 10,
                width: '100%',
                flexShrink: 0,
                transition: 'background 0.2s'
              });

export const s8 = ({isMobile,leftSplitPercent}) => ({ height: isMobile ? '45%' : `${100 - leftSplitPercent}%`, display: 'flex', flexDirection: 'column', background: '#040508', overflow: 'hidden' });

export const s9 = ({isDraggingMainRef}) => ({
              width: 6,
              cursor: 'col-resize',
              background: isDraggingMainRef.current ? 'rgba(91, 140, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)',
              zIndex: 10,
              alignSelf: 'stretch',
              transition: 'background 0.2s',
              flexShrink: 0
            });

export const s10 = ({isMobile,mainSplitPercent}) => ({
          width: isMobile ? '100%' : `${100 - mainSplitPercent}%`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#040508',
          overflow: 'hidden'
        });

export const s11 = ({rightSplitPercent}) => ({
            height: rightSplitPercent === 100 ? 'calc(100% - 36px)' : `${rightSplitPercent}%`,
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            flexShrink: 0
          });

export const s12 = ({currentStep}) => ({
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: currentStep === 0 ? '#4A5568' : '#F8FAFC',
                          padding: 5,
                          borderRadius: 4,
                          cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        });

export const s13 = ({currentStep,traceData}) => ({
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: currentStep === traceData.length - 1 ? '#4A5568' : '#F8FAFC',
                          padding: 5,
                          borderRadius: 4,
                          cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        });

export const s14 = ({vizZoom}) => ({
                  padding: 14,
                  transformOrigin: 'top left',
                  transform: `scale(${vizZoom})`,
                  width: `${100 / vizZoom}%`,
                  minHeight: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                });

export const s15 = ({isMobile}) => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: 14, alignItems: 'start' });

export const s16 = ({isDraggingRightRef}) => ({
                height: 6,
                cursor: 'row-resize',
                background: isDraggingRightRef.current ? 'rgba(245, 169, 91, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                zIndex: 10,
                width: '100%',
                flexShrink: 0,
                transition: 'background 0.2s'
              });

export const s17 = ({rightSplitPercent}) => ({
            height: rightSplitPercent === 100 ? '36px' : `${100 - rightSplitPercent}%`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#040508',
            flexShrink: 0
          });

export const s18 = ({activeTab,rightSplitPercent}) => ({
                  background: activeTab === 'explanation' && rightSplitPercent < 100 ? 'rgba(34, 197, 160, 0.08)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'explanation' && rightSplitPercent < 100 ? `2px solid #22C5A0` : 'none',
                  color: activeTab === 'explanation' && rightSplitPercent < 100 ? '#22C5A0' : '#8892B0',
                  padding: '6px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.15s'
                });

export const s19 = ({activeTab,rightSplitPercent}) => ({
                    background: activeTab === 'instructions' && rightSplitPercent < 100 ? 'rgba(155, 110, 248, 0.08)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'instructions' && rightSplitPercent < 100 ? `2px solid #9B6EF8` : 'none',
                    color: activeTab === 'instructions' && rightSplitPercent < 100 ? '#9B6EF8' : '#8892B0',
                    padding: '6px 16px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.15s'
                  });

export const s20 = ({rightSplitPercent}) => ({ flex: 1, overflowY: 'auto', padding: 14, display: rightSplitPercent === 100 ? 'none' : 'block' });

export const s21 = ({status}) => ({ fontFamily: 'monospace', fontSize: 11, color: status === 'failed' ? '#F55B6B' : status === 'passed' ? '#22C5A0' : '#8892B0', wordBreak: 'break-all' });
