// /api/debug.js — Endpoint de diagnóstico temporal
// Visitá https://TU-SITIO.vercel.app/api/debug para ver qué está fallando
// IMPORTANTE: borrá este archivo cuando todo esté funcionando

export default async function handler(req, res) {
  const results = [];

  // 1. Verificar variables de entorno (sin mostrar valores secretos)
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, PLAYLIST_ID } = process.env;

  results.push({
    check: 'Variables de entorno',
    CLIENT_ID: CLIENT_ID ? `✓ presente (${CLIENT_ID.length} chars)` : '✗ FALTA',
    CLIENT_SECRET: CLIENT_SECRET ? `✓ presente (${CLIENT_SECRET.length} chars)` : '✗ FALTA',
    REFRESH_TOKEN: REFRESH_TOKEN ? `✓ presente (${REFRESH_TOKEN.length} chars)` : '✗ FALTA',
    PLAYLIST_ID: PLAYLIST_ID ? `✓ presente: ${PLAYLIST_ID}` : '✗ FALTA',
  });

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(200).json({
      status: 'ERROR',
      problema: 'Faltan variables de entorno en Vercel',
      solucion: 'Settings → Environment Variables → agregar las que faltan → Redeploy',
      detalle: results
    });
  }

  // 2. Intentar refrescar el access token
  let accessToken = null;
  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + basic,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        scope: 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-read-private user-read-email'
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(200).json({
        status: 'ERROR',
        problema: 'Spotify rechazó el refresh token',
        codigo_spotify: tokenRes.status,
        error_spotify: tokenData,
        solucion: tokenRes.status === 400
          ? 'El REFRESH_TOKEN es inválido o expiró. Corré el script get-refresh-token.js de nuevo y actualizá la variable en Vercel.'
          : tokenRes.status === 401
          ? 'CLIENT_ID o CLIENT_SECRET incorrectos. Verificalos en el dashboard de Spotify.'
          : 'Error desconocido de Spotify.',
        detalle: results
      });
    }

    accessToken = tokenData.access_token;
    results.push({ check: 'Refresh token', status: '✓ OK — access token obtenido correctamente' });

  } catch (err) {
    return res.status(200).json({
      status: 'ERROR',
      problema: 'Error de red al contactar Spotify',
      error: err.message,
      detalle: results
    });
  }

  // 3. Verificar identidad del usuario autenticado
  let meId = null;
  try {
    const meRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    const meData = await meRes.json();
    meId = meData.id;
    results.push({
      check: 'Usuario autenticado (dueño del token)',
      spotify_id: meData.id,
      nombre: meData.display_name,
      email: meData.email
    });
  } catch (err) {
    results.push({ check: 'Usuario autenticado', status: '✗ ' + err.message });
  }

  // 4. Verificar que la playlist existe y es accesible
  if (PLAYLIST_ID) {
    try {
      const plRes = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}?fields=id,name,owner,public`, {
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      const plData = await plRes.json();

      if (!plRes.ok) {
        results.push({
          check: 'Playlist',
          status: '✗ ERROR',
          codigo: plRes.status,
          error: plData,
          solucion: plRes.status === 404
            ? 'La playlist no existe o el PLAYLIST_ID está mal. Verificá que copiaste solo el ID (sin ?si=... ni otros parámetros).'
            : 'Error al acceder a la playlist.'
        });
      } else {
        const ownerId = plData.owner?.id;
        const ownerMatch = meId && ownerId && meId === ownerId;
        results.push({
          check: 'Playlist',
          status: ownerMatch ? '✓ OK — el dueño coincide con el token' : '✗ PROBLEMA — dueños no coinciden',
          nombre: plData.name,
          owner_nombre: plData.owner?.display_name,
          owner_id: ownerId,
          token_user_id: meId,
          coinciden: ownerMatch
            ? 'SÍ ✓'
            : `NO ✗ — la playlist es de "${ownerId}" pero el token es de "${meId}". Tenés que loguearte con la cuenta "${ownerId}" cuando corrés get-refresh-token.js`,
          publica: plData.public
        });
      }
    } catch (err) {
      results.push({ check: 'Playlist', status: '✗ Error de red: ' + err.message });
    }
  }

  // 4. Intentar agregar una canción de prueba (y luego sacarla)
  // Usamos una canción conocida: "Never Gonna Give You Up" de Rick Astley
  const TEST_URI = 'spotify:track:4uLU6hMCjMI75M1A2tKUQC';
  try {
    const addRes = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [TEST_URI] })
    });

    if (!addRes.ok) {
      const addErr = await addRes.json().catch(() => ({}));
      results.push({
        check: 'Agregar canción de prueba',
        status: '✗ ERROR',
        codigo: addRes.status,
        error: addErr,
        solucion: addRes.status === 403
          ? 'Sin permiso para modificar la playlist. Causas posibles: (1) la playlist no es tuya — tiene que ser de la misma cuenta con la que corriste get-refresh-token.js, (2) Spotify requiere "Extended Quota Mode" aprobado para apps en Development Mode (restricción de nov-2024). Verificá dueño de la playlist en el check anterior.'
          : addRes.status === 404
          ? 'Playlist no encontrada. Verificá el PLAYLIST_ID.'
          : 'Error desconocido al agregar.'
      });
    } else {
      const addData = await addRes.json();

      // Sacar la canción de prueba inmediatamente
      await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tracks: [{ uri: TEST_URI }] })
      });

      results.push({
        check: 'Agregar canción de prueba',
        status: '✓ OK — canción agregada y removida correctamente'
      });
    }
  } catch (err) {
    results.push({ check: 'Agregar canción de prueba', status: '✗ Error de red: ' + err.message });
  }

  const allOk = results.every(r => !r.status?.startsWith('✗'));

  return res.status(200).json({
    status: allOk ? 'TODO OK ✓' : 'HAY ERRORES',
    resultados: results
  });
}
