"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Tracks pointer movement over the hero panel using ResizeObserver-cached bounds
 * to drive CSS radial spotlight mask coordinates without causing layout reflows.
 */
export function HeroSpotlightTracker({ targetId = "top" }: { targetId?: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let rect = el.getBoundingClientRect();
    const updateRect = () => {
      rect = el.getBoundingClientRect();
    };

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(el);

    let frameId: number | null = null;
    let nextX = 50;
    let nextY = 50;

    const flush = () => {
      frameId = null;
      el.style.setProperty("--mouse-x", `${nextX}%`);
      el.style.setProperty("--mouse-y", `${nextY}%`);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (rect.width === 0 || rect.height === 0) return;
      nextX = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      nextY = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      if (frameId === null) {
        frameId = requestAnimationFrame(flush);
      }
    };

    const onScroll = () => {
      updateRect();
    };

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [targetId]);

  return null;
}

/**
 * Progressive-enhancement fallback for scroll-driven .scroll-reveal elements in
 * browsers lacking CSS `animation-timeline: view()` & `animation-range: entry`.
 */
export function ScrollRevealObserver() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      return;
    }

    const supportsSiblingIndex =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-delay: calc(sibling-index() * 0.1s)");

    if (!supportsSiblingIndex) {
      document.querySelectorAll<HTMLElement>(".stagger-grid").forEach((grid) => {
        Array.from(grid.children).forEach((child, idx) => {
          (child as HTMLElement).style.setProperty(
            "--sibling-index",
            String(idx)
          );
        });
      });
    }

    const supportsViewTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)");

    if (supportsViewTimeline) return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal")
    );
    if (elements.length === 0) return;

    const viewportBottom = window.innerHeight * 0.96;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportBottom) {
        el.setAttribute("data-reveal-state", "visible");
      } else {
        el.setAttribute("data-reveal-state", "pending");
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal-state", "visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    for (const el of elements) {
      if (el.getAttribute("data-reveal-state") === "pending") {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
}

/**
 * Accessible ticker marquee with keyboard-operable Pause / Play control (WCAG 2.2.2).
 */
export function TelemetryTicker({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative flex items-center border-y-2 border-slate-700 bg-[#141923]">
      <div
        className="min-w-0 flex-1 overflow-hidden py-2.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_94%,transparent)]"
        aria-hidden="true"
      >
        <div
          ref={trackRef}
          data-paused={paused ? "true" : "false"}
          className="animate-ticker font-mono-tech text-[11px] font-bold tracking-[0.18em] text-slate-300"
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="mx-5 inline-flex items-center gap-3"
            >
              <span className="h-1.5 w-1.5 bg-[#2dd4bf]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((prev) => !prev)}
        aria-label={paused ? "Play tech ticker" : "Pause tech ticker"}
        className="font-mono-tech relative z-10 mr-2 inline-flex shrink-0 cursor-pointer items-center gap-1 border border-slate-700 bg-[#0d1017] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
      >
        {paused ? (
          <>
            <Play className="h-2.5 w-2.5 text-[#2dd4bf]" aria-hidden="true" />
            <span className="hidden sm:inline">Play</span>
          </>
        ) : (
          <>
            <Pause className="h-2.5 w-2.5 text-[#facc15]" aria-hidden="true" />
            <span className="hidden sm:inline">Pause</span>
          </>
        )}
      </button>

      <p className="sr-only">Core stack: {items.join(", ")}</p>
    </div>
  );
}
