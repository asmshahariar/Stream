'use client';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { useState, useEffect, useRef } from 'react';

interface PlayerProps {
  src: string;
  type?: string;
}

export default function Player({ src, type }: PlayerProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mpegtsPlayerRef = useRef<any>(null);

  let sourceType = type;
  if (!sourceType || sourceType === 'Auto') {
    if (src.includes('.m3u8') || src.includes('.m3u')) sourceType = 'application/x-mpegurl';
    else if (src.includes('.mpd')) sourceType = 'application/dash+xml';
    else if (src.includes('.ts')) sourceType = 'video/mp2t';
    else if (src.includes('.mp4')) sourceType = 'video/mp4';
    else sourceType = 'application/x-mpegurl';
  } else {
    const typeMap: Record<string, string> = {
      'HLS': 'application/x-mpegurl',
      'DASH': 'application/dash+xml',
      'TS': 'video/mp2t',
      'MP4': 'video/mp4',
    };
    sourceType = typeMap[sourceType] || 'application/x-mpegurl';
  }

  function onError(detail: any) {
    console.error('Player error:', detail);
    setErrorMsg('The stream failed to load. The URL might be invalid, offline, or blocking access (CORS).');
  }

  const isTsStream = sourceType === 'video/mp2t' || src.endsWith('.ts');

  let finalSrc = src;
  if (src && !src.includes('mux.dev')) {
    finalSrc = `/api/proxy?url=${encodeURIComponent(src)}`;
  }

  useEffect(() => {
    let loadTimeout: NodeJS.Timeout;

    if (isTsStream && finalSrc && videoRef.current) {
      import('mpegts.js').then((mpegts) => {
        if (mpegts.default.isSupported()) {
          const player = mpegts.default.createPlayer({
            type: 'mpegts',
            isLive: true,
            url: finalSrc,
          }, {
            enableStashBuffer: false,
            liveBufferLatencyChasing: true
          });

          mpegtsPlayerRef.current = player;
          player.attachMediaElement(videoRef.current!);
          player.load();
          
          loadTimeout = setTimeout(() => {
            setErrorMsg("This specific stream is encoded in HEVC (H.265) video and EAC3 audio. Web browsers (like Chrome) physically cannot play these codecs. You must use VLC Player or an H.264 link for web.");
            if (mpegtsPlayerRef.current) {
              try { mpegtsPlayerRef.current.destroy(); mpegtsPlayerRef.current = null; } catch (e) {}
            }
          }, 10000);
          
          player.play().then(() => {
            clearTimeout(loadTimeout);
          }).catch((e: any) => {
            console.error('TS AutoPlay blocked:', e);
          });
          
          player.on(mpegts.default.Events.ERROR, (errorType: any, errorDetail: any) => {
            console.error("MPEGTS Error:", errorType, errorDetail);
            clearTimeout(loadTimeout);
            setErrorMsg("Playback failed. This stream might be offline or use unsupported codecs.");
          });
        }
      });
    }

    return () => {
      if (loadTimeout) clearTimeout(loadTimeout);
      if (mpegtsPlayerRef.current) {
        try {
          mpegtsPlayerRef.current.pause();
          mpegtsPlayerRef.current.unload();
          mpegtsPlayerRef.current.detachMediaElement();
          mpegtsPlayerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        mpegtsPlayerRef.current = null;
      }
    };
  }, [finalSrc, isTsStream]);

  if (errorMsg) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center text-white text-sm md:text-base text-center p-4 border border-gray-800 rounded-lg shadow-2xl">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 font-bold text-xl">Playback Error</p>
          <p className="max-w-md text-gray-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (isTsStream) {
    return (
      <div className="w-full rounded-lg overflow-hidden border border-gray-800 shadow-2xl bg-black aspect-video flex">
        <video 
          ref={videoRef} 
          className="w-full h-full object-contain" 
          controls 
          autoPlay 
        />
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-800 shadow-2xl bg-black">
      <MediaPlayer
        className="w-full aspect-video"
        title="Live Stream"
        src={{ src: finalSrc, type: sourceType }}
        crossOrigin
        playsInline
        autoPlay
        load="eager"
        onError={onError}
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
