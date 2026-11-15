'use client';
import * as featureStyleFunctions from '@/features/mascot/styles/VedikaParticleBot.7288cf16.styles.js';

import inlineStyles from '@/features/mascot/styles/VedikaParticleBot.styles';
import { useEffect, useRef, useState } from 'react';
import {TouchTexture,TARGET_CACHE} from '@/features/mascot/components/features-mascot-components-VedikaParticleBot.support.jsx';
import {useVedikaParticleBotModel} from '@/features/mascot/hooks/features-mascot-components-VedikaParticleBot.jsx';
export default function VedikaParticleBot({
  src = '/vedika-bot.png',
  width = 520,
  height = 560,
  colorMode = 'monochrome',
  isEntering = false,
  onSettled = null,
  className = '',
  inline = false,
  themeRgb = null,
  intensity = 1.0,
  particleStep = null
}) {
const {canvasRef,containerRef,isLoaded,setIsLoaded,intensityRef,onSettledRef,isEnteringRef,parseThemeRgb,themeRgbRef,morphToImageRef,prevSrcRef}=useVedikaParticleBotModel({src,width,height,colorMode,isEntering,onSettled,className,inline,themeRgb,intensity,particleStep});
return (
    <div
      ref={containerRef}
      className={`vedika-particle-bot-container ${className}`}
      style={featureStyleFunctions.s0({inline,width,height})}
    >
      <canvas
        ref={canvasRef}
        style={inline ? {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
          opacity: 1
        } : {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: isEntering ? 0 : 1,
          transition: 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        title="Vedika Particle Bot"
      />

      {!isLoaded && !inline && (
        <div style={inlineStyles.s0}>
          <div style={inlineStyles.s1} />
          <span>Generating Vedika Particles...</span>
        </div>
      )}

      {!isLoaded && inline && (
        <div style={inlineStyles.s2} />
      )}
    </div>
  );

}
