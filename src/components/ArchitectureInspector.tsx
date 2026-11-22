"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  Globe,
  Layers,
  Lock,
  Monitor,
  RotateCw,
  ShieldAlert,
  Star,
} from "lucide-react";
import SystemDiagram from "@/components/SystemDiagram";
import type { ProjectCategory, ProjectItem } from "@/data/portfolio";

type FilterKey = "ALL" | "FEATURED" | ProjectCategory;
type ViewportMode = "preview" | "architecture" | "live";

const ACCENT_MAP = {
  cyan: {
    hex: "#2dd4bf",
    border: "border-[#2dd4bf]",
    bg: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    btn: "brutal-btn-cyan",
    dot: "bg-[#2dd4bf]",
  },
  amber: {
    hex: "#facc15",
    border: "border-[#facc15]",
    bg: "bg-[#facc15]",
    text: "text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    btn: "brutal-btn-amber",
    dot: "bg-[#facc15]",
  },
  coral: {
    hex: "#fb7185",
    border: "border-[#fb7185]",
    bg: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    btn: "brutal-btn-coral",
    dot: "bg-[#fb7185]",
  },
};

const FILTER_META: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "FEATURED", label: "FEATURED" },
  { key: "FLAGSHIP", label: "FLAGSHIP" },
  { key: "AI_SYSTEMS", label: "AI SYSTEMS" },
  { key: "HACKATHON", label: "HACKATHON" },
  { key: "FULL_STACK", label: "FULL STACK" },
];

