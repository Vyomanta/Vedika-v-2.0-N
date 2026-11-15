'use client';

import inlineStyles from '@/features/mascot/styles/VedikaLabParticleBot.styles';
import { useEffect, useRef } from 'react';
import {TouchTexture,generateLabShape} from '@/features/mascot/components/features-mascot-components-VedikaLabParticleBot.support.jsx';

export function useVedikaLabParticleBotModel({
  labId = 'physics',
  accentColor = '#10B981',
  accentRgb = '16, 185, 129',
  isEntering = false,
  onSettled = null,
  className = ''
}) {

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  const isEnteringRef = useRef(isEntering);
  isEnteringRef.current = isEntering;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animId;
    let particles = [];
    const TOTAL_PARTICLES = 1350;

    const touchTexture = new TouchTexture(64, 65, 0.22);

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      isHovered: false
    };

    let dpr = 1;
    let containerWidth = 520;
    let containerHeight = 560;

    const updateCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      containerWidth = Math.max(300, Math.floor(rect.width || 520));
      containerHeight = Math.max(300, Math.floor(rect.height || 560));

      canvas.width = Math.floor(containerWidth * dpr);
      canvas.height = Math.floor(containerHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    // Generate initial target positions for the selected scientific lab
    const initialTargets = generateLabShape(labId, TOTAL_PARTICLES);

    // Initialize particles with smooth convergence
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const tgt = initialTargets[i] || { x: 0, y: 0, z: 0, size: 1.5, alpha: 0.8 };
      const spawnDist = 120 + Math.random() * 240;
      const spawnAngle = Math.random() * Math.PI * 2;

      particles.push({
        pindex: i,
        tgtX: tgt.x,
        tgtY: tgt.y,
        tgtZ: tgt.z,
        size: tgt.size,
        alpha: tgt.alpha,
        x: tgt.x + Math.cos(spawnAngle) * spawnDist,
        y: tgt.y + Math.sin(spawnAngle) * spawnDist,
        z: tgt.z + (Math.random() - 0.5) * 80,
        vx: 0,
        vy: 0,
        vz: 0,
        angle: Math.random() * Math.PI * 2,
        rnd: 0.7 + Math.random() * 1.3,
        spring: 0.055 + Math.random() * 0.02,
        friction: 0.82 + Math.random() * 0.03,
        floatPower: 14.0 + Math.random() * 6.0,
        seed: Math.random() * 1000
      });
    }

    // Relative mouse position inside container
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      mouse.prevX = relX;
      mouse.prevY = relY;
      mouse.x = relX;
      mouse.y = relY;
      mouse.isHovered = (relX >= -60 && relX <= rect.width + 60 && relY >= -60 && relY <= rect.height + 60);

      const uvX = relX / rect.width;
      const uvY = relY / rect.height;
      if (uvX >= -0.2 && uvX <= 1.2 && uvY >= -0.2 && uvY <= 1.2) {
        touchTexture.addTouch({ x: uvX, y: uvY });
      }
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isHovered = false;
    };

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const shockwaveRadius = 150;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const screenX = centerX + p.x;
        const screenY = centerY + p.y;
        const dx = screenX - relX;
        const dy = screenY - relY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < shockwaveRadius && dist > 0.01) {
          const norm = dist / shockwaveRadius;
          const force = Math.pow(1 - norm, 2) * 26;
          p.vz -= force * 1.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      touchTexture.addTouch({ x: relX / rect.width, y: relY / rect.height });
    };

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0]);
      }
    }, { passive: true });
    window.addEventListener('touchend', handlePointerLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    let time = 0;
    const PERSPECTIVE_FOV = 440;
    let warpFade = 1.0;

    function animate() {
      time += 0.018;

      const rect = container.getBoundingClientRect();

      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) {
        animId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Handle page entrance / navigation warp dissolution
      if (isEnteringRef.current) {
        warpFade = Math.max(0, warpFade - 0.045);
      } else {
        warpFade = Math.min(1, warpFade + 0.05);
      }

      if (warpFade <= 0.01) {
        animId = requestAnimationFrame(animate);
        return;
      }

      // Exact local center of the container (and the bot avatar)
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;

      touchTexture.update();
      const touchData = touchTexture.getImageData();

      if (mouse.isHovered && mouse.x > 0) {
        const uvX = mouse.x / containerWidth;
        const uvY = mouse.y / containerHeight;
        if (uvX >= -0.05 && uvX <= 1.05 && uvY >= -0.05 && uvY <= 1.05) {
          touchTexture.addTouch({ x: uvX, y: uvY });
        }
      }

      const rotY = time * 0.45;
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let rotTgtX = p.tgtX;
        let rotTgtY = p.tgtY;
        let rotTgtZ = p.tgtZ;

        if (labId === 'math' || labId === 'physics' || labId === 'biology') {
          rotTgtX = p.tgtX * cosR - p.tgtZ * sinR;
          rotTgtZ = p.tgtX * sinR + p.tgtZ * cosR;
        } else if (labId === 'chemistry') {
          rotTgtX = p.tgtX + Math.sin(time * 1.5 + p.seed) * 3;
          rotTgtY = p.tgtY + Math.cos(time * 1.2 + p.seed) * 2.5;
        }

        let t = 0;
        if (touchData) {
          const u = (p.x + containerWidth / 2) / containerWidth;
          const v = (p.y + containerHeight / 2) / containerHeight;
          const tx = Math.max(0, Math.min(63, (u * 63) | 0));
          const ty = Math.max(0, Math.min(63, (v * 63) | 0));
          t = touchData[(ty * 64 + tx) * 4] / 255;
        }

        let dispX = 0;
        let dispY = 0;
        let dispZ = 0;

        if (t > 0.005) {
          const floatAmount = t * p.floatPower * p.rnd;
          dispX = Math.cos(p.angle) * floatAmount;
          dispY = Math.sin(p.angle) * floatAmount;
          dispZ = -t * 28.0;
        }

        const ambZ = Math.sin(time * 1.2 + p.seed) * 2.0;
        const ambX = Math.cos(time * 0.9 + p.seed) * 0.8;
        const ambY = Math.sin(time * 0.7 + p.seed) * 0.8;

        const homeX = rotTgtX + dispX + ambX;
        const homeY = rotTgtY + dispY + ambY;
        const homeZ = rotTgtZ + dispZ + ambZ;

        p.vx += (homeX - p.x) * p.spring;
        p.vy += (homeY - p.y) * p.spring;
        p.vz += (homeZ - p.z) * (p.spring * 1.2);

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vz *= p.friction;

        if (isEnteringRef.current) {
          p.vz -= 3.5;
          p.vx += Math.cos(p.angle) * 2.5;
          p.vy += Math.sin(p.angle) * 2.5;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Safe perspective clamping
        const safeZ = Math.max(-PERSPECTIVE_FOV + 50, p.z);
        const depthScale = PERSPECTIVE_FOV / (PERSPECTIVE_FOV + safeZ);
        const clampedScale = Math.min(2.0, Math.max(0.35, depthScale));

        const screenX = centerX + p.x * clampedScale;
        const screenY = centerY + p.y * clampedScale;

        const renderRadius = Math.min(3.6, Math.max(0.6, p.size * clampedScale));
        const finalAlpha = Math.min(1, Math.max(0, p.alpha * warpFade * Math.min(1.15, clampedScale)));

        const isHighlight = i % 9 === 0;
        if (isHighlight) {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        } else {
          ctx.fillStyle = `rgba(${accentRgb}, ${finalAlpha})`;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, renderRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [labId, accentColor, accentRgb]);

  
return {canvasRef,containerRef,onSettledRef,isEnteringRef};
}
