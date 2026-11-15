export const s0 = ({lab,transX,transY,transZ,rotX,rotY,rotZ,scaleVal,isSelected}) => ({
        '--card-theme': lab.color,
        '--card-theme-rgb': lab.colorRgb,
        '--card-glow': lab.glowColor,
        transform: `translateX(${transX}px) translateY(${transY}px) translateZ(${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scaleVal})`,
        zIndex: isSelected ? 15 : 12,
        opacity: isSelected ? 1 : 0.88,
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
      });

export const s1 = ({lab}) => ({ background: lab.color });

export const s2 = ({item}) => ({
                  color: item.accent,
                  borderColor: `${item.accent}44`
                });

export const s3 = ({lab}) => ({
        '--card-theme': lab.color,
        '--card-theme-rgb': lab.colorRgb,
        '--card-glow': lab.glowColor
      });

export const s4 = ({lab}) => ({ color: lab.color });

export const s5 = ({item}) => ({ color: item.accent });
