export const s0 = ({leftPos,lineLength,color}) => ({
          position: 'absolute',
          top: '17px', // center of the 34px tall pill
          left: `${leftPos}px`,
          width: `${lineLength}px`,
          height: '2px',
          borderTop: `2px dotted ${color}`,
          zIndex: 0,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transform: 'translateY(-1px)'
        });

export const s1 = ({color}) => ({ width: 6, height: 6, borderRadius: '50%', background: color, transform: 'translateX(-3px)' });

export const s2 = ({color}) => ({ width: 6, height: 6, borderRadius: '50%', background: color, transform: 'translateX(3px)' });

export const s3 = ({actionStyle}) => ({ fontSize: 9.5, color: actionStyle.text, background: actionStyle.bg, padding: '2px 6px', borderRadius: 4, fontWeight: 800 });

export const s4 = ({actionStyle}) => ({ fontSize: 12, color: actionStyle.text, fontWeight: 700, fontFamily: 'monospace' });

export const s5 = ({listVal}) => ({ display: 'flex', overflowX: 'auto', padding: '16px 4px 32px 4px', justifyContent: listVal.length <= 8 ? 'center' : 'flex-start', width: '100%' });

export const s6 = ({pillBg,pillBorder,textColor,isPointed,actionType}) => ({
                      width: 42,
                      height: 34,
                      borderRadius: 8,
                      background: pillBg,
                      border: pillBorder,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: textColor,
                      boxShadow: isPointed ? (actionType === 'SWAP' ? '0 0 12px rgba(245, 169, 91, 0.15)' : '0 0 12px rgba(34, 197, 160, 0.15)') : 'none',
                      userSelect: 'none'
                    });

export const s7 = ({textColor}) => ({ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '5px solid currentColor', color: textColor, marginBottom: 2 });

export const s8 = ({textColor}) => ({
                        background: textColor,
                        color: '#040508',
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: 3,
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      });

export const s9 = ({borderStyle,shadowStyle}) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#0D111A',
                      border: borderStyle,
                      boxShadow: shadowStyle,
                      borderRadius: 8,
                      overflow: 'hidden'
                    });

export const s10 = ({valType}) => ({ fontSize: 8, color: valType === 'number' ? '#5B8CF8' : valType === 'boolean' ? '#22C5A0' : '#F5A95B', textTransform: 'uppercase', opacity: 0.6 });

export const s11 = ({isChanged}) => ({
                      minWidth: 40,
                      height: 24,
                      background: '#161B26',
                      border: isChanged ? '1px solid rgba(245, 169, 91, 0.25)' : '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 6px',
                      position: 'relative',
                      overflow: 'hidden'
                    });

export const s12 = ({valColor}) => ({
                            fontSize: 11.5,
                            color: valColor,
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap'
                          });

export const s13 = ({borderStyle,shadowStyle}) => ({ background: '#0D111A', border: borderStyle, boxShadow: shadowStyle, borderRadius: 8, padding: 12 });

export const s14 = ({}) => ({ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderBottom: `1px solid rgba(255, 255, 255, 0.05)`, padding: '3px 0' });
