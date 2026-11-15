export const s0 = ({d,slideStep,isActive,isVisible}) => ({
                    position: 'absolute',
                    transform: `translateX(${d * slideStep}px) scale(${isActive ? 1 : Math.max(0.78, 1 - Math.abs(d) * 0.1)})`,
                    opacity: isVisible ? (isActive ? 1 : Math.max(0.35, 1 - Math.abs(d) * 0.28)) : 0,
                    zIndex: isActive ? 10 : 10 - Math.abs(d),
                    pointerEvents: isVisible ? 'auto' : 'none',
                    transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease, filter 0.5s ease'
                  });
