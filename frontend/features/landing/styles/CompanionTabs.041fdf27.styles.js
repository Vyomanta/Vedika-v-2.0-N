export const s0 = ({isMerged,isActive,tab,T}) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '12px 6px',
                borderRadius: isMerged ? '0 16px 16px 0' : 12,
                borderTop: isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent',
                borderRight: isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent',
                borderBottom: isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent',
                borderLeft: isMerged ? `3px solid ${T.s1}` : (isActive ? `1.5px solid ${tab.color}` : '1.5px solid transparent'),
                background: isActive ? (isMerged ? T.s1 : `${tab.color}18`) : 'transparent',
                boxShadow: isActive && !isMerged ? `0 0 16px ${tab.color}25` : 'none',
                color: isActive ? '#FFFFFF' : (T.muted || '#94A3B8'),
                outline: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                width: isMerged ? 'calc(100% + 2px)' : '100%',
                marginLeft: isMerged ? -2 : 0,
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: isActive ? 20 : 1
              });

export const s1 = ({isActive,tab}) => ({ color: isActive ? tab.color : 'inherit', filter: 'none', transition: 'color 0.2s' });

export const s2 = ({tab}) => ({
                    position: 'absolute',
                    top: -6,
                    right: -10,
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 10,
                    background: tab.color,
                    color: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                  });

export const s3 = ({isActive,T}) => ({
                fontSize: 10.5,
                fontWeight: isActive ? 700 : 500,
                textAlign: 'center',
                lineHeight: 1.2,
                color: isActive ? '#FFFFFF' : (T.text || '#E2E8F0'),
                wordBreak: 'break-word',
                maxWidth: '100%',
                transition: 'color 0.2s'
              });

export const s4 = ({isActive,tab}) => ({
                fontSize: 9,
                opacity: isActive ? 0.9 : 0.6,
                textAlign: 'center',
                lineHeight: 1.1,
                color: isActive ? tab.color : 'inherit'
              });

export const s5 = ({T}) => ({
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
        background: T.s2 || '#0E1322',
        padding: 5,
        borderRadius: 12,
        border: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
        flex: 1
      });

export const s6 = ({isActive,tab,T}) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '7px 4px',
                borderRadius: 8,
                border: isActive ? `1.5px solid ${tab.color}` : '1px solid transparent',
                background: isActive ? `${tab.color}15` : 'transparent',
                boxShadow: 'none',
                color: isActive ? (T.text || '#FFF') : (T.muted || '#94A3B8'),
                outline: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
                position: 'relative'
              });

export const s7 = ({isActive,tab}) => ({ color: isActive ? tab.color : 'currentColor' });

export const s8 = ({isActive}) => ({
                  fontSize: 11.5,
                  fontWeight: isActive ? 700 : 600,
                  whiteSpace: 'nowrap'
                });

export const s9 = ({isActive,tab,T}) => ({
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 10,
                    background: isActive ? tab.color : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#FFFFFF' : T.muted
                  });

export const s10 = ({isActive}) => ({
                fontSize: 9.5,
                opacity: isActive ? 0.9 : 0.6,
                whiteSpace: 'nowrap'
              });

export const s11 = ({T}) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            padding: '7px 11px',
            borderRadius: 10,
            background: T.s2 || '#0E1322',
            border: `1px solid ${T.border || 'rgba(255,255,255,0.08)'}`,
            color: T.muted || '#94A3B8',
            cursor: 'pointer',
            fontSize: 11.5,
            fontWeight: 600,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            alignSelf: 'stretch'
          });
