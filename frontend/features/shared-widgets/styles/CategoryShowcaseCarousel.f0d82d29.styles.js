export const s0 = ({theme}) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: theme === 'gold' ? 'rgba(245, 158, 11, 0.12)' : theme === 'purple' ? 'rgba(168, 85, 247, 0.14)' : 'rgba(124, 58, 237, 0.12)',
        border: theme === 'gold' ? '1px solid rgba(245, 158, 11, 0.35)' : theme === 'purple' ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(124, 58, 237, 0.3)',
        color: theme === 'gold' ? '#FDE68A' : theme === 'purple' ? '#E9D5FF' : '#A78BFA',
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: 16
      });

export const s1 = ({translateX,scale,rotateY,zIndex,opacity,theme,isCenter}) => ({
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                ...(theme === 'gold' ? {
                  background: '#0C0E14',
                  borderColor: isCenter ? 'rgba(251, 191, 36, 0.75)' : 'rgba(245, 158, 11, 0.22)',
                  boxShadow: isCenter
                    ? '0 18px 44px rgba(0, 0, 0, 0.85), 0 0 24px rgba(245, 158, 11, 0.2)'
                    : '0 10px 30px rgba(0, 0, 0, 0.5)'
                } : theme === 'purple' ? {
                  background: '#0C0818',
                  borderColor: isCenter ? 'rgba(192, 132, 252, 0.8)' : 'rgba(168, 85, 247, 0.25)',
                  boxShadow: isCenter
                    ? '0 18px 44px rgba(0, 0, 0, 0.85), 0 0 24px rgba(168, 85, 247, 0.3)'
                    : '0 10px 30px rgba(0, 0, 0, 0.5)'
                } : {})
              });

export const s2 = ({theme}) => ({
                      background: theme === 'gold'
                        ? 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)'
                        : theme === 'purple'
                        ? 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #7C3AED 100%)'
                        : 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
                      color: theme === 'gold' ? '#000000' : '#FFFFFF',
                      border: 'none',
                      borderRadius: 12,
                      padding: '9px 18px',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      marginTop: 10,
                      boxShadow: 'none',
                      transform: 'none',
                      transition: 'none'
                    });
