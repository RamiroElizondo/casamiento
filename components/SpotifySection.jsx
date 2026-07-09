'use client';

import { useEffect, useRef, useState } from 'react';
import Ornament from '@/components/Ornament';

const ADD_TRACK_URL =
  'https://script.google.com/macros/s/AKfycbwf3PwTOsKcHIMrolfU0kID85mS_R4hloHOsR71ikGGMLfQNqiBtpetHUTO_OhPhJIz/exec';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none h-4 w-4">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none h-4 w-4">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none h-[13px] w-[13px]">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function SpotifySection() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [status, setStatus] = useState('Buscá una canción para sugerirla');
  const [playingUri, setPlayingUri] = useState(null);
  const [addedUris, setAddedUris] = useState(() => new Set());
  const [pendingUris, setPendingUris] = useState(() => new Set());
  const [toast, setToast] = useState({ show: false, message: '' });

  const debounceRef = useRef(null);
  const searchSeqRef = useRef(0);
  const audioRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(toastTimerRef.current);
      audioRef.current?.pause();
    };
  }, []);

  function showToast(message) {
    clearTimeout(toastTimerRef.current);
    setToast({ show: true, message });
    toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }

  async function runSearch(q) {
    const seq = ++searchSeqRef.current;
    setStatus('Buscando…');
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q));
      if (seq !== searchSeqRef.current) return; // resultado obsoleto
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus(err.error || 'Error al buscar');
        return;
      }
      const data = await res.json();
      setTracks(data.tracks || []);
      setStatus('');
    } catch {
      setStatus('Sin conexión');
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    const q = value.trim();
    if (!q) {
      setTracks([]);
      setStatus('');
      searchSeqRef.current++;
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(q), 350);
  }

  function togglePreview(track) {
    if (!track.preview) return;

    if (playingUri === track.uri) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingUri(null);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(track.preview);
    audioRef.current = audio;
    setPlayingUri(track.uri);
    audio.play();
    audio.addEventListener(
      'ended',
      () => {
        setPlayingUri((current) => (current === track.uri ? null : current));
        audioRef.current = null;
      },
      { once: true }
    );
  }

  async function addTrack(track) {
    setPendingUris((prev) => new Set(prev).add(track.uri));
    try {
      await fetch(ADD_TRACK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          song: track.name,
          artist: track.artists,
          url: 'https://open.spotify.com/track/' + track.uri.replace('spotify:track:', ''),
        }),
      });
      setAddedUris((prev) => new Set(prev).add(track.uri));
      showToast(`"${track.name}" sugerida ✓`);
    } catch {
      showToast('Sin conexión, intentá de nuevo');
    } finally {
      setPendingUris((prev) => {
        const next = new Set(prev);
        next.delete(track.uri);
        return next;
      });
    }
  }

  return (
    <section className="relative z-10 mx-auto max-w-[720px] px-6 pb-32 pt-16">
      <div className="reveal mb-12 text-center">
        <Ornament className="mb-3 text-gold" />
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-normal text-ink">Sumá tu canción</h2>
        <div className="mt-2 font-smallcaps text-[0.85rem] uppercase tracking-[0.4em] text-gold-deep">
          la playlist de la fiesta
        </div>
      </div>

      <div className="spotify-card reveal relative border border-beige bg-paper px-6 py-10 shadow-soft sm:px-10 sm:py-12">
        <p className="mx-auto mb-8 max-w-[420px] text-center italic text-ink-soft">
          Buscá la canción que no puede faltar y sugerila. Nosotros nos encargamos de armar la playlist.
        </p>

        <div className="relative mb-5 flex gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-[0.85rem] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold-deep"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Buscá una canción o artista..."
            className="flex-1 border border-beige bg-cream px-4 py-[0.85rem] pl-10 font-serif text-base text-ink outline-none transition-colors focus:border-gold placeholder:italic placeholder:text-ink-soft/50"
          />
        </div>

        <ul className="search-results mb-2 max-h-[440px] list-none overflow-y-auto">
          {tracks.length === 0 && (
            <li className="px-4 py-8 text-center italic text-ink-soft/70">
              {query.trim() ? 'Sin resultados' : 'Empezá a escribir para buscar canciones'}
            </li>
          )}
          {tracks.map((t) => {
            const spotifyUrl = 'https://open.spotify.com/track/' + t.uri.replace('spotify:track:', '');
            const isPlaying = playingUri === t.uri;
            const isAdded = addedUris.has(t.uri);
            const isPending = pendingUris.has(t.uri);
            return (
              <li
                key={t.uri}
                className="track-item flex items-center gap-3 border-b border-gold/15 py-3 transition-colors hover:bg-beige/20"
              >
                {t.preview ? (
                  <div
                    role="button"
                    aria-label="Escuchar preview"
                    onClick={() => togglePreview(t)}
                    className={`track-cover-wrap relative h-12 w-12 flex-shrink-0 cursor-pointer ${isPlaying ? 'playing' : ''}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.cover || ''} alt="" className="h-12 w-12 flex-shrink-0 bg-beige-soft object-cover" />
                    <div className="track-cover-overlay absolute inset-0 flex items-center justify-center bg-ink/50 text-white transition-opacity [&_svg]:drop-shadow">
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </div>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.cover || ''} alt="" className="h-12 w-12 flex-shrink-0 bg-beige-soft object-cover" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[0.95rem] text-ink">{t.name}</div>
                  <div className="truncate text-[0.8rem] italic text-ink-soft">{t.artists}</div>
                </div>

                {!t.preview && (
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver en Spotify"
                    title="Ver en Spotify"
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-beige text-ink-soft transition-colors hover:border-[#1ed760] hover:bg-[#1ed760]/10 hover:text-[#1ed760]"
                  >
                    <SpotifyIcon />
                  </a>
                )}

                <button
                  type="button"
                  disabled={isAdded || isPending}
                  onClick={() => addTrack(t)}
                  aria-label="Sugerir"
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-[1.25rem] transition-colors disabled:cursor-default ${
                    isAdded
                      ? 'border-gold-deep bg-gold-deep text-cream'
                      : 'border-gold text-gold-deep hover:bg-gold hover:text-cream'
                  }`}
                >
                  {isAdded ? '✓' : isPending ? '…' : '+'}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="min-h-[1.2rem] text-center font-smallcaps text-[0.8rem] tracking-[0.2em] text-gold-deep">
          {status}
        </div>
      </div>

      <div
        className={`toast fixed bottom-8 left-1/2 z-[100] border-l-[3px] border-gold bg-ink px-6 py-[0.85rem] font-smallcaps text-[0.85rem] uppercase tracking-[0.2em] text-cream shadow-deep ${
          toast.show ? 'show' : ''
        }`}
      >
        {toast.message}
      </div>
    </section>
  );
}
