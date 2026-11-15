'use client';

import inlineStyles from '@/features/mascot/styles/VedikaLabParticleBot.styles';
import { useEffect, useRef } from 'react';
export class TouchTexture {
  constructor(size = 64, maxAge = 65, radius = 0.22) {
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
    let force = 0.55;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(Math.max(dd * 10000, 0.45), 1.0);
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

    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      p.age++;
      if (p.age > this.maxAge) {
        this.trail.splice(i, 1);
      }
    }

    for (let i = 0; i < this.trail.length; i++) {
      this.drawTouch(this.trail[i]);
    }
  }

  drawTouch(point) {
    const posX = point.x * this.size;
    const posY = point.y * this.size;

    let intensity = 1;
    const ramp = this.maxAge * 0.30;
    if (point.age < ramp) {
      intensity = Math.sin((point.age / ramp) * (Math.PI / 2));
    } else {
      const fadeProgress = (point.age - ramp) / (this.maxAge * 0.70);
      intensity = Math.sin((1 - Math.min(1, fadeProgress)) * (Math.PI / 2));
    }

    intensity *= point.force;
    const radius = this.size * this.radius * intensity;
    if (radius <= 0.4) return;

    const grd = this.ctx.createRadialGradient(
      posX, posY, radius * 0.15,
      posX, posY, radius
    );
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
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

export function generateLabShape(labId, totalCount = 1350) {
  const points = [];

  if (labId === 'math') {
    // 1. 3D Lorenz Strange Attractor (500 pts)
    let lx = 0.1, ly = 0, lz = 0;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const lorenzCount = 500;
    for (let i = 0; i < lorenzCount; i++) {
      const dt = 0.011;
      const dx = sigma * (ly - lx) * dt;
      const dy = (lx * (rho - lz) - ly) * dt;
      const dz = (lx * ly - beta * lz) * dt;
      lx += dx;
      ly += dy;
      lz += dz;

      points.push({
        x: lx * 7.5,
        y: (lz - 24) * -7.2,
        z: ly * 7.5,
        size: 1.6 + (i % 8 === 0 ? 0.9 : 0),
        alpha: 0.88
      });
    }

    // 2. Torus Knot (p=2, q=3) (460 pts)
    const torusCount = 460;
    const R = 155;
    const r = 45;
    for (let i = 0; i < torusCount; i++) {
      const u = (i / torusCount) * Math.PI * 2 * 2;
      const tx = (R + r * Math.cos(1.5 * u)) * Math.cos(u);
      const ty = (R + r * Math.cos(1.5 * u)) * Math.sin(u) * 0.75;
      const tz = r * Math.sin(1.5 * u) * 1.5;

      points.push({
        x: tx * 0.90,
        y: ty * 0.90,
        z: tz,
        size: 1.4 + Math.random() * 0.5,
        alpha: 0.78
      });
    }

    // 3. Golden Ratio Fibonacci Logarithmic Spiral (390 pts)
    const spiralCount = 390;
    const phi = 1.6180339887;
    for (let i = 0; i < spiralCount; i++) {
      const theta = i * 0.18;
      const rad = 10 * Math.pow(phi, (i / spiralCount) * 4.0);
      if (rad < 225) {
        points.push({
          x: Math.cos(theta) * rad,
          y: Math.sin(theta) * rad * 0.85,
          z: (Math.random() - 0.5) * 40,
          size: 1.3 + Math.random() * 0.6,
          alpha: 0.82
        });
      }
    }
  } else if (labId === 'physics') {
    // 1. Quantum Nucleus (160 pts)
    for (let i = 0; i < 160; i++) {
      const rad = Math.pow(Math.random(), 0.6) * 32;
      const theta = Math.random() * Math.PI * 2;
      const phiAngle = (Math.random() - 0.5) * Math.PI;
      points.push({
        x: rad * Math.cos(phiAngle) * Math.cos(theta),
        y: rad * Math.sin(phiAngle),
        z: rad * Math.cos(phiAngle) * Math.sin(theta),
        size: 2.0 + Math.random() * 0.8,
        alpha: 0.95
      });
    }

    // 2. 3 Tilted Bohr Electron Orbitals (680 pts)
    const orbits = [
      { rx: 185, ry: 64, tilt: -0.58, phi: 0 },
      { rx: 205, ry: 70, tilt: 0.62, phi: Math.PI / 3 },
      { rx: 180, ry: 78, tilt: 1.62, phi: Math.PI / 1.5 }
    ];
    orbits.forEach((orb) => {
      const count = 225;
      const cosT = Math.cos(orb.tilt);
      const sinT = Math.sin(orb.tilt);
      for (let i = 0; i < count; i++) {
        const u = (i / count) * Math.PI * 2;
        const ox = Math.cos(u) * orb.rx;
        const oy = Math.sin(u) * orb.ry;
        const px = ox * cosT - oy * sinT;
        const py = ox * sinT + oy * cosT;
        const pz = Math.sin(u + orb.phi) * 50;

        points.push({
          x: px,
          y: py,
          z: pz,
          size: i % 18 === 0 ? 3.2 : 1.35 + Math.random() * 0.4,
          alpha: i % 18 === 0 ? 1.0 : 0.74
        });
      }
    });

    // 3. Lorentz Magnetic Dipole Field Lines (510 pts)
    const fieldLines = 6;
    const ptsPerLine = 85;
    for (let l = 0; l < fieldLines; l++) {
      const angleSign = l % 2 === 0 ? 1 : -1;
      const maxR = 120 + (l * 28);
      for (let i = 0; i < ptsPerLine; i++) {
        const theta = (i / (ptsPerLine - 1)) * Math.PI;
        if (theta === 0 || theta === Math.PI) continue;
        const r = maxR * Math.sin(theta) * Math.sin(theta);
        const fx = r * Math.cos(theta) * angleSign;
        const fy = r * Math.sin(theta) - (maxR * 0.5);

        points.push({
          x: fx,
          y: fy,
          z: (Math.sin(theta * 3) * 40),
          size: 1.3 + Math.random() * 0.4,
          alpha: 0.70
        });
      }
    }
  } else if (labId === 'chemistry') {
    // 1. Classical Erlenmeyer Flask Contour (560 pts)
    const neckTopY = -185;
    const neckBottomY = -65;
    const neckWidth = 40;
    const flaskBaseY = 165;
    const flaskBaseWidth = 175;
    const flaskCount = 560;

    for (let i = 0; i < flaskCount; i++) {
      const u = i / flaskCount;
      let fx, fy;

      if (u < 0.15) {
        const t = u / 0.15;
        fx = -neckWidth;
        fy = neckTopY + t * (neckBottomY - neckTopY);
      } else if (u < 0.40) {
        const t = (u - 0.15) / 0.25;
        fx = -neckWidth + t * (-flaskBaseWidth - (-neckWidth));
        fy = neckBottomY + t * (flaskBaseY - neckBottomY);
      } else if (u < 0.60) {
        const t = (u - 0.40) / 0.20;
        fx = -flaskBaseWidth + t * (flaskBaseWidth * 2);
        fy = flaskBaseY + Math.sin(t * Math.PI) * 6;
      } else if (u < 0.85) {
        const t = (u - 0.60) / 0.25;
        fx = flaskBaseWidth + t * (neckWidth - flaskBaseWidth);
        fy = flaskBaseY + t * (neckBottomY - flaskBaseY);
      } else {
        const t = (u - 0.85) / 0.15;
        fx = neckWidth;
        fy = neckBottomY + t * (neckTopY - neckBottomY);
      }

      points.push({
        x: fx + (Math.random() - 0.5) * 4,
        y: fy + (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 30,
        size: 1.5 + Math.random() * 0.5,
        alpha: 0.85
      });
    }

    // 2. Liquid Meniscus Level & Bubbling Reactants (410 pts)
    const liquidTopY = 30;
    for (let i = 0; i < 410; i++) {
      const ly = liquidTopY + Math.random() * (flaskBaseY - liquidTopY - 10);
      const t = (ly - neckBottomY) / (flaskBaseY - neckBottomY);
      const halfW = neckWidth + t * (flaskBaseWidth - neckWidth) - 10;
      const lx = (Math.random() - 0.5) * 2 * halfW;

      points.push({
        x: lx,
        y: ly,
        z: (Math.random() - 0.5) * 50,
        size: 1.6 + Math.random() * 1.5,
        alpha: 0.78
      });
    }

    // 3. Central Rotating Covalent Benzene Ring (380 pts)
    const benzeneRadius = 72;
    for (let i = 0; i < 380; i++) {
      const side = Math.floor(i / (380 / 6));
      const t = (i % (380 / 6)) / (380 / 6);
      const a1 = (side / 6) * Math.PI * 2;
      const a2 = ((side + 1) / 6) * Math.PI * 2;
      const bx = (Math.cos(a1) + t * (Math.cos(a2) - Math.cos(a1))) * benzeneRadius;
      const by = (Math.sin(a1) + t * (Math.sin(a2) - Math.sin(a1))) * benzeneRadius - 20;

      points.push({
        x: bx,
        y: by,
        z: (Math.random() - 0.5) * 30,
        size: (i % (380 / 6) === 0) ? 3.0 : 1.4 + Math.random() * 0.4,
        alpha: 0.92
      });
    }
  } else if (labId === 'biology') {
    // 1. 3D Rotating DNA Double Helix (680 pts)
    const helixRadius = 100;
    const helixHeight = 390;
    const helixCount = 680;
    for (let i = 0; i < helixCount; i++) {
      const u = (i / helixCount);
      const theta = u * Math.PI * 4.4;
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const hx = Math.cos(theta + strand) * helixRadius;
      const hz = Math.sin(theta + strand) * helixRadius;
      const hy = (u - 0.5) * helixHeight;

      points.push({
        x: hx,
        y: hy,
        z: hz,
        size: 1.7 + Math.random() * 0.5,
        alpha: 0.90
      });
    }

    // 2. Nucleotide Base-Pair Connecting Rungs (A-T, G-C) (360 pts)
    const rungPairs = 24;
    const ptsPerRung = 15;
    for (let r = 0; r < rungPairs; r++) {
      const u = r / rungPairs;
      const theta = u * Math.PI * 4.4;
      const hy = (u - 0.5) * helixHeight;
      const x1 = Math.cos(theta) * helixRadius;
      const z1 = Math.sin(theta) * helixRadius;
      const x2 = Math.cos(theta + Math.PI) * helixRadius;
      const z2 = Math.sin(theta + Math.PI) * helixRadius;

      for (let p = 0; p < ptsPerRung; p++) {
        const t = p / (ptsPerRung - 1);
        points.push({
          x: x1 + t * (x2 - x1),
          y: hy,
          z: z1 + t * (z2 - z1),
          size: 1.35 + Math.random() * 0.4,
          alpha: 0.80
        });
      }
    }

    // 3. Living Cellular Membrane Envelope (310 pts)
    const cellCount = 310;
    for (let i = 0; i < cellCount; i++) {
      const theta = (i / cellCount) * Math.PI * 2;
      const rx = 195 + Math.sin(theta * 5) * 14;
      const ry = 225 + Math.cos(theta * 4) * 14;
      points.push({
        x: Math.cos(theta) * rx,
        y: Math.sin(theta) * ry,
        z: (Math.random() - 0.5) * 60,
        size: 1.4 + Math.random() * 0.6,
        alpha: 0.68
      });
    }
  }

  while (points.length < totalCount) {
    points.push({
      x: (Math.random() - 0.5) * 350,
      y: (Math.random() - 0.5) * 350,
      z: (Math.random() - 0.5) * 40,
      size: 1.2 + Math.random() * 0.5,
      alpha: 0.5
    });
  }

  return points.slice(0, totalCount);
}