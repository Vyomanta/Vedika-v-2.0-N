export const s0 = ({}) => ({ width: 1, height: 20, background: "rgba(255, 255, 255, 0.12)", margin: "0 6px", flexShrink: 0 });

export const s1 = ({}) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 24px",
        background: "rgba(8, 12, 22, 0.96)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        color: "#94a3b8",
        fontSize: 12,
        zIndex: 30,
        width: "100%",
        boxSizing: "border-box",
        minHeight: 52,
      });

export const s2 = ({}) => ({ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 });

export const s3 = ({btnBase,showTakeaways}) => ({
              ...btnBase,
              background: showTakeaways ? "rgba(245, 169, 91, 0.22)" : "rgba(245, 169, 91, 0.10)",
              color: "#f5a95b",
              borderColor: showTakeaways ? "rgba(245, 169, 91, 0.5)" : "rgba(245, 169, 91, 0.3)",
              boxShadow: showTakeaways ? "0 0 12px rgba(245, 169, 91, 0.25)" : "none",
            });

export const s4 = ({}) => ({ fontWeight: 700 });

export const s5 = ({}) => ({
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px",
            borderRadius: 8,
            background: "rgba(56, 189, 248, 0.08)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            color: "#38bdf8",
            fontSize: 11.5,
            fontWeight: 600,
          });

export const s6 = ({}) => ({ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 });

export const s7 = ({}) => ({
            display: "flex",
            alignItems: "center",
            gap: 3,
            background: "rgba(255, 255, 255, 0.03)",
            padding: 3,
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          });

export const s8 = ({btnBase}) => ({ ...btnBase, padding: "5px 8px" });

export const s9 = ({btnBase}) => ({ ...btnBase, padding: "5px 9px", minWidth: 46, justifyContent: "center" });

export const s10 = ({btnBase}) => ({ ...btnBase, padding: "5px 8px" });

export const s11 = ({btnBase}) => ({
              ...btnBase,
              padding: "5px 10px",
              background: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              borderColor: "rgba(56, 189, 248, 0.3)",
            });

export const s12 = ({btnBase,zoom,lvl}) => ({
                ...btnBase,
                padding: "4px 8px",
                fontSize: 11,
                background: Math.abs(zoom - lvl) < 0.04 ? "rgba(56, 189, 248, 0.2)" : "transparent",
                color: Math.abs(zoom - lvl) < 0.04 ? "#38bdf8" : "#94a3b8",
                borderColor: Math.abs(zoom - lvl) < 0.04 ? "rgba(56, 189, 248, 0.4)" : "transparent",
              });

export const s13 = ({}) => ({
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#64748b",
            padding: "4px 8px",
          });
