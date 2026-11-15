export const s0 = ({isRevealed,pixelX,pixelY}) => ({
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0) scale(1)" : "translateY(16px) scale(0.94)",
        transformOrigin: `${pixelX}px ${pixelY}px`,
        transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: isRevealed ? "auto" : "none",
      });

export const s1 = ({isDrawn}) => ({
          opacity: isDrawn ? 0.16 : 0,
          transition: "opacity 0.4s ease-out",
        });

export const s2 = ({isDrawn}) => ({
          opacity: isDrawn ? 0.9 : 0,
          transition: "opacity 0.3s ease-out",
        });

export const s3 = ({isDrawn}) => ({
          opacity: isDrawn ? 0.95 : 0,
          transition: "stroke-dashoffset 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out",
        });
