export const s0 = ({displayMode,textColor,blockBg,blockBorder,style}) => ({
          display: displayMode ? 'block' : 'inline-block',
          margin: displayMode ? '14px 0' : '0 4px',
          textAlign: displayMode ? 'center' : 'left',
          overflowX: displayMode ? 'auto' : 'visible',
          maxWidth: '100%',
          color: textColor,
          fontWeight: 700,
          padding: displayMode ? '14px 20px' : '2px 4px',
          background: displayMode ? blockBg : 'rgba(91, 140, 248, 0.06)',
          borderRadius: displayMode ? '12px' : '6px',
          border: displayMode ? `1px solid ${blockBorder}` : '1px solid rgba(91, 140, 248, 0.15)',
          verticalAlign: 'middle',
          boxShadow: displayMode ? '0 2px 10px rgba(0, 0, 0, 0.04)' : 'none',
          ...style
        });

export const s1 = ({theme,displayMode,style}) => ({
        fontFamily: 'monospace',
        background: 'rgba(91, 140, 248, 0.15)',
        color: theme.accent || '#3B82F6',
        padding: '2px 8px',
        borderRadius: 6,
        fontWeight: 700,
        fontSize: 14,
        display: displayMode ? 'block' : 'inline-block',
        margin: displayMode ? '10px 0' : '2px 4px',
        ...style
      });

export const s2 = ({isWaterFlip}) => ({
          display: 'inline-block',
          transform: isWaterFlip ? 'scaleY(-1)' : 'scaleX(-1)',
          fontWeight: 700,
          margin: '0 1px'
        });

export const s3 = ({theme}) => ({
                  background: `${theme.purple || '#8B5CF6'}18`,
                  color: theme.purple || '#8B5CF6',
                  border: `1px solid ${theme.purple || '#8B5CF6'}40`,
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '13px',
                  marginRight: '6px',
                  display: 'inline-block',
                  letterSpacing: '0.3px'
                });

export const s4 = ({T}) => ({ fontSize: 15, lineHeight: 1.85, color: T.text, fontWeight: 500 });

export const s5 = ({T}) => ({
                    background: `${T.green}18`,
                    border: `1px solid ${T.green}40`,
                    borderRadius: 12,
                    padding: '14px 18px',
                    marginTop: 24,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: T.green,
                    fontWeight: 800,
                    fontSize: 18,
                    boxShadow: `0 4px 14px ${T.green}20`
                  });

export const s6 = ({T}) => ({
                  fontSize: 17,
                  fontWeight: 700,
                  color: T.purple,
                  marginTop: 22,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: 8
                });

export const s7 = ({T}) => ({
                fontSize: 15,
                fontWeight: 700,
                color: T.accent,
                marginTop: 16,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              });

export const s8 = ({T}) => ({
                  background: T.s2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: '14px 18px',
                  margin: '12px 0',
                  textAlign: 'left',
                  color: T.text,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap'
                });

export const s9 = ({T}) => ({ margin: '12px 0', lineHeight: 1.85, color: T.text });

export const s10 = ({T}) => ({ margin: '8px 0', lineHeight: 1.85, color: T.text });

export const s11 = ({T}) => ({ fontWeight: 700, color: T.text });

export const s12 = ({T}) => ({ borderLeft: `3px solid ${T.purple}`, paddingLeft: 12, margin: '10px 0', color: T.muted });

export const s13 = ({T}) => ({ padding: '8px 12px', color: T.text });

export const s14 = ({T}) => ({ padding: '8px 12px', fontWeight: 700, color: T.text });
