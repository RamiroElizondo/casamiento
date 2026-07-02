import { WEDDING } from '@/lib/event';

// Landing neutra: la página raíz no revela detalles del evento.
// Cada invitado accede con su link personal (/<uuid>).
export default function Home() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="landing-item text-2xl tracking-[0.5em] text-gold">· · ·</div>
      <div className="landing-item mt-6 font-smallcaps text-[0.85rem] uppercase tracking-[0.5em] text-gold-deep">
        {WEDDING.shortDate}
      </div>
      <h1 className="landing-item mt-4 font-display text-[clamp(2.8rem,10vw,6rem)] leading-tight text-ink">
        {WEDDING.couple}
      </h1>
      <p className="landing-item mt-6 max-w-[420px] italic text-ink-soft">
        Esta es una celebración con invitación personal.
        <br />
        Ingresá con el link que te enviamos.
      </p>
    </main>
  );
}
