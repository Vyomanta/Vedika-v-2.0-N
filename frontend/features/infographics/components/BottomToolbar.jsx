'use client';
import * as featureStyleFunctions from '@/features/infographics/styles/BottomToolbar.4323a659.styles.js';

import React from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Move,
  Layers,
} from "lucide-react";

export const BottomToolbar = ({
  scene,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitToScreen,
  takeawaysCount = 0,
  showTakeaways = false,
  onToggleTakeaways,
}) => {
  const layoutType = scene?.layout?.type || "editorial";
  const formattedLayoutName = layoutType
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  };

  const divider = (
    <div style={featureStyleFunctions.s0({})} />
  );

  return (
    <div
      className="infographic-bottom-dock"
      style={featureStyleFunctions.s1({})}
    >
      {/* ── Left Side: Key Takeaways Companion Button & Layout Badge ── */}
      <div style={featureStyleFunctions.s2({})}>
        {takeawaysCount > 0 && (
          <button
            type="button"
            onClick={onToggleTakeaways}
            style={featureStyleFunctions.s3({btnBase,showTakeaways})}
            title="Toggle Key Takeaways (Collapsed by default)"
          >
            <Sparkles size={14} color="#f5a95b" />
            <span style={featureStyleFunctions.s4({})}>Key Takeaways ({takeawaysCount})</span>
          </button>
        )}

        {/* Blueprint Architecture Pill */}
        <div
          style={featureStyleFunctions.s5({})}
          title={`Autonomous layout: ${layoutType}`}
        >
          <Layers size={13} />
          <span>{formattedLayoutName} Layout</span>
        </div>
      </div>

      {/* ── Center / Right Side: Clean Zoom Suite in ONE Line ── */}
      <div style={featureStyleFunctions.s6({})}>
        <div
          style={featureStyleFunctions.s7({})}
        >
          <button
            type="button"
            onClick={onZoomOut}
            style={featureStyleFunctions.s8({btnBase})}
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>

          <button
            type="button"
            onClick={() => onZoomReset?.(1.0)}
            style={featureStyleFunctions.s9({btnBase})}
            title="Reset to 100%"
          >
            <span>{Math.round(zoom * 100)}%</span>
          </button>

          <button
            type="button"
            onClick={onZoomIn}
            style={featureStyleFunctions.s10({btnBase})}
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            onClick={onFitToScreen}
            style={featureStyleFunctions.s11({btnBase})}
            title="Fit Entire Infographic to Window"
          >
            <Maximize2 size={13} />
            <span>Fit</span>
          </button>

          {[0.75, 1.0, 1.25, 1.5].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onZoomReset?.(lvl)}
              style={featureStyleFunctions.s12({btnBase,zoom,lvl})}
              title={`Zoom ${Math.round(lvl * 100)}%`}
            >
              {Math.round(lvl * 100)}%
            </button>
          ))}
        </div>

        {divider}

        {/* Quick Canvas Hint */}
        <div
          style={featureStyleFunctions.s13({})}
        >
          <Move size={12} color="#38bdf8" />
          <span>Pan: Click &amp; Drag &bull; Zoom: Ctrl+Scroll &bull; Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
