'use client';

import { useRef } from 'react';

type VideoFeedItemProps = {
  src: string;
  title: string;
  author: string;
};

export default function VideoFeedItem({
  src,
  title,
  author,
}: VideoFeedItemProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="relative h-[90vh] w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Creator */}
      <div className="absolute top-4 left-4 text-sm text-white/80">
        @{author}
      </div>

      {/* Title */}
      <div className="absolute bottom-6 left-6 max-w-md">
        <p className="text-white text-base leading-snug">{title}</p>
      </div>

      {/* Right actions */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3 text-white/80">
        <button>♥</button>
        <button>↻</button>
        <button>⋯</button>
      </div>
    </div>
  );
}

