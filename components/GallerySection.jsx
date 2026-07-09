const PHOTOS = [
  {
    label: 'El primer encuentro',
    textFill: '#faf6ee',
    content: (
      <>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8dcc4" />
            <stop offset="1" stopColor="#c97e6e" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g1)" />
        <circle cx="200" cy="160" r="55" fill="#faf6ee" opacity="0.85" />
        <path d="M 90 400 Q 200 240 310 400 Z" fill="#8a6a35" opacity="0.4" />
        <path d="M 0 320 Q 100 280 200 310 T 400 290 L 400 400 L 0 400 Z" fill="#2c2418" opacity="0.5" />
      </>
    ),
  },
  {
    label: 'Juntos',
    textFill: '#2c2418',
    content: (
      <>
        <rect width="400" height="400" fill="#d9c9a8" />
        <circle cx="140" cy="180" r="40" fill="#faf6ee" />
        <circle cx="240" cy="180" r="40" fill="#faf6ee" />
        <path d="M 100 400 Q 200 260 300 400 Z" fill="#b8924f" opacity="0.5" />
      </>
    ),
  },
  {
    label: 'Aventuras',
    textFill: '#2c2418',
    content: (
      <>
        <rect width="400" height="400" fill="#ede4d3" />
        <path d="M 0 0 L 400 0 L 400 200 Q 200 280 0 200 Z" fill="#c97e6e" opacity="0.4" />
        <circle cx="200" cy="220" r="45" fill="#faf6ee" opacity="0.9" />
        <path d="M 175 215 Q 200 245 225 215" stroke="#2c2418" strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    label: 'El sí',
    textFill: '#faf6ee',
    content: (
      <>
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8924f" />
            <stop offset="1" stopColor="#8a6a35" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g2)" />
        <circle cx="200" cy="200" r="80" fill="#faf6ee" opacity="0.2" />
        <circle cx="200" cy="200" r="50" fill="#faf6ee" opacity="0.4" />
        <path d="M 180 195 L 200 215 L 230 180" stroke="#faf6ee" strokeWidth="3" fill="none" />
      </>
    ),
  },
  {
    label: 'Familia',
    textFill: '#2c2418',
    content: (
      <>
        <rect width="400" height="400" fill="#f5efe4" />
        <path d="M 50 200 Q 200 100 350 200" stroke="#b8924f" strokeWidth="2" fill="none" />
        <circle cx="100" cy="220" r="35" fill="#c97e6e" opacity="0.7" />
        <circle cx="200" cy="180" r="35" fill="#b8924f" opacity="0.7" />
        <circle cx="300" cy="220" r="35" fill="#c97e6e" opacity="0.7" />
      </>
    ),
  },
  {
    label: 'Para siempre',
    textFill: '#faf6ee',
    content: (
      <>
        <rect width="400" height="400" fill="#2c2418" />
        <circle cx="320" cy="80" r="30" fill="#faf6ee" opacity="0.9" />
        <circle cx="80" cy="60" r="2" fill="#faf6ee" />
        <circle cx="150" cy="100" r="2" fill="#faf6ee" />
        <circle cx="250" cy="50" r="2" fill="#faf6ee" />
        <circle cx="50" cy="150" r="1.5" fill="#faf6ee" />
        <circle cx="350" cy="180" r="1.5" fill="#faf6ee" />
        <path d="M 0 280 Q 200 320 400 280 L 400 400 L 0 400 Z" fill="#b8924f" opacity="0.3" />
      </>
    ),
  },
];

import Ornament from '@/components/Ornament';

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
        {PHOTOS.map((photo) => (
          <div key={photo.label} className="photo reveal">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              {photo.content}
              <text
                x="200"
                y="380"
                textAnchor="middle"
                fontFamily="Playfair Display"
                fontSize="14"
                fill={photo.textFill}
                opacity="0.7"
              >
                {photo.label}
              </text>
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
