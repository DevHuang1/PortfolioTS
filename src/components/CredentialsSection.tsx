"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Award,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import {
  PROFILE,
  type CredentialGroup,
  type CredentialItem,
} from "@/data/portfolio";

const ACCENTS = {
  cyan: {
    strip: "bg-[#2dd4bf]",
    text: "text-[#2dd4bf]",
    hoverText: "group-hover:text-[#2dd4bf]",
    linkHover: "hover:text-[#2dd4bf]",
    chip: "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    activeTab: "border-[#2dd4bf] bg-[#2dd4bf] text-[#0d1017]",
    card: "brutal-card-cyan",
    btn: "brutal-btn-cyan",
  },
  amber: {
    strip: "bg-[#facc15]",
    text: "text-[#facc15]",
    hoverText: "group-hover:text-[#facc15]",
    linkHover: "hover:text-[#facc15]",
    chip: "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]",
    activeTab: "border-[#facc15] bg-[#facc15] text-[#0d1017]",
    card: "brutal-card-amber",
    btn: "brutal-btn-amber",
  },
  coral: {
    strip: "bg-[#fb7185]",
    text: "text-[#fb7185]",
    hoverText: "group-hover:text-[#fb7185]",
    linkHover: "hover:text-[#fb7185]",
    chip: "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]",
    activeTab: "border-[#fb7185] bg-[#fb7185] text-[#0d1017]",
    card: "brutal-card-coral",
    btn: "brutal-btn-coral",
  },
};

interface SelectedCredential {
  credential: CredentialItem;
  accent: CredentialGroup["accent"];
  hasFile: boolean;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.offsetParent !== null
  );
}

