import {
  ADDITIONAL_REPOS,
  CREDENTIALS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from "@/data/portfolio";

export const dynamic = "force-static";

export async function GET() {
  const totalCreds = CREDENTIALS.reduce(
    (sum, group) => sum + group.items.length,
    0
  );
  const flagshipRepoCount = PROJECTS.reduce(
    (sum, project) => sum + (project.secondaryRepoUrl ? 2 : 1),
    0
  );

  const lines: string[] = [
    `# ${PROFILE.name} (${PROFILE.handle})`,
    `> ${PROFILE.headline} — ${PROFILE.location}`,
    `> Target Roles: ${PROFILE.targetRoles.join(", ")}`,
    `> Design Preference: ${PROFILE.designPreference}`,
    "",
    PROFILE.summary,
    "",
    "## Contact & Links",
    `- Primary Email: ${PROFILE.links.rawEmail} (${PROFILE.links.email})`,
    `- BibiVersus Email: ${PROFILE.links.bibiversusEmail}`,
    `- GitHub: ${PROFILE.links.github}`,
    `- LinkedIn: ${PROFILE.links.linkedin}`,
    `- CV (PDF): ${PROFILE.links.cvPdf}`,
    `- CV (DOCX): ${PROFILE.links.cvDocx}`,
    `- Status API: /api/status`,
    "",
    "## Spoken Languages",
    ...PROFILE.spokenLanguages.map((lang) => `- ${lang}`),
    "",
    `## Core Skills & Tech Stack (${SKILL_GROUPS.length} Categories)`,
    ...SKILL_GROUPS.map(
      (group) => `- **${group.category}**: ${group.items.join(", ")}`
    ),
    "",
    `## Experience & Active Ventures (${EXPERIENCE.length})`,
    ...EXPERIENCE.flatMap((exp) => [
      `### ${exp.role} — ${exp.organization} (${exp.period}) [${exp.type}]`,
      ...exp.highlights.map((highlight) => `- ${highlight}`),
      `- Stack: ${exp.stack.join(", ")}`,
      ...(exp.link ? [`- Reference Link (${exp.link.label}): ${exp.link.url}`] : []),
      "",
    ]),
    `## Education & Training Programs (${EDUCATION.length})`,
    ...EDUCATION.map(
      (edu) =>
        `- **${edu.program}** — ${edu.institution} (${edu.period}) [${edu.status}]${
          edu.details ? ` — ${edu.details}` : ""
        }`
    ),
    "",
    `## Flagship & Documented Projects (${PROJECTS.length} Entries / ${flagshipRepoCount} Repos)`,
    ...PROJECTS.flatMap((project) => [
      `### ${project.name} (${project.repoName}) [${project.category}${
        project.featured ? " • FEATURED" : ""
      }]`,
      `- Tagline: ${project.tagline}`,
      `- Summary: ${project.summary}`,
      `- Visibility / Language: ${project.visibility} · ${project.language}${
        project.license ? ` · ${project.license}` : ""
      }`,
      ...(project.eventOrContext
        ? [`- Event / Context: ${project.eventOrContext}`]
        : []),
      `- Status: ${project.status}`,
      `- Repository: ${project.repoUrl}`,
      ...(project.secondaryRepoUrl
        ? [`- Secondary Repository: ${project.secondaryRepoUrl}`]
        : []),
      ...(project.externalLinks?.length
        ? project.externalLinks
            .filter(
              (link) =>
                link.url !== project.repoUrl &&
                link.url !== project.secondaryRepoUrl
            )
            .map((link) => `- External Link (${link.label}): ${link.url}`)
        : []),
      `- Case Study Route: /projects/${project.id}`,
      `- Metrics: ${project.metrics
        .map((m) => `${m.label}: ${m.value} (${m.note})`)
        .join(" | ")}`,
      `- Problem: ${project.problem}`,
      `- Stack: ${project.stack.join(", ")}`,
      `- Dataflow: ${project.dataflow.join(" -> ")}`,
      ...project.decisions.map((decision) => `- Decision: ${decision}`),
      "",
    ]),
    `## Additional GitHub Repositories (${ADDITIONAL_REPOS.length} Repos — ${flagshipRepoCount + ADDITIONAL_REPOS.length} Total Portfolio Repos)`,
    ...ADDITIONAL_REPOS.map(
      (repo) =>
        `- **${repo.name}** (${repo.visibility} · ${repo.language}${
          repo.license ? ` · ${repo.license}` : ""
        } · ${repo.updated}): ${repo.summary}${
          repo.repoUrl ? ` — ${repo.repoUrl}` : ""
        }`
    ),
    "",
    `## Verified Credentials & Certificates (${totalCreds} Unique Assets Across ${CREDENTIALS.length} Categories)`,
    ...CREDENTIALS.flatMap((group) => [
      `### ${group.category} (${group.items.length})`,
      ...(group.note
        ? [
            `- Note: ${group.note}${
              group.noteUrl ? ` (${group.noteUrl})` : ""
            }`,
          ]
        : []),
      ...group.items.map((item) => {
        const meta = [
          item.issuer,
          item.date,
          item.type,
          item.role ? `Role: ${item.role}` : null,
          item.credentialId ? `ID: ${item.credentialId}` : null,
          item.signatory ? `Signatory: ${item.signatory}` : null,
          item.verifyUrl ? `Verify: ${item.verifyUrl}` : null,
          item.fileName
            ? `Asset: /certificates/${encodeURIComponent(item.fileName)}`
            : null,
        ]
          .filter(Boolean)
          .join(" | ");
        return `- **${item.title}** (${meta})${item.note ? ` — ${item.note}` : ""}`;
      }),
      "",
    ]),
  ];

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
