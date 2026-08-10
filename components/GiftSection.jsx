'use client';

import { useState } from 'react';
import Ornament from '@/components/Ornament';

const ACCOUNT = {
  cbu: '4530000800010568340313',
  alias: 'BODAYAMIYGONZA24',
  titular: 'Yamila Eliana Borras Huerta',
  banco: 'Naranja X',
};

function CopyIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="12" height="12" rx="2.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-4">
      <div className="font-smallcaps text-[0.75rem] uppercase tracking-[0.25em] text-gold-deep">
        {label}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copiado' : `Copiar ${label}`}
        className="group flex w-full max-w-full flex-nowrap items-center justify-center gap-2 text-ink transition-colors hover:text-gold-deep active:scale-[0.98] sm:w-auto sm:justify-start"
      >
        <span className="break-all text-[0.72rem] tracking-normal sm:text-[0.95rem] sm:tracking-wide">{value}</span>
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-paper text-gold-deep transition-all duration-300 group-hover:border-gold group-active:scale-90 sm:h-8 sm:w-8">
          {copied ? (
            <CheckIcon className="copied-pop h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </span>
      </button>
    </div>
  );
}

export default function GiftSection() {
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="reveal mb-10 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          Sugerencia de regalo
        </h2>
      </div>

      <p className="reveal mx-auto max-w-[560px] text-center italic leading-relaxed text-ink-soft">
        El mejor regalo es tu presencia, pero si deseás tener un detalle con
        nosotros, te agradeceremos una contribución para nuestro futuro juntos.
        Te compartimos los datos necesarios.
      </p>

      <div className="reveal mx-auto mt-10 max-w-[480px] rounded-[26px] border border-gold bg-cream-deep px-6 py-8 shadow-soft sm:px-10">
        <div className="flex flex-col gap-5">
          <CopyRow label="CBU" value={ACCOUNT.cbu} />
          <CopyRow label="Alias" value={ACCOUNT.alias} />
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-4">
            <div className="font-smallcaps text-[0.75rem] uppercase tracking-[0.25em] text-gold-deep">
              Titular
            </div>
            <div className="text-[0.95rem] text-ink">{ACCOUNT.titular}</div>
          </div>
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-4">
            <div className="font-smallcaps text-[0.75rem] uppercase tracking-[0.25em] text-gold-deep">
              Cuenta
            </div>
            <div className="text-[0.95rem] text-ink">{ACCOUNT.banco}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
