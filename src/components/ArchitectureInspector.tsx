"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  Terminal,
} from "lucide-react";
import type { ProjectCategory, ProjectItem } from "@/data/portfolio";

type FilterKey = "ALL" | "FEATURED" | ProjectCategory;

const ACCENT_MAP = {
  cyan: {
    border: "border-[#2dd4bf]",
    bg: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    btn: "brutal-btn-cyan",
    activeShadow: "hover:shadow-[4px_4px_0px_#2dd4bf]",
  },
  amber: {
    border: "border-[#facc15]",
    bg: "bg-[#facc15]",
    text: "text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    btn: "brutal-btn-amber",
    activeShadow: "hover:shadow-[4px_4px_0px_#facc15]",
  },
  coral: {
    border: "border-[#fb7185]",
    bg: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    btn: "brutal-btn-coral",
    activeShadow: "hover:shadow-[4px_4px_0px_#fb7185]",
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  if (!projects || projects.length === 0) {
    return null;
  }

  const active =
    filteredProjects.find((p) => p.id === selectedId) ??
    filteredProjects[0] ??
    projects[0];
  const style = ACCENT_MAP[active.accent];

  const handleFilterChange = (nextFilter: FilterKey) => {
    setFilter(nextFilter);
    const nextList =
      nextFilter === "ALL"
        ? projects
        : nextFilter === "FEATURED"
          ? projects.filter((p) => p.featured)
          : projects.filter((p) => p.category === nextFilter);
    if (nextList.length > 0 && !nextList.some((p) => p.id === selectedId)) {
      setSelectedId(nextList[0].id);
    }
  };

  const handleTabKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (filteredProjects.length <= 1) return;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (index + 1) % filteredProjects.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (index - 1 + filteredProjects.length) % filteredProjects.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = filteredProjects.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const target = filteredProjects[nextIndex];
      setSelectedId(target.id);
      tabRefs.current[nextIndex]?.focus();
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
    <section className="brutal-card p-5 md:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center border-2 border-[#2dd4bf]/70 bg-[#2dd4bf]/10 text-[#2dd4bf]">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Interactive Console // {projects.length} Flagship Builds
            </p>
            <h2 className="font-mono-tech text-sm font-bold uppercase tracking-wider text-slate-100">
              60-Second Architecture Inspector
            </h2>
          </div>
        </div>
        <span className="font-mono-tech border border-slate-600 bg-[#0d1017] px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-300">
          SELECT_SYSTEM //{" "}
          <span className={style.text}>{active.id.toUpperCase()}</span>
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filter systems by category"
        >
          {FILTER_META.filter((f) => filterCounts[f.key] > 0).map((f) => {
            const isCurrent = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={isCurrent}
                onClick={() => handleFilterChange(f.key)}
                className={`font-mono-tech cursor-pointer border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
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
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-400">
          Showing {filteredProjects.length} of {projects.length}
        </span>
      </div>

      <div className="mb-6">
        <p className="font-mono-tech mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
          Select System (swipe or ←/→ arrows)
        </p>
        <div
          role="tablist"
          aria-label="Flagship systems"
          className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
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
                id={`inspector-tab-${project.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="inspector-system-panel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedId(project.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`font-mono-tech shrink-0 cursor-pointer whitespace-nowrap px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                  isSelected
                    ? `border-2 border-white ${tabAccent.bg} text-[#0d1017] shadow-[3px_3px_0px_#000000] hover:-translate-y-0.5 ${tabAccent.activeShadow}`
                    : `brutal-btn ${tabAccent.btn} bg-[#0d1017] text-slate-200 hover:bg-[#1b2230]`
                }`}
              >
                <span
                  className={`mr-1.5 ${
                    isSelected ? "text-[#0d1017]/75" : "opacity-60"
                  }`}
                >
                  {String(globalIndex + 1).padStart(2, "0")}
                </span>
                {project.name}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={active.id}
        id="inspector-system-panel"
        role="tabpanel"
        aria-labelledby={`inspector-tab-${active.id}`}
        className="animate-brutal-enter grid gap-6 lg:grid-cols-12"
      >
        <div className="min-w-0 space-y-5 lg:col-span-7">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`font-mono-tech border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.chip}`}
              >
                {active.category.replace("_", " ")}
              </span>
              {active.featured && (
                <span className="font-mono-tech border border-[#facc15]/50 bg-[#facc15]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#facc15]">
                  Featured
                </span>
              )}
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-400">
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
            <p className="mt-1 text-sm text-slate-300 md:text-base">
              {active.tagline}
            </p>
            {active.eventOrContext && (
              <p className="font-mono-tech mt-1.5 text-[11px] text-slate-400">
                Context: <span className="text-slate-200">{active.eventOrContext}</span>
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {active.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border border-slate-800 bg-[#0d1017] p-2.5"
              >
                <dt className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  {metric.label}
                </dt>
                <dd className={`font-mono-tech mt-1 text-xs font-bold ${style.text}`}>
                  {metric.value}
                </dd>
                <dd className="font-mono-tech mt-0.5 text-[10px] leading-snug text-slate-400">
                  {metric.note}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-2 border-slate-700 bg-[#0d1017] p-3.5 sm:p-4">
            <p className="font-mono-tech mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              System Dataflow
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {active.dataflow.map((node, idx) => (
                <div key={`${node}-${idx}`} className="flex max-w-full items-center gap-2">
                  <span className="font-mono-tech break-words border border-slate-700 bg-[#141923] px-2.5 py-1.5 text-xs text-slate-100">
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

          <div className="flex flex-wrap gap-2">
            {active.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono-tech border border-slate-700 bg-[#1b2230] px-2.5 py-1 text-[11px] text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between border-2 border-slate-700 bg-[#0d1017] p-4 lg:col-span-5">
          <div>
            <p className="font-mono-tech mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#facc15]">
              <span className="h-1 w-5 bg-[#facc15]" aria-hidden="true" />
              Key Engineering Decisions
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
              {active.decisions.map((decision) => (
                <li key={decision} className="flex gap-2.5">
                  <span className={`font-mono-tech mt-0.5 font-bold ${style.text}`}>
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
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#141923] px-3.5 py-2 text-[11px] font-bold uppercase text-white"
              >
                GitHub <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {active.secondaryRepoUrl && secondaryRepoLabel && (
              <a
                href={active.secondaryRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#141923] px-3 py-2 text-[11px] font-bold uppercase text-slate-200"
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
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#141923] px-3 py-2 text-[11px] font-bold uppercase text-[#2dd4bf]"
              >
                {ext.label}{" "}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
