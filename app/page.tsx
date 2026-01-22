// app/explore/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ExploreItem = {
  id: string;
  title?: string;
  prompt: string;
  creator: string;
  likes: number;
  views: number;
  age: string;
  // placeholder-only for now
  kind: "video" | "image";
};

const SEED: ExploreItem[] = [
  {
    id: "ex_001",
    title: "Neon rain city",
    prompt:
      "Cinematic drone shot over a neon city at night, rain reflections, slow push-in, moody atmosphere, high detail.",
    creator: "sirremixalot",
    likes: 5400,
    views: 175000,
    age: "2h",
    kind: "video",
  },
  {
    id: "ex_002",
    title: "Ice bridge mouse",
    prompt:
      "Tiny mouse sliding across glossy ice under a long bridge, cold blue light, shallow depth of field, smooth motion.",
    creator: "camet",
    likes: 6200,
    views: 168000,
    age: "5h",
    kind: "video",
  },
  {
    id: "ex_003",
    title: "Snow fox portrait",
    prompt:
      "A fluffy arctic fox perched on a snowy post, soft morning fog, gentle wind, realistic fur detail, calm framing.",
    creator: "rorotuck",
    likes: 6400,
    views: 947000,
    age: "1d",
    kind: "video",
  },
  {
    id: "ex_004",
    title: "Studio close-up",
    prompt:
      "High-end studio close-up of a luxury watch rotating on a turntable, dramatic rim light, crisp reflections, macro lens.",
    creator: "glassframe",
    likes: 2100,
    views: 91000,
    age: "3d",
    kind: "video",
  },
  {
    id: "ex_005",
    title: "Retro street",
    prompt:
      "1990s handheld street footage in Times Square, busy crowd, authentic motion blur, film grain, nostalgic color grade.",
    creator: "vhs_era",
    likes: 890,
    views: 38000,
    age: "6d",
    kind: "video",
  },
  {
    id: "ex_006",
    title: "Polar bear tux",
    prompt:
      "A polar bear wearing a tuxedo sitting in a theater audience, subtle head turn, warm spotlight bokeh, comedic realism.",
    creator: "cinebear",
    likes: 1300,
    views: 52000,
    age: "1w",
    kind: "video",
  },
];

type Tab = "Trending" | "New" | "Following";

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>("Trending");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const base = [...SEED];

    // lightweight tab behavior (you'll replace with real data later)
    if (tab === "New") base.reverse();
    if (tab === "Following") base.sort((a, b) => a.creator.localeCompare(b.creator));

    const query = q.trim().toLowerCase();
    if (!query) return base;

    return base.filter((it) => {
      const hay = `${it.title ?? ""} ${it.prompt} ${it.creator}`.toLowerCase();
      return hay.includes(query);
    });
  }, [tab, q]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/10" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Upcube Video</div>
              <div className="text-xs text-white/60">Explore generations</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Create
            </Link>
            <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
              New
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Controls */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <TabButton active={tab === "Trending"} onClick={() => setTab("Trending")}>
              Trending
            </TabButton>
            <TabButton active={tab === "New"} onClick={() => setTab("New")}>
              New
            </TabButton>
            <TabButton active={tab === "Following"} onClick={() => setTab("Following")}>
              Following
            </TabButton>
          </div>

          <div className="flex w-full items-center gap-2 md:w-[420px]">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs text-white/40">Search</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="prompt, creator, style..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setQ("")}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Feed (Sora-like: columns) */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((it) => (
            <ExploreTile key={it.id} item={it} />
          ))}
        </div>
      </main>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-2 text-sm transition",
        active
          ? "border border-white/15 bg-white/10 text-white"
          : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ExploreTile({ item }: { item: ExploreItem }) {
  return (
    <article className="mb-4 break-inside-avoid">
      <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-white/20">
        {/* Media placeholder */}
        <div className="relative aspect-[9/16] w-full bg-black/40">
          {/* Fake “video” look */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/70" />
          <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
            <div className="absolute inset-0 bg-white/5" />
          </div>

          {/* Top-left creator */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white/10" />
            <div className="text-xs text-white/85">@{item.creator}</div>
          </div>

          {/* Bottom prompt + stats */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-white/70">
                {item.kind.toUpperCase()}
              </span>
              <span className="text-[11px] text-white/60">{item.age}</span>
            </div>

            <div className="mt-2">
              <div className="text-sm font-semibold tracking-tight">
                {item.title ?? "Untitled"}
              </div>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/70">
                {item.prompt}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <Dot /> {formatCompact(item.likes)} likes
                </span>
                <span className="flex items-center gap-1">
                  <Dot /> {formatCompact(item.views)} views
                </span>
              </div>

              <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
                Remix
              </button>
            </div>
          </div>

          {/* Right-side actions (Sora-ish vibe) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 space-y-2 opacity-90">
            <ActionPill label="♥" />
            <ActionPill label="⤴" />
            <ActionPill label="⋯" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionPill({ label }: { label: string }) {
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/40 text-sm text-white/80">
      {label}
    </div>
  );
}

function Dot() {
  return <span className="inline-block h-1 w-1 rounded-full bg-white/40" />;
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${Math.round((n / 1_000_000) * 10) / 10}M`;
  if (n >= 1_000) return `${Math.round((n / 1_000) * 10) / 10}K`;
  return `${n}`;
}
