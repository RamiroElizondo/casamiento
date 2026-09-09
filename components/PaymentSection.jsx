import Ornament from '@/components/Ornament';

// Aviso de aporte para invitados que se suman después de la cena.
// Va justo debajo del itinerario.
export default function PaymentSection({ amount }) {
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="reveal mb-6 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">
          Tu lugar en la fiesta
        </h2>
      </div>

      <p className="reveal mx-auto max-w-[560px] text-center italic leading-relaxed text-ink-soft">
        ¡Nos encantaría que te sumes a bailar con nosotros! Como te unís después
        de la cena, te pedimos una colaboración de{' '}
        <span className="not-italic text-ink">${amount.toLocaleString('es-AR')}</span>{' '}
        para tu lugar en la fiesta. Gracias por acompañarnos en un día tan
        especial.
      </p>
    </section>
  );
}
