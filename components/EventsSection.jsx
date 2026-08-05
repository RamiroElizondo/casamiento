import { EVENTS, INVITE_TYPES, mapsUrl } from '@/lib/event';
import Ornament from '@/components/Ornament';

function EventIcon({ kind }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-7 w-7',
  };
  if (kind === 'church') {
    return (
      <svg {...common}>
        <path d="M12 2v4M10 4h4" />
        <path d="M12 6l6 5v11H6V11l6-5z" />
        <path d="M10 22v-5a2 2 0 1 1 4 0v5" />
      </svg>
    );
  }
  if (kind === 'dinner') {
    return (
      <svg {...common}>
        <path d="M7 3v7a2 2 0 0 0 2 2v9M5 3v4M9 3v4" />
        <path d="M17 3c-1.5 1.5-2 4-2 6 0 1.5 1 3 2 3v9" />
      </svg>
    );
  }
  // party
  return (
    <svg {...common}>
      <path d="M9 18V6l10-2v11" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="15" r="2.5" />
      <path d="M20 3l.5 1.5L22 5l-1.5.5L20 7l-.5-1.5L18 5l1.5-.5L20 3z" strokeWidth="1" />
    </svg>
  );
}

export default function EventsSection({ type }) {
  const keys = INVITE_TYPES[type].events;
  const compact = keys.length >= 4;

  const wrapClass = compact
    ? 'mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'
    : 'mx-auto flex max-w-[880px] flex-col gap-6 md:flex-row md:justify-center';

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="reveal mb-12 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          {keys.length > 1 ? 'Itinerario del gran día' : 'Te esperamos'}
        </h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          sábado 24 de octubre
        </div>
      </div>

      <div className={wrapClass}>
        {keys.map((key) => {
          const ev = EVENTS[key];
          // La dirección y el botón "Cómo llegar" solo se muestran en la
          // tarjeta de Recepción (para no repetir la misma dirección en
          // cena/fiesta, que comparten lugar). Si la invitación tiene una
          // sola tarjeta (ej. solo fiesta, para invitados de después de
          // cena), sí se muestra para que sepan a dónde ir.
          const showLocation = key === 'recepcion' || keys.length === 1;
          // El nombre del lugar (place) se repite igual en civil/cena/fiesta
          // porque comparten el mismo salón que ya se indica en Recepción.
          // Se oculta en esas tarjetas cuando hay itinerario completo, pero
          // se muestra si la tarjeta va sola (invitado de después de cena).
          const showPlace = key === 'misa' || key === 'recepcion' || keys.length === 1;
          return (
            <div
              key={key}
              className={`event-card reveal relative border border-gold bg-paper text-center ${
                compact ? 'px-5 py-8' : 'flex-1 px-8 py-10'
              }`}
            >
              <div
                className={`mx-auto mb-5 flex items-center justify-center rounded-full border border-gold text-gold-deep ${
                  compact ? 'h-12 w-12' : 'h-14 w-14'
                }`}
              >
                <EventIcon kind={ev.icon} />
              </div>
              <div
                className={`font-smallcaps uppercase text-gold-deep ${
                  compact ? 'text-[0.7rem] tracking-[0.25em]' : 'text-[0.8rem] tracking-[0.4em]'
                }`}
              >
                {ev.title}
              </div>
              <div
                className={`mt-3 whitespace-nowrap font-display leading-none text-ink ${
                  compact ? 'text-[2rem]' : 'text-[2.6rem]'
                }`}
              >
                {ev.time}
              </div>
              {showPlace && (
                <div className={`mt-4 italic text-ink ${compact ? 'text-[1.1rem]' : 'text-[1.25rem]'}`}>
                  {ev.place}
                </div>
              )}
              {showLocation && ev.address && (
                <div className={`mt-1 text-ink-soft ${compact ? 'text-[0.85rem]' : 'text-[0.95rem]'}`}>
                  {ev.address}
                </div>
              )}
              {showLocation && key !== 'civil' && (
                <a
                  href={mapsUrl(key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-block whitespace-nowrap border border-gold font-smallcaps uppercase text-gold-deep transition-colors duration-300 hover:bg-gold hover:text-paper ${
                    compact ? 'px-4 py-2 text-[0.68rem] tracking-[0.2em]' : 'px-6 py-2 text-[0.75rem] tracking-[0.3em]'
                  }`}
                >
                  Cómo llegar
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
