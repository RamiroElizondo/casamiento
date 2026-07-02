import './globals.css';

export const metadata = {
  title: 'Yamila & Gonzalo · Nuestra Boda',
  description: 'Te invitamos a celebrar con nosotros · 24 de Octubre de 2026',
  robots: { index: false, follow: false }, // links personales: fuera de buscadores
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Tipografías: Cormorant Garamond (serif elegante) + Italiana (display) + Cormorant SC (small caps decorativos) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Italiana&family=Cormorant+SC:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
