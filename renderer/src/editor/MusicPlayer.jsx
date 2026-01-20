import { useState, useRef, useEffect } from 'react';

export default function MusicPlayer({ theme }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const colors = theme.colors;

  // Add music file to playlist
  const handleImportMusic = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('audio')) return;

    const objectUrl = URL.createObjectURL(file);
    setPlaylist(prev => [...prev, { id: Date.now(), name: file.name, url: objectUrl }]);
    e.target.value = '';
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!playlist[currentTrackIndex]) return;
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    } else if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn('Play error:', err));
    }
    setIsPlaying(!isPlaying);
  };

  // Next track
  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Previous track
  const playPrevious = () => {
    if (playlist.length === 0) return;
    if (currentTime > 3) {
      // If > 3 seconds in, restart current track
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      // Otherwise go to previous track
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      setCurrentTrackIndex(prevIndex);
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  // Update audio ref when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTrack = playlist[currentTrackIndex];
    if (!currentTrack) {
      audio.src = '';
      return;
    }

    audio.src = currentTrack.url;
    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(err => console.warn('Autoplay error:', err));
    }

    return () => {
      audio.pause();
    };
  }, [currentTrackIndex, playlist]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex, playlist]);

  const currentTrack = playlist[currentTrackIndex];
  const trackName = currentTrack ? currentTrack.name.replace(/\.[^.]+$/, '') : 'No track';

  // Format time mm:ss
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        background: colors.bgPanel,
        borderRadius: 12,
      }}
    >
      {/* Audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Track info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
          Now Playing
        </div>
        <div style={{
          fontSize: 13,
          color: colors.textPrimary,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}>
          {trackName}
        </div>
        <div style={{ fontSize: 11, color: colors.textMuted }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: 4,
        background: colors.borderSubtle,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = percent * duration;
        setCurrentTime(percent * duration);
      }}
      >
        <div style={{
          height: '100%',
          background: colors.accentMint,
          width: `${(currentTime / duration) * 100}%`,
          transition: 'width 0.1s linear',
        }} />
      </div>

      {/* Playback controls */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={playPrevious}
          disabled={playlist.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            background: playlist.length === 0 ? colors.borderSubtle : colors.buttonBg,
            border: `1px solid ${colors.borderSubtle}`,
            color: colors.textPrimary,
            cursor: playlist.length === 0 ? 'not-allowed' : 'pointer',
            opacity: playlist.length === 0 ? 0.4 : 1,
            transition: 'all 140ms ease-out',
          }}
          onMouseEnter={(e) => playlist.length > 0 && (e.target.style.background = colors.buttonBgHover)}
          onMouseLeave={(e) => (e.target.style.background = playlist.length === 0 ? colors.borderSubtle : colors.buttonBg)}
        >
          {/* Previous icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20"/>
            <line x1="5" y1="4" x2="5" y2="20"/>
          </svg>
        </button>

        <button
          onClick={togglePlayPause}
          disabled={playlist.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 10,
            background: playlist.length === 0 ? colors.borderSubtle : colors.accentMint,
            border: 'none',
            color: '#000',
            cursor: playlist.length === 0 ? 'not-allowed' : 'pointer',
            opacity: playlist.length === 0 ? 0.4 : 1,
            transition: 'all 140ms ease-out',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => playlist.length > 0 && (e.target.style.filter = 'brightness(1.1)')}
          onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
        >
          {/* Play/Pause icon */}
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        <button
          onClick={playNext}
          disabled={playlist.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            background: playlist.length === 0 ? colors.borderSubtle : colors.buttonBg,
            border: `1px solid ${colors.borderSubtle}`,
            color: colors.textPrimary,
            cursor: playlist.length === 0 ? 'not-allowed' : 'pointer',
            opacity: playlist.length === 0 ? 0.4 : 1,
            transition: 'all 140ms ease-out',
          }}
          onMouseEnter={(e) => playlist.length > 0 && (e.target.style.background = colors.buttonBgHover)}
          onMouseLeave={(e) => (e.target.style.background = playlist.length === 0 ? colors.borderSubtle : colors.buttonBg)}
        >
          {/* Next icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4"/>
            <line x1="19" y1="4" x2="19" y2="20"/>
          </svg>
        </button>
      </div>

      {/* Volume control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.textSecondary }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a7 7 0 0 1 0 9.9M21.38 5a10 10 0 0 1 0 14"/>
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: colors.borderSubtle,
            cursor: 'pointer',
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
          onInput={(e) => {
            const percent = e.target.value * 100;
            e.target.style.background = `linear-gradient(to right, ${colors.accentMint} 0%, ${colors.accentMint} ${percent}%, ${colors.borderSubtle} ${percent}%, ${colors.borderSubtle} 100%)`;
          }}
        />
        <span style={{ fontSize: 11, color: colors.textMuted, minWidth: 28, textAlign: 'right' }}>
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Import button */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 12px',
          background: colors.buttonBg,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: 10,
          color: colors.buttonText,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 140ms ease-out',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = colors.buttonBgHover}
        onMouseLeave={(e) => e.currentTarget.style.background = colors.buttonBg}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>Import MP3</span>
          <input
            type="file"
            accept="audio/mp3,.mp3"
            onChange={handleImportMusic}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Playlist */}
      {playlist.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          maxHeight: 150,
          overflowY: 'auto',
          paddingTop: 12,
          borderTop: `1px solid ${colors.borderSubtle}`,
        }}>
          <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Playlist ({playlist.length})
          </div>
          {playlist.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              style={{
                padding: '6px 8px',
                background: currentTrackIndex === idx ? colors.chipSelectedBg : 'transparent',
                border: `1px solid ${currentTrackIndex === idx ? colors.chipSelectedBorder : 'transparent'}`,
                borderRadius: 8,
                color: currentTrackIndex === idx ? colors.accentRose : colors.textSecondary,
                cursor: 'pointer',
                fontSize: 12,
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'all 140ms ease-out',
              }}
              onMouseEnter={(e) => {
                if (currentTrackIndex !== idx) {
                  e.target.style.background = colors.buttonBgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (currentTrackIndex !== idx) {
                  e.target.style.background = 'transparent';
                }
              }}
              title={track.name}
            >
              {track.name.replace(/\.[^.]+$/, '')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
