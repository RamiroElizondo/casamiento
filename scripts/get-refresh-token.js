// scripts/get-refresh-token.js
// Correr una sola vez localmente para obtener tu REFRESH_TOKEN.
// Uso:
//   1) Asegurate de tener Node 18+ instalado (node --version)
//   2) En el dashboard de Spotify agregá http://127.0.0.1:8888/callback como Redirect URI
//   3) Editá CLIENT_ID y CLIENT_SECRET abajo (o pasalos como variables de entorno)
//   4) Ejecutá: node scripts/get-refresh-token.js
//   5) Se abre el navegador, autorizá con tu cuenta de Spotify
//   6) Copiá el REFRESH_TOKEN que aparece en la terminal y pegalo en Vercel

import http from 'node:http';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';

const CLIENT_ID = process.env.CLIENT_ID || 'PEGA_TU_CLIENT_ID_ACA';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'PEGA_TU_CLIENT_SECRET_ACA';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPES = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
const PORT = 8888;

// ─────────────────────────────────────────────────────────
//  CAMBIÁ ESTOS VALORES ANTES DE CORRER EL SCRIPT
// ─────────────────────────────────────────────────────────
const PLAYLIST_NAME = '🎵 Playlist del Casamiento';       // ← el nombre que querés
const PLAYLIST_DESC = 'Las canciones elegidas por nuestros invitados';  // ← descripción
// ─────────────────────────────────────────────────────────

if (CLIENT_ID.startsWith('PEGA_') || CLIENT_SECRET.startsWith('PEGA_')) {
  console.error('\n❌ Editá el script y pegá tu CLIENT_ID y CLIENT_SECRET, o pasalos como variables de entorno.\n');
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');
const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  client_id: CLIENT_ID,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
  state
}).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== '/callback') {
    res.writeHead(404); res.end('Not found'); return;
  }
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  if (returnedState !== state) {
    res.writeHead(400); res.end('State mismatch'); return;
  }
  if (!code) {
    res.writeHead(400); res.end('No code received'); return;
  }

  // Intercambiar código por tokens
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + basic,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI
    })
  });

  const data = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error('Error al obtener token:', JSON.stringify(data));
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><body style="font-family:sans-serif;padding:2rem"><h2>❌ Error</h2><pre>' + JSON.stringify(data, null, 2) + '</pre></body></html>');
    server.close();
    return;
  }

  console.log('\nToken obtenido. Obteniendo datos de usuario...');

  // Obtener el user ID
  const meRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: 'Bearer ' + data.access_token }
  });
  const me = await meRes.json();
  const userId = me.id;
  console.log('Usuario: ' + me.display_name + ' (' + userId + ')');

  // Crear la playlist (privada para evitar el bug 403 de Spotify con playlists públicas)
  console.log('Creando playlist "' + PLAYLIST_NAME + '"...');
  const plRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + data.access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: PLAYLIST_NAME,
      description: PLAYLIST_DESC,
      public: false,
      collaborative: false
    })
  });
  const pl = await plRes.json();
  const playlistId = pl.id;

  if (!playlistId) {
    console.error('Error al crear playlist:', JSON.stringify(pl));
  } else {
    console.log('Playlist creada: ' + playlistId);
  }

  // Test: agregar una canción de prueba y sacarla
  let testOk = false;
  if (playlistId) {
    console.log('Verificando permisos...');
    const addRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + data.access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uris: ['spotify:track:4uLU6hMCjMI75M1A2tKUQC'] })
    });
    if (addRes.ok) {
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + data.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }] })
      });
      testOk = true;
    } else {
      const addErr = await addRes.json().catch(() => ({}));
      console.error('Error en test de permisos:', addRes.status, JSON.stringify(addErr));
    }
  }

  // Imprimir resultados ANTES de responder al navegador
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ Todo listo' + (testOk ? ' — permisos verificados ✓' : ' — OJO: el test de permisos falló'));
  console.log('══════════════════════════════════════════════════════════════\n');
  if (playlistId) {
    console.log('  ✓ Playlist creada: "' + PLAYLIST_NAME + '"');
    console.log('    Abrila en: https://open.spotify.com/playlist/' + playlistId);
    console.log('    (Es privada. Podés hacerla pública desde la app de Spotify luego.)\n');
  }
  console.log('Pegá estos valores en Vercel → Settings → Environment Variables:\n');
  console.log('  CLIENT_ID     = ' + CLIENT_ID);
  console.log('  CLIENT_SECRET = ' + CLIENT_SECRET);
  console.log('  REFRESH_TOKEN = ' + data.refresh_token);
  console.log('  PLAYLIST_ID   = ' + (playlistId || '(no se pudo crear, fijate el error arriba)'));
  console.log('\n══════════════════════════════════════════════════════════════\n');

  // Recién ahora responder al navegador y cerrar
  const html = `
    <html><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f5efe4;color:#2c2418">
      <h1>✓ Listo</h1>
      <p>Volvé a la terminal y copiá los valores que aparecen ahí.</p>
      <p>Ya podés cerrar esta pestaña.</p>
    </body></html>
  `;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);

  server.close();
  process.exit(0);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nServidor local escuchando en http://127.0.0.1:${PORT}`);
  console.log('Abriendo el navegador para autorizar...\n');
  // Abrir el navegador (Linux / macOS / Windows)
  const opener = process.platform === 'darwin' ? 'open' :
                 process.platform === 'win32' ? 'start ""' : 'xdg-open';
  exec(`${opener} "${authUrl}"`, (err) => {
    if (err) {
      console.log('No pude abrir el navegador. Pegá esta URL manualmente:\n');
      console.log(authUrl + '\n');
    }
  });
});
