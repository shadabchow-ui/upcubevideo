"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setVideo(null);

    const res = await fetch("/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setVideo(Array.isArray(data.video) ? data.video[0] : data.video);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-3xl font-bold">Mochi Video</h1>

      <textarea
        className="w-full max-w-xl p-3 text-black rounded"
        rows={4}
        placeholder="Describe the video..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={loading}
        className="px-6 py-2 bg-white text-black rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {video && (
        <video
          src={video}
          controls
          className="w-full max-w-xl rounded-xl mt-4"
        />
      )}
    </main>
  );
}
