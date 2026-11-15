export const s0 = ({style}) => ({
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          ...style
        });

export const s1 = ({baseBg,style}) => ({
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
        backgroundColor: baseBg,
        ...style
      });

export const s2 = ({opacity}) => ({
          position: 'absolute',
          inset: 0,
          opacity: opacity,
          overflow: 'hidden'
        });

export const s3 = ({baseBg}) => ({ position: 'absolute', inset: 0, backgroundColor: baseBg });
