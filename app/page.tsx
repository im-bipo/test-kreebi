import Image from "next/image";

const BUILDER_URL = "https://builder.kreebi.com/";

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-x-clip bg-[#050505] font-sans text-white">
      {/* ── background texture ─────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[#7C28EE]/25 blur-[140px]" />
        <div className="anim-float-slow absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-[#7C28EE]/12 blur-[120px]" />
        <div className="absolute right-[-12rem] bottom-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[#4F46E5]/14 blur-[130px]" />
        {/* grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(70%_55%_at_50%_0%,black_30%,transparent_100%)]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_10%,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* ── floating nav ───────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-5">
        <nav className="anim-rise flex w-full max-w-xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/55 py-2 pr-2 pl-4 shadow-[0_8px_40px_-8px_rgba(124,40,238,0.5)] backdrop-blur-2xl">
          <a href="/" className="flex items-center gap-2.5">
            <Image
              src="/kreebi-ai.png"
              alt="Kreebi AI logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 rounded-lg ring-1 ring-white/15"
            />
            <span className="text-sm font-semibold tracking-tight">
              Kreebi AI
            </span>
          </a>
          <a
            href={BUILDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#7C28EE] hover:text-white active:scale-[0.98]"
          >
            Open Kreebi AI Builder
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.07] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:bg-white/20">
              <span aria-hidden>↗</span>
            </span>
          </a>
        </nav>
      </header>

      {/* ── hero ───────────────────────────────────────── */}
      <main className="relative flex flex-1 items-center justify-center">
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-32 pb-16 text-center">
          <h1
            className="anim-rise mt-7 max-w-4xl text-5xl leading-[0.95] font-semibold tracking-[-0.04em] text-balance sm:text-7xl md:text-8xl"
            style={{ animationDelay: "0.15s" }}
          >
            Describe it.
            <span className="text-gradient block">Watch it build.</span>
          </h1>

          <p
            className="anim-rise mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            style={{ animationDelay: "0.25s" }}
          >
            Kreebi AI is the fastest free way to build stunning WordPress pages.
            Type a prompt, get a pixel-perfect page in seconds then refine it
            live.
          </p>

          <div
            className="anim-rise mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
            style={{ animationDelay: "0.35s" }}
          >
            <a
              href={BUILDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 w-full items-center justify-between gap-4 rounded-full bg-[#7C28EE] py-2 pr-2 pl-7 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_20px_60px_-10px_rgba(124,40,238,0.8)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#8d3ff5] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_24px_80px_-10px_rgba(124,40,238,0.95)] active:scale-[0.98] sm:w-[340px]"
            >
              Open Kreebi AI Builder
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:scale-105 group-hover:bg-white group-hover:text-[#7C28EE]">
                <span aria-hidden>→</span>
              </span>
            </a>
            <a
              href={BUILDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-7 text-base font-medium text-white/80 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/25 hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:w-auto"
            >
              See what it makes
            </a>
          </div>

          <div
            className="anim-rise mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/45"
            style={{ animationDelay: "0.45s" }}
          >
            {[
              "Free to try",
              "No credit card",
              "WordPress-ready",
              "Live now",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
