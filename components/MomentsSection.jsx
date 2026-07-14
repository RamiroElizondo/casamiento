// Tira de fotos entre el itinerario y la cuenta regresiva.
// Recortadas en 3:4 y optimizadas en /public/moments/.
const MOMENTS = [
  { src: '/moments/momento-1.webp', alt: 'Gonzalo y Yamila sentados espalda con espalda' },
  { src: '/moments/momento-2.webp', alt: 'Gonzalo y Yamila mirándose' },
  { src: '/moments/momento-3.webp', alt: 'Gonzalo y Yamila sentados en el parque' },
  { src: '/moments/momento-4.webp', alt: 'Gonzalo y Yamila paseando' },
];

export default function MomentsSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {MOMENTS.map((m, i) => (
          <div
            key={m.src}
            className={`reveal overflow-hidden rounded-[26px] border border-gold bg-cream-deep ${
              i % 2 === 1 ? 'md:translate-y-6' : ''
            }`}
          >
            <img
              src={m.src}
              alt={m.alt}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
