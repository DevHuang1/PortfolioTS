import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  GitBranch,
  Layers,
  ListChecks,
  ShieldAlert,
  Star,
  Target,
} from "lucide-react";
import NodeForgeTerminal from "@/components/NodeForgeTerminal";
import SystemDiagram from "@/components/SystemDiagram";
import { PROFILE, PROJECTS, type ProjectItem } from "@/data/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    return { title: "System Not Found" };
  }

  const title = `${project.name} — System Case Study`;
  const description = project.summary || project.tagline;

  return {
    title,
    description,
    keywords: [
      project.name,
      project.repoName,
      project.category,
      project.roleSignal,
      ...project.stack,
    ],
    alternates: {
      canonical: `/projects/${project.id}`,
    },
    openGraph: {
      title: `${title} — ${PROFILE.name}`,
      description,
      type: "article",
      url: `/projects/${project.id}`,
      siteName: PROFILE.domain,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${PROFILE.name}`,
      description,
    },
  };
}

const ACCENTS = {
  cyan: {
    strip: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    card: "brutal-card-cyan",
    button: "brutal-btn-cyan",
  },
  amber: {
    strip: "bg-[#facc15]",
    text: "text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    card: "brutal-card-amber",
    button: "brutal-btn-amber",
  },
  coral: {
    strip: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    card: "brutal-card-coral",
    button: "brutal-btn-coral",
  },
} as const;

function PanelHeading({
  index,
  title,
  icon: Icon,
  accent,
}: {
  index: string;
  title: string;
  icon: LucideIcon;
  accent: ProjectItem["accent"];
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center border ${ACCENTS[accent].chip}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Section {index}
        </p>
        <h2 className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  const accent = ACCENTS[project.accent];
  const projectIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const previous =
    PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const paddedIndex = String(projectIndex + 1).padStart(2, "0");
  const paddedTotal = String(PROJECTS.length).padStart(2, "0");
  const showSecondaryRepo =
    Boolean(project.secondaryRepoUrl) &&
    !project.externalLinks?.some(
      (link) => link.url === project.secondaryRepoUrl
    );

  return (
    <main
      id="main-content"
      className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-8 md:py-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/#systems"
          className="brutal-btn brutal-btn-cyan font-mono-tech group inline-flex items-center gap-2 bg-[#141923] px-3.5 py-2 text-[11px] font-bold uppercase text-white"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          All Systems
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
            SYS_{paddedIndex} / {paddedTotal}
          </span>
          <span className="font-mono-tech border border-slate-600 bg-[#141923] px-3 py-1 text-[10px] uppercase tracking-wider text-slate-200">
            {project.status}
          </span>
        </div>
      </div>

      <header
        className={`brutal-card ${accent.card} corner-brackets animate-brutal-enter relative overflow-hidden`}
      >
        <div className={`h-1.5 w-full ${accent.strip}`} aria-hidden="true" />

        <div className="grid gap-8 p-4 sm:p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono-tech border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}
              >
                {project.category.replace("_", " ")}
              </span>
              {project.featured ? (
                <span className="font-mono-tech inline-flex items-center gap-1 border border-[#facc15]/60 bg-[#facc15]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#facc15]">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Featured
                </span>
              ) : null}
              <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] uppercase text-slate-200">
                {project.visibility} • {project.language}
              </span>
              {project.license ? (
                <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] uppercase text-slate-300">
                  {project.license} License
                </span>
              ) : null}
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-slate-300">
                {project.roleSignal}
              </span>
            </div>

            {project.eventOrContext ? (
              <p className="font-mono-tech mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#facc15]">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {project.eventOrContext}
              </p>
            ) : null}

            <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-6xl">
              {project.name}
            </h1>
            <p className="mt-2.5 max-w-2xl text-pretty text-base font-medium leading-relaxed text-slate-200 md:text-lg">
              {project.tagline}
            </p>
            <p className="mt-2.5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-300">
              {project.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2.5 py-1 text-[11px] text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-slate-800 pt-5">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#2dd4bf] px-4 py-2 text-[11px] font-bold uppercase text-[#0d1017]"
                >
                  Launch Live System
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex max-w-full items-center gap-1.5 bg-[#0d1017] px-3.5 py-2 text-[11px] font-bold uppercase text-white sm:px-4"
              >
                <GitBranch className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">GitHub ({project.repoName})</span>
              </a>

              {showSecondaryRepo && project.secondaryRepoUrl ? (
                <a
                  href={project.secondaryRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-4 py-2 text-[11px] font-bold uppercase text-slate-200"
                >
                  <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                  Secondary Repo
                </a>
              ) : null}

              {project.externalLinks?.map((ext) => (
                <a
                  key={ext.url}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-4 py-2 text-[11px] font-bold uppercase text-[#facc15]"
                >
                  {ext.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden shrink-0 text-right lg:block">
            <p className="font-mono-tech text-[9px] uppercase tracking-[0.24em] text-slate-400">
              System ID
            </p>
            <p className={`font-mono-tech text-6xl font-bold ${accent.text}`}>
              {paddedIndex}
            </p>
            <p className="font-mono-tech mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {project.repoName}
            </p>
          </div>
        </div>
      </header>

      <section
        aria-label="System metrics"
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {project.metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`brutal-card ${accent.card} min-w-0 bg-[#141923] p-3.5 sm:p-4`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono-tech truncate text-[9px] font-bold uppercase tracking-[0.1em] text-slate-300">
                {metric.label}
              </p>
              <span className={`font-mono-tech shrink-0 text-[9px] ${accent.text}`}>
                M-{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className={`mt-2 break-words text-lg font-bold sm:text-xl md:text-2xl ${accent.text}`}>
              {metric.value}
            </p>
            <p className="font-mono-tech mt-1 text-[10px] text-slate-300">
              {metric.note}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="brutal-card space-y-4 p-6">
          <PanelHeading
            index="01"
            title="Problem Statement"
            icon={Target}
            accent={project.accent}
          />
          <p className="text-sm leading-relaxed text-slate-200">
            {project.problem}
          </p>
        </div>

        <div className="brutal-card space-y-4 p-6">
          <PanelHeading
            index="02"
            title="System Constraints"
            icon={ShieldAlert}
            accent="coral"
          />
          <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
            {project.constraints.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-mono-tech font-bold text-[#fb7185]">
                  &gt;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="brutal-card space-y-4 p-6">
        <PanelHeading
          index="03"
          title="System Architecture & Dataflow"
          icon={Layers}
          accent={project.accent}
        />
        <SystemDiagram
          nodes={project.diagramNodes}
          edges={project.diagramEdges}
          accent={project.accent}
        />
      </section>

      {project.id === "nodeforge" ? <NodeForgeTerminal /> : null}

      <section className="brutal-card space-y-4 p-6">
        <PanelHeading
          index="04"
          title="Key Engineering Decisions"
          icon={ListChecks}
          accent={project.accent}
        />
        <ul className="space-y-3 text-sm leading-relaxed text-slate-200">
          {project.decisions.map((decision, index) => (
            <li
              key={decision}
              className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
            >
              <span
                className={`font-mono-tech text-[10px] font-bold ${accent.text}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{decision}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="Case study navigation"
        className="grid gap-4 md:grid-cols-2"
      >
        <Link
          href={`/projects/${previous.id}`}
          className="brutal-card brutal-card-cyan group flex flex-col gap-1.5 p-5"
        >
          <span className="font-mono-tech inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Previous System
          </span>
          <span className="text-lg font-bold text-white transition-colors group-hover:text-[#2dd4bf]">
            {previous.name}
          </span>
          <span className="text-xs text-slate-300">{previous.tagline}</span>
        </Link>

        <Link
          href={`/projects/${next.id}`}
          className="brutal-card brutal-card-cyan group flex flex-col items-start gap-1.5 p-5 md:items-end md:text-right"
        >
          <span className="font-mono-tech inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Next System
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
          <span className="text-lg font-bold text-white transition-colors group-hover:text-[#2dd4bf]">
            {next.name}
          </span>
          <span className="text-xs text-slate-300">{next.tagline}</span>
        </Link>
      </nav>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-800 pt-6">
        <p className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-400">
          {PROFILE.domain} // {PROFILE.name} // System Case Study
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/llms.txt"
            className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:text-[#2dd4bf]"
          >
            /llms.txt
          </Link>
          <Link
            href="/"
            className="font-mono-tech inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:text-[#2dd4bf]"
          >
            Return to Mission Control
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
