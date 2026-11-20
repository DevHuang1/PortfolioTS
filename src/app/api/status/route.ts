import { NextResponse } from "next/server";
import {
  ADDITIONAL_REPOS,
  CREDENTIALS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from "@/data/portfolio";

export const dynamic = "force-dynamic";

function formatYangonTime(now: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: PROFILE.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  } catch {
    return now.toISOString();
  }
}

export async function GET() {
  const now = new Date();
  const flagshipRepoCount = PROJECTS.reduce(
    (sum, project) => sum + (project.secondaryRepoUrl ? 2 : 1),
    0
  );
  const additionalPublicCount = ADDITIONAL_REPOS.filter(
    (repo) => repo.visibility === "Public"
  ).length;
  const additionalPrivateCount = ADDITIONAL_REPOS.filter(
    (repo) => repo.visibility === "Private"
  ).length;
  const totalRepoCount = flagshipRepoCount + ADDITIONAL_REPOS.length;
  const totalCredentials = CREDENTIALS.reduce(
    (sum, group) => sum + group.items.length,
    0
  );
  const totalSkills = SKILL_GROUPS.reduce(
    (sum, group) => sum + group.items.length,
    0
  );

  return NextResponse.json(
    {
      status: "operational",
      service: PROFILE.domain,
      engineer: {
        name: PROFILE.name,
        handle: PROFILE.handle,
        headline: PROFILE.headline,
        role: PROFILE.role,
        targetRoles: PROFILE.targetRoles,
        location: PROFILE.location,
        timezone: PROFILE.timezone,
        timezoneLabel: PROFILE.timezoneLabel,
        yangonTime: formatYangonTime(now),
        education: "University of Information Technology (UIT) — B.C.Sc. (2024–2028)",
        spokenLanguages: PROFILE.spokenLanguages,
      },
      contact: {
        email: PROFILE.links.rawEmail,
        bibiversusEmail: PROFILE.links.bibiversusEmail,
        github: PROFILE.links.github,
        linkedin: PROFILE.links.linkedin,
        telegram: PROFILE.links.telegram,
      },
      activeVentures: EXPERIENCE.filter((item) =>
        item.role.toLowerCase().includes("founder")
      ).map((item) => ({
        id: item.id,
        role: item.role,
        organization: item.organization,
        period: item.period,
      })),
      activeRoles: EXPERIENCE.filter((item) =>
        item.period.toLowerCase().includes("present")
      ).map((item) => ({
        id: item.id,
        role: item.role,
        organization: item.organization,
        period: item.period,
      })),
      timestamp: now.toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      runtime: {
        node: process.version,
        framework: "Next.js 15 (App Router)",
        zeroBaas: true,
        designPreference: PROFILE.designPreference,
      },
      counts: {
        flagshipProjects: PROJECTS.length,
        flagshipRepos: flagshipRepoCount,
        additionalRepos: ADDITIONAL_REPOS.length,
        totalRepos: totalRepoCount,
        publicRepos: flagshipRepoCount + additionalPublicCount,
        privateRepos: additionalPrivateCount,
        credentials: totalCredentials,
        credentialCategories: CREDENTIALS.length,
        experience: EXPERIENCE.length,
        education: EDUCATION.length,
        skillGroups: SKILL_GROUPS.length,
        totalSkills,
      },
      experienceCount: EXPERIENCE.length,
      systems: PROJECTS.map((project) => ({
        id: project.id,
        name: project.name,
        repoName: project.repoName,
        category: project.category,
        tier: project.tier,
        featured: Boolean(project.featured),
        status: project.status,
        language: project.language,
        repoUrl: project.repoUrl,
      })),
      credentialSummary: CREDENTIALS.map((group) => ({
        category: group.category,
        count: group.items.length,
      })),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
