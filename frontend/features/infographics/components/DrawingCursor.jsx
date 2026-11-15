'use client';
import * as featureStyleFunctions from '@/features/infographics/styles/DrawingCursor.8bb9cc6a.styles.js';

import React from "react";

export const DrawingCursor = ({ x, y, visible, label }) => {
  if (!visible) return null;

  // Prevent edge clipping: when x > 72, flip telemetry pill to left
  const isFlipped = x > 72;

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={featureStyleFunctions.s0({x,y})}
    >
      <div className="relative flex items-center">
        {/* Precision Drawing Nib Pulse */}
        <span
          className="absolute left-[2px] top-[24px] w-2 h-2 -ml-1 -mt-1 rounded-full bg-white opacity-75 animate-ping"
        />
        <span
          className="absolute left-[2px] top-[24px] w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-white shadow-[0_0_8px_#ffffff]"
        />

        {/* Minimalist White Architectural Stylus */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={featureStyleFunctions.s1({})}
        >
          <path
            d="M19.5 4.5L16.5 1.5L4.5 13.5L4 17L7.5 16.5L19.5 4.5Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="0.75"
          />
          <path
            d="M8.5 9.5L11.5 12.5L7.5 16.5L4 17L4.5 13.5L8.5 9.5Z"
            fill="#e2e8f0"
          />
          <path
            d="M4 17L1.5 22.5L7 20L4 17Z"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="0.5"
          />
          <circle cx="1.5" cy="22.5" r="0.75" fill="#ffffff" />
        </svg>

        {/* Minimalist Floating Telemetry Pill */}
        {label && (
          <div
            className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wide shadow-xl backdrop-blur-md border border-white/20 transition-all ${
              isFlipped ? "-order-1 mr-3 ml-0" : "ml-2.5 mr-0"
            }`}
            style={featureStyleFunctions.s2({})}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-1.5 align-middle animate-pulse" />
            {label}
          </div>
        )}
      </div>
    </div>
  );
};
