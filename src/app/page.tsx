import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Cpu,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Trophy,
} from "lucide-react";
import ArchitectureInspector from "@/components/ArchitectureInspector";
import CredentialsSection from "@/components/CredentialsSection";
import MissionTimeline from "@/components/MissionTimeline";
import NodeForgeTerminal from "@/components/NodeForgeTerminal";
import PixelPortrait from "@/components/PixelPortrait";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import SectionHeading from "@/components/SectionHeading";
import SkillMatrix from "@/components/SkillMatrix";
import {
  ADDITIONAL_REPOS,
  AWARD_HIGHLIGHTS,
  CREDENTIALS,
  EDUCATION,
  EXPERIENCE,
  HERO_STATS,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
  TICKER_ITEMS,
} from "@/data/portfolio";

function getAvailableCertificates() {
  try {
    return fs.readdirSync(path.join(process.cwd(), "public", "certificates"));
  } catch {
    return [];
  }
}

function getPortraitSrc(): string | null {
  const candidates = [
    "images/portrait.jpg",
    "images/portrait.jpeg",
    "images/portrait.png",
    "images/portrait.webp",
    "images/IMG_3730.jpeg",
    "portrait.jpg",
    "portrait.jpeg",
    "portrait.png",
    "IMG_3730.jpeg",
  ];

  for (const rel of candidates) {
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) {
      return `/${rel}`;
    }
  }

  // Fallback: pick up any image dropped into public/images/ regardless of filename
  try {
    const imgDir = path.join(process.cwd(), "public", "images");
    const files = fs
      .readdirSync(imgDir)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
    if (files.length > 0) {
      return `/images/${encodeURIComponent(files[0])}`;
    }
  } catch {
    // ignore
  }

  return null;
}

