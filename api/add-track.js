// /api/add-track.js — Vercel Serverless Function
// Agrega una canción a la playlist usando el refresh token configurado.

let cachedToken = null;
let cachedTokenExpires = 0;

// Rate limiting muy básico en memoria por IP (se reinicia con cada cold start, suficiente para un casamiento)
const rateLimits = new Map();
const RATE_LIMIT_MAX = 30;          // canciones máx por IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // por hora

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW;
  }
  entry.count++;
  rateLimits.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX;
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpires - 60000) {
    return cachedToken;
  }
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Faltan variables de entorno');
  }
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
    scope: 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative'
  });
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + basic,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error('Spotify token error:', res.status, JSON.stringify(errData));
    if (res.status === 400) throw new Error('REFRESH_TOKEN inválido o expirado — corré get-refresh-token.js de nuevo');
    if (res.status === 401) throw new Error('CLIENT_ID o CLIENT_SECRET incorrectos');
    throw new Error(`Error Spotify ${res.status}: ${JSON.stringify(errData)}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  cachedTokenExpires = Date.now() + (data.expires_in * 1000);
  return cachedToken;
}

async function getPlaylistTrackUris(token, playlistId) {
  // Trae todas las URIs ya en la playlist para evitar duplicados.
  // Para playlists chicas (<500) alcanza con una sola llamada.
  const uris = new Set();
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(uri)),next&limit=100`;
  while (url) {
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) break;
    const data = await r.json();
    (data.items || []).forEach(it => { if (it.track?.uri) uris.add(it.track.uri); });
    url = data.next;
  }
  return uris;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Rate limit por IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiadas canciones por hora, esperá un poco' });
  }

  const { uri } = req.body || {};
  if (!uri || typeof uri !== 'string' || !uri.startsWith('spotify:track:')) {
    return res.status(400).json({ error: 'URI inválida' });
  }

  const { PLAYLIST_ID } = process.env;
  if (!PLAYLIST_ID) {
    return res.status(500).json({ error: 'PLAYLIST_ID no configurado' });
  }

  try {
    const token = await getAccessToken();

    // Evitar duplicados
    const existing = await getPlaylistTrackUris(token, PLAYLIST_ID);
    if (existing.has(uri)) {
      return res.status(409).json({ error: 'Esa canción ya está en la playlist' });
    }

    const r = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [uri] })
    });

    if (!r.ok) {
      const errData = await r.json().catch(async () => ({ raw: await r.text() }));
      console.error('Spotify add-track error:', r.status, JSON.stringify(errData));
      const msg = r.status === 403
        ? 'Sin permisos: la playlist tiene que ser tuya (misma cuenta que generó el refresh token)'
        : r.status === 404
        ? 'Playlist no encontrada, verificá PLAYLIST_ID'
        : `Error Spotify ${r.status}`;
      return res.status(502).json({ error: msg });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('add-track catch:', err.message);
    return res.status(500).json({ error: err.message || 'Error del servidor' });
  }
}
