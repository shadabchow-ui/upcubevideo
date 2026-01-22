'use client'

import { useRef } from 'react'

export default function VideoFeedItem({ src, title, author }) {
  const ref = useRef<HTMLVideoElement>(null)

  return (
    <div className="relative h-[90vh] w-full overflow-hidden rounded-2xl">
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Text overlay */}
      <div className="absolute bottom-6 left-6 max-w-md">
        <p className="text-sm text-zinc-400">@{author}</p>
        <p className="text-base text-white mt-1">{title}</p>
      </div>

      {/* Right actions */}
      <div className="absolute bottom-24 right-6 flex flex-col gap-4 text-white">
        <button className="opacity-70 hover:opacity-100">♥</button>
        <button className="opacity-70 hover:opacity-100">↻</button>
        <button className="opacity-70 hover:opacity-100">⋯</button>
      </div>
    </div>
  )
}
