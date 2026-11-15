export const s0 = ({leftPos,lineLength,color}) => ({
          position: 'absolute',
          top: '16px',
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

export const s1 = ({color}) => ({ width: 5, height: 5, borderRadius: '50%', background: color, transform: 'translateX(-2px)' });

export const s2 = ({color}) => ({ width: 5, height: 5, borderRadius: '50%', background: color, transform: 'translateX(2px)' });

export const s3 = ({actionStyle}) => ({ fontSize: 9, color: actionStyle.text, background: actionStyle.bg, padding: '1px 6px', borderRadius: 4, fontWeight: 800 });

export const s4 = ({actionStyle}) => ({ fontSize: 11, color: actionStyle.text, fontWeight: 700, fontFamily: 'monospace' });

export const s5 = ({pillBg,pillBorder,textColor,isPointed,actionType}) => ({
                      width: 42,
                      height: 34,
                      borderRadius: 6,
                      background: pillBg,
                      border: pillBorder,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: textColor,
                      boxShadow: isPointed ? (actionType === 'SWAP' ? '0 0 12px rgba(245, 169, 91, 0.25)' : '0 0 12px rgba(34, 197, 160, 0.25)') : 'none',
                      userSelect: 'none'
                    });

export const s6 = ({textColor}) => ({ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '5px solid currentColor', color: textColor, marginBottom: 1 });

export const s7 = ({textColor}) => ({
                        background: textColor,
                        color: '#040508',
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: 3,
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace'
                      });

export const s8 = ({lineColor}) => ({
          display: 'flex', alignItems: 'stretch', gap: 0,
          background: '#07090F', borderRadius: 10, overflow: 'hidden',
          border: `1px solid ${lineColor}40`
        });

export const s9 = ({lineColor}) => ({
            padding: '8px 12px', background: `${lineColor}20`,
            borderRight: `2px solid ${lineColor}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minWidth: 50, flexShrink: 0
          });

export const s10 = ({lineColor}) => ({ fontSize: 8.5, color: lineColor, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' });

export const s11 = ({lineColor}) => ({ fontSize: 16, fontWeight: 800, color: lineColor, fontFamily: 'monospace' });

export const s12 = ({i,scalarKeys,isNew,isChanged}) => ({
                      display: 'flex', alignItems: 'center',
                      padding: '6px 12px',
                      borderBottom: i < scalarKeys.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      background: isNew ? 'rgba(52,211,153,0.06)' : isChanged ? 'rgba(91,140,248,0.08)' : 'transparent',
                      transition: 'background 0.2s'
                    });

export const s13 = ({isNew,isChanged}) => ({
                      width: 3, height: 16, borderRadius: 2, marginRight: 8, flexShrink: 0,
                      background: isNew ? '#34D399' : isChanged ? '#5B8CF8' : 'transparent'
                    });

export const s14 = ({isNew,isChanged}) => ({
                      fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700,
                      color: isNew ? '#34D399' : isChanged ? '#5B8CF8' : '#F8FAFC',
                      marginLeft: 'auto', textAlign: 'right',
                      maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    });
