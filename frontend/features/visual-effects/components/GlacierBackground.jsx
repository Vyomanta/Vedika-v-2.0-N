'use client';
import * as featureStyleFunctions from '@/features/visual-effects/styles/GlacierBackground.e7dfb03d.styles.js';

import inlineStyles from '@/features/visual-effects/styles/GlacierBackground.styles';


import React from 'react';
import FeralUIFlowCanvas, { PRESETS } from '@/components/FeralUIFlowCanvas';
import WavyLinesBackground from '@/components/WavyLinesBackground';

/**
 * GlacierBackground - FeralUI Gradient Flow & Wavy Lines Background for Ask Vedika & Code with Vedika
 * 
 * Supports:
 * - 'aurora': FeralUI Aurora Palette
 * - 'glacier': FeralUI Glacier Palette
 * - 'pastel': FeralUI Opal Palette
 * - 'waves': Cybernetic Slow Flowing Neon Wavy Lines Animation
 */
const GlacierBackground = React.memo(function GlacierBackground({
  variant = 'aurora',
  opacity = 1.0,
  style = {},
  className = ''
}) {
  if (variant === 'black' || variant === 'pure-black') {
    return (
      <div
        className={`pure-black-background ${className}`}
        style={featureStyleFunctions.s0({style})}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'waves') {
    return <WavyLinesBackground opacity={opacity} className={className} />;
  }

  const activeVariant = PRESETS[variant] ? variant : 'aurora';
  const baseBg = PRESETS[activeVariant]?.baseColor || '#232E4A';

  return (
    <div
      className={`glacier-flow-background ${className}`}
      style={featureStyleFunctions.s1({baseBg,style})}
      aria-hidden="true"
    >
      <div
        style={featureStyleFunctions.s2({opacity})}
      >
        {/* Base radiant color layer */}
        <div style={featureStyleFunctions.s3({baseBg})} />

        {/* Real-time 60fps GPU WebGL / 2D Fluid Shader (ALWAYS IN MOTION) */}
        <FeralUIFlowCanvas variant={activeVariant} />

        {/* Authentic FeralUI Grain Overlay (from official #grainp pattern) */}
        <div
          style={inlineStyles.s0}
        />
      </div>
    </div>
  );
});

export default GlacierBackground;
