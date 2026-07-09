import Ornament from '@/components/Ornament';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-beige px-6 py-12 text-center">
      <Ornament className="mb-4 text-gold" />
      <p className="font-smallcaps text-[0.75rem] uppercase tracking-[0.4em] text-ink-soft">
        Yamila & Gonzalo · 2026
      </p>
    </footer>
  );
}
