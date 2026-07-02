import { EVENTS, INVITE_TYPES, mapsUrl } from '@/lib/event';

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

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="reveal mb-12 text-center">
        <div className="mb-2 text-2xl tracking-[0.3em] text-gold">· · ·</div>
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          {keys.length > 1 ? 'El gran día' : 'Te esperamos'}
        </h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          sábado 24 de octubre
        </div>
      </div>

      <div className="mx-auto flex max-w-[880px] flex-col gap-6 md:flex-row md:justify-center">
        {keys.map((key) => {
          const ev = EVENTS[key];
          return (
            <div
              key={key}
              className="event-card reveal relative flex-1 border border-gold bg-paper px-8 py-10 text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold-deep">
                <EventIcon kind={ev.icon} />
              </div>
              <div className="font-smallcaps text-[0.8rem] uppercase tracking-[0.4em] text-gold-deep">
                {ev.title}
              </div>
              <div className="mt-3 font-display text-[2.6rem] leading-none text-ink">
                {ev.time}
              </div>
              <div className="mt-4 text-[1.25rem] italic text-ink">{ev.place}</div>
              <div className="mt-1 text-[0.95rem] text-ink-soft">{ev.address}</div>
              <a
                href={mapsUrl(key)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block border border-gold px-6 py-2 font-smallcaps text-[0.75rem] uppercase tracking-[0.3em] text-gold-deep transition-colors duration-300 hover:bg-gold hover:text-paper"
              >
                Cómo llegar
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
