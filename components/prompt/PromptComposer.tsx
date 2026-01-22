'use client';

import { useState } from 'react';

export default function PromptComposer() {
  const [value, setValue] = useState('');

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[720px] max-w-[90vw] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl bg-black/70 backdrop-blur border border-white/10 px-4 py-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe the video you want to create…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
          Generate
        </button>
      </div>
    </div>
  );
}
