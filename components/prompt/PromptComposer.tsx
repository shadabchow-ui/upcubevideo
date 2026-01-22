'use client';

import { useState, useEffect } from 'react';

export default function PromptComposer() {
  const [prompt, setPrompt] = useState('');
  const [quality, setQuality] = useState<'fast' | 'cinematic'>('fast');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setVideoUrl(null);
    setStatus('starting');

    const res = await fetch('/api/video/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, quality }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setJobId(data.id);
    setStatus(data.status);
  }

  // Polling
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/video/status?id=${jobId}`);
      const data = await res.json();

      setStatus(data.status);

      if (data.status === 'succeeded') {
        setVideoUrl(data.output);
        clearInterval(interval);
      }

      if (data.status === 'failed') {
        setError(data.error || 'Generation failed');
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <textarea
        className="w-full p-3 rounded bg-black/60 border border-white/10"
        placeholder="Describe your video..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={() => setQuality('fast')}
          className={`px-3 py-1 rounded ${
            quality === 'fast' ? 'bg-white text-black' : 'bg-white/10'
          }`}
        >
          Fast
        </button>
        <button
          onClick={() => setQuality('cinematic')}
          className={`px-3 py-1 rounded ${
            quality === 'cinematic'
              ? 'bg-white text-black'
              : 'bg-white/10'
          }`}
        >
          Cinematic
        </button>
      </div>

      <button
        onClick={generate}
        className="px-6 py-2 rounded bg-white text-black"
      >
        Generate
      </button>

      {status && <p className="text-sm opacity-70">Status: {status}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full rounded-lg"
        />
      )}
    </div>
  );
}



