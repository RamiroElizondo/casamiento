'use client';

import { useEffect, useRef, useState } from 'react';
import { WEDDING } from '@/lib/event';
import Ornament from '@/components/Ornament';

const FRAME_COUNT = 300;
const SCROLL_VH = 350; // recorrido del scrub en mobile
const CONCURRENCY = 6; // descargas de frames en paralelo
const LERP = 0.22; // suavizado del scrub (0-1, más alto = más directo)

function frameSrc(index) {
  return `/frames/frame-${String(index + 1).padStart(4, '0')}.webp`;
}

// Orden de carga "de grueso a fino": primero 1 de cada 16 frames a lo largo
// de todo el video, después 1 de cada 8, etc. Así el scrub es usable enseguida
// en cualquier punto del recorrido, y se va afinando solo.
function buildLoadOrder() {
  const order = [];
  const seen = new Uint8Array(FRAME_COUNT);
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < FRAME_COUNT; i += stride) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  return order;
}

/* ------------------------------------------------------------------ */
/* Mobile: scroll-scrub sobre canvas, con lerp para que nunca salte.   */
/* ------------------------------------------------------------------ */
function HeroMobileScrub() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const images = new Array(FRAME_COUNT);
    const loaded = new Uint8Array(FRAME_COUNT);
    imagesRef.current = images;
    loadedRef.current = loaded;

    const queue = buildLoadOrder();
    let cursor = 0;

    function loadNext() {
      if (cancelled || cursor >= queue.length) return;
      const i = queue[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(i);
      images[i] = img;
      const done = () => {
        loaded[i] = 1;
        if (i === 0 && !cancelled) setReady(true);
        loadNext();
      };
      // decode() garantiza que el frame está listo para dibujar sin jank
      img
        .decode()
        .then(done)
        .catch(() => {
          img.onload = done;
          img.onerror = loadNext;
        });
    }

    for (let c = 0; c < CONCURRENCY; c++) loadNext();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    const images = imagesRef.current;
    const loaded = loadedRef.current;

    // El buffer del canvas usa la resolución nativa de los frames y el
    // recorte a pantalla lo hace CSS (object-fit: cover). Cero trabajo de
    // resize, cero saltos cuando iOS muestra/oculta la barra de URL.
    const first = images[0];
    canvas.width = first.naturalWidth;
    canvas.height = first.naturalHeight;

    let drawnFrame = -1;

    function nearestLoadedFrame(target) {
      if (loaded[target]) return target;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (target - d >= 0 && loaded[target - d]) return target - d;
        if (target + d < FRAME_COUNT && loaded[target + d]) return target + d;
      }
      return -1;
    }

    function draw(frameIndex) {
      const idx = nearestLoadedFrame(frameIndex);
      if (idx === -1 || idx === drawnFrame) return;
      const img = images[idx];
      if (!img || !img.naturalWidth) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawnFrame = idx;
    }

    let current = 0;
    let rafId = null;

    function loop() {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const target = progress * (FRAME_COUNT - 1);

      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.4) current = target;

      draw(Math.round(current));
      rafId = requestAnimationFrame(loop);
    }

    // El loop solo corre mientras el hero está en pantalla.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (rafId == null) rafId = requestAnimationFrame(loop);
        } else if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0 }
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [ready]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${SCROLL_VH}vh` }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="hero-loading text-gold-light">· · ·</div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 py-10 text-center sm:py-14">
          <div className="hero-prelude">
            <Ornament className="mb-3 text-gold-light" />
            <p>Tenemos algo que contarte</p>
          </div>
          <div className="hero-hint">↓ Deslizá para descubrirlo ↓</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: sin scrub. Video vertical autoplay enmarcado en arco +     */
/* tipografía con entrada escalonada.                                  */
/* ------------------------------------------------------------------ */
function HeroDesktop() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-12 py-16">
      <div className="grid w-full max-w-[1200px] grid-cols-[1.1fr_0.9fr] items-center gap-16">
        <div className="text-left">
          <div className="hero-stagger w-14" style={{ '--d': '0.2s' }}>
            <Ornament className="text-gold" />
          </div>
          <div
            className="hero-stagger mt-6 font-smallcaps text-[0.9rem] uppercase tracking-[0.5em] text-gold-deep"
            style={{ '--d': '0.45s' }}
          >
            {WEDDING.shortDate}
          </div>
          <h1
            className="hero-stagger mt-4 font-display text-[clamp(3.5rem,6vw,6rem)] leading-[1.05] text-ink"
            style={{ '--d': '0.7s' }}
          >
            Yamila
            <span className="mx-4 italic text-gold">&amp;</span>
            Gonzalo
          </h1>
          <p
            className="hero-stagger mt-8 max-w-[440px] text-[1.35rem] italic leading-relaxed text-ink-soft"
            style={{ '--d': '1s' }}
          >
            Despues de tantos momentos compartidos, risas, aprendizajes y amor, hemos decidido unir nuestras vidas para siempre. Nos encantaría que nos acompañes a celebrar este dia tan importante para nosotros.
          </p>
          <div
            className="hero-stagger mt-12 font-smallcaps text-[0.8rem] uppercase tracking-[0.4em] text-gold-deep"
            style={{ '--d': '1.4s' }}
          >
            ↓ Deslizá para ver más
          </div>
        </div>

        <div className="hero-stagger flex justify-center" style={{ '--d': '0.5s' }}>
          <div className="hero-arch">
            <video
              src="/hero.mp4"
              poster={frameSrc(0)}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export default function Hero() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setMode(mq.matches ? 'desktop' : 'mobile');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (mode === 'desktop') return <HeroDesktop />;
  if (mode === 'mobile') return <HeroMobileScrub />;
  // Placeholder pre-hidratación: evita flash y mismatch de SSR.
  return <div className="h-screen w-full bg-ink" />;
}
