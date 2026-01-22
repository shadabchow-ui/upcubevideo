'use client';

import { useCallback, useRef, useState } from 'react';

type VideoItem = {
  id: string;
  videoUrl: string;     // mp4/webm url
  posterUrl?: string;   // thumbnail image url (optional)
  prompt?: string;
  creator?: string;
  likes?: number;
  comments?: number;
};

export default function VideoCard({ item }: { item: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const safePlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      // restart from the beginning on each hover
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof (p as Promise<void>).then === 'function') await p;
    } catch {
      // autoplay can fail in some browsers; ignore
    }
  }, []);

  const safeStop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    try {
      v.pause();
      v.currentTime = 0;
    } catch {
      // ignore
    }
  }, []);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur transition hover:border-white/20 hover:bg-white/10"
      onMouseEnter={() => {
        setIsHovering(true);
        safePlay();
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        safeStop();
      }}
      onTouchStart={() => {
        // mobile: tap to preview
        setIsHovering(true);
        safePlay();
      }}
      onTouchEnd={() => {
        setIsHovering(false);
        safeStop();
      }}
    >
      <div className="relative">
        <video
          ref={videoRef}
          className="h-auto w-full object-cover"
          src={item.videoUrl}
          poster={item.posterUrl}
          muted
          playsInline
          preload="metadata"
        />

        {/* Play icon overlay (shows when not hovering) */}
        <div
          className={[
            'pointer-events-none absolute inset-0 grid place-items-center transition',
            isHovering ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          <div className="rounded-full bg-black/50 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/15">
            ▶ Preview
          </div>
        </div>

        {/* subtle hover glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
        </div>
      </div>

      <div className="space-y-2 p-4">
        {item.prompt ? (
          <p className="line-clamp-2 text-sm leading-snug text-white/90">
            {item.prompt}
          </p>
        ) : (
          <p className="line-clamp-2 text-sm leading-snug text-white/60">
            Video
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-white/60">
          <span className="truncate">{item.creator ?? 'Anonymous'}</span>
          <div className="flex items-center gap-3">
            <span>♥ {item.likes ?? 0}</span>
            <span>💬 {item.comments ?? 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
