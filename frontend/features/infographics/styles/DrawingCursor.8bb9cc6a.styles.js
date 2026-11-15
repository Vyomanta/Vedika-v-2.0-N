export const s0 = ({x,y}) => ({
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-2px, -24px)",
        transition: "left 0.6s cubic-bezier(0.22, 1, 0.36, 1), top 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      });

export const s1 = ({}) => ({
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(255,255,255,0.4))",
          });

export const s2 = ({}) => ({
              backgroundColor: "rgba(10, 15, 26, 0.92)",
              color: "#f8fafc",
            });
