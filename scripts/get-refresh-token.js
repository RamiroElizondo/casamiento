// scripts/get-refresh-token.js
// Correr una sola vez localmente para obtener tu REFRESH_TOKEN.
// Uso:
//   1) Asegurate de tener Node 18+ instalado (node --version)
//   2) En el dashboard de Spotify agregá http://127.0.0.1:8888/callback como Redirect URI
//   3) Editá CLIENT_ID y CLIENT_SECRET abajo (o pasalos como variables de entorno)
//   4) Ejecutá: node scripts/get-refresh-token.js
//   5) Se abre el navegador, autorizá con tu cuenta de Spotify
//   6) Copiá los valores que aparecen en la terminal y pegados en Vercel

import http from 'node:http';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';
import * as readline from 'node:readline/promises';

const CLIENT_ID = process.env.CLIENT_ID || 'PEGA_TU_CLIENT_ID_ACA';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'PEGA_TU_CLIENT_SECRET_ACA';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPES = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-read-private user-read-email';
const PORT = 8888;

const PLAYLIST_NAME = '🎵 Playlist Casamiento GONZALO - YAMILA 🎵';
const PLAYLIST_DESC = 'Las canciones elegidas por nuestros invitados';

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
    console.error('Error al obtener token (HTTP ' + tokenRes.status + '):', JSON.stringify(data));
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><body style="font-family:sans-serif;padding:2rem"><h2>❌ Error</h2><pre>' + JSON.stringify(data, null, 2) + '</pre></body></html>');
    server.close();
    return;
  }

  console.log('\nToken obtenido.');
  console.log('Scopes concedidos: ' + (data.scope || '(ninguno — revisar app en Spotify Dashboard)'));
  console.log('REFRESH_TOKEN primeros 20 chars: ' + (data.refresh_token?.slice(0, 20) || '(null)'));

  // ── DIAGNÓSTICO TEMPRANO ──────────────────────────────────────────────────
  // Si se pasa PLAYLIST_ID como env var, testea add-track inmediatamente
  // con este token fresco, antes de cualquier otra lógica.
  // Uso: $env:PLAYLIST_ID="tu_id"; node scripts/get-refresh-token.js
  const DIAG_PLAYLIST_ID = process.env.PLAYLIST_ID || '';
  if (DIAG_PLAYLIST_ID) {
    console.log('\n── DIAGNÓSTICO DIRECTO ──────────────────────────────────────────');
    console.log('POST /v1/playlists/' + DIAG_PLAYLIST_ID + '/tracks ...');
    const diagAddRes = await fetch(`https://api.spotify.com/v1/playlists/${DIAG_PLAYLIST_ID}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + data.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: ['spotify:track:4uLU6hMCjMI75M1A2tKUQC'] })
    });
    const diagAddBody = await diagAddRes.json().catch(async () => ({ raw: await diagAddRes.text().catch(() => '') }));
    console.log('TEST ADD-TRACK:', diagAddRes.status, JSON.stringify(diagAddBody));

    if (!diagAddRes.ok) {
      console.log('\nGET /v1/playlists/' + DIAG_PLAYLIST_ID + ' (atributos completos)...');
      const diagPlRes = await fetch(`https://api.spotify.com/v1/playlists/${DIAG_PLAYLIST_ID}`, {
        headers: { Authorization: 'Bearer ' + data.access_token }
      });
      const diagPlBody = await diagPlRes.json().catch(async () => ({ raw: await diagPlRes.text().catch(() => '') }));
      console.log('GET PLAYLIST (' + diagPlRes.status + '):', JSON.stringify({
        id: diagPlBody.id,
        name: diagPlBody.name,
        public: diagPlBody.public,
        collaborative: diagPlBody.collaborative,
        owner: diagPlBody.owner,
        snapshot_id: diagPlBody.snapshot_id,
        tracks: diagPlBody.tracks ? { total: diagPlBody.tracks.total } : undefined,
        error: diagPlBody.error
      }, null, 2));
    } else {
      await fetch(`https://api.spotify.com/v1/playlists/${DIAG_PLAYLIST_ID}/tracks`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + data.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: [{ uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' }] })
      });
      console.log('Canción de prueba removida. ✓ add-track funciona con este token.');
    }
    console.log('────────────────────────────────────────────────────────────────\n');
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Obtener el user ID
  const meRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: 'Bearer ' + data.access_token }
  });
  if (!meRes.ok) {
    const meErr = await meRes.text();
    console.error('Error al obtener usuario (HTTP ' + meRes.status + '):', meErr);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<html><body style="font-family:sans-serif;padding:2rem"><h2>❌ Error al obtener usuario</h2><pre>HTTP ' + meRes.status + '\n' + meErr + '</pre></body></html>');
    server.close();
    return;
  }
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
  let playlistId = pl.id;

  if (!plRes.ok || !playlistId) {
    console.error('Error al crear playlist (HTTP ' + plRes.status + '):', JSON.stringify(pl));
    console.log('');
    console.log('══════════════════════════════════════════════════════════════');
    console.log('  CAUSA: Spotify restringió POST /v1/users/{id}/playlists en');
    console.log('  nov-2024. Ahora requiere "Extended Quota" aprobado, incluso');
    console.log('  en Development Mode. No se puede saltear desde el código.');
    console.log('');
    console.log('  SOLUCIÓN: Creá la playlist manualmente en Spotify y pegá el ID.');
    console.log('');
    console.log('  Pasos:');
    console.log('  1) Abrí https://open.spotify.com/ (o la app de escritorio)');
    console.log('  2) Creá una playlist nueva (privada es suficiente)');
    console.log('  3) Hacé clic derecho → "Compartir" → "Copiar enlace a playlist"');
    console.log('     El ID es la parte final de la URL:');
    console.log('     https://open.spotify.com/playlist/ESTE_ES_EL_ID');
    console.log('══════════════════════════════════════════════════════════════');
    console.log('');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const input = (await rl.question('  PLAYLIST_ID > ')).trim();
    rl.close();
    if (!input) {
      console.error('\n❌ No se ingresó un PLAYLIST_ID. Saliendo.');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<html><body style="font-family:sans-serif;padding:2rem"><h2>❌ Sin playlist</h2><p>No se ingresó un PLAYLIST_ID. Cerrá y volvé a correr el script.</p></body></html>');
      server.close();
      process.exit(1);
    }
    playlistId = input;
    console.log('Usando playlist existente: ' + playlistId);
  } else {
    console.log('Playlist creada: ' + playlistId);
  }

  // Test: agregar una canción de prueba y sacarla
  let testOk = false;
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
    console.log('Test de agregar canción: OK');
  } else {
    const addErr = await addRes.json().catch(() => ({}));
    console.error('Test de agregar canción: FALLÓ (HTTP ' + addRes.status + '):', JSON.stringify(addErr));
    if (addRes.status === 403) {
      console.log('');
      console.log('  ⚠️  PROBLEMA CRÍTICO: tampoco se puede agregar canciones.');
      console.log('  El app NO va a funcionar con este token.');
      console.log('  Opciones:');
      console.log('  a) Solicitá "Extended Quota Mode" en el Spotify Developer Dashboard');
      console.log('     (requiere justificación y puede tardar días/semanas)');
      console.log('  b) Asegurate de que la playlist sea de tu propiedad (misma cuenta)');
      console.log('  c) Verificá que el usuario esté en User Management de la app');
    }
  }

  // Imprimir resultados ANTES de responder al navegador
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ' + (testOk ? '✓ Todo listo — permisos verificados ✓' : '⚠️  Listo — OJO: el test de permisos falló'));
  console.log('══════════════════════════════════════════════════════════════\n');
  console.log('  Playlist: "' + PLAYLIST_NAME + '"');
  console.log('  https://open.spotify.com/playlist/' + playlistId + '\n');
  console.log('Pegá estos valores en Vercel → Settings → Environment Variables:\n');
  console.log('  CLIENT_ID     = ' + CLIENT_ID);
  console.log('  CLIENT_SECRET = ' + CLIENT_SECRET);
  console.log('  REFRESH_TOKEN = ' + data.refresh_token);
  console.log('  PLAYLIST_ID   = ' + playlistId);
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
  const opener = process.platform === 'darwin' ? 'open' :
                 process.platform === 'win32' ? 'start ""' : 'xdg-open';
  exec(`${opener} "${authUrl}"`, (err) => {
    if (err) {
      console.log('No pude abrir el navegador. Pegá esta URL manualmente:\n');
      console.log(authUrl + '\n');
    }
  });
});
