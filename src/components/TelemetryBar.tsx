"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import { Clock, Command, Menu, X } from "lucide-react";
import { PROFILE } from "@/data/portfolio";

const NAV_ITEMS = [
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Systems", href: "/#systems" },
  { label: "Archive", href: "/#archive" },
  { label: "Credentials", href: "/#credentials" },
  { label: "Contact", href: "/#contact" },
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
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono-tech px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition hover:bg-[#141923] hover:text-[#2dd4bf] lg:px-2.5"
              >
                {item.label}
              </Link>
            ))}
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
          className="border-t-2 border-slate-800 bg-[#0d1017] px-4 py-3 md:hidden"
        >
          <nav aria-label="Mobile" className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono-tech border border-slate-700 bg-[#141923] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-200 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
              >
                {item.label}
              </Link>
            ))}
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
    </div>
  );
}
