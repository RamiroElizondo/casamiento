// /api/search.js — Vercel Serverless Function
// Busca canciones en Spotify usando el refresh token configurado en variables de entorno.

let cachedToken = null;
let cachedTokenExpires = 0;

async function getAccessToken() {
  // Reutiliza el token si todavía es válido (con margen de 60s)
  if (cachedToken && Date.now() < cachedTokenExpires - 60000) {
    return cachedToken;
  }

  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Faltan variables de entorno: CLIENT_ID, CLIENT_SECRET o REFRESH_TOKEN');
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN
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
    const txt = await res.text();
    throw new Error('Error al refrescar token: ' + txt);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedTokenExpires = Date.now() + (data.expires_in * 1000);
  return cachedToken;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const query = (req.query.q || '').toString().trim();
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro q' });
  }
  if (query.length > 100) {
    return res.status(400).json({ error: 'Query demasiado largo' });
  }

  try {
    const token = await getAccessToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=8`;
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });

    if (!r.ok) {
      const txt = await r.text();
      console.error('Spotify search error:', r.status, txt);
      return res.status(502).json({ error: 'Error al buscar en Spotify' });
    }

    const data = await r.json();
    const tracks = (data.tracks?.items || []).map(t => ({
      uri: t.uri,
      name: t.name,
      artists: t.artists.map(a => a.name).join(', '),
      cover: t.album.images[2]?.url || t.album.images[1]?.url || t.album.images[0]?.url || ''
    }));

    // Cache de 30 segundos en el CDN para queries idénticas
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json({ tracks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
