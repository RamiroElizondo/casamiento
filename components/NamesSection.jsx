import Ornament from '@/components/Ornament';

export default function NamesSection() {
  return (
    <section className="reveal relative z-10 px-6 pb-12 pt-24 text-center">
      <div className="mb-6 font-smallcaps text-[0.85rem] uppercase tracking-[0.5em] text-gold-deep">
        24 · Octubre · 2026
      </div>
      <h1 className="font-display text-[clamp(3rem,12vw,7rem)] leading-[0.95] font-normal text-ink">
        Yamila
        <span className="my-[-0.1em] block text-[0.8em] font-normal not-italic italic text-gold">&amp;</span>
        Gonzalo
      </h1>
      <div className="mx-auto my-8 flex items-center justify-center gap-4">
        <span className="h-px w-[50px] bg-gold" />
        <Ornament className="text-gold" />
        <span className="h-px w-[50px] bg-gold" />
      </div>
      <p className="mx-auto max-w-[480px] text-[clamp(1rem,2.5vw,1.25rem)] italic text-ink-soft">
        Después de tantos atardeceres juntos, queremos compartir el más importante con vos.
      </p>
    </section>
  );
}
