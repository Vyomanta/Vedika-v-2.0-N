export const s0 = ({style}) => ({
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 7,
        position: 'relative',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      });

export const s1 = ({tipBorder,tipColor}) => ({
            position: 'absolute',
            bottom: '100%',
            marginBottom: 6,
            background: 'rgba(15, 23, 42, 0.94)',
            border: tipBorder,
            borderRadius: 10,
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 700,
            color: tipColor,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 30,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            animation: 'fadeInUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          });

export const s2 = ({labelColor}) => ({
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: labelColor,
          textTransform: 'uppercase',
          lineHeight: 1,
          transition: 'color 0.2s ease',
          userSelect: 'none'
        });

export const s3 = ({size,isHovered,themeColor,isTyping,isAiLoading,isIdle,themeVars}) => ({
          width: size,
          height: Math.round(size * 0.88),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          filter: isHovered
            ? (themeColor === 'cyan'
                ? 'drop-shadow(0 6px 20px rgba(56, 189, 248, 0.8)) drop-shadow(0 0 12px rgba(14, 165, 233, 0.55))'
                : 'drop-shadow(0 6px 20px rgba(192, 132, 252, 0.8)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.55))')
            : isTyping
            ? (themeColor === 'cyan'
                ? 'drop-shadow(0 4px 16px rgba(14, 165, 233, 0.6)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))'
                : 'drop-shadow(0 4px 16px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 8px rgba(192, 132, 252, 0.4))')
            : isAiLoading
            ? (themeColor === 'cyan'
                ? 'drop-shadow(0 4px 14px rgba(56, 189, 248, 0.5))'
                : 'drop-shadow(0 4px 14px rgba(192, 132, 252, 0.5))')
            : 'drop-shadow(0 3px 12px rgba(0, 0, 0, 0.4))',
          transition: 'filter 0.35s ease, transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1)',
          transform: isHovered ? 'scale(1.08) translateY(-2px)' : isTyping ? 'scale(1.04) translateY(-1px)' : 'scale(1.0)',
          animation: isIdle ? 'blobIdleFloat 3.8s ease-in-out infinite' : isAiLoading ? 'blobIdleFloat 2.2s ease-in-out infinite' : 'none',
          ...themeVars
        });
