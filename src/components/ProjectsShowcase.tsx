"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FolderGit2,
  GitBranch,
  Lock,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  ADDITIONAL_REPOS,
  PROJECTS,
  type AdditionalRepoItem,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/portfolio";

type ProjectFilter = "ALL" | "FEATURED" | ProjectCategory;
type ArchiveVisibilityFilter = "ALL" | "Public" | "Private";

const ACCENTS = {
  cyan: {
    strip: "bg-[#2dd4bf]",
    solid: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    card: "brutal-card-cyan",
    button: "brutal-btn-cyan",
  },
  amber: {
    strip: "bg-[#facc15]",
    solid: "bg-[#facc15]",
    text: "text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    card: "brutal-card-amber",
    button: "brutal-btn-amber",
  },
  coral: {
    strip: "bg-[#fb7185]",
    solid: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    card: "brutal-card-coral",
    button: "brutal-btn-coral",
  },
} as const;

interface ProjectsShowcaseProps {
  projects?: ProjectItem[];
  additionalRepos?: AdditionalRepoItem[];
}

export default function ProjectsShowcase({
  projects = PROJECTS,
  additionalRepos = ADDITIONAL_REPOS,
}: ProjectsShowcaseProps) {
  const [filter, setFilter] = useState<ProjectFilter>("ALL");
  const [projectQuery, setProjectQuery] = useState("");

  const [visibilityFilter, setVisibilityFilter] =
    useState<ArchiveVisibilityFilter>("ALL");
  const [languageFilter, setLanguageFilter] = useState<string>("ALL");
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveExpanded, setArchiveExpanded] = useState(false);

  const filterCounts = useMemo(
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
    const q = projectQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter =
        filter === "ALL"
          ? true
          : filter === "FEATURED"
            ? Boolean(project.featured)
            : project.category === filter;

      if (!matchesFilter) return false;
      if (!q) return true;

      return (
        project.name.toLowerCase().includes(q) ||
        project.repoName.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        (project.eventOrContext?.toLowerCase().includes(q) ?? false) ||
        project.stack.some((tech) => tech.toLowerCase().includes(q))
      );
    });
  }, [projects, filter, projectQuery]);

  const archiveLanguages = useMemo(() => {
    const langs = Array.from(new Set(additionalRepos.map((r) => r.language)));
    return ["ALL", ...langs];
  }, [additionalRepos]);

  const archiveCounts = useMemo(
    () => ({
      ALL: additionalRepos.length,
      Public: additionalRepos.filter((r) => r.visibility === "Public").length,
      Private: additionalRepos.filter((r) => r.visibility === "Private").length,
    }),
    [additionalRepos]
  );

  const filteredArchive = useMemo(() => {
    const q = archiveQuery.trim().toLowerCase();
    return additionalRepos.filter((repo) => {
      if (
        visibilityFilter !== "ALL" &&
        repo.visibility !== visibilityFilter
      ) {
        return false;
      }
      if (languageFilter !== "ALL" && repo.language !== languageFilter) {
        return false;
      }
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.summary.toLowerCase().includes(q) ||
        repo.language.toLowerCase().includes(q) ||
        (repo.note?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [additionalRepos, visibilityFilter, languageFilter, archiveQuery]);

  const hasActiveArchiveFilter =
    visibilityFilter !== "ALL" ||
    languageFilter !== "ALL" ||
    archiveQuery.trim().length > 0;
  const displayedArchive =
    archiveExpanded || hasActiveArchiveFilter
      ? filteredArchive
      : filteredArchive.slice(0, 6);

  const projectTabs: { id: ProjectFilter; label: string; count: number }[] = [
    { id: "ALL", label: "All Systems", count: filterCounts.ALL },
    { id: "FEATURED", label: "Featured", count: filterCounts.FEATURED },
    { id: "FLAGSHIP", label: "Flagship", count: filterCounts.FLAGSHIP },
    { id: "AI_SYSTEMS", label: "AI Systems", count: filterCounts.AI_SYSTEMS },
    { id: "HACKATHON", label: "Hackathons", count: filterCounts.HACKATHON },
    { id: "FULL_STACK", label: "Full-Stack", count: filterCounts.FULL_STACK },
  ];

  return (
    <div className="space-y-8">
      <div className="brutal-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filter flagship systems by category"
        >
          {projectTabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                aria-pressed={active}
                className={`font-mono-tech cursor-pointer border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                  active
                    ? "border-[#2dd4bf] bg-[#2dd4bf] text-[#0d1017]"
                    : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500 hover:text-white"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 border-2 border-slate-700 bg-[#0d1017] px-2.5 py-1.5 lg:w-72">
          <Search
            className="h-3.5 w-3.5 shrink-0 text-[#2dd4bf]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={projectQuery}
            onChange={(e) => setProjectQuery(e.target.value)}
            placeholder="Search projects, stack, events..."
            aria-label="Search flagship systems"
            className="font-mono-tech w-full bg-transparent text-[11px] text-white placeholder:text-slate-400"
          />
          {projectQuery ? (
            <button
              type="button"
              onClick={() => setProjectQuery("")}
              aria-label="Clear project search"
              className="cursor-pointer text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="brutal-card p-8 text-center">
          <p className="font-mono-tech text-xs uppercase tracking-wider text-slate-300">
            No systems matched your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("ALL");
              setProjectQuery("");
            }}
            className="brutal-btn brutal-btn-cyan font-mono-tech mt-3 inline-flex cursor-pointer items-center bg-[#0d1017] px-3 py-1.5 text-[10px] font-bold uppercase text-[#2dd4bf]"
          >
            Show All {projects.length} Systems
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const accent = ACCENTS[project.accent];
            const index = projects.findIndex((p) => p.id === project.id);
            const showSecondaryRepo =
              Boolean(project.secondaryRepoUrl) &&
              !project.externalLinks?.some(
                (link) => link.url === project.secondaryRepoUrl
              );

            return (
              <article
                key={project.id}
                className={`brutal-card ${accent.card} flex flex-col overflow-hidden`}
              >
                <div
                  className={`h-1.5 w-full ${accent.strip}`}
                  aria-hidden="true"
                />

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 md:p-6">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`font-mono-tech text-[10px] font-bold uppercase tracking-[0.16em] ${accent.text}`}
                      >
                        SYS_{String(index + 1).padStart(2, "0")} //{" "}
                        {project.category.replace("_", " ")}
                      </span>
                      {project.featured ? (
                        <span className="font-mono-tech inline-flex items-center gap-1 border border-[#facc15]/60 bg-[#facc15]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#facc15]">
                          <Star className="h-2.5 w-2.5" aria-hidden="true" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <span className="font-mono-tech max-w-full break-words border border-slate-600 bg-[#0d1017] px-2 py-0.5 text-[10px] uppercase text-slate-200">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {project.tagline}
                  </p>
                  {project.eventOrContext ? (
                    <p className="font-mono-tech mt-1.5 text-[10px] uppercase tracking-wider text-[#facc15]">
                      {project.eventOrContext}
                    </p>
                  ) : null}
                  <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                    {project.summary}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-2">
                    {project.metrics.slice(0, 4).map((metric) => (
                      <div
                        key={metric.label}
                        className="min-w-0 border border-slate-800 bg-[#0d1017] p-2.5"
                      >
                        <dt className="font-mono-tech truncate text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {metric.label}
                        </dt>
                        <dd
                          className={`font-mono-tech mt-0.5 break-words text-xs font-bold md:text-sm ${accent.text}`}
                        >
                          {metric.value}
                        </dd>
                        <dd className="font-mono-tech truncate text-[10px] text-slate-400">
                          {metric.note}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 5).map((item) => (
                      <span
                        key={item}
                        className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                    {project.stack.length > 5 ? (
                      <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-300">
                        +{project.stack.length - 5}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t-2 border-slate-800 px-5 py-3.5 md:px-6">
                  <Link
                    href={`/projects/${project.id}`}
                    className={`brutal-btn ${accent.button} font-mono-tech group inline-flex items-center gap-1.5 ${accent.solid} px-3 py-1.5 text-[11px] font-bold uppercase text-[#0d1017]`}
                  >
                    Case Study
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>

                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-1.5 text-[11px] font-bold uppercase text-white"
                  >
                    <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                    GitHub
                  </a>

                  {showSecondaryRepo && project.secondaryRepoUrl ? (
                    <a
                      href={project.secondaryRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-tech inline-flex items-center gap-1 border border-slate-700 bg-[#0d1017] px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-200 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
                    >
                      v1 Repo
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : null}

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-tech inline-flex items-center gap-1 border border-[#2dd4bf]/60 bg-[#2dd4bf]/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#2dd4bf] transition hover:bg-[#2dd4bf] hover:text-[#0d1017]"
                    >
                      Live Demo
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : null}

                  {project.externalLinks?.map((ext) => (
                    <a
                      key={ext.url}
                      href={ext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-tech inline-flex items-center gap-1 border border-slate-700 bg-[#0d1017] px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-200 transition hover:border-[#facc15] hover:text-[#facc15]"
                    >
                      {ext.label}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div id="archive" className="brutal-card scroll-mt-20 p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b-2 border-slate-800 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tech flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#facc15]">
              <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub Archive // 24 Curated Repositories
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Additional Repositories ({additionalRepos.length})
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300 md:text-sm">
              {archiveCounts.Public} public clickable repositories and{" "}
              {archiveCounts.Private} private builds complementing the 16
              flagship repositories above.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["ALL", "Public", "Private"] as const).map((vis) => {
              const active = visibilityFilter === vis;
              return (
                <button
                  key={vis}
                  type="button"
                  onClick={() => setVisibilityFilter(vis)}
                  aria-pressed={active}
                  className={`font-mono-tech cursor-pointer border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    active
                      ? "border-[#facc15] bg-[#facc15] text-[#0d1017]"
                      : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {vis} ({archiveCounts[vis]})
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter archive by language"
          >
            {archiveLanguages.map((lang) => {
              const active = languageFilter === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguageFilter(lang)}
                  aria-pressed={active}
                  className={`font-mono-tech cursor-pointer border px-2 py-0.5 text-[10px] font-semibold uppercase transition ${
                    active
                      ? "border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf]"
                      : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {lang === "ALL" ? "All Languages" : lang}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 border-2 border-slate-700 bg-[#0d1017] px-2.5 py-1.5 md:w-64">
            <Search
              className="h-3.5 w-3.5 shrink-0 text-[#facc15]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={archiveQuery}
              onChange={(e) => setArchiveQuery(e.target.value)}
              placeholder="Search archive repos..."
              aria-label="Search additional repositories"
              className="font-mono-tech w-full bg-transparent text-[11px] text-white placeholder:text-slate-400"
            />
            {archiveQuery ? (
              <button
                type="button"
                onClick={() => setArchiveQuery("")}
                aria-label="Clear archive search"
                className="cursor-pointer text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {filteredArchive.length === 0 ? (
          <p className="font-mono-tech py-8 text-center text-xs uppercase tracking-wider text-slate-300">
            No additional repositories matched your filter.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {displayedArchive.map((repo) => {
              const isPrivate = repo.visibility === "Private";

              return (
                <article
                  key={repo.id}
                  className="flex flex-col justify-between gap-3 border-2 border-slate-800 bg-[#0d1017] p-4 transition hover:border-slate-600"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      {repo.repoUrl ? (
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-tech group inline-flex items-center gap-1.5 break-all text-xs font-bold text-[#2dd4bf] transition hover:text-[#facc15]"
                        >
                          {repo.name}
                          <ExternalLink
                            className="h-3 w-3 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        <span className="font-mono-tech inline-flex items-center gap-1.5 break-all text-xs font-bold text-slate-200">
                          <Lock
                            className="h-3 w-3 shrink-0 text-[#fb7185]"
                            aria-hidden="true"
                          />
                          {repo.name}
                        </span>
                      )}

                      <span
                        className={`font-mono-tech shrink-0 border px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          isPrivate
                            ? "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]"
                            : "border-[#2dd4bf]/50 bg-[#2dd4bf]/10 text-[#2dd4bf]"
                        }`}
                      >
                        {repo.visibility}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {repo.summary}
                    </p>
                    {repo.note ? (
                      <p className="font-mono-tech mt-1.5 text-[10px] text-[#facc15]">
                        {repo.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="font-mono-tech flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-2.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-slate-200">
                        {repo.language}
                      </span>
                      {repo.license ? (
                        <span className="border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-slate-300">
                          {repo.license}
                        </span>
                      ) : null}
                    </span>
                    <span>{repo.updated}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!hasActiveArchiveFilter && filteredArchive.length > 6 ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setArchiveExpanded((prev) => !prev)}
              aria-expanded={archiveExpanded}
              className="brutal-btn brutal-btn-amber font-mono-tech inline-flex cursor-pointer items-center gap-2 bg-[#0d1017] px-4 py-2 text-[11px] font-bold uppercase text-[#facc15]"
            >
              {archiveExpanded ? (
                <>
                  Collapse Archive
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              ) : (
                <>
                  Expand All {filteredArchive.length} Archive Repos
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
