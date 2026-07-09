'use client';

import { useEffect, useRef, useState } from 'react';
import Ornament from '@/components/Ornament';

// FOTOS: reemplazá estos dos archivos por las mitades reales de la foto
// (novia con brazo extendido a la izquierda, novio a la derecha).
// Mantené proporción vertical (3:4 aprox). Mismo nombre de archivo y listo.
const PHOTO_LEFT = '/couple/novia.webp';
const PHOTO_RIGHT = '/couple/novio.webp';

/* ----------------------- cañón de anillos ----------------------- */

// Sprite de anillo de compromiso pre-dibujado (una sola vez) para que las
// partículas sean baratas de renderizar: solo drawImage + rotación.
function makeRingSprite() {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const ctx = c.getContext('2d');

  // aro
  const g = ctx.createLinearGradient(12, 12, 52, 56);
  g.addColorStop(0, '#e6cd96');
  g.addColorStop(0.5, '#b8924f');
  g.addColorStop(1, '#8a6a35');
  ctx.strokeStyle = g;
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.arc(32, 37, 17, 0, Math.PI * 2);
  ctx.stroke();
  // brillo interior del aro
  ctx.strokeStyle = 'rgba(255, 245, 220, 0.85)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(32, 37, 20, Math.PI * 1.1, Math.PI * 1.55);
  ctx.stroke();

  // diamante
  ctx.fillStyle = '#eef6fb';
  ctx.strokeStyle = '#b9d4e3';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(32, 4);
  ctx.lineTo(41, 12);
  ctx.lineTo(32, 24);
  ctx.lineTo(23, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // facetas
  ctx.beginPath();
  ctx.moveTo(23, 12);
  ctx.lineTo(41, 12);
  ctx.moveTo(32, 4);
  ctx.lineTo(32, 24);
  ctx.stroke();

  return c;
}

function fireRings(canvas, sprite) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const corners = [
    { x: 0, y: 0, angle: Math.PI * 0.25 },
    { x: w, y: 0, angle: Math.PI * 0.75 },
    { x: 0, y: h, angle: -Math.PI * 0.25 },
    { x: w, y: h, angle: -Math.PI * 0.75 },
  ];

  const particles = [];
  for (const c of corners) {
    for (let i = 0; i < 22; i++) {
      const spread = (Math.random() - 0.5) * (Math.PI * 0.55);
      const speed = 5 + Math.random() * 9;
      particles.push({
        x: c.x,
        y: c.y,
        vx: Math.cos(c.angle + spread) * speed,
        vy: Math.sin(c.angle + spread) * speed,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.35,
        size: 15 + Math.random() * 16,
        life: 0,
        maxLife: 80 + Math.random() * 50,
      });
    }
  }

  let rafId;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    let alive = 0;
    for (const p of particles) {
      if (p.life >= p.maxLife) continue;
      alive++;
      p.life++;
      p.vy += 0.16; // gravedad
      p.vx *= 0.985;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;

      const fade = Math.min(1, (p.maxLife - p.life) / 28);
      ctx.globalAlpha = fade;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (alive > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, w, h);
    }
  }
  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

/* --------------------------- sección ---------------------------- */

function HeartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function CoupleSection() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const spriteRef = useRef(null);
  const stopRef = useRef(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    spriteRef.current = makeRingSprite();
    return () => stopRef.current?.();
  }, []);

  function handleHeart() {
    setJoined(true);
    if (canvasRef.current && spriteRef.current) {
      stopRef.current?.();
      stopRef.current = fireRings(canvasRef.current, spriteRef.current);
    }
  }

  return (
    <section className="relative z-10 overflow-hidden px-6 py-24">
      <div className="reveal mb-12 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          Los novios
        </h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          {joined ? 'juntos para siempre' : 'tocá el corazón'}
        </div>
      </div>

      <div ref={stageRef} className="reveal relative mx-auto max-w-[820px]">
        <div className="flex items-stretch justify-center">
          {/* Mitad novia */}
          <div
            className="couple-half min-w-0 flex-1 transition-all duration-700 ease-in-out"
            style={joined ? { transform: 'translateX(38px)' } : undefined}
          >
            <div
              className={`overflow-hidden border border-gold bg-cream-deep transition-all duration-700 ${
                joined ? 'rounded-l-[26px] rounded-r-none' : 'rounded-[26px]'
              }`}
            >
              <img
                src={PHOTO_LEFT}
                alt="Yamila"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover object-right"
              />
            </div>
            <div className="mt-4 text-center font-display text-[1.4rem] italic text-ink">
              Yamila
            </div>
          </div>

          {/* Corazón */}
          <div className="relative z-20 flex w-[76px] shrink-0 items-center justify-center">
            <button
              type="button"
              onClick={handleHeart}
              aria-label={joined ? 'Lanzar anillos otra vez' : 'Unir a los novios'}
              className={`heart-btn flex items-center justify-center rounded-full border border-gold bg-paper text-rose shadow-soft transition-all duration-700 ${
                joined ? 'h-10 w-10' : 'h-14 w-14'
              }`}
            >
              <HeartIcon className={joined ? 'h-5 w-5' : 'h-7 w-7'} />
            </button>
          </div>

          {/* Mitad novio */}
          <div
            className="couple-half min-w-0 flex-1 transition-all duration-700 ease-in-out"
            style={joined ? { transform: 'translateX(-38px)' } : undefined}
          >
            <div
              className={`overflow-hidden border border-gold bg-cream-deep transition-all duration-700 ${
                joined ? 'rounded-r-[26px] rounded-l-none' : 'rounded-[26px]'
              }`}
            >
              <img
                src={PHOTO_RIGHT}
                alt="Gonzalo"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover object-left"
              />
            </div>
            <div className="mt-4 text-center font-display text-[1.4rem] italic text-ink">
              Gonzalo
            </div>
          </div>
        </div>

        {/* Capa del estallido de anillos */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute -inset-6 z-30 h-[calc(100%+48px)] w-[calc(100%+48px)]"
        />
      </div>
    </section>
  );
}
