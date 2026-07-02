'use client';

import { useEffect } from 'react';

// Activa la clase .in en los elementos .reveal cuando entran en viewport,
// igual que el IntersectionObserver del index.html original.
export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
