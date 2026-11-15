export const s0 = ({x,y,isTracing}) => ({
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition: isTracing ? 'none' : 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform'
      });

export const s1 = ({p,x,y}) => ({
            position: 'absolute',
            left: p.x - x,
            top: p.y - y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${p.color}`
          });

export const s2 = ({isWriting}) => ({
          position: 'absolute',
          left: -2,
          top: -38,
          width: 40,
          height: 40,
          transformOrigin: '2px 38px',
          animation: isWriting ? 'penWritingMicro 0.24s ease-in-out infinite alternate' : 'none'
        });

export const s3 = ({accentColor}) => ({
              fontSize: 9.5,
              fontWeight: 600,
              color: accentColor || '#38BDF8',
              maxWidth: 130,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            });
