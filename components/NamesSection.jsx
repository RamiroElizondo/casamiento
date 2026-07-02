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
      <div className="relative mx-auto my-8 h-px w-[60px] bg-gold before:absolute before:left-[-10px] before:top-1/2 before:h-[5px] before:w-[5px] before:-translate-y-1/2 before:rounded-full before:bg-gold before:content-[''] after:absolute after:right-[-10px] after:top-1/2 after:h-[5px] after:w-[5px] after:-translate-y-1/2 after:rounded-full after:bg-gold after:content-['']" />
      <p className="mx-auto max-w-[480px] text-[clamp(1rem,2.5vw,1.25rem)] italic text-ink-soft">
        Después de tantos atardeceres juntos, queremos compartir el más importante con vos.
      </p>
    </section>
  );
}