export default function HomePage() {
  const availableFiles = getAvailableCertificates();
  const portraitSrc = getPortraitSrc();
  const phoneHref = `tel:${PROFILE.links.phone.replace(/\s+/g, "")}`;

  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl space-y-14 px-4 py-8 md:px-8 md:py-10"
    >
      <header
        id="top"
        className="brutal-card hero-panel corner-brackets animate-brutal-enter scroll-mt-20 overflow-hidden p-6 md:p-10"
      >
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="#awards"
                className="font-mono-tech inline-flex max-w-full items-center gap-2 border-2 border-[#facc15] bg-[#facc15]/15 px-2.5 py-1 text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#facc15] transition hover:bg-[#facc15] hover:text-[#0d1017]"
              >
                <Trophy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="break-words">
                  NASA Space Apps 2026 Yangon — Youth Scientific Excellence Award
                </span>
              </a>
              <span className="font-mono-tech inline-flex max-w-full items-center gap-2 border-2 border-[#2dd4bf] bg-[#2dd4bf]/10 px-2.5 py-1 text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#2dd4bf]">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2dd4bf] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" />
                </span>
                <span className="break-words">{PROFILE.targetRoles.join(" • ")}</span>
              </span>
              <span className="font-mono-tech inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-300">
                <MapPin
                  className="h-3.5 w-3.5 shrink-0 text-[#facc15]"
                  aria-hidden="true"
                />
                {PROFILE.location} • UIT B.C.Sc. &apos;28
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-7">
              <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:tracking-[0.3em]">
                Portfolio // Mission Control
              </p>
              <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] font-bold text-[#2dd4bf]">
                @{PROFILE.handle}
              </span>
            </div>

            <h1 className="mt-2 break-words text-4xl font-bold tracking-tight text-white uppercase sm:text-6xl md:text-7xl">
              {PROFILE.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="font-mono-tech text-sm font-bold uppercase tracking-wider text-[#facc15] md:text-base">
                {PROFILE.headline}
              </p>
              <span
                className="hidden h-1 w-12 bg-[#facc15] sm:block"
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-200 md:text-base">
              {PROFILE.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono-tech inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Globe className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
                Languages:
              </span>
              {PROFILE.spokenLanguages.map((lang) => (
                <span
                  key={lang}
                  className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-200"
                >
                  {lang}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={PROFILE.links.email}
                className="brutal-btn brutal-btn-amber font-mono-tech group inline-flex max-w-full items-center gap-2 bg-[#facc15] px-3.5 py-2.5 text-xs font-bold uppercase text-[#0d1017] sm:px-4"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="break-all">Email {PROFILE.links.rawEmail}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-2 bg-[#0d1017] px-3.5 py-2.5 text-xs font-bold uppercase text-white"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
              <a
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-2 bg-[#0d1017] px-3.5 py-2.5 text-xs font-bold uppercase text-white"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href={PROFILE.links.cvPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2.5 text-xs font-bold uppercase text-[#2dd4bf]"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                CV PDF
              </a>
              <a
                href={PROFILE.links.cvDocx}
                download="ThuTaSitt_CV.docx"
                className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2.5 text-xs font-bold uppercase text-slate-200"
              >
                <FileText className="h-4 w-4 text-[#facc15]" aria-hidden="true" />
                CV DOCX
              </a>
              <a
                href={PROFILE.links.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2.5 text-xs font-bold uppercase text-slate-200"
              >
                <Send className="h-3.5 w-3.5 text-[#2dd4bf]" aria-hidden="true" />
                {PROFILE.links.telegram}
              </a>
              <a
                href={phoneHref}
                className="brutal-btn brutal-btn-coral font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3.5 py-2.5 text-xs font-bold uppercase text-slate-200"
              >
                <Phone className="h-3.5 w-3.5 text-[#fb7185]" aria-hidden="true" />
                {PROFILE.links.phone}
              </a>
            </div>

            <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-px border-2 border-slate-700 bg-slate-700 sm:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse bg-[#0d1017] p-3"
                >
                  <dt className="font-mono-tech mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {stat.label}
                  </dt>
                  <dd className="font-mono-tech text-lg font-bold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <PixelPortrait
            src={portraitSrc}
            alt={`${PROFILE.name} — black and white low-pixel portrait`}
          />
        </div>
      </header>

      <div
        className="overflow-hidden border-y-2 border-slate-700 bg-[#141923] py-2.5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        aria-hidden="true"
      >
        <div className="animate-ticker font-mono-tech text-[11px] font-bold tracking-[0.18em] text-slate-300">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
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
      <p className="sr-only">Core stack: {TICKER_ITEMS.join(", ")}</p>

      <section id="awards" className="scroll-mt-20 space-y-5">
        <SectionHeading
          index="00"
          title="Awards & International Certificates"
          subtitle="NASA Space Apps Challenge 2026 Yangon Youth Scientific Excellence Award (Myanmar Space Agency) alongside verified international credentials from Stanford/DeepLearning.AI, UNESCO, ASEAN/MCMC, AWS, IBM, Anthropic, ITPEC, WHO, and UNICEF."
          badge="AWARD WINNER • 37 CERTS"
          icon={Trophy}
          accent="amber"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AWARD_HIGHLIGHTS.map((item, idx) => {
            const isTopAward = idx === 0;
            const borderClass =
              item.accent === "amber"
                ? "brutal-card-amber"
                : item.accent === "coral"
                  ? "brutal-card-coral"
                  : "brutal-card-cyan";
            const badgeClass =
              item.accent === "amber"
                ? "border-[#facc15]/70 bg-[#facc15]/15 text-[#facc15]"
                : item.accent === "coral"
                  ? "border-[#fb7185]/70 bg-[#fb7185]/15 text-[#fb7185]"
                  : "border-[#2dd4bf]/70 bg-[#2dd4bf]/15 text-[#2dd4bf]";

            return (
              <article
                key={item.id}
                className={`brutal-card ${borderClass} flex flex-col justify-between p-5 ${
                  isTopAward
                    ? "md:col-span-2 lg:col-span-3 border-[#facc15] bg-gradient-to-r from-[#facc15]/10 via-[#141923] to-[#141923]"
                    : ""
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`font-mono-tech inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${badgeClass}`}
                    >
                      {isTopAward ? (
                        <Trophy className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Award className="h-3 w-3" aria-hidden="true" />
                      )}
                      {item.badge}
                    </span>
                    <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  <h3
                    className={`mt-3 font-bold text-white ${
                      isTopAward ? "text-xl md:text-2xl" : "text-base"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="font-mono-tech mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    {item.issuer}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-200">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                  <a
                    href="#credentials"
                    className="font-mono-tech inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf] transition hover:text-[#facc15]"
                  >
                    Inspect in Credential Vault
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                  {item.verifyUrl ? (
                    <a
                      href={item.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-tech inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#facc15] transition hover:underline"
                    >
                      Verify
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div id="inspector" className="scroll-mt-20">
        <ArchitectureInspector projects={PROJECTS} />
      </div>

      <section id="skills" className="scroll-mt-20 space-y-5">
        <SectionHeading
          index="01"
          title="Technical Capabilities & Stack"
          subtitle="Five engineering domains spanning full-stack web, 3D graphics, multi-agent AI, GeoAI, and cloud DevOps."
          badge="05 GROUPS"
          icon={Layers}
          accent="cyan"
        />
        <SkillMatrix
          groups={SKILL_GROUPS}
          spokenLanguages={PROFILE.spokenLanguages}
          targetRoles={PROFILE.targetRoles}
        />
      </section>

      <section id="experience" className="scroll-mt-20 space-y-5">
        <SectionHeading
          index="02"
          title="Experience & Education"
          subtitle="EdTech founding, student engineering leadership, field research, academic training, and matriculation tutoring."
          badge="04 ROLES • 06 PROGRAMS"
          icon={Briefcase}
          accent="amber"
        />
        <MissionTimeline items={EXPERIENCE} education={EDUCATION} />
      </section>

      <section id="systems" className="scroll-mt-20 space-y-6">
        <SectionHeading
          index="03"
          title="Flagship Systems & GitHub Archive"
          subtitle="All 15 flagship systems (16 repositories) plus 8 curated additional repositories — 24 GitHub builds in full."
          badge="15 FLAGSHIPS • 24 REPOS"
          icon={Cpu}
          accent="cyan"
        />

        <ProjectsShowcase
          projects={PROJECTS}
          additionalRepos={ADDITIONAL_REPOS}
        />

        <NodeForgeTerminal />
      </section>

      <div id="credentials" className="scroll-mt-20">
        <CredentialsSection
          groups={CREDENTIALS}
          availableFiles={availableFiles}
        />
      </div>

      <footer
        id="contact"
        className="brutal-card scroll-mt-20 flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="space-y-3 lg:col-span-7">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.22em] text-[#2dd4bf]">
              Open Channel // Contact &amp; Dossier
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Have a system worth building?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Open for {PROFILE.targetRoles.join(", ")} opportunities. Reach out
              directly or inspect verified CVs, certificates, and machine-readable
              status endpoints.
            </p>

            <div className="grid gap-2.5 pt-2 sm:grid-cols-2">
              <a
                href={PROFILE.links.email}
                className="min-w-0 border border-slate-700 bg-[#0d1017] p-3 transition hover:border-[#facc15]"
              >
                <p className="font-mono-tech text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Primary Email
                </p>
                <p className="font-mono-tech mt-1 break-all text-xs font-bold text-[#facc15]">
                  {PROFILE.links.rawEmail}
                </p>
              </a>

              <a
                href={`mailto:${PROFILE.links.bibiversusEmail}`}
                className="min-w-0 border border-slate-700 bg-[#0d1017] p-3 transition hover:border-[#2dd4bf]"
              >
                <p className="font-mono-tech text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Venture Email
                </p>
                <p className="font-mono-tech mt-1 break-all text-xs font-bold text-[#2dd4bf]">
                  {PROFILE.links.bibiversusEmail}
                </p>
              </a>

              <a
                href={phoneHref}
                className="min-w-0 border border-slate-700 bg-[#0d1017] p-3 transition hover:border-[#fb7185]"
              >
                <p className="font-mono-tech text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Phone / Direct
                </p>
                <p className="font-mono-tech mt-1 text-xs font-bold text-white">
                  {PROFILE.links.phone}
                </p>
              </a>

              <a
                href={PROFILE.links.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 border border-slate-700 bg-[#0d1017] p-3 transition hover:border-[#2dd4bf]"
              >
                <p className="font-mono-tech text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Telegram
                </p>
                <p className="font-mono-tech mt-1 break-all text-xs font-bold text-white">
                  {PROFILE.links.telegram}
                </p>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-2 lg:col-span-5 lg:justify-end">
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-2 text-[11px] font-bold uppercase text-white"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                GitHub
              </a>
              <a
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-2 text-[11px] font-bold uppercase text-white"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href={PROFILE.links.cvPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-2 text-[11px] font-bold uppercase text-[#facc15]"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                CV PDF
              </a>
              <a
                href={PROFILE.links.cvDocx}
                download="ThuTaSitt_CV.docx"
                className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-2 text-[11px] font-bold uppercase text-slate-200"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                CV DOCX
              </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-800 pt-4">
          <p className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-400">
            © {new Date().getFullYear()} {PROFILE.name} • {PROFILE.domain} •{" "}
            {PROFILE.location}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/llms.txt"
              className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:text-[#2dd4bf]"
            >
              /llms.txt
            </Link>
            <Link
              href="/api/status"
              className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:text-[#2dd4bf]"
            >
              /api/status
            </Link>
            <a
              href="#top"
              className="font-mono-tech inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:text-[#2dd4bf]"
            >
              Back to top
              <ArrowUpRight
                className="h-3.5 w-3.5 -rotate-45"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
