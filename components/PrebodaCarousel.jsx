'use client';

import { useRef } from 'react';
import Ornament from '@/components/Ornament';

// Carrusel de fotos de la preboda. Altura fija: cada foto conserva su
// proporción original (sin recortes). Optimizadas en /public/preboda/.
// Falta la 9687 (no está en la carpeta); agregarla acá cuando esté.
const PHOTOS = [
  '/preboda/preboda-1.webp',
  '/preboda/preboda-2.webp',
  '/preboda/preboda-3.webp',
  '/preboda/preboda-4.webp',
  '/preboda/preboda-5.webp',
  '/preboda/preboda-6.webp',
  '/preboda/preboda-7.webp',
  '/preboda/preboda-8.webp',
  '/preboda/preboda-9.webp',
];

function Chevron({ flip }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${flip ? 'rotate-180' : ''}`}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function PrebodaCarousel() {
  const trackRef = useRef(null);

  function scrollBy(dir) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <section className="relative z-10 overflow-hidden py-16">
      <div className="reveal mb-10 px-6 text-center">
        <Ornament className="mb-3 text-gold" />
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          Nos preparamos juntos para el gran día
        </div>
      </div>

      <div className="reveal relative">
        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 md:gap-5"
        >
          {PHOTOS.map((src, i) => (
            <div
              key={src}
              className="shrink-0 snap-center overflow-hidden rounded-[26px] border border-gold bg-cream-deep"
            >
              <img
                src={src}
                alt={`Preboda de Gonzalo y Yamila, foto ${i + 1}`}
                loading="lazy"
                className="h-[340px] w-auto max-w-none md:h-[440px]"
              />
            </div>
          ))}
        </div>

        {/* Flechas */}
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => scrollBy(-1)}
          className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-paper/90 text-gold-deep shadow-soft transition-transform hover:scale-105"
        >
          <Chevron flip />
        </button>
        <button
          type="button"
          aria-label="Foto siguiente"
          onClick={() => scrollBy(1)}
          className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-paper/90 text-gold-deep shadow-soft transition-transform hover:scale-105"
        >
          <Chevron />
        </button>
      </div>
    </section>
  );
}
