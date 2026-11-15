export const s0 = ({ct,zIndex}) => ({
                transform: `translate3d(${ct.finalX}px, 0px, 0px) scale(${ct.scale})`,
                zIndex: zIndex
              });

export const s1 = ({faderAlpha}) => ({ opacity: faderAlpha });
