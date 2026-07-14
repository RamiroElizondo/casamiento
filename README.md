# Casamiento Yamila & Gonzalo · Setup completo

Landing de casamiento hecha con **Next.js + Tailwind CSS**. Tiene un hero con efecto de video controlado por scroll (scroll-scrub, tipo Apple), countdown y los invitados pueden agregar canciones a tu playlist de Spotify sin necesidad de loguearse.

## Cómo funciona

- Los invitados entran a la URL, deslizan sobre el hero (el "video" se arma dibujando frames en un `<canvas>` según el scroll), ven la cuenta regresiva y la galería
- En la sección de Spotify buscan canciones y las agregan
- Las canciones se agregan a **tu** playlist usando un token tuyo guardado en el servidor
- Los invitados no necesitan tener Spotify

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

### Efecto de scroll-video del hero

El hero (`components/HeroScrollVideo.jsx`) dibuja en un `<canvas>` los frames que están en `public/frames/frame-XXXX.webp`, eligiendo el frame según cuánto se scrolleó la sección.

Esos frames livianos se generan a partir de los PNG originales (pesados, no se suben al repo) que viven en `images/scroll/`. Si necesitás regenerarlos:

```bash
npm run optimize-frames
```

Esto lee `images/scroll/ezgif-frame-*.png`, los redimensiona a 640px de ancho y los convierte a WebP calidad 72 en `public/frames/` (que sí se sube al repo, pesa unos 4-5MB en total).

---

## Setup paso a paso (10 minutos)

### 1. Crear la app de Spotify

1. Andá a https://developer.spotify.com/dashboard
2. Click en **Create app**
3. Completá:
   - **App name**: el que quieras (ej: "Casamiento")
   - **App description**: cualquier cosa
   - **Redirect URIs**: agregá **dos**:
     - `http://127.0.0.1:8888/callback` (para correr el script una vez)
     - `https://TU-DOMINIO-DE-VERCEL.vercel.app` (lo completás después de desplegar)
   - **Which API/SDKs**: tildá **Web API**
4. Aceptá términos y creá la app
5. Una vez creada, click en **Settings**. Ahí vas a ver:
   - **Client ID**: copialo
   - **Client secret**: click en "View client secret" y copialo

### 2. Crear la playlist

1. En tu Spotify, creá una playlist nueva (puede ser pública o privada, no hace falta que sea colaborativa)
2. Copiá el ID de la URL. Si la URL es `https://open.spotify.com/playlist/5inWO4GDGfsW78zgar9e3E?si=...`, el ID es `5inWO4GDGfsW78zgar9e3E`

### 3. Obtener el refresh token

En tu compu necesitás Node.js 18 o superior. Verificá con:

```bash
node --version
```

Si no lo tenés, instalalo desde https://nodejs.org

Después, en una terminal:

```bash
cd casamiento
CLIENT_ID="tu_client_id" CLIENT_SECRET="tu_client_secret" npm run get-token
```

(En Windows con PowerShell sería `$env:CLIENT_ID="..."; $env:CLIENT_SECRET="..."; npm run get-token`)

Te va a:
1. Abrir el navegador en la pantalla de autorización de Spotify
2. Pedirte que aceptes
3. Mostrarte el `REFRESH_TOKEN` en la terminal

Copiá ese valor.

### 4. Desplegar en Vercel

1. Creá una cuenta gratis en https://vercel.com
2. Instalá el CLI: `npm install -g vercel`
3. En la carpeta del proyecto: `vercel`
4. Seguí los pasos (login, nombre del proyecto, etc.)
5. Cuando termine, te da una URL tipo `https://casamiento-xyz.vercel.app`

### 5. Configurar las variables de entorno

1. En el dashboard de Vercel, andá a tu proyecto → **Settings** → **Environment Variables**
2. Agregá estas 4 variables (en los 3 environments: Production, Preview, Development):

