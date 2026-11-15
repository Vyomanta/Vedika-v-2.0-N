export const s0 = ({isInteractingWithBar}) => ({
          position: 'relative',
          width: '100%',
          height: isInteractingWithBar ? 8 : 4,
          background: 'rgba(255, 255, 255, 0.12)',
          cursor: 'pointer',
          transition: 'height 0.12s ease'
        });

export const s1 = ({progressPercent}) => ({
          height: '100%',
          width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
          position: 'relative',
          pointerEvents: 'none'
        });

export const s2 = ({isInteractingWithBar,isDraggingRef}) => ({
            position: 'absolute',
            right: -6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: isInteractingWithBar ? 14 : 8,
            height: isInteractingWithBar ? 14 : 8,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 0 10px rgba(96, 165, 250, 0.9)',
            opacity: isInteractingWithBar ? 1 : 0.85,
            transition: isDraggingRef.current ? 'none' : 'width 0.12s, height 0.12s'
          });

export const s3 = ({hoverX}) => ({
            position: 'absolute',
            bottom: 14,
            left: hoverX,
            transform: 'translateX(-50%)',
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(11, 15, 25, 0.95)',
            color: '#FFFFFF',
            fontSize: 11,
            fontFamily: 'monospace',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            zIndex: 30
          });

export const s4 = ({isMobile}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 8 : 12,
        padding: isMobile ? '8px 10px' : '10px 18px',
        background: '#0B0F19',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#FFFFFF',
        flexWrap: isMobile ? 'wrap' : 'nowrap'
      });

export const s5 = ({isMobile}) => ({ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, flexWrap: 'wrap' });

export const s6 = ({isMobile,isPlaying}) => ({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? 30 : 34,
              height: isMobile ? 30 : 34,
              borderRadius: '50%',
              background: isPlaying ? 'rgba(255, 255, 255, 0.08)' : '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: isPlaying ? 'none' : '0 2px 10px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.15s ease'
            });

export const s7 = ({isMobile}) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: isMobile ? '4px 6px' : '6px 9px',
                borderRadius: 8,
                background: 'transparent',
                color: '#94A3B8',
                fontSize: isMobile ? 11 : 11.5,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              });

export const s8 = ({isMobile}) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: isMobile ? '4px 6px' : '6px 9px',
                borderRadius: 8,
                background: 'transparent',
                color: '#94A3B8',
                fontSize: isMobile ? 11 : 11.5,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              });

export const s9 = ({isMobile}) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            paddingLeft: isMobile ? 4 : 8,
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: isMobile ? 11 : 12,
            fontFamily: 'monospace',
            color: '#CBD5E1',
            letterSpacing: '0.02em'
          });

export const s10 = ({isMobile,useHtml5Fallback}) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: isMobile ? '3px 7px' : '4px 9px',
              borderRadius: 6,
              background: useHtml5Fallback ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.07)',
              border: `1px solid ${useHtml5Fallback ? 'rgba(59, 130, 246, 0.45)' : 'rgba(255, 255, 255, 0.12)'}`,
              color: useHtml5Fallback ? '#60A5FA' : '#94A3B8',
              fontSize: isMobile ? 10 : 11,
              fontWeight: 500,
              cursor: 'pointer',
              marginLeft: isMobile ? 2 : 6,
              transition: 'all 0.15s ease'
            });

export const s11 = ({isMobile}) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderRadius: 9999,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.22))',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            padding: isMobile ? '5px 11px' : '7px 15px',
            fontSize: isMobile ? 11 : 12,
            fontWeight: 600,
            color: '#FBBF24',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 10px rgba(245, 158, 11, 0.12)',
            transition: 'all 0.15s ease'
          });