function matchesQuery(item: CredentialItem, query: string): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  const haystack = [
    item.title,
    item.issuer,
    item.date,
    item.year,
    item.type,
    item.role,
    item.credentialId,
    item.signatory,
    item.note,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export default function CredentialsSection({
  groups,
  availableFiles = [],
}: {
  groups: CredentialGroup[];
  availableFiles?: string[];
}) {
  const [selected, setSelected] = useState<SelectedCredential | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [query, setQuery] = useState<string>("");

  const openerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  const availableSet = useMemo(() => new Set(availableFiles), [availableFiles]);
  const totalCount = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups]
  );

  const visibleGroups = useMemo(() => {
    const trimmed = query.trim();
    return groups
      .filter(
        (group) =>
          activeCategory === "ALL" || group.category === activeCategory
      )
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => matchesQuery(item, trimmed)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, activeCategory, query]);

  const filteredCount = useMemo(
    () => visibleGroups.reduce((sum, group) => sum + group.items.length, 0),
    [visibleGroups]
  );

  useEffect(() => {
    if (!selected) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        openerRef.current?.focus();
      }
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelected(null);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusables = getFocusableElements(modalRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !modalRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !modalRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const activeAccent = selected ? ACCENTS[selected.accent] : null;
  const fileName = selected?.hasFile ? selected.credential.fileName : undefined;
  const isImage = fileName?.toLowerCase().endsWith(".png");
  const fileSrc = fileName
    ? `/certificates/${encodeURIComponent(fileName)}`
    : "";
  const isSingleGroupView = visibleGroups.length === 1;

  return (
    <section className="space-y-5">
      <SectionHeading
        index="04"
        title="Awards & International Certificates Vault"
        subtitle={`${totalCount} verified awards and international certificates across NASA Space Apps, Stanford/DeepLearning.AI, UNESCO, ASEAN GeoAI, AWS, IBM, Anthropic, ITPEC, WHO, and UNICEF. Open any entry to inspect proof.`}
        icon={Award}
        accent="amber"
      />

      <div className="brutal-card space-y-4 bg-[#141923] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter credentials by category"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              aria-pressed={activeCategory === "ALL"}
              onClick={() => setActiveCategory("ALL")}
              className={`brutal-btn font-mono-tech cursor-pointer px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                activeCategory === "ALL"
                  ? ACCENTS.amber.activeTab
                  : "bg-[#0d1017] text-slate-200 hover:bg-[#1b2230]"
              }`}
            >
              All ({totalCount})
            </button>

            {groups.map((group) => {
              const isSelected = activeCategory === group.category;
              const style = ACCENTS[group.accent];

              return (
                <button
                  key={group.category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveCategory(group.category)}
                  className={`brutal-btn ${style.btn} font-mono-tech cursor-pointer px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? style.activeTab
                      : "bg-[#0d1017] text-slate-200 hover:bg-[#1b2230]"
                  }`}
                >
                  {group.category} ({group.items.length})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3">
          <div className="flex w-full min-w-0 flex-1 items-center gap-2 border-2 border-slate-700 bg-[#0d1017] px-3 py-1.5 focus-within:border-[#2dd4bf] sm:w-auto sm:min-w-[220px]">
            <Search
              className="h-3.5 w-3.5 shrink-0 text-[#2dd4bf]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search certificate title, issuer, ID, or year..."
              aria-label="Search credentials"
              className="font-mono-tech w-full bg-transparent text-xs text-white placeholder:text-slate-400"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear credential search"
                className="cursor-pointer p-0.5 text-slate-400 transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-slate-300">
            Showing {filteredCount} / {totalCount} verified entries
          </span>
        </div>
      </div>

      {visibleGroups.length === 0 ? (
        <div className="brutal-card flex flex-col items-center justify-center gap-3 bg-[#141923] p-8 text-center">
          <p className="font-mono-tech text-xs font-bold uppercase tracking-wider text-slate-300">
            No credentials matched &ldquo;{query}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("ALL");
              setQuery("");
            }}
            className="brutal-btn brutal-btn-cyan font-mono-tech cursor-pointer bg-[#2dd4bf] px-3.5 py-1.5 text-[10px] font-bold uppercase text-[#0d1017]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-5 ${
            isSingleGroupView ? "grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          {visibleGroups.map((group) => {
            const accent = ACCENTS[group.accent];

            return (
              <div
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
                      className={`font-mono-tech text-[11px] font-bold uppercase tracking-[0.14em] ${accent.text}`}
                    >
                      {group.category}
                    </h3>
                    <span className="font-mono-tech shrink-0 border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] font-bold text-slate-200">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul
                    className={`grid gap-1.5 ${
                      isSingleGroupView ? "md:grid-cols-2 md:gap-2.5" : ""
                    }`}
                  >
                    {group.items.map((cred, index) => {
                      const hasFile = Boolean(
                        cred.fileName && availableSet.has(cred.fileName)
                      );

                      return (
                        <li key={`${group.category}-${cred.title}`}>
                          <button
                            type="button"
                            onClick={(event) => {
                              openerRef.current = event.currentTarget;
                              setSelected({
                                credential: cred,
                                accent: group.accent,
                                hasFile,
                              });
                            }}
                            aria-haspopup="dialog"
                            title={
                              hasFile
                                ? "Inspect certificate proof"
                                : "View credential details"
                            }
                            className="group flex h-full w-full cursor-pointer items-start justify-between gap-2.5 border border-slate-800/80 bg-[#0d1017]/60 p-2.5 text-left transition hover:border-slate-500 hover:bg-[#0d1017]"
                          >
                            <div className="flex min-w-0 gap-2.5">
                              <span
                                className={`font-mono-tech mt-0.5 text-[10px] font-bold ${accent.text}`}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0 space-y-1">
                                <p
                                  className={`text-sm font-semibold leading-snug text-white transition-colors ${accent.hoverText}`}
                                >
                                  {cred.title}
                                </p>
                                <p className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-300">
                                  {cred.issuer}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                  <span className="font-mono-tech border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-300">
                                    {cred.type}
                                  </span>
                                  <span className="font-mono-tech border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-[9px] text-slate-300">
                                    {cred.date}
                                  </span>
                                  {cred.verifyUrl ? (
                                    <span
                                      className={`font-mono-tech border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${accent.chip}`}
                                    >
                                      Verify Link
                                    </span>
                                  ) : null}
                                  {cred.credentialId ? (
                                    <span className="font-mono-tech max-w-full break-all text-[9px] text-slate-400">
                                      ID: {cred.credentialId}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                              <span className="font-mono-tech border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">
                                {cred.year}
                              </span>
                              <Eye
                                className={`h-3.5 w-3.5 text-slate-400 transition ${accent.hoverText}`}
                                aria-hidden="true"
                              />
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {group.note ? (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                      <p className="text-xs leading-relaxed text-slate-300">
                        {group.note}
                      </p>
                      {group.noteUrl ? (
                        <a
                          href={group.noteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`font-mono-tech inline-flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${accent.text} transition hover:underline`}
                        >
                          Claim Portal
                          <ExternalLink
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && activeAccent ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2.5 backdrop-blur-sm sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            ref={modalRef}
            className="brutal-card relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden bg-[#141923]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credential-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`h-1.5 w-full shrink-0 ${activeAccent.strip}`}
              aria-hidden="true"
            />

            <div className="flex shrink-0 items-start justify-between gap-3 border-b-2 border-slate-700 p-4 sm:gap-4 sm:p-5">
              <div className="min-w-0 space-y-2">
                <p
                  className={`font-mono-tech flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${activeAccent.text}`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{selected.credential.issuer}</span>
                  <span aria-hidden="true">•</span>
                  <span>{selected.credential.date}</span>
                </p>

                <h3
                  id="credential-title"
                  className="break-words text-base font-bold leading-snug text-white sm:text-lg md:text-xl"
                >
                  {selected.credential.title}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`font-mono-tech border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${activeAccent.chip}`}
                  >
                    {selected.credential.type}
                  </span>
                  {selected.credential.role ? (
                    <span className="font-mono-tech break-words border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-200">
                      Role: {selected.credential.role}
                    </span>
                  ) : null}
                  {selected.credential.credentialId ? (
                    <span className="font-mono-tech break-all border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-200">
                      ID: {selected.credential.credentialId}
                    </span>
                  ) : null}
                  {selected.credential.signatory ? (
                    <span className="font-mono-tech break-words border border-slate-700 bg-[#0d1017] px-2 py-0.5 text-[10px] text-slate-300">
                      Signed: {selected.credential.signatory}
                    </span>
                  ) : null}
                </div>

                {selected.credential.note ? (
                  <p className="text-xs leading-relaxed text-slate-300">
                    {selected.credential.note}
                  </p>
                ) : null}
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelected(null)}
                className="brutal-btn shrink-0 cursor-pointer bg-[#0d1017] p-1.5 text-white"
                aria-label="Close credential viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {fileName ? (
                    <>
                      <a
                        href={fileSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        {isImage ? "Open Image" : "Open PDF"}
                      </a>
                      <a
                        href={fileSrc}
                        download={fileName}
                        className="brutal-btn font-mono-tech inline-flex items-center gap-1.5 bg-[#0d1017] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-200"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        Download
                      </a>
                    </>
                  ) : null}

                  {selected.credential.verifyUrl ? (
                    <a
                      href={selected.credential.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="brutal-btn brutal-btn-amber font-mono-tech inline-flex items-center gap-1.5 bg-[#facc15] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0d1017]"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Verify Credential
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>

                {fileName ? (
                  <span className="font-mono-tech max-w-full break-all text-[10px] text-slate-400">
                    {fileName}
                  </span>
                ) : null}
              </div>

              {fileName ? (
                <div className="space-y-2.5">
                  <div className="h-[min(360px,45vh)] w-full overflow-hidden border-2 border-slate-700 bg-[#0d1017] sm:h-[min(430px,50vh)]">
                    {isImage ? (
                      <img
                        src={fileSrc}
                        alt={selected.credential.title}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={fileSrc}
                        title={selected.credential.title}
                        className="h-full w-full"
                      />
                    )}
                  </div>
                  {!isImage ? (
                    <p className="font-mono-tech text-[10px] leading-relaxed text-slate-400">
                      On mobile browsers that block embedded PDF frames, use{" "}
                      <a
                        href={fileSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#2dd4bf] underline"
                      >
                        Open PDF
                      </a>{" "}
                      or{" "}
                      <a
                        href={fileSrc}
                        download={fileName}
                        className="font-bold text-slate-200 underline"
                      >
                        Download
                      </a>{" "}
                      above.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 bg-[#0d1017] p-10 text-center">
                  <span
                    className={`grid h-12 w-12 place-items-center border-2 ${activeAccent.chip}`}
                  >
                    <FileText className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm font-medium text-white">
                    Certificate verification
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-300">
                    {selected.credential.verifyUrl
                      ? "Use the Verify Credential button above to confirm this credential directly with the issuer."
                      : "Reach out directly for additional verification documentation."}
                  </p>
                  <a
                    href={PROFILE.links.email}
                    className="brutal-btn brutal-btn-amber font-mono-tech mt-4 inline-flex items-center gap-1.5 bg-[#facc15] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0d1017]"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    Contact {PROFILE.links.rawEmail}
                  </a>
                </div>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t-2 border-slate-800 px-5 py-3">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-400">
                Credential Proof //{" "}
                {selected.hasFile ? "Verified Asset" : "External / On Request"}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={`font-mono-tech inline-flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition ${activeAccent.linkHover}`}
              >
                Return to credentials
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
