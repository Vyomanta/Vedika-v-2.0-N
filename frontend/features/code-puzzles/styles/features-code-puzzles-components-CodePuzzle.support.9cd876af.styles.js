export const s0 = ({isOpen,color,minWidth,maxWidth}) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: '#0D111E',
          border: `1px solid ${isOpen ? color : 'rgba(255, 255, 255, 0.12)'}`,
          borderRadius: 8,
          padding: '5px 12px',
          color: '#F8FAFC',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          minWidth,
          maxWidth,
          transition: 'all 0.15s ease',
          boxShadow: isOpen ? `0 0 0 2px ${color}25` : 'none',
          userSelect: 'none'
        });

export const s1 = ({isOpen}) => ({ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', flexShrink: 0 });

export const s2 = ({maxWidth}) => ({
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          minWidth: '100%',
          width: 'max-content',
          maxWidth,
          background: '#0D111E',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          padding: 4,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        });

export const s3 = ({isSelected,color}) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: isSelected ? `${color}20` : 'transparent',
                  color: isSelected ? color : '#CBD5E1',
                  fontSize: 12,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'background 0.1s ease',
                  userSelect: 'none'
                });
