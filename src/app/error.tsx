"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, Home, RotateCcw } from "lucide-react";

export default function SegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
              <AlertOctagon className="h-3.5 w-3.5" aria-hidden="true" />
              ERR_500 // RUNTIME_FAULT
            </span>
            {error.digest ? (
              <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-400">
                Digest: {error.digest}
              </span>
            ) : null}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
              Subsystem Render Exception
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              An unexpected error interrupted this route segment. You can retry
              rendering the view or return to the main dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-t-2 border-slate-800 pt-5">
            <button
              type="button"
              onClick={() => reset()}
              className="brutal-btn brutal-btn-amber font-mono-tech inline-flex cursor-pointer items-center gap-2 bg-[#facc15] px-4 py-2.5 text-xs font-bold uppercase text-[#0d1017]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry Subsystem
            </button>
            <Link
              href="/"
              className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-2 bg-[#0d1017] px-4 py-2.5 text-xs font-bold uppercase text-white"
            >
              <Home className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
