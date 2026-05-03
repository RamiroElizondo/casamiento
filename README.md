# Casamiento Sofía & Mateo · Setup completo

Landing de casamiento con animación de sobre, countdown y los invitados pueden agregar canciones a tu playlist de Spotify sin necesidad de loguearse.

## Cómo funciona

- Los invitados entran a la URL, abren el sobre, ven la cuenta regresiva y la galería
- En la sección de Spotify buscan canciones y las agregan
- Las canciones se agregan a **tu** playlist usando un token tuyo guardado en el servidor
- Los invitados no necesitan tener Spotify

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

En `index.html`, buscá:

```js
const WEDDING_DATE = new Date('2026-03-15T18:30:00-03:00');
```

El formato es `AAAA-MM-DDTHH:MM:SS-03:00` (Argentina). Cambialo por tu fecha real.

También cambiá el texto debajo del countdown (`<div class="when">...`) y el lugar (`<div class="where">...`).

### Cambiar los nombres

Hacé buscar y reemplazar de "Sofía" y "Mateo" en `index.html`. Aparecen en el sobre, el título grande, el footer y el `<title>` de la pestaña.

### Reemplazar las fotos placeholder

En la sección galería hay 6 `<div class="photo">` cada uno con un SVG. Reemplazá cada uno por:

```html
<div class="photo reveal">
  <img src="fotos/foto1.jpg" alt="" style="width:100%;height:100%;object-fit:cover;display:block" />
</div>
```

Subí las fotos a una carpeta `fotos/` en la raíz del proyecto.

---

## Troubleshooting

**"No se pudo agregar"**
- Verificá que las 4 variables de entorno estén bien escritas en Vercel
- Verificá que hayas redesplegado después de agregarlas
- Mirá los logs en Vercel → tu proyecto → Logs

**"Esa canción ya está en la playlist"**
- El backend evita duplicados. Es esperado.

**"Demasiadas canciones por hora, esperá un poco"**
- Hay un límite de 30 canciones por hora por IP. Si querés cambiarlo, editá `RATE_LIMIT_MAX` en `api/add-track.js`.

**El sobre no se abre en mobile**
- Asegurate de tocarlo, no de hacer scroll. La animación es por click/tap.

---

## Estructura de archivos

```
casamiento/
├── index.html              ← La landing
├── api/
│   ├── search.js           ← Busca canciones
│   └── add-track.js        ← Agrega a la playlist
├── scripts/
│   └── get-refresh-token.js ← Setup inicial (solo se corre una vez)
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```
