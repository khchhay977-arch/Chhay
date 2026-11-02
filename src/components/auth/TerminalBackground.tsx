/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export const TerminalBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = Math.min(45, Math.floor(width / 35));
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      maxAlpha: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const colors = ['#06b6d4', '#0ea5e9', '#3b82f6', '#38bdf8'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.4 + 0.1,
        maxAlpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Chart waveforms simulator
    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.012;

      // Draw 2 faint flowing cryptocurrency chart waves in background
      // Wave 1: Cyan price wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.68 +
          Math.sin(x * 0.0035 + tick) * 45 +
          Math.cos(x * 0.0018 - tick * 0.8) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Electric blue counter wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
      ctx.lineWidth = 1.2;
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.38 +
          Math.sin(x * 0.0042 - tick * 0.7) * 40 +
          Math.cos(x * 0.0024 + tick * 0.5) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw particles & soft connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Soft pulse
        p.alpha += Math.sin(tick * 2 + i) * 0.003;
        const currentAlpha = Math.max(0.05, Math.min(p.maxAlpha, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw sparse constellation nodes between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#06b6d4';
            ctx.globalAlpha = (1 - dist / 110) * 0.06;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#040711] flex items-center justify-center py-10 px-4 sm:px-6">
      {/* 1. Perspective Animated Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* 2. Soft Ambient Cyan Light Waves (Slow Pulses) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.12, 0.22, 0.12],
          x: ['-50%', '-48%', '-50%'],
          y: ['-50%', '-52%', '-50%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-600/30 via-sky-500/20 to-blue-700/25 blur-[160px] pointer-events-none -z-0"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 right-1/4 w-[500px] h-[400px] rounded-full bg-gradient-to-br from-blue-700/20 via-indigo-600/15 to-cyan-500/10 blur-[150px] pointer-events-none -z-0"
      />

      {/* 3. Subtle Animated Cryptocurrency Depth Lines / Candlesticks in Header/Edge */}
      <div className="absolute top-8 left-8 hidden xl:flex items-end gap-1.5 opacity-20 pointer-events-none select-none">
        {[40, 65, 30, 80, 55, 90, 70, 85, 45, 60].map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${h * 0.4}px`, `${h * 0.7}px`, `${h * 0.4}px`] }}
            transition={{
              duration: 2.5 + (i % 3) * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-1 rounded-sm ${i % 2 === 0 ? 'bg-cyan-400' : 'bg-blue-500'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 right-12 hidden xl:flex items-end gap-1.5 opacity-20 pointer-events-none select-none">
        {[50, 35, 75, 45, 80, 60, 95, 70, 55, 85].map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${h * 0.5}px`, `${h * 0.75}px`, `${h * 0.5}px`] }}
            transition={{
              duration: 3 + (i % 3) * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-1 rounded-sm ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-cyan-500'}`}
          />
        ))}
      </div>

      {/* 4. Canvas Layer (Floating Particles & Faint Sine Waves) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-0"
      />

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