| Nombre | Valor |
|---|---|
| `CLIENT_ID` | Tu Client ID de Spotify |
| `CLIENT_SECRET` | Tu Client Secret de Spotify |
| `REFRESH_TOKEN` | El que obtuviste con el script |
| `PLAYLIST_ID` | El ID de tu playlist |

3. **Importante**: redespliega después de agregar las variables. Volvé a correr `vercel --prod` o desde el dashboard hacé "Redeploy".

### 6. Listo

Probá la URL final en tu celu. Buscá una canción, dale al `+` y debería aparecer en tu playlist de Spotify al toque.

---

## Personalización

### Cambiar la fecha del casamiento

En `components/CountdownSection.jsx`, buscá:

```js
const WEDDING_DATE = new Date('2026-10-24T18:30:00-03:00');
```

El formato es `AAAA-MM-DDTHH:MM:SS-03:00` (Argentina). Cambialo por tu fecha real, y también el texto de `Sábado 24 de Octubre...` y el lugar (`Salon Tierras Negras...`) más abajo en el mismo archivo. La misma fecha/nombres aparecen también en `components/NamesSection.jsx` y en el `<title>` de `app/layout.js`.

### Cambiar los nombres

Buscá y reemplazá "Yamila" y "Gonzalo" en `components/NamesSection.jsx`, `components/SiteFooter.jsx` y `app/layout.js`.

### Reemplazar las fotos placeholder

En `components/GallerySection.jsx` hay un array `PHOTOS` con 6 entradas, cada una con un SVG de relleno. Reemplazá el contenido de `<div className="photo reveal">` por una imagen real:

```jsx
<div className="photo reveal">
  <img src="/fotos/foto1.jpg" alt="" className="h-full w-full object-cover" />
</div>
```

Subí las fotos a `public/fotos/`.

### El efecto de scroll-video del hero

Ver la sección "Efecto de scroll-video del hero" más arriba — el material sale de `images/scroll/` (frames PNG originales) y se procesa con `npm run optimize-frames` hacia `public/frames/`. Si querés cambiar qué tan "lento" se siente el scrub, ajustá `SCROLL_VH` en `components/HeroScrollVideo.jsx`.

---

## Troubleshooting

**"No se pudo agregar"**
- Verificá que las 4 variables de entorno estén bien escritas en Vercel
- Verificá que hayas redesplegado después de agregarlas
- Mirá los logs en Vercel → tu proyecto → Logs

**"Esa canción ya está en la playlist"**
- El backend evita duplicados. Es esperado.

**El efecto de scroll-video no se ve / se ve en blanco**
- Corré `npm run optimize-frames` para generar `public/frames/`. Sin esos archivos el hero queda con el canvas vacío.

---

## Estructura de archivos

```
casamiento/
├── app/
│   ├── layout.js              ← <html>/<head>, fuentes, metadata
│   ├── page.js                ← Ensambla todas las secciones
│   ├── globals.css            ← Tailwind + estilos custom (noise, reveal, etc.)
│   └── api/
│       └── search/route.js    ← Busca canciones (Route Handler)
├── components/
│   ├── HeroScrollVideo.jsx     ← Hero con scroll-scrub sobre <canvas>
│   ├── NamesSection.jsx
│   ├── GallerySection.jsx
│   ├── CountdownSection.jsx
│   ├── SpotifySection.jsx     ← Buscador + sugerencia de canciones
│   ├── SiteFooter.jsx
│   └── ScrollReveal.jsx       ← Animaciones al scrollear (IntersectionObserver)
├── public/
│   └── frames/                ← Frames WebP optimizados (se suben al repo)
├── images/
│   └── scroll/                ← Frames PNG originales (pesados, gitignored)
├── scripts/
│   ├── get-refresh-token.js   ← Setup inicial de Spotify (se corre una vez)
│   └── optimize-frames.mjs    ← Genera public/frames/ a partir de images/scroll/
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```
