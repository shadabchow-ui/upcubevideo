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
];

type Tab = "Trending" | "New" | "Following";

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>("Trending");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    let base = [...SEED];
    if (tab === "New") base = [...base].reverse();
    if (tab === "Following")
      base = [...base].sort((a, b) => a.creator.localeCompare(b.creator));

    const query = q.trim().toLowerCase();
    if (!query) return base;

    return base.filter((it) =>
      `${it.title ?? ""} ${it.prompt} ${it.creator}`
        .toLowerCase()
        .includes(query)
    );
  }, [tab, q]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/10" />
            <div>
              <div className="text-sm font-semibold">Upcube Video</div>
              <div className="text-xs text-white/50">Explore generations</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Create
            </Link>
            <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">
              New
            </button>
          </div>
        </div>
      </header>

      {/* Tabs + search */}
      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {(["Trending", "New", "Following"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "rounded-full px-4 py-2 text-sm transition",
                tab === t
                  ? "bg-white/15 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex w-full md:w-[420px] gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search prompt, creator, style…"
            className="w-full rounded-full bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            onClick={() => setQ("")}
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Sora-style feed */}
      <main className="mx-auto max-w-4xl px-4 space-y-20 pb-24">
        {items.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </main>
    </div>
  );
}

function FeedItem({ item }: { item: ExploreItem }) {
  return (
    <section className="relative h-[88vh] w-full overflow-hidden rounded-3xl">
      {/* Media */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Creator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-white/15" />
        <span className="text-sm text-white/85">@{item.creator}</span>
      </div>

      {/* Right actions */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-3">
        <Action icon="♥" />
        <Action icon="↻" />
        <Action icon="⋯" />
      </div>

      {/* Bottom prompt */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-xs text-white/60 mb-1">
          {item.kind.toUpperCase()} · {item.age}
        </div>
        <div className="text-base font-semibold">
          {item.title ?? "Untitled"}
        </div>
        <p className="mt-1 max-w-xl text-sm text-white/70 leading-relaxed">
          {item.prompt}
        </p>

        <div className="mt-3 flex gap-4 text-xs text-white/60">
          <span>{format(item.likes)} likes</span>
          <span>{format(item.views)} views</span>
        </div>
      </div>
    </section>
  );
}

function Action({ icon }: { icon: string }) {
  return (
    <button className="h-10 w-10 rounded-full bg-black/50 border border-white/10 grid place-items-center text-white/80 hover:bg-black/70">
      {icon}
    </button>
  );
}

function format(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
