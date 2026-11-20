import Link from "next/link";
import { AlertTriangle, ArrowLeft, Cpu } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[75vh] max-w-4xl items-center px-4 py-12 md:px-8"
    >
      <section className="brutal-card brutal-card-coral hero-panel corner-brackets animate-brutal-enter w-full overflow-hidden">
        <div className="h-1.5 w-full bg-[#fb7185]" aria-hidden="true" />
        <div className="space-y-6 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono-tech inline-flex items-center gap-2 border-2 border-[#fb7185] bg-[#fb7185]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#fb7185]">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              ERR_404 // ROUTE_NOT_FOUND
            </span>
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Telemetry // Unmapped Sector
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
            <p
              className="font-mono-tech text-6xl font-bold tracking-tight text-[#fb7185] md:text-7xl"
              aria-hidden="true"
            >
              404
            </p>
            <div className="space-y-2 border-slate-700 md:border-l-2 md:pl-6">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                System Endpoint Not Found
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300">
                The requested route or project case study does not exist in this
                deployment. Return to Mission Control or inspect the active
                systems catalog.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t-2 border-slate-800 pt-5">
            <Link
              href="/"
              className="brutal-btn brutal-btn-cyan font-mono-tech group inline-flex items-center gap-2 bg-[#2dd4bf] px-4 py-2.5 text-xs font-bold uppercase text-[#0d1017]"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Mission Control
            </Link>
            <Link
              href="/#systems"
              className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-2 bg-[#0d1017] px-4 py-2.5 text-xs font-bold uppercase text-white"
            >
              <Cpu className="h-4 w-4 text-[#facc15]" aria-hidden="true" />
              Browse Systems
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
