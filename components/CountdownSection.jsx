'use client';

import { useEffect, useState } from 'react';
import Ornament from '@/components/Ornament';

function getTimeLeft(target) {
  const diff = target - new Date();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownSection({ targetIso, timeLabel }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const target = new Date(targetIso);
    setTime(getTimeLeft(target));
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const cells = [
    { label: 'Días', value: time?.days },
    { label: 'Horas', value: time?.hours != null ? String(time.hours).padStart(2, '0') : undefined },
    { label: 'Min', value: time?.mins != null ? String(time.mins).padStart(2, '0') : undefined },
    { label: 'Seg', value: time?.secs != null ? String(time.secs).padStart(2, '0') : undefined },
  ];

  return (
    <section className="relative z-10 bg-gradient-to-b from-transparent via-beige/25 to-transparent px-6 py-24">
      <div className="reveal mb-12 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">COMENZÓ LA CUENTA REGRESIVA</h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          para nuestra boda
        </div>
      </div>

      <div className="reveal mx-auto grid max-w-[720px] grid-cols-4 gap-3 sm:gap-6">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="countdown-cell border border-gold bg-paper px-2 py-5 text-center"
          >
            <div className="font-display text-[clamp(2rem,8vw,4rem)] leading-none tabular-nums text-ink">
              {cell.value ?? '--'}
            </div>
            <div className="mt-2 font-smallcaps text-[0.7rem] uppercase tracking-[0.3em] text-gold-deep">
              {cell.label}
            </div>
          </div>
        ))}
      </div>

      <div className="reveal mt-12 text-center font-serif">
        <div className="text-[clamp(1.1rem,3vw,1.5rem)] italic text-ink">
          Sábado 24 de Octubre de 2026 · {timeLabel}
        </div>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.3em] text-gold-deep">
          San Juan · Argentina
        </div>
      </div>
    </section>
  );
}