export default function ArchitectureInspector({
  projects,
}: {
  projects: ProjectItem[];
}) {
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id ?? "");
  const [viewportMode, setViewportMode] = useState<ViewportMode>("preview");
  const [reloadTick, setReloadTick] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const tablistRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterCounts = useMemo<Record<FilterKey, number>>(
    () => ({
      ALL: projects.length,
      FEATURED: projects.filter((p) => p.featured).length,
      FLAGSHIP: projects.filter((p) => p.category === "FLAGSHIP").length,
      AI_SYSTEMS: projects.filter((p) => p.category === "AI_SYSTEMS").length,
      HACKATHON: projects.filter((p) => p.category === "HACKATHON").length,
      FULL_STACK: projects.filter((p) => p.category === "FULL_STACK").length,
    }),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (filter === "ALL") return projects;
    if (filter === "FEATURED") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  const active = useMemo(
    () =>
      filteredProjects.find((p) => p.id === selectedId) ??
      filteredProjects[0] ??
      projects[0],
    [filteredProjects, selectedId, projects]
  );

  // Scroll the selected Chrome tab cleanly into view inside the tab strip
  useEffect(() => {
    if (!active) return;
    const idx = filteredProjects.findIndex((p) => p.id === active.id);
    if (idx < 0) return;
    tabRefs.current[idx]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [active, filteredProjects]);

  // IntersectionObserver fallback for horizontal edge fade hints when scroll() timeline is unsupported
  useEffect(() => {
    const scroller = tablistRef.current;
    if (!scroller) return;
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline", "scroll(self inline)")
    ) {
      return;
    }

    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;
    if (!first || !last) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === first) {
            scroller.classList.toggle(
              "more-start",
              entry.intersectionRatio < 1
            );
          }
          if (entry.target === last) {
            scroller.classList.toggle("more-end", entry.intersectionRatio < 1);
          }
        }
      },
      { root: scroller, threshold: 1, rootMargin: "1px" }
    );

    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, [filteredProjects.length]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  if (!projects || projects.length === 0 || !active) {
    return null;
  }

  const style = ACCENT_MAP[active.accent];
  const activeFilteredIndex = Math.max(
    0,
    filteredProjects.findIndex((p) => p.id === active.id)
  );
  const omniboxUrl = active.liveUrl ?? active.repoUrl;
  const effectiveMode: ViewportMode =
    viewportMode === "live" && !active.liveUrl ? "preview" : viewportMode;

  const selectProject = (nextProject: ProjectItem) => {
    setSelectedId(nextProject.id);
    setCopiedUrl(false);
    if (!nextProject.liveUrl && viewportMode === "live") {
      setViewportMode("preview");
    }
  };

  const handleFilterChange = (nextFilter: FilterKey) => {
    setFilter(nextFilter);
    const nextList =
      nextFilter === "ALL"
        ? projects
        : nextFilter === "FEATURED"
          ? projects.filter((p) => p.featured)
          : projects.filter((p) => p.category === nextFilter);
    if (nextList.length > 0 && !nextList.some((p) => p.id === selectedId)) {
      selectProject(nextList[0]);
    }
  };

  const stepTab = (delta: number) => {
    if (filteredProjects.length <= 1) return;
    const nextIdx =
      (activeFilteredIndex + delta + filteredProjects.length) %
      filteredProjects.length;
    selectProject(filteredProjects[nextIdx]);
  };

  const handleTabKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (filteredProjects.length <= 1) return;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % filteredProjects.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + filteredProjects.length) % filteredProjects.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = filteredProjects.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      selectProject(filteredProjects[nextIndex]);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(omniboxUrl);
      setCopiedUrl(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedUrl(false), 1800);
    } catch {
      setCopiedUrl(false);
    }
  };

  const secondaryRepoLabel = active.secondaryRepoUrl
    ? active.externalLinks?.find((ext) => ext.url === active.secondaryRepoUrl)
        ?.label ?? "Secondary Repo"
    : null;

  const extraLinks = (active.externalLinks ?? []).filter(
    (ext) => ext.url !== active.repoUrl && ext.url !== active.secondaryRepoUrl
  );

  return (
    <section
      className="brutal-card overflow-hidden bg-[#090b10]"
      aria-label="Interactive mini Chrome browser project viewer"
    >
      {/* Top Window Chrome & Category Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#090b10] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2dd4bf]" />
          </div>
          <div>
            <p className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Mini Browser Preview // {projects.length} Flagship Systems
            </p>
            <h2 className="font-mono-tech text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              Interactive Chrome Project Sandbox
            </h2>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter browser tabs by category"
        >
          {FILTER_META.filter((f) => filterCounts[f.key] > 0).map((f) => {
            const isCurrent = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={isCurrent}
                onClick={() => handleFilterChange(f.key)}
                className={`font-mono-tech cursor-pointer border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
                  isCurrent
                    ? "border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf]"
                    : "border-slate-700 bg-[#0d1017] text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {f.label}{" "}
                <span className="opacity-70">({filterCounts[f.key]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single-Row Scrollable Chrome Tab Strip */}
      <div className="border-b border-slate-800 bg-[#07090e] px-2 pt-2 sm:px-4">
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Project browser tabs"
          className="chrome-tab-strip no-scrollbar gap-1"
        >
          {filteredProjects.map((project, index) => {
            const isSelected = project.id === active.id;
            const globalIndex = projects.findIndex((p) => p.id === project.id);
            const tabAccent = ACCENT_MAP[project.accent];

            return (
              <button
                key={project.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                id={`chrome-tab-${project.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                style={{ "--tab-accent": tabAccent.hex } as CSSProperties}
                onClick={() => selectProject(project)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`chrome-tab font-mono-tech flex max-w-[210px] cursor-pointer items-center gap-2 rounded-t-md border border-b-0 px-3 py-2 text-[11px] font-semibold transition-colors ${
                  isSelected
                    ? "border-slate-700 bg-[#141923] text-white"
                    : "border-transparent bg-[#0c1018] text-slate-400 hover:border-slate-800 hover:bg-[#111622] hover:text-slate-200"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${tabAccent.dot}`}
                  aria-hidden="true"
                />
                <span className="text-[10px] text-slate-400">
                  {String(globalIndex + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{project.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chrome Navigation + Omnibox Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-2 border-slate-800 bg-[#141923] px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => stepTab(-1)}
            aria-label="Previous project tab"
            className="grid h-7 w-7 cursor-pointer place-items-center border border-slate-700 bg-[#0d1017] text-slate-300 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => stepTab(1)}
            aria-label="Next project tab"
            className="grid h-7 w-7 cursor-pointer place-items-center border border-slate-700 bg-[#0d1017] text-slate-300 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setReloadTick((t) => t + 1)}
            aria-label="Reload viewport preview"
            className="grid h-7 w-7 cursor-pointer place-items-center border border-slate-700 bg-[#0d1017] text-slate-300 transition hover:border-[#facc15] hover:text-[#facc15]"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Omnibox URL Bar */}
        <div className="flex min-w-[220px] flex-1 items-center gap-2 border border-slate-700 bg-[#090b10] px-2.5 py-1">
          <Lock
            className="h-3 w-3 shrink-0 text-[#2dd4bf]"
            aria-hidden="true"
          />
          <span className="font-mono-tech min-w-0 flex-1 truncate text-[11px] text-slate-300">
            {omniboxUrl}
          </span>
          <button
            type="button"
            onClick={() => void handleCopyUrl()}
            aria-label="Copy project URL"
            className="font-mono-tech inline-flex shrink-0 cursor-pointer items-center gap-1 border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-300 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
          >
            {copiedUrl ? (
              <>
                <Check className="h-2.5 w-2.5 text-[#2dd4bf]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-2.5 w-2.5" />
                Copy
              </>
            )}
          </button>
          <a
            href={omniboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${active.name} URL in new browser tab`}
            className="grid h-5 w-5 shrink-0 place-items-center text-slate-400 transition hover:text-[#facc15]"
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>

        {/* Viewport View Mode Controls */}
        <div
          role="group"
          aria-label="Browser viewport mode"
          className="flex flex-wrap items-center gap-1"
        >
          <button
            type="button"
            aria-pressed={effectiveMode === "preview"}
            onClick={() => setViewportMode("preview")}
            className={`font-mono-tech inline-flex cursor-pointer items-center gap-1 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              effectiveMode === "preview"
                ? "border-[#2dd4bf] bg-[#2dd4bf] text-[#0d1017]"
                : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500"
            }`}
          >
            <Monitor className="h-3 w-3" aria-hidden="true" />
            Preview
          </button>
          <button
            type="button"
            aria-pressed={effectiveMode === "architecture"}
            onClick={() => setViewportMode("architecture")}
            className={`font-mono-tech inline-flex cursor-pointer items-center gap-1 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              effectiveMode === "architecture"
                ? "border-[#facc15] bg-[#facc15] text-[#0d1017]"
                : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500"
            }`}
          >
            <Layers className="h-3 w-3" aria-hidden="true" />
            Architecture
          </button>
          {active.liveUrl ? (
            <button
              type="button"
              aria-pressed={effectiveMode === "live"}
              onClick={() => setViewportMode("live")}
              className={`font-mono-tech inline-flex cursor-pointer items-center gap-1 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                effectiveMode === "live"
                  ? "border-[#fb7185] bg-[#fb7185] text-[#0d1017]"
                  : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500"
              }`}
            >
              <Globe className="h-3 w-3" aria-hidden="true" />
              Live Frame
            </button>
          ) : null}
        </div>
      </div>

      {/* Browser Viewport Canvas (TabPanel) */}
      <div
        key={`${active.id}-${effectiveMode}-${reloadTick}`}
        id="chrome-browser-viewport"
        role="tabpanel"
        aria-labelledby={`chrome-tab-${active.id}`}
        className="animate-brutal-enter bg-[#0a0d14] p-4 sm:p-6 md:p-7"
      >
        {effectiveMode === "live" && active.liveUrl ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border border-slate-700 bg-[#141923] px-3 py-2">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-300">
                Live Embedded Frame // {active.liveUrl}
              </span>
              <a
                href={active.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-tech inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#2dd4bf] hover:underline"
              >
                Open Full Tab
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
            <div className="h-[460px] w-full overflow-hidden border-2 border-slate-700 bg-[#0d1017]">
              <iframe
                src={active.liveUrl}
                title={`${active.name} live preview`}
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        ) : effectiveMode === "architecture" ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <p
                  className={`font-mono-tech text-[10px] font-bold uppercase tracking-[0.18em] ${style.text}`}
                >
                  {active.name} // System Topology &amp; Constraints
                </p>
                <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">
                  {active.tagline}
                </h3>
              </div>
              <Link
                href={`/projects/${active.id}`}
                className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#facc15] px-3 py-1.5 text-[11px] font-bold uppercase text-[#0d1017]"
              >
                Full Case Study
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <SystemDiagram
              nodes={active.diagramNodes}
              edges={active.diagramEdges}
              accent={active.accent}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="border-2 border-slate-800 bg-[#141923] p-4">
                <p className="font-mono-tech mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fb7185]">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  Problem &amp; Constraints
                </p>
                <p className="text-sm leading-relaxed text-slate-200">
                  {active.problem}
                </p>
                <ul className="mt-3 space-y-1.5 border-t border-slate-800 pt-3 text-xs text-slate-300">
                  {active.constraints.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span className="font-mono-tech font-bold text-[#fb7185]">
                        !
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-slate-800 bg-[#141923] p-4">
                <p className="font-mono-tech mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#facc15]">
                  Key Engineering Decisions
                </p>
                <ul className="space-y-2.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  {active.decisions.map((decision) => (
                    <li key={decision} className="flex gap-2">
                      <span
                        className={`font-mono-tech font-bold ${style.text}`}
                      >
                        &gt;
                      </span>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Simulated Mini Webpage Canvas */}
            <div className="min-w-0 space-y-5 lg:col-span-7">
              <div className="border-2 border-slate-800 bg-[#141923] p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`font-mono-tech border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.chip}`}
                  >
                    {active.category.replace("_", " ")}
                  </span>
                  {active.featured && (
                    <span className="font-mono-tech inline-flex items-center gap-1 border border-[#facc15]/50 bg-[#facc15]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#facc15]">
                      <Star className="h-2.5 w-2.5" aria-hidden="true" />
                      Featured
                    </span>
                  )}
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-300">
                    {active.status}
                  </span>
                  <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-300">
                    {active.language}
                    {active.license ? ` • ${active.license}` : ""}
                  </span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {active.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-200 md:text-base">
                  {active.tagline}
                </p>
                {active.eventOrContext && (
                  <p className="font-mono-tech mt-1.5 text-[11px] text-[#facc15]">
                    {active.eventOrContext}
                  </p>
                )}
                <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                  {active.summary}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {active.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="border-2 border-slate-800 bg-[#141923] p-3"
                  >
                    <dt className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {metric.label}
                    </dt>
                    <dd
                      className={`font-mono-tech mt-1 text-xs font-bold sm:text-sm ${style.text}`}
                    >
                      {metric.value}
                    </dd>
                    <dd className="font-mono-tech mt-0.5 text-[10px] leading-snug text-slate-400">
                      {metric.note}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="border-2 border-slate-800 bg-[#141923] p-4">
                <p className="font-mono-tech mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Execution Pipeline
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {active.dataflow.map((node, idx) => (
                    <div
                      key={`${node}-${idx}`}
                      className="flex max-w-full items-center gap-2"
                    >
                      <span className="font-mono-tech break-words border border-slate-700 bg-[#0d1017] px-2.5 py-1.5 text-xs text-slate-100">
                        <span className={`mr-1.5 text-[10px] ${style.text}`}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {node}
                      </span>
                      {idx < active.dataflow.length - 1 && (
                        <ArrowRight
                          className={`h-4 w-4 shrink-0 ${style.text}`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {active.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono-tech border border-slate-700 bg-[#141923] px-2.5 py-1 text-[11px] text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Browser Pane: Decisions + Launch Actions */}
            <div className="flex flex-col justify-between border-2 border-slate-800 bg-[#141923] p-4 sm:p-5 lg:col-span-5">
              <div>
                <p className="font-mono-tech mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#facc15]">
                  <span className="h-1 w-5 bg-[#facc15]" aria-hidden="true" />
                  Key Engineering Decisions
                </p>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
                  {active.decisions.map((decision) => (
                    <li key={decision} className="flex gap-2.5">
                      <span
                        className={`font-mono-tech mt-0.5 font-bold ${style.text}`}
                      >
                        &gt;
                      </span>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-800 pt-4">
                <Link
                  href={`/projects/${active.id}`}
                  className="brutal-btn brutal-btn-amber font-mono-tech group inline-flex items-center gap-1.5 bg-[#facc15] px-3.5 py-2 text-[11px] font-bold uppercase text-[#0d1017]"
                >
                  Full Case Study
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                {active.liveUrl && (
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#2dd4bf] px-3.5 py-2 text-[11px] font-bold uppercase text-[#0d1017]"
                  >
                    Launch Live{" "}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {active.repoUrl && (
                  <a
                    href={active.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2 text-[11px] font-bold uppercase text-white"
                  >
                    GitHub <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {active.secondaryRepoUrl && secondaryRepoLabel && (
                  <a
                    href={active.secondaryRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2 text-[11px] font-bold uppercase text-slate-200"
                  >
                    {secondaryRepoLabel}{" "}
                    <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {extraLinks.map((ext) => (
                  <a
                    key={ext.url}
                    href={ext.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2 text-[11px] font-bold uppercase text-[#2dd4bf]"
                  >
                    {ext.label}{" "}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
