// Pétalos dorados y rosados cayendo suavemente por toda la página.
// CSS puro (solo transform/opacity → composición en GPU, cero jank) y se
// desactiva con prefers-reduced-motion.
const PETALS = [
  { left: '6%', delay: '0s', dur: '16s', scale: 1 },
  { left: '18%', delay: '5s', dur: '21s', scale: 0.7 },
  { left: '31%', delay: '11s', dur: '18s', scale: 1.15 },
  { left: '44%', delay: '2.5s', dur: '23s', scale: 0.8 },
  { left: '56%', delay: '8s', dur: '17s', scale: 1 },
  { left: '67%', delay: '14s', dur: '20s', scale: 0.65 },
  { left: '78%', delay: '4s', dur: '19s', scale: 1.1 },
  { left: '89%', delay: '9.5s', dur: '22s', scale: 0.75 },
  { left: '50%', delay: '17s', dur: '24s', scale: 0.9 },
];

export default function AmbientPetals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.dur,
            '--petal-scale': p.scale,
          }}
        />
      ))}
    </div>
  );
}
