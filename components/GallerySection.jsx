import Ornament from '@/components/Ornament';

// Fotos reales en /public/history/ (optimizadas a webp).
// El orden sigue el layout: la 1 ocupa 2x2 en desktop y la 4 ocupa 2 columnas.
const PHOTOS = [
  '/history/historia-1.webp',
  '/history/historia-2.webp',
  '/history/historia-3.webp',
  '/history/historia-4.webp',
  '/history/historia-5.webp',
  '/history/historia-6.webp',
];

export default function GallerySection() {
  return (
    <section className="relative z-10 px-6 pb-24 pt-16">
      <div className="reveal mb-12 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">Nuestra historia</h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          en imágenes
        </div>
      </div>

      <div className="gallery-grid">
        {PHOTOS.map((src, i) => (
          <div key={src} className="photo reveal">
            <img
              src={src}
              alt={`Nuestra historia, foto ${i + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
