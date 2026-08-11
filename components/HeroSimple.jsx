import { WEDDING } from '@/lib/event';
import Ornament from '@/components/Ornament';

// Hero sin video, solo texto. Se usa en la invitación de solo misa:
// va directo a "Nuestra historia" después, sin el scrub de frames.
// Mismo criterio de tamaños que NamesSection para que se vea bien en mobile.
export default function HeroSimple() {
  return (
    <section className="reveal relative z-10 px-6 pb-12 pt-20 text-center sm:pt-28">
      <Ornament className="mx-auto mb-6 text-gold" />
      <div className="mb-6 font-smallcaps text-[0.85rem] uppercase tracking-[0.5em] text-gold-deep">
        {WEDDING.shortDate}
      </div>
      <h1 className="font-display text-[clamp(3rem,12vw,7rem)] leading-[0.95] font-normal text-ink">
        Yamila
        <span className="my-[-0.1em] block text-[0.8em] font-normal not-italic italic text-gold">&amp;</span>
        Gonzalo
      </h1>
      <p className="mx-auto mt-8 max-w-[480px] text-[clamp(1rem,2.5vw,1.25rem)] italic text-ink-soft">
        Despues de tantos momentos compartidos, risas, aprendizajes y amor, hemos decidido unir nuestras vidas para siempre. Nos encantaría que nos acompañes a celebrar este dia tan importante para nosotros.
      </p>
      <div className="mt-10 font-smallcaps text-[0.8rem] uppercase tracking-[0.4em] text-gold-deep">
        ↓ Deslizá para ver más
      </div>
    </section>
  );
}
