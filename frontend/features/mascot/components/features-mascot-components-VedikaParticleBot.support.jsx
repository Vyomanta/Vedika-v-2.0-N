'use client';

import inlineStyles from '@/features/mascot/styles/VedikaParticleBot.styles';
import { useEffect, useRef, useState } from 'react';
export class TouchTexture {
  constructor(size = 64, maxAge = 80, radius = 0.20) {
    this.size = size;
    this.maxAge = maxAge;
    this.radius = radius;
    this.trail = [];

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.clear();
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.size, this.size);
  }

  addTouch(point) {
    let force = 0.4;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(Math.max(dd * 10000, 0.4), 1.0);
    }
    this.trail.push({
      x: point.x,
      y: point.y,
      age: 0,
      force
    });
  }

  update() {
    this.clear();
    if (!this.ctx) return;

    // Age points and discard points older than maxAge
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      p.age++;
      if (p.age > this.maxAge) {
        this.trail.splice(i, 1);
      }
    }

    // Draw active touch points with Bruno Imbrizi easeOutSine curve
    for (let i = 0; i < this.trail.length; i++) {
      this.drawTouch(this.trail[i]);
    }
  }

  drawTouch(point) {
    const posX = point.x * this.size;
    const posY = point.y * this.size;

    let intensity = 1;
    const ramp = this.maxAge * 0.28;
    if (point.age < ramp) {
      // Smooth fade-in
      intensity = Math.sin((point.age / ramp) * (Math.PI / 2));
    } else {
      // Smooth fade-out
      const fadeProgress = (point.age - ramp) / (this.maxAge * 0.72);
      intensity = Math.sin((1 - Math.min(1, fadeProgress)) * (Math.PI / 2));
    }

    intensity *= point.force;

    const radius = this.size * this.radius * intensity;
    if (radius <= 0.4) return;

    const grd = this.ctx.createRadialGradient(
      posX, posY, radius * 0.15,
      posX, posY, radius
    );
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(posX, posY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  getImageData() {
    if (!this.ctx) return null;
    return this.ctx.getImageData(0, 0, this.size, this.size).data;
  }
}

export const TARGET_CACHE = new Map();