"use client";

import { useMemo, useState } from "react";
import { Compass, Globe, Search, Sparkles, X } from "lucide-react";
import {
  PROFILE,
  SKILL_GROUPS,
  type SkillGroup,
} from "@/data/portfolio";

const ACCENTS = {
  cyan: {
    strip: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    pillActive: "bg-[#2dd4bf] text-[#0d1017] border-[#2dd4bf]",
    card: "brutal-card-cyan",
  },
  amber: {
    strip: "bg-[#facc15]",
    text: "text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    pillActive: "bg-[#facc15] text-[#0d1017] border-[#facc15]",
    card: "brutal-card-amber",
  },
  coral: {
    strip: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    pillActive: "bg-[#fb7185] text-[#0d1017] border-[#fb7185]",
    card: "brutal-card-coral",
  },
} as const;

interface SkillMatrixProps {
  groups?: SkillGroup[];
  spokenLanguages?: string[];
  targetRoles?: string[];
}

export default function SkillMatrix({
  groups = SKILL_GROUPS,
  spokenLanguages = PROFILE.spokenLanguages,
  targetRoles = PROFILE.targetRoles,
}: SkillMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const totalSkills = useMemo(
    () => groups.reduce((acc, g) => acc + g.items.length, 0),
    [groups]
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    return groups
      .filter(
        (group) =>
          selectedCategory === "ALL" || group.category === selectedCategory
      )
      .map((group) => {
        if (!normalizedQuery) return group;
        const categoryMatches = group.category
          .toLowerCase()
          .includes(normalizedQuery);
        const matchingItems = categoryMatches
          ? group.items
          : group.items.filter((item) =>
              item.toLowerCase().includes(normalizedQuery)
            );
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, selectedCategory, normalizedQuery]);

  const { visibleRoles, visibleLanguages, showMetaCard } = useMemo(() => {
    if (selectedCategory !== "ALL") {
      return { visibleRoles: [], visibleLanguages: [], showMetaCard: false };
    }
    if (!normalizedQuery) {
      return {
        visibleRoles: targetRoles,
        visibleLanguages: spokenLanguages,
        showMetaCard: true,
      };
    }
    const metaTitleMatches = "target roles & spoken languages".includes(
      normalizedQuery
    );
    if (metaTitleMatches) {
      return {
        visibleRoles: targetRoles,
        visibleLanguages: spokenLanguages,
        showMetaCard: true,
      };
    }
    const roles = targetRoles.filter((role) =>
      role.toLowerCase().includes(normalizedQuery)
    );
    const langs = spokenLanguages.filter((lang) =>
      lang.toLowerCase().includes(normalizedQuery)
    );
    return {
      visibleRoles: roles,
      visibleLanguages: langs,
      showMetaCard: roles.length > 0 || langs.length > 0,
    };
  }, [selectedCategory, normalizedQuery, targetRoles, spokenLanguages]);

  return (
    <div className="space-y-5">
      <div className="brutal-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filter skill categories"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            aria-pressed={selectedCategory === "ALL"}
            className={`font-mono-tech cursor-pointer border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              selectedCategory === "ALL"
                ? "border-[#2dd4bf] bg-[#2dd4bf] text-[#0d1017]"
                : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500 hover:text-white"
            }`}
          >
            All ({totalSkills})
          </button>
          {groups.map((group) => {
            const isSelected = selectedCategory === group.category;
            const accent = ACCENTS[group.accent];

            return (
              <button
                key={group.category}
                type="button"
                onClick={() =>
                  setSelectedCategory(isSelected ? "ALL" : group.category)
                }
                aria-pressed={isSelected}
                className={`font-mono-tech cursor-pointer border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                  isSelected
                    ? accent.pillActive
                    : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500 hover:text-white"
                }`}
              >
                {group.category} ({group.items.length})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 border-2 border-slate-700 bg-[#0d1017] px-2.5 py-1.5 md:w-64">
          <Search
            className="h-3.5 w-3.5 shrink-0 text-[#2dd4bf]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter skill (e.g. Docker, VPS, GeoAI)..."
            aria-label="Filter technical skills"
            className="font-mono-tech w-full bg-transparent text-[11px] text-white placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear skill filter"
              className="cursor-pointer text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filteredGroups.length === 0 && !showMetaCard ? (
        <div className="brutal-card p-8 text-center">
          <p className="font-mono-tech text-xs uppercase tracking-wider text-slate-300">
            No skills matched &quot;{query}&quot; in the selected category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setQuery("");
            }}
            className="brutal-btn brutal-btn-cyan font-mono-tech mt-3 inline-flex cursor-pointer items-center bg-[#0d1017] px-3 py-1.5 text-[10px] font-bold uppercase text-[#2dd4bf]"
          >
            Reset Skill Filters
          </button>
        </div>
      ) : (
        <div className="stagger-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group, index) => {
            const accent = ACCENTS[group.accent];

            return (
              <article
                key={group.category}
                className={`brutal-card ${accent.card} flex flex-col overflow-hidden`}
              >
                <div
                  className={`h-1 w-full ${accent.strip}`}
                  aria-hidden="true"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-slate-800 pb-2.5">
                    <h3
                      className={`font-mono-tech text-[11px] font-bold uppercase tracking-[0.15em] ${accent.text}`}
                    >
                      {String(index + 1).padStart(2, "0")} // {group.category}
                    </h3>
                    <span className="font-mono-tech shrink-0 border border-slate-700 bg-[#0d1017] px-1.5 py-0.5 text-[10px] text-slate-300">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((skill) => {
                      const isMatch =
                        Boolean(normalizedQuery) &&
                        skill.toLowerCase().includes(normalizedQuery);

                      return (
                        <li
                          key={skill}
                          className={`font-mono-tech border px-2.5 py-1 text-[11px] transition ${
                            isMatch
                              ? accent.chip
                              : "border-slate-700 bg-[#0d1017] text-slate-200"
                          }`}
                        >
                          {skill}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            );
          })}

          {showMetaCard ? (
            <article className="brutal-card brutal-card-coral flex flex-col overflow-hidden">
              <div className="h-1 w-full bg-[#fb7185]" aria-hidden="true" />
              <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-slate-800 pb-2.5">
                    <h3 className="font-mono-tech flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#fb7185]">
                      <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                      {String(filteredGroups.length + 1).padStart(2, "0")} //
                      Target Roles &amp; Languages
                    </h3>
                    <span className="font-mono-tech shrink-0 border border-slate-700 bg-[#0d1017] px-1.5 py-0.5 text-[10px] text-slate-300">
                      READY
                    </span>
                  </div>

                  <div className="space-y-4">
                    {visibleRoles.length > 0 ? (
                      <div>
                        <p className="font-mono-tech mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          <Sparkles
                            className="h-3 w-3 text-[#facc15]"
                            aria-hidden="true"
                          />
                          Role Focus
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {visibleRoles.map((role) => {
                            const isMatch =
                              Boolean(normalizedQuery) &&
                              role.toLowerCase().includes(normalizedQuery);

                            return (
                              <li
                                key={role}
                                className={`font-mono-tech border px-2.5 py-1 text-[11px] font-semibold ${
                                  isMatch
                                    ? "border-[#fb7185] bg-[#fb7185]/20 text-white"
                                    : "border-[#fb7185]/50 bg-[#fb7185]/10 text-[#fb7185]"
                                }`}
                              >
                                {role}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}

                    {visibleLanguages.length > 0 ? (
                      <div>
                        <p className="font-mono-tech mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          <Globe
                            className="h-3 w-3 text-[#2dd4bf]"
                            aria-hidden="true"
                          />
                          Spoken Languages
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {visibleLanguages.map((lang) => {
                            const isMatch =
                              Boolean(normalizedQuery) &&
                              lang.toLowerCase().includes(normalizedQuery);

                            return (
                              <li
                                key={lang}
                                className={`font-mono-tech border px-2.5 py-1 text-[11px] ${
                                  isMatch
                                    ? ACCENTS.cyan.chip
                                    : "border-slate-700 bg-[#0d1017] text-slate-200"
                                }`}
                              >
                                {lang}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                <p className="font-mono-tech border-t border-slate-800 pt-3 text-[10px] uppercase tracking-wider text-slate-400">
                  UIT B.C.Sc. (2024–2028) • {PROFILE.location}
                </p>
              </div>
            </article>
          ) : null}
        </div>
      )}
    </div>
  );
}
