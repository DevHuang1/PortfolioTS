"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import {
  CREDENTIALS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from "@/data/portfolio";
import TelemetryBar from "@/components/TelemetryBar";

type PaletteKind =
  | "SECTION"
  | "ACTION"
  | "PROJECT"
  | "SKILL"
  | "EXPERIENCE"
  | "EDUCATION"
  | "CREDENTIAL";

interface PaletteItem {
  id: string;
  kind: PaletteKind;
  label: string;
  sub: string;
  keywords: string;
  href?: string;
  externalUrl?: string;
  copyText?: string;
}

const KIND_BADGE: Record<PaletteKind, string> = {
  SECTION: "border-slate-600 bg-[#141923] text-slate-300",
  ACTION: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
  PROJECT: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
  SKILL: "border-[#2dd4bf]/50 bg-[#2dd4bf]/10 text-[#2dd4bf]",
  EXPERIENCE: "border-[#facc15]/50 bg-[#facc15]/10 text-[#facc15]",
  EDUCATION: "border-slate-500 bg-slate-800/70 text-slate-200",
  CREDENTIAL: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function CommandPaletteShell({
  children,
}: {
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navSourceRef = useRef<"keyboard" | "pointer" | null>(null);
  const wasOpenRef = useRef(false);
  const skipRestoreFocusRef = useRef(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allItems = useMemo<PaletteItem[]>(() => {
    const totalCredentials = CREDENTIALS.reduce(
      (sum, group) => sum + group.items.length,
      0
    );

    const sections: PaletteItem[] = [
      {
        id: "sec-inspector",
        kind: "SECTION",
        label: "Section // 60-Second Architecture Inspector",
        sub: "Interactive system selector, metrics, dataflow & decisions",
        keywords: "section architecture inspector interactive console",
        href: "/#inspector",
      },
      {
        id: "sec-skills",
        kind: "SECTION",
        label: "Section // Technical Skill Matrix",
        sub: "Languages, Frontend & 3D, Backend, AI/ML/GeoAI, Cloud & DevOps",
        keywords: "section skills matrix languages stack spoken target roles",
        href: "/#skills",
      },
      {
        id: "sec-awards",
        kind: "SECTION",
        label: "Section // Awards & International Certificates",
        sub: "NASA Space Apps 2026 Youth Scientific Excellence Award, Stanford ML, AWS, UNESCO, ASEAN GeoAI",
        keywords: "section awards honors international certificates nasa space apps msa",
        href: "/#awards",
      },
      {
        id: "sec-experience",
        kind: "SECTION",
        label: "Section // Experience & Mission Timeline",
        sub: "BibiVersus, UIT Project Lead, The Sprout Scouts, Tutoring",
        keywords: "section experience timeline mission roles work",
        href: "/#experience",
      },
      {
        id: "sec-education",
        kind: "SECTION",
        label: "Section // Education & Training",
        sub: "UIT B.C.Sc. '28, UTokyo GCI World, MERN, CCNA, Japanese N5",
        keywords: "section education university training",
        href: "/#education",
      },
      {
        id: "sec-systems",
        kind: "SECTION",
        label: "Section // Flagship Production Systems & Terminal",
        sub: `All ${PROJECTS.length} flagship builds & live NodeForge.ai sandbox`,
        keywords: "section projects flagship systems terminal nodeforge",
        href: "/#systems",
      },
      {
        id: "sec-archive",
        kind: "SECTION",
        label: "Section // GitHub Archive (8 Additional Repos)",
        sub: "Searchable repository archive across Python, TS, JS",
        keywords: "section github archive additional repos public",
        href: "/#archive",
      },
      {
        id: "sec-credentials",
        kind: "SECTION",
        label: `Section // Awards & International Certificates Vault (${totalCredentials} Entries)`,
        sub: "NASA Space Apps Award, UNESCO, ASEAN GeoAI, AWS, DeepLearning.AI, IBM, ITPEC",
        keywords: "section credentials certificates awards badges verification",
        href: "/#credentials",
      },
      {
        id: "sec-contact",
        kind: "SECTION",
        label: "Section // Contact & Open Channel",
        sub: `${PROFILE.links.rawEmail} • ${PROFILE.links.bibiversusEmail} • ${PROFILE.location}`,
        keywords: "section contact email github linkedin footer",
        href: "/#contact",
      },
    ];

    const actions: PaletteItem[] = [
      {
        id: "act-copy-email",
        kind: "ACTION",
        label: `Action // Copy Email (${PROFILE.links.rawEmail})`,
        sub: "Copy primary engineering contact email to clipboard",
        keywords: `copy email mail contact ${PROFILE.links.rawEmail}`,
        copyText: PROFILE.links.rawEmail,
      },
      {
        id: "act-github",
        kind: "ACTION",
        label: `Action // Open GitHub (@${PROFILE.handle})`,
        sub: PROFILE.links.github,
        keywords: `open github profile code repos ${PROFILE.handle}`,
        externalUrl: PROFILE.links.github,
      },
      {
        id: "act-linkedin",
        kind: "ACTION",
        label: "Action // Open LinkedIn Profile",
        sub: `${PROFILE.name} — LinkedIn`,
        keywords: "open linkedin profile network career",
        externalUrl: PROFILE.links.linkedin,
      },
      {
        id: "act-cv-pdf",
        kind: "ACTION",
        label: "Action // Open CV (PDF)",
        sub: "ThuTaSitt_CV.pdf (Hosted locally)",
        keywords: "open cv resume pdf curriculum vitae",
        externalUrl: PROFILE.links.cvPdf,
      },
      {
        id: "act-cv-docx",
        kind: "ACTION",
        label: "Action // Download CV (DOCX)",
        sub: "ThuTaSitt_CV.docx (Hosted locally)",
        keywords: "open cv resume docx word download",
        externalUrl: PROFILE.links.cvDocx,
      },
    ];

    const projectItems: PaletteItem[] = PROJECTS.map((p) => ({
      id: `proj-${p.id}`,
      kind: "PROJECT",
      label: `Project // ${p.name}`,
      sub: `${p.tagline} • ${p.stack.slice(0, 4).join(", ")}`,
      keywords: [
        p.name,
        p.repoName,
        p.tagline,
        p.summary,
        p.category,
        p.status,
        p.language,
        p.eventOrContext ?? "",
        ...p.stack,
      ].join(" "),
      href: `/projects/${p.id}`,
    }));

    const skillItems: PaletteItem[] = SKILL_GROUPS.map((group) => ({
      id: `skill-${group.category}`,
      kind: "SKILL",
      label: `Skills // ${group.category}`,
      sub: group.items.join(" · "),
      keywords: [group.category, ...group.items].join(" "),
      href: "/#skills",
    }));

    const experienceItems: PaletteItem[] = EXPERIENCE.map((exp) => ({
      id: `exp-${exp.id}`,
      kind: "EXPERIENCE",
      label: `Experience // ${exp.role}`,
      sub: `${exp.organization} • ${exp.period}`,
      keywords: [
        exp.role,
        exp.organization,
        exp.type,
        exp.period,
        ...exp.stack,
        ...exp.highlights,
      ].join(" "),
      href: "/#experience",
    }));

    const educationItems: PaletteItem[] = EDUCATION.map((edu) => ({
      id: `edu-${edu.id}`,
      kind: "EDUCATION",
      label: `Education // ${edu.program}`,
      sub: `${edu.institution} • ${edu.period} (${edu.status})`,
      keywords: [
        edu.program,
        edu.institution,
        edu.period,
        edu.status,
        edu.details ?? "",
      ].join(" "),
      href: "/#education",
    }));

    const credentialItems: PaletteItem[] = CREDENTIALS.flatMap((group, gIdx) =>
      group.items.map((cred, cIdx) => ({
        id: `cred-${gIdx}-${cIdx}`,
        kind: "CREDENTIAL" as const,
        label: `Credential // ${cred.title}`,
        sub: `${cred.issuer} • ${cred.date} • ${group.category}`,
        keywords: [
          cred.title,
          cred.issuer,
          cred.date,
          cred.year,
          cred.type,
          cred.role ?? "",
          cred.credentialId ?? "",
          cred.signatory ?? "",
          cred.note ?? "",
          group.category,
        ].join(" "),
        href: "/#credentials",
      }))
    );

    return [
      ...actions,
      ...sections,
      ...projectItems,
      ...skillItems,
      ...experienceItems,
      ...educationItems,
      ...credentialItems,
    ];
  }, []);

  const items = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return allItems;
    return allItems.filter((item) => {
      const haystack = `${item.label} ${item.sub} ${item.keywords}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [allItems, query]);

  const openPalette = useCallback(() => {
    skipRestoreFocusRef.current = false;
    if (typeof document !== "undefined") {
      const active = document.activeElement as HTMLElement | null;
      triggerElementRef.current =
        active && active !== document.body ? active : paletteButtonRef.current;
    }
    setOpen(true);
  }, []);

  const closePalette = useCallback((restoreFocus = true) => {
    skipRestoreFocusRef.current = !restoreFocus;
    setOpen(false);
    setQuery("");
    setCopyFeedback(null);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    optionRefs.current = [];
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Global Cmd/Ctrl+K toggle (always attached)
  useEffect(() => {
    const onToggleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) {
          openPalette();
        } else {
          closePalette(true);
        }
      }
    };
    window.addEventListener("keydown", onToggleShortcut);
    return () => window.removeEventListener("keydown", onToggleShortcut);
  }, [open, openPalette, closePalette]);

  // Escape & Tab focus trap ONLY while palette is open
  useEffect(() => {
    if (!open) return;

    const onOpenKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.tabIndex !== -1);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || !dialogRef.current.contains(active) || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (!active || !dialogRef.current.contains(active) || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onOpenKeyDown);
    return () => window.removeEventListener("keydown", onOpenKeyDown);
  }, [open, closePalette]);

  // Move focus into input on open; restore focus to trigger on close
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      if (skipRestoreFocusRef.current) {
        skipRestoreFocusRef.current = false;
        return;
      }
      const target = triggerElementRef.current ?? paletteButtonRef.current;
      const frame = requestAnimationFrame(() => {
        if (target && document.contains(target)) {
          target.focus({ preventScroll: true });
        }
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open]);

  // Keep keyboard-selected option scrolled into view
  useEffect(() => {
    if (!open || navSourceRef.current !== "keyboard") return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    navSourceRef.current = null;
  }, [activeIndex, open]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const executeItem = useCallback(
    async (item: PaletteItem) => {
      if (item.copyText) {
        const ok = await copyToClipboard(item.copyText);
        setCopyFeedback(
          ok
            ? `Copied ${item.copyText} to clipboard`
            : `Email: ${item.copyText}`
        );
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => {
          setCopyFeedback(null);
        }, 2500);
        return;
      }

      if (item.externalUrl) {
        closePalette(false);
        window.open(item.externalUrl, "_blank", "noopener,noreferrer");
        return;
      }

      if (item.href) {
        closePalette(false);
        router.push(item.href);
      }
    },
    [closePalette, router]
  );

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length === 0) return;
      navSourceRef.current = "keyboard";
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;
      navSourceRef.current = "keyboard";
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      if (items.length === 0) return;
      e.preventDefault();
      navSourceRef.current = "keyboard";
      setActiveIndex(0);
    } else if (e.key === "End") {
      if (items.length === 0) return;
      e.preventDefault();
      navSourceRef.current = "keyboard";
      setActiveIndex(items.length - 1);
    } else if (e.key === "Enter" && items[activeIndex]) {
      e.preventDefault();
      void executeItem(items[activeIndex]);
    }
  };

  const activeOptionId =
    items.length > 0 && items[activeIndex]
      ? `command-palette-option-${activeIndex}`
      : undefined;

  return (
    <>
      <TelemetryBar
        onOpenPalette={openPalette}
        paletteButtonRef={paletteButtonRef}
        isPaletteOpen={open}
      />

      {children}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-3 pt-4 backdrop-blur-sm sm:px-4 sm:pt-16 md:pt-24"
          onClick={() => closePalette()}
        >
          <div
            ref={dialogRef}
            className="brutal-card corner-brackets w-full max-w-2xl bg-[#141923] p-3.5 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b-2 border-slate-700 pb-3 transition focus-within:border-[#2dd4bf]">
              <Search
                className="h-4 w-4 shrink-0 text-[#2dd4bf]"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="command-palette-listbox"
                aria-activedescendant={activeOptionId}
                aria-label="Search projects, skills, experience, education, credentials, or quick actions"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search 15 projects, skills, experience, education, 36 certs, or actions..."
                className="font-mono-tech flex-1 bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search query"
                  className="font-mono-tech cursor-pointer border border-slate-700 bg-[#0d1017] px-2 py-1 text-[10px] uppercase text-slate-400 transition hover:border-[#2dd4bf] hover:text-white"
                >
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => closePalette()}
                aria-label="Close command palette"
                className="cursor-pointer border border-slate-700 bg-[#0d1017] p-1 text-slate-300 transition hover:border-[#2dd4bf] hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {copyFeedback && (
              <div
                role="status"
                aria-live="polite"
                className="font-mono-tech mt-3 flex items-center gap-2 border border-[#2dd4bf] bg-[#2dd4bf]/10 px-3 py-2 text-[11px] font-bold text-[#2dd4bf]"
              >
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{copyFeedback}</span>
              </div>
            )}

            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Command palette results"
              className="mt-3 max-h-[60vh] space-y-1.5 overflow-y-auto pr-0.5 sm:max-h-80"
            >
              {items.length === 0 && (
                <p
                  role="status"
                  className="font-mono-tech py-6 text-center text-xs text-slate-400"
                >
                  No matching project, skill, credential, or action.
                </p>
              )}

              {items.map((item, index) => {
                const isActive = index === activeIndex;
                const optionId = `command-palette-option-${index}`;

                return (
                  <button
                    key={item.id}
                    id={optionId}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={isActive}
                    onClick={() => void executeItem(item)}
                    onMouseEnter={() => {
                      navSourceRef.current = "pointer";
                      setActiveIndex(index);
                    }}
                    className={`group flex w-full cursor-pointer items-center justify-between gap-3 border-2 px-3 py-2 text-left transition ${
                      isActive
                        ? "border-[#2dd4bf] bg-[#2dd4bf]/10"
                        : "border-transparent bg-[#0d1017] hover:border-slate-600"
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span
                        className={`font-mono-tech mt-0.5 shrink-0 text-[9px] font-bold ${
                          isActive ? "text-[#2dd4bf]" : "text-slate-400"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-mono-tech border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${KIND_BADGE[item.kind]}`}
                          >
                            {item.kind}
                          </span>
                          <p
                            className={`font-mono-tech truncate text-xs font-bold ${
                              isActive ? "text-[#2dd4bf]" : "text-white"
                            }`}
                          >
                            {item.label}
                          </p>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {item.sub}
                        </p>
                      </div>
                    </div>

                    {item.copyText ? (
                      <Copy
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? "text-[#facc15]" : "text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    ) : item.externalUrl ? (
                      <ExternalLink
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? "text-[#facc15]" : "text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowRight
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? "text-[#facc15]" : "text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="font-mono-tech mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-slate-800 pt-2.5 text-[10px] uppercase tracking-wider text-slate-400">
              <span>
                {items.length} result{items.length === 1 ? "" : "s"}
              </span>
              <span className="hidden flex-wrap items-center gap-3 sm:flex">
                <span>
                  <kbd className="border border-slate-700 bg-[#0d1017] px-1 py-0.5 text-[9px] text-slate-300">
                    ↑↓
                  </kbd>{" "}
                  move
                </span>
                <span>
                  <kbd className="border border-slate-700 bg-[#0d1017] px-1 py-0.5 text-[9px] text-slate-300">
                    ↵
                  </kbd>{" "}
                  run
                </span>
                <span>
                  <kbd className="border border-slate-700 bg-[#0d1017] px-1 py-0.5 text-[9px] text-slate-300">
                    tab
                  </kbd>{" "}
                  controls
                </span>
                <span>
                  <kbd className="border border-slate-700 bg-[#0d1017] px-1 py-0.5 text-[9px] text-slate-300">
                    esc
                  </kbd>{" "}
                  close
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandPaletteShell;
