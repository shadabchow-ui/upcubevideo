// app/page.tsx
"use client";

import { useMemo, useState } from "react";

type JobStatus = "Queued" | "Running" | "Done" | "Failed";

type Job = {
  id: string;
  prompt: string;
  createdAt: string;
  status: JobStatus;
};

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [useStoryboard, setUseStoryboard] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job_001",
      prompt: "A cinematic drone shot over a neon city at night, rain, reflections…",
      createdAt: "Just now",
      status: "Done",
    },
    {
      id: "job_002",
      prompt: "A playful polar bear wearing a tuxedo sitting in a theater…",
      createdAt: "2m ago",
      status: "Running",
    },
    {
      id: "job_003",
      prompt: "A small fox in fresh snow, soft morning light, shallow depth…",
      createdAt: "7m ago",
      status: "Queued",
    },
  ]);

  const canGenerate = useMemo(() => prompt.trim().length >= 5, [prompt]);

  async function onGenerate() {
    if (!canGenerate) return;

    // UI-first: immediately create a job card
    const newJob: Job = {
      id: `job_${Math.random().toString(16).slice(2)}`,
      prompt: prompt.trim(),
      createdAt: "Now",
      status: "Queued",
    };
    setJobs((prev) => [newJob, ...prev]);
    setPrompt("");

    // Call your API
    try {
      setJobs((prev) =>
        prev.map((j) => (j.id === newJob.id ? { ...j, status: "Running" } : j))
      );

      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: newJob.prompt }),
      });

      if (!res.ok) throw new Error("Request failed");
      // const data = await res.json(); // later: store video url/output

      setJobs((prev) =>
        prev.map((j) => (j.id === newJob.id ? { ...j, status: "Done" } : j))
      );
    } catch {
      setJobs((prev) =>
        prev.map((j) => (j.id === newJob.id ? { ...j, status: "Failed" } : j))
      );
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/10" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Upcube Video</div>
              <div className="text-xs text-white/60">Generate short clips from text</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Runtime: Edge + node compat
            </span>
            <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
              New
            </button>
          </div>
        </div>
      </header>

      {/* 3-column layout */}
      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-6">
        {/* Left rail */}
        <aside className="col-span-12 md:col-span-2">
          <nav className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <NavItem active label="Create" />
            <NavItem label="Explore" />
            <NavItem label="History" />
            <NavItem label="Settings" />
          </nav>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-white/70">Tips</div>
            <div className="mt-2 text-xs text-white/60">
              Keep prompts concrete: subject, motion, camera, lighting, style.
            </div>
          </div>
        </aside>

        {/* Center canvas */}
        <section className="col-span-12 md:col-span-7">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold tracking-tight">Describe your video</div>
                <div className="mt-1 text-sm text-white/60">
                  Write a prompt. Optional storyboard will split into shots later.
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-white"
                  checked={useStoryboard}
                  onChange={(e) => setUseStoryboard(e.target.checked)}
                />
                Storyboard
              </label>
            </div>

            <div className="mt-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic handheld shot of a boxer wrapping hands in a gritty gym, dust in the air, warm tungsten light..."
                className="min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-white/50">
                {canGenerate ? "Ready to generate" : "Type at least 5 characters"}
              </div>
              <button
                onClick={onGenerate}
                disabled={!canGenerate}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/90"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Output preview placeholder */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Preview</div>
            <div className="mt-3 grid aspect-video place-items-center rounded-2xl border border-dashed border-white/15 bg-black/40 text-sm text-white/50">
              Your video preview will appear here
            </div>
          </div>
        </section>

        {/* Right panel */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Your generations</div>
              <button
                onClick={() => setJobs([])}
                className="text-xs text-white/50 hover:text-white/80"
              >
                Clear
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-white/50">{job.createdAt}</span>
                    <StatusPill status={job.status} />
                  </div>
                  <div className="mt-2 line-clamp-2 text-sm text-white/80">{job.prompt}</div>
                  <div className="mt-3 grid aspect-video place-items-center rounded-xl border border-white/10 bg-black/50 text-xs text-white/40">
                    thumbnail
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/50">
                  No generations yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Quick settings</div>
            <div className="mt-3 space-y-3 text-sm text-white/70">
              <Row label="Frames" value="24" />
              <Row label="FPS" value="8" />
              <Row label="Guidance" value="7.5" />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={[
        "w-full rounded-xl px-3 py-2 text-left text-sm transition",
        active
          ? "border border-white/15 bg-white/10 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function StatusPill({ status }: { status: JobStatus }) {
  const cls =
    status === "Done"
      ? "border-white/15 bg-white/10 text-white"
      : status === "Running"
      ? "border-white/15 bg-white/5 text-white/80"
      : status === "Queued"
      ? "border-white/10 bg-black/30 text-white/70"
      : "border-white/15 bg-black/30 text-white/70";

  return (
    <span className={`rounded-full border px-2 py-1 text-[11px] ${cls}`}>
      {status}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-white/90">{value}</span>
    </div>
  );
}
