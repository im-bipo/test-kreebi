"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BetaForm from "./components/beta-form";

function getReleaseDate() {
  // 25th September 2026, midnight local time
  return new Date(2026, 8, 25, 0, 0, 0);
}

function getTimeLeft(target: number, now: number) {
  const diff = Math.max(0, target - now);
  return {
    total: diff,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  const target = useMemo(() => getReleaseDate().getTime(), []);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, []);

  const timeLeft = now === null ? null : getTimeLeft(target, now);
  const isLive = timeLeft !== null && timeLeft.total <= 0;

  const units = timeLeft
    ? [
        { value: pad(timeLeft.days), label: "Days" },
        { value: pad(timeLeft.hours), label: "Hours" },
        { value: pad(timeLeft.minutes), label: "Minutes" },
        { value: pad(timeLeft.seconds), label: "Seconds" },
      ]
    : [
        { value: "--", label: "Days" },
        { value: "--", label: "Hours" },
        { value: "--", label: "Minutes" },
        { value: "--", label: "Seconds" },
      ];

  const releaseLabel = new Date(target).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col items-center justify-center overflow-hidden bg-white px-6 py-16 text-center font-sans text-zinc-900">
      {/* soft primary glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(124,40,238,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl"
      />

      <main className="relative flex w-full max-w-2xl flex-col items-center gap-8">
        <Image
          src="/kreebi-ai.png"
          alt="Kreebi AI logo"
          width={76}
          height={76}
          priority
          className="h-[76px] w-[76px] rounded-xl shadow-lg shadow-primary/20 ring-1 ring-zinc-900/5"
        />

        <div className="flex items-center gap-3 text-primary" aria-hidden>
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
          <span className="text-xs font-semibold tracking-[0.32em] uppercase">
            First release · V1
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary/60" />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
            First release will be on
            <span className="block text-primary">25th September 2026</span>
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg">
            The fastest free way to build stunning WordPress pages with AI.
            Describe it, generate it, refine it. Launching {releaseLabel}.
          </p>
        </div>

        {isLive ? (
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.07] px-8 py-6">
            <p className="text-2xl font-semibold text-primary">
              It&apos;s live — welcome to Kreebi AI v1.
            </p>
          </div>
        ) : (
          <div
            role="timer"
            aria-live="off"
            aria-label="Countdown to first release"
            className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {units.map((u) => (
              <div
                key={u.label}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(124,40,238,0.25)]"
              >
                <div className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">
                  {u.value}
                </div>
                <div className="mt-2 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <BetaForm />
      </main>
    </div>
  );
}
