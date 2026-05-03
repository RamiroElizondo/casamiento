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
const SCOPES = 'playlist-modify-public playlist-modify-private';
const PORT = 8888;

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
    console.error('Error:', data);
    res.writeHead(500); res.end('Error obteniendo token, mirá la consola');
    server.close();
    return;
  }

  const html = `
    <html><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f5efe4;color:#2c2418">
      <h1>✓ Listo</h1>
      <p>Volvé a la terminal y copiá el REFRESH_TOKEN que aparece ahí.</p>
      <p>Ya podés cerrar esta pestaña.</p>
    </body></html>
  `;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ Refresh token obtenido');
  console.log('══════════════════════════════════════════════════════════════\n');
  console.log('Guardá estos valores como variables de entorno en Vercel:\n');
  console.log('  CLIENT_ID     = ' + CLIENT_ID);
  console.log('  CLIENT_SECRET = ' + CLIENT_SECRET);
  console.log('  REFRESH_TOKEN = ' + data.refresh_token);
  console.log('  PLAYLIST_ID   = (el ID de tu playlist)\n');
  console.log('══════════════════════════════════════════════════════════════\n');

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
