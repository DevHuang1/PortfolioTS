import { ExternalLink, GraduationCap } from "lucide-react";
import type { EducationItem, ExperienceItem } from "@/data/portfolio";

const ACCENTS = {
  cyan: {
    card: "brutal-card-cyan",
    bg: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    strip: "bg-[#2dd4bf]",
  },
  amber: {
    card: "brutal-card-amber",
    bg: "bg-[#facc15]",
    text: "text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    strip: "bg-[#facc15]",
  },
  coral: {
    card: "brutal-card-coral",
    bg: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    strip: "bg-[#fb7185]",
  },
};

function accentFor(item: ExperienceItem): keyof typeof ACCENTS {
  if (item.accent && ACCENTS[item.accent]) return item.accent;
  if (item.type.includes("Research")) return "coral";
  if (
    item.type.includes("Academic") ||
    item.type.includes("Teaching") ||
    item.type.includes("Real-Time")
  ) {
    return "amber";
  }
  return "cyan";
}

interface MissionTimelineProps {
  items: ExperienceItem[];
  education?: EducationItem[];
}

export default function MissionTimeline({
  items,
  education,
}: MissionTimelineProps) {
  return (
    <div className="space-y-10">
      <div className="relative pl-8 md:pl-10">
        <div
          className="absolute top-2 bottom-2 left-3 w-0.5 bg-gradient-to-b from-[#2dd4bf] via-[#facc15] to-slate-700 md:left-4"
          aria-hidden="true"
        />

        <div className="space-y-6">
          {items.map((exp, index) => {
            const isActive = exp.period.toLowerCase().includes("present");
            const code = `MSN-${String(index + 1).padStart(2, "0")}`;
            const style = ACCENTS[accentFor(exp)];

            return (
              <article key={exp.id} className="relative">
                <div
                  className="absolute -left-[29px] top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#e2e8f0] bg-[#0d1017] md:-left-[33px]"
                  aria-hidden="true"
                >
                  {isActive ? (
                    <>
                      <span
                        className={`absolute inline-flex h-4 w-4 animate-ping rounded-full opacity-60 ${style.bg}`}
                      />
                      <span
                        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${style.bg}`}
                      />
                    </>
                  ) : (
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${style.bg}`}
                    />
                  )}
                </div>

                <div
                  className="absolute -left-[10px] top-[33px] h-0.5 w-3 bg-slate-600"
                  aria-hidden="true"
                />

                <div
                  className={`brutal-card ${style.card} relative min-w-0 overflow-hidden p-4 sm:p-5 md:p-6`}
                >
                  <div
                    className={`absolute inset-y-0 left-0 w-1 ${style.strip}`}
                    aria-hidden="true"
                  />

                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-mono-tech border px-2 py-0.5 text-[10px] font-bold tracking-wider ${style.chip}`}
                      >
                        {code}
                      </span>
                      <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {exp.type}
                      </span>
                    </div>

                    <span
                      className={`font-mono-tech border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        isActive
                          ? "border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf]"
                          : "border-slate-700 bg-[#0d1017] text-slate-300"
                      }`}
                    >
                      {isActive ? (
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#2dd4bf] align-middle" />
                      ) : null}
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <p className="font-mono-tech mt-0.5 text-xs text-[#facc15]">
                    {exp.organization}
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                    {exp.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className={`font-mono-tech font-bold ${style.text}`}>
                          &gt;
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {exp.link && (
                      <a
                        href={exp.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf]"
                      >
                        {exp.link.label}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {education && education.length > 0 && (
        <div
          id="education"
          className="scroll-mt-20 space-y-5 border-t-2 border-slate-800 pt-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center border-2 border-[#2dd4bf]/70 bg-[#2dd4bf]/10 text-[#2dd4bf]">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Academic Track & Training
                </p>
                <h3 className="font-mono-tech text-sm font-bold uppercase tracking-wider text-white">
                  Education & Specialized Programs
                </h3>
              </div>
            </div>
            <span className="font-mono-tech border border-slate-700 bg-[#0d1017] px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-400">
              {education.length} Programs
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {education.map((edu, idx) => {
              const inProgress = edu.status === "In Progress";
              return (
                <article
                  key={edu.id}
                  className={`brutal-card ${
                    inProgress ? "brutal-card-cyan" : "brutal-card-amber"
                  } flex flex-col justify-between p-4`}
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        EDU-{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-mono-tech border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          inProgress
                            ? "border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf]"
                            : "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]"
                        }`}
                      >
                        {inProgress ? (
                          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#2dd4bf] align-middle" />
                        ) : null}
                        {edu.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {edu.program}
                    </h4>
                    <p className="font-mono-tech mt-1 text-[11px] text-[#facc15]">
                      {edu.institution}
                    </p>
                    {edu.details && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {edu.details}
                      </p>
                    )}
                  </div>

                  <p className="font-mono-tech mt-3 border-t border-slate-800 pt-2 text-[10px] uppercase tracking-wider text-slate-400">
                    {edu.period}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
