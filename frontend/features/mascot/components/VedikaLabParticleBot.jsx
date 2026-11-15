'use client';

import inlineStyles from '@/features/mascot/styles/VedikaLabParticleBot.styles';
import { useEffect, useRef } from 'react';
import {TouchTexture,generateLabShape} from '@/features/mascot/components/features-mascot-components-VedikaLabParticleBot.support.jsx';
import {useVedikaLabParticleBotModel} from '@/features/mascot/hooks/features-mascot-components-VedikaLabParticleBot.jsx';
export default function VedikaLabParticleBot({
  labId = 'physics',
  accentColor = '#10B981',
  accentRgb = '16, 185, 129',
  isEntering = false,
  onSettled = null,
  className = ''
}) {
const {canvasRef,containerRef,onSettledRef,isEnteringRef}=useVedikaLabParticleBotModel({labId,accentColor,accentRgb,isEntering,onSettled,className});
return (
    <div
      ref={containerRef}
      className={`vedika-lab-bot-canvas-wrap ${className}`}
      style={inlineStyles.s0}
    >
      <canvas
        ref={canvasRef}
        style={inlineStyles.s1}
      />
    </div>
  );

}
