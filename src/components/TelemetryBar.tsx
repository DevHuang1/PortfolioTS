"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { Clock, Command, Menu, X } from "lucide-react";
import { PROFILE } from "@/data/portfolio";

const NAV_ITEMS = [
  { label: "Awards", href: "/#awards", sectionId: "awards" },
  { label: "Skills", href: "/#skills", sectionId: "skills" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Systems", href: "/#systems", sectionId: "systems" },
  { label: "Archive", href: "/#archive", sectionId: "archive" },
  { label: "Credentials", href: "/#credentials", sectionId: "credentials" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

interface TelemetryBarProps {
  onOpenPalette?: () => void;
  paletteButtonRef?: RefObject<HTMLButtonElement | null>;
  isPaletteOpen?: boolean;
}

export default function TelemetryBar({
  onOpenPalette,
  paletteButtonRef,
  isPaletteOpen = false,
}: TelemetryBarProps) {
  const [yangonTime, setYangonTime] = useState<string>("--:--:--");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const dotIndex = PROFILE.domain.indexOf(".");
  const domainName =
    dotIndex > 0 ? PROFILE.domain.slice(0, dotIndex) : PROFILE.domain;
  const domainSuffix = dotIndex > 0 ? PROFILE.domain.slice(dotIndex) : "";

  useEffect(() => {
    const update = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: PROFILE.timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setYangonTime(formatted);
      } catch {
        setYangonTime("UTC+6:30");
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  // Progressive fallback for scroll progress bar when CSS `animation-timeline: scroll()` is unsupported
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof CSS === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches ||
      CSS.supports("animation-timeline", "scroll()")
    ) {
      return;
    }

    const bar = progressBarRef.current;
    if (!bar) return;

    let frameId: number | null = null;
    const syncProgress = () => {
      frameId = null;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(syncProgress);
      }
    };

    syncProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  // Scrollspy active section highlight (handles hero top, nested #archive, and bottom #contact)
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.sectionId)
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    let frameId: number | null = null;

    const updateActive = () => {
      frameId = null;
      const docHeight = document.documentElement.scrollHeight;
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }
      if (window.innerHeight + window.scrollY >= docHeight - 40) {
        setActiveSection("contact");
        return;
      }

      const triggerY = Math.min(260, window.innerHeight * 0.35);
      let current = "";
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= triggerY) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b-2 border-slate-800 bg-[#090b10]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex shrink-0 items-center gap-2"
            aria-label={`${PROFILE.domain} home`}
          >
            <span className="font-mono-tech grid h-7 w-7 place-items-center border-2 border-[#2dd4bf] bg-[#2dd4bf]/10 text-[10px] font-bold text-[#2dd4bf] transition-colors group-hover:bg-[#2dd4bf] group-hover:text-[#0d1017]">
              {PROFILE.initials}
            </span>
            <span className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.16em] text-white sm:text-xs">
              {domainName}
              {domainSuffix ? (
                <span className="text-[#2dd4bf]">{domainSuffix}</span>
              ) : null}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`font-mono-tech border-b-2 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition lg:px-2.5 ${
                    isActive
                      ? "border-[#2dd4bf] bg-[#141923] text-[#2dd4bf]"
                      : "border-transparent text-slate-400 hover:bg-[#141923] hover:text-[#2dd4bf]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <span className="font-mono-tech hidden items-center gap-1.5 text-[10px] text-slate-400 lg:inline-flex">
            <Clock className="h-3 w-3 text-[#facc15]" aria-hidden="true" />
            {PROFILE.timezoneLabel}{" "}
            <strong className="font-bold tabular-nums text-slate-200">
              {yangonTime}
            </strong>
          </span>

          <button
            ref={paletteButtonRef}
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPalette?.();
            }}
            aria-haspopup="dialog"
            aria-expanded={isPaletteOpen}
            aria-label="Open command palette"
            className="font-mono-tech inline-flex cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#141923] px-2 py-1 text-[10px] font-semibold text-slate-300 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
          >
            <Command className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">Jump</span>
            <kbd className="border border-slate-600 bg-[#0d1017] px-1 text-[9px] text-[#facc15]">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="telemetry-mobile-nav"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="font-mono-tech inline-flex h-7 w-7 cursor-pointer items-center justify-center border border-slate-700 bg-[#141923] text-slate-200 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="telemetry-mobile-nav"
          className="animate-drawer-enter border-t-2 border-slate-800 bg-[#0d1017] px-4 py-3 md:hidden"
        >
          <nav aria-label="Mobile" className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-mono-tech border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "border-[#2dd4bf] bg-[#2dd4bf]/10 text-[#2dd4bf]"
                      : "border-slate-700 bg-[#141923] text-slate-200 hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="font-mono-tech mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-2.5 text-[10px] uppercase tracking-wider text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-300">
              {PROFILE.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-[#facc15]" aria-hidden="true" />
              {PROFILE.timezoneLabel}{" "}
              <strong className="tabular-nums text-slate-200">
                {yangonTime}
              </strong>
            </span>
          </div>
        </div>
      )}

      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="scroll-progress-bar pointer-events-none h-[2px] w-full bg-gradient-to-r from-[#2dd4bf] via-[#facc15] to-[#fb7185]"
      />
    </div>
  );
}
