'use client';

import { useState } from 'react';

export default function PromptComposer() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Generation failed');
      }

      const data = await res.json();
      console.log('Mochi output:', data);

      // TEMP: just log result
      // Next step: inject into feed or route to /create
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[720px] max-w-[90vw] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl bg-black/70 backdrop-blur border border-white/10 px-4 py-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to create…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          disabled={loading}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-400 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

