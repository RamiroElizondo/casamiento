import Ornament from '@/components/Ornament';

// Ilustración de pareja: ella de vestido, él de traje. Línea simple,
// mismo estilo que los iconos de eventos.
function CoupleIllustration() {
  return (
    <svg
      viewBox="0 0 220 210"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-44 w-auto sm:h-52"
      aria-hidden="true"
    >
      {/* Novio */}
      <circle cx="76" cy="34" r="13" />
      <path d="M56 62 C 60 56, 67 53, 76 53 C 85 53, 92 56, 96 62 L 101 124 L 51 124 Z" />
      <path d="M76 53 L 68 72 L 76 92 L 84 72 Z" />
      <path d="M76 92 V 124" />
      <path d="M59 124 L 57 186 M 93 124 L 95 186 M 76 132 V 186" />

      {/* Novia */}
      <circle cx="150" cy="38" r="11.5" />
      <circle cx="150" cy="20" r="4.5" />
      <path d="M139 57 L 161 57 L 165 88 L 135 88 Z" />
      <path d="M135 88 C 122 122, 114 155, 110 188 L 190 188 C 186 155, 178 122, 165 88" />
      <path
        d="M144 96 C 138 128, 132 158, 128 184 M 156 96 C 162 128, 168 158, 172 184"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

export default function DressCodeSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      {/* Código de vestimenta */}
      <div className="reveal mb-10 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          Código de vestimenta
        </h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          Estrictamente formal
        </div>
      </div>

      <div className="reveal mb-8 flex justify-center text-gold-deep">
        <CoupleIllustration />
      </div>

      <p className="reveal mx-auto max-w-[560px] text-center italic leading-relaxed text-ink-soft">
        Con mucho cariño les recordamos que el blanco y las tonalidades claras
        son un honor reservado para la novia. Cada detalle de esta celebración
        fue pensado con mucho cariño para crear una noche especial. Nos hará
        muy felices que formen parte de esta experiencia acompañándonos con el
        estilo de vestimenta indicado en la invitación.
      </p>

      {/* Celebración para adultos */}
      <div className="reveal mb-8 mt-20 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          Celebración para adultos
        </h2>
      </div>

      <p className="reveal mx-auto max-w-[560px] text-center italic leading-relaxed text-ink-soft">
        Sabemos cuánto queremos a los más pequeños, pero en esta oportunidad
        hemos decidido que nuestra celebración sea solo para adultos. Gracias
        por comprender y por acompañarnos en este momento tan especial.
      </p>
    </section>
  );
}
