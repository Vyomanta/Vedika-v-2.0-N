export const s0 = ({btnBaseStyle,showCode}) => ({
              ...btnBaseStyle,
              background: showCode ? 'rgba(91, 140, 248, 0.2)' : btnBaseStyle.background,
              color: showCode ? '#729DF8' : btnBaseStyle.color,
              borderColor: showCode ? 'rgba(91, 140, 248, 0.4)' : btnBaseStyle.borderColor
            });

export const s1 = ({btnBaseStyle}) => ({
              ...btnBaseStyle,
              color: '#60A5FA',
              background: 'rgba(96, 165, 250, 0.1)',
              borderColor: 'rgba(96, 165, 250, 0.3)'
            });

export const s2 = ({btnBaseStyle}) => ({
                ...btnBaseStyle,
                color: '#F59E0B',
                background: 'rgba(245, 158, 11, 0.1)',
                borderColor: 'rgba(245, 158, 11, 0.25)'
              });

export const s3 = ({btnBaseStyle}) => ({
                ...btnBaseStyle,
                color: '#F87171',
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.25)'
              });

export const s4 = ({btnBaseStyle}) => ({ ...btnBaseStyle, marginTop: 8 });

export const s5 = ({zoom,isWheelZooming}) => ({
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: isWheelZooming ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                margin: '0 auto',
                width: '100%',
                maxWidth: '820px',
                touchAction: 'none'
              });

export const s6 = ({isKeypointsOpen}) => ({
                color: isKeypointsOpen ? '#F5A95B' : '#64748B',
                transform: isKeypointsOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              });

export const s7 = ({btnBaseStyle}) => ({
                      ...btnBaseStyle,
                      color: '#F5A95B',
                      borderColor: 'rgba(245, 169, 91, 0.4)',
                      background: 'rgba(245, 169, 91, 0.14)',
                      padding: '6px 12px'
                    });

export const s8 = ({btnBaseStyle,modalZoom,MAX_MODAL_ZOOM}) => ({ ...btnBaseStyle, opacity: modalZoom >= MAX_MODAL_ZOOM ? 0.45 : 1, cursor: modalZoom >= MAX_MODAL_ZOOM ? 'not-allowed' : 'pointer' });

export const s9 = ({btnBaseStyle,modalZoom,MIN_MODAL_ZOOM}) => ({ ...btnBaseStyle, opacity: modalZoom <= MIN_MODAL_ZOOM ? 0.45 : 1, cursor: modalZoom <= MIN_MODAL_ZOOM ? 'not-allowed' : 'pointer' });

export const s10 = ({isPanning}) => ({
                  flex: 1,
                  height: '100%',
                  minHeight: 0,
                  overflowY: 'auto',
                  overflowX: 'auto',
                  padding: '24px 20px 80px',
                  background: 'radial-gradient(circle at 50% 30%, rgba(18, 25, 42, 0.85) 0%, rgba(7, 9, 16, 0.98) 100%)',
                  position: 'relative',
                  cursor: isPanning ? 'grabbing' : 'grab',
                  scrollBehavior: 'auto',
                  overscrollBehavior: 'contain',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                });

export const s11 = ({btnBaseStyle}) => ({ ...btnBaseStyle, marginTop: 8 });

export const s12 = ({modalZoom,isPanning,isWheelZooming}) => ({
                      transform: `scale(${modalZoom})`,
                      transformOrigin: 'top center',
                      transition: (isPanning || isWheelZooming) ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      margin: '0 auto',
                      width: '100%',
                      maxWidth: '1440px',
                      paddingBottom: 40,
                      minHeight: 'fit-content'
                    });
