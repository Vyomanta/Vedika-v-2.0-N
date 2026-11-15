export const s0 = ({activeCard}) => ({
        '--active-accent': activeCard.accent,
        '--active-accent-rgb': activeCard.accentRgb,
        '--active-accent-glow': activeCard.accentGlow,
        '--active-accent-glow-soft': activeCard.accentGlowSoft
      });

export const s1 = ({activeCard}) => ({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 3,
          zIndex: 99999,
          background: `linear-gradient(90deg, transparent, ${activeCard.accent}, #A855F7, transparent)`,
          boxShadow: `0 0 14px ${activeCard.accent}`
        });

export const s2 = ({card}) => ({
                    '--card-accent': card.accent,
                    '--card-rgb': card.accentRgb,
                    '--card-glow': card.accentGlow,
                    '--card-glow-soft': card.accentGlowSoft
                  });

export const s3 = ({card}) => ({ color: card.accent });

export const s4 = ({card}) => ({ color: card.accent });

export const s5 = ({card}) => ({ color: card.accent });
