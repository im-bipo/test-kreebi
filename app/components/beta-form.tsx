"use client";

import { useState, type FormEvent } from "react";

// "Try the beta" newsletter form — posts the email to /api/beta,
// which logs it and forwards it to the Slack webhook.
export default function BetaForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending || done) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="w-full rounded-2xl border border-primary/25 bg-primary/[0.06] px-6 py-5">
        <p className="font-semibold text-primary">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-zinc-500">
          We&apos;ll email you the moment the beta opens.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3 text-primary" aria-hidden>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
        <span className="text-xs font-semibold tracking-[0.32em] uppercase">
          Join Beta Lab
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="beta-email" className="sr-only">
          Email address
        </label>
        <input
          id="beta-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={sending}
          className="h-12 rounded-xl bg-primary px-6 font-medium whitespace-nowrap text-white shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Joining…" : "Join Beta"}
        </button>
      </form>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
