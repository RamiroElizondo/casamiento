'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 300;
const SCROLL_VH = 400; // alto del track de scroll: a mayor valor, scrub más "lento" y preciso

function frameSrc(index) {
  return `/frames/frame-${String(index + 1).padStart(4, '0')}.webp`;
}

export default function HeroScrollVideo() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedRef = useRef(null);
  const currentFrameRef = useRef(-1);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Precarga de frames: el primero con prioridad, el resto en segundo plano.
  useEffect(() => {
    let cancelled = false;
    const images = new Array(FRAME_COUNT);
    const loaded = new Uint8Array(FRAME_COUNT);
    imagesRef.current = images;
    loadedRef.current = loaded;

    function loadFrame(i) {
      if (images[i]) return;
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        loaded[i] = 1;
        if (i === 0 && !cancelled) setFirstFrameReady(true);
      };
      images[i] = img;
    }

    loadFrame(0);
    let i = 1;
    const idle = typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback
      : (cb) => setTimeout(cb, 0);

    function loadNext() {
      if (cancelled || i >= FRAME_COUNT) return;
      loadFrame(i);
      i++;
      idle(loadNext);
    }
    loadNext();

    return () => {
      cancelled = true;
    };
  }, []);

  // Dibuja el frame correspondiente al progreso de scroll en el canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      currentFrameRef.current = -1; // fuerza redibujo tras un resize
    }

    function nearestLoadedFrame(target) {
      const loaded = loadedRef.current;
      if (!loaded) return -1;
      if (loaded[target]) return target;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (target - d >= 0 && loaded[target - d]) return target - d;
        if (target + d < FRAME_COUNT && loaded[target + d]) return target + d;
      }
      return -1;
    }

    function draw(frameIndex) {
      const idx = nearestLoadedFrame(frameIndex);
      if (idx === -1 || idx === currentFrameRef.current) return;
      const img = imagesRef.current[idx];
      if (!img || !img.naturalWidth) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = cw / scale;
      const sh = ch / scale;
      const sx = (iw - sw) / 2;
      const sy = (ih - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      currentFrameRef.current = idx;
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        draw(Math.round(progress * (FRAME_COUNT - 1)));
        ticking = false;
      });
    }

    resizeCanvas();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [firstFrameReady]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${SCROLL_VH}vh` }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-ink">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 py-10 text-center sm:py-14">
          <div className="hero-prelude">
            <div className="ornament">· · ·</div>
            <p>Tenemos algo que contarte</p>
          </div>
          <div className="hero-hint">↓ Deslizá para descubrirlo ↓</div>
        </div>
      </div>
    </section>
  );
}
