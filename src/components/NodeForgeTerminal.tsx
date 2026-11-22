"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import {
  EDUCATION,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from "@/data/portfolio";

interface LogEntry {
  cmd: string;
  output: string[];
  isLive?: boolean;
}

function buildInspectLines(): string[] {
  const nodeforge = PROJECTS.find((p) => p.id === "nodeforge");
  return [
    `[NodeForge.ai // ${nodeforge?.eventOrContext ?? "ReverieHacks (Aug 2026)"} • ${nodeforge?.license ?? "MIT"}]`,
    "4-Node Agentic Code-Review & Security Pipeline:",
    "  [01] Human Input              -> Scope PR diff, policy targets & review constraints",
    "  [02] Query Expansion          -> Expand checks & codebase context (OpenRouter / Featherless)",
    "  [03] Execution & Verification -> Side-by-side baseline scoring & PR review checks",
    "  [04] Output Sanitization      -> Deterministic findings + SARIF / JSON export + Mermaid",
    "PASS: All 4 inspectable nodes active (export ready: SARIF / JSON)",
  ];
}

function buildWhoamiLines(): string[] {
  const degree = EDUCATION[0];
  return [
    `${PROFILE.name} (@${PROFILE.handle}) — ${PROFILE.role}`,
    `Education: ${degree ? `${degree.program} @ ${degree.institution} (${degree.period})` : "UIT Yangon"}`,
    `Location:  ${PROFILE.location} (${PROFILE.timezone} / ${PROFILE.timezoneLabel})`,
    `Email:     ${PROFILE.links.rawEmail} | ${PROFILE.links.bibiversusEmail}`,
    `Channels:  GitHub ${PROFILE.links.github} | LinkedIn ${PROFILE.links.linkedin}`,
    `Languages: ${PROFILE.spokenLanguages.join(" • ")}`,
  ];
}

function buildSkillLines(): string[] {
  return [
    `[Skill Matrix // ${SKILL_GROUPS.length} Domains]`,
    ...SKILL_GROUPS.map(
      (group) => `• ${group.category}: ${group.items.join(", ")}`
    ),
  ];
}

const HELP_LINES = [
  "Available commands:",
  "  curl /api/status          Fetch live JSON telemetry from Next.js API",
  "  nodeforge inspect         Inspect NodeForge.ai 4-node agentic pipeline",
  "  nodeforge export --sarif  Preview SARIF v2.1.0 security report output",
  "  whoami                    Display verified engineer profile & contacts",
  "  skills                    List all 5 technical skill groups",
  "  help                      Show available commands",
  "  clear                     Reset terminal output",
];

const SARIF_PREVIEW_LINES = [
  "[nodeforge] Exporting Output Sanitization report (SARIF v2.1.0)...",
  '{',
  '  "version": "2.1.0",',
  '  "runs": [{',
  '    "tool": { "driver": { "name": "NodeForge.ai", "informationUri": "https://github.com/DevHuang1/NodeForge.ai" } },',
  '    "properties": { "nodes": ["Human Input", "Query Expansion", "Execution & Verification", "Output Sanitization"], "baselineComparison": true },',
  '    "results": []',
  "  }]",
  "}",
  "PASS: SARIF/JSON artifact verified (0 blocking findings)",
];

const QUICK_BUTTONS = [
  "curl /api/status",
  "nodeforge inspect",
  "whoami",
  "skills",
  "help",
];

function summarizeStatusPayload(data: Record<string, unknown>, status: number, latency: number): string[] {
  const service = typeof data.service === "string" ? data.service : PROFILE.domain;
  const uptime = typeof data.uptimeSeconds === "number" ? `${data.uptimeSeconds}s` : "live";
  const counts = data.counts as Record<string, unknown> | undefined;
  const systemsCount =
    typeof counts?.flagshipProjects === "number"
      ? counts.flagshipProjects
      : Array.isArray(data.systems)
        ? data.systems.length
        : PROJECTS.length;
  const totalRepos =
    typeof counts?.totalRepos === "number" ? `${counts.totalRepos} repos` : "24 repos";
  const certCount =
    typeof counts?.credentials === "number" ? `${counts.credentials} certs` : "verified";
  return [
    `[LIVE] GET /api/status -> HTTP ${status} OK (${latency}ms)`,
    `✓ service=${service} | flagship=${systemsCount} | total=${totalRepos} | credentials=${certCount} | uptime=${uptime}`,
    "PASS: Live endpoint healthy",
  ];
}

export default function NodeForgeTerminal({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<LogEntry[]>(() => [
    {
      cmd: "nodeforge inspect",
      output: buildInspectLines(),
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>(["nodeforge inspect"]);
  const [cmdCursor, setCmdCursor] = useState<number>(-1);

  const outputRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    if (!hasInteractedRef.current) return;
    const node = outputRef.current;
    if (!node) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({
      top: node.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [history, loading]);

  const runLiveStatus = async (cmd: string, summaryOnly: boolean) => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const latency = Math.round(performance.now() - start);
      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok) {
        setHistory((prev) => [
          ...prev,
          { cmd, isLive: true, output: [`ERR: HTTP ${res.status} (${latency}ms)`] },
        ]);
        return;
      }

      if (summaryOnly) {
        setHistory((prev) => [
          ...prev,
          {
            cmd,
            isLive: true,
            output: summarizeStatusPayload(data, res.status, latency),
          },
        ]);
      } else {
        const pretty = JSON.stringify(data, null, 2).split("\n");
        setHistory((prev) => [
          ...prev,
          {
            cmd,
            isLive: true,
            output: [
              `HTTP ${res.status} OK • ${latency}ms • application/json`,
              ...pretty,
            ],
          },
        ]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setHistory((prev) => [
        ...prev,
        {
          cmd,
          isLive: true,
          output: [`ERR: Failed to reach /api/status (${message})`],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runCommand = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd || loading) return;

    hasInteractedRef.current = true;
    setCmdHistory((prev) => [...prev, cmd]);
    setCmdCursor(-1);

    const normalized = cmd.toLowerCase();

    if (normalized === "clear") {
      setHistory([]);
      return;
    }

    if (
      normalized === "curl /api/status" ||
      normalized === `curl ${PROFILE.domain}/api/status` ||
      normalized === "get /api/status"
    ) {
      await runLiveStatus(cmd, false);
      return;
    }

    if (normalized === "nodeforge ping") {
      await runLiveStatus(cmd, true);
      return;
    }

    if (
      normalized === "nodeforge inspect" ||
      normalized === "nodeforge inspect --nodes" ||
      normalized === "nodeforge"
    ) {
      setHistory((prev) => [...prev, { cmd, output: buildInspectLines() }]);
      return;
    }

    if (
      normalized === "nodeforge export --sarif" ||
      normalized === "nodeforge sarif"
    ) {
      setHistory((prev) => [...prev, { cmd, output: SARIF_PREVIEW_LINES }]);
      return;
    }

    if (normalized === "whoami") {
      setHistory((prev) => [...prev, { cmd, output: buildWhoamiLines() }]);
      return;
    }

    if (normalized === "skills") {
      setHistory((prev) => [...prev, { cmd, output: buildSkillLines() }]);
      return;
    }

    if (normalized === "help" || normalized === "?") {
      setHistory((prev) => [...prev, { cmd, output: HELP_LINES }]);
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        cmd,
        output: [
          `Command not found: "${cmd}"`,
          'Type "help", "nodeforge inspect", "curl /api/status", "whoami", or "skills".',
        ],
      },
    ]);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      if (cmdHistory.length === 0) return;
      e.preventDefault();
      const nextCursor =
        cmdCursor === -1 ? cmdHistory.length - 1 : Math.max(0, cmdCursor - 1);
      setCmdCursor(nextCursor);
      setInput(cmdHistory[nextCursor]);
    } else if (e.key === "ArrowDown") {
      if (cmdCursor === -1) return;
      e.preventDefault();
      if (cmdCursor >= cmdHistory.length - 1) {
        setCmdCursor(-1);
        setInput("");
      } else {
        const nextCursor = cmdCursor + 1;
        setCmdCursor(nextCursor);
        setInput(cmdHistory[nextCursor]);
      }
    }
  };

  const promptHost = `${PROFILE.handle.toLowerCase()}@nodeforge`;

  return (
    <div className={`brutal-card bg-[#0d1017] ${compact ? "p-4" : "p-5"}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2dd4bf]" />
          </span>
          <Terminal className="h-4 w-4 text-[#2dd4bf]" aria-hidden="true" />
          <span className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-white">
            NodeForge.ai — Live Console
          </span>
          <span className="font-mono-tech hidden border border-slate-700 bg-[#141923] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-400 sm:inline">
            ReverieHacks &apos;26 • 4-Node Pipeline
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {QUICK_BUTTONS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={loading}
              onClick={() => void runCommand(preset)}
              className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex cursor-pointer items-center gap-1 bg-[#141923] px-2.5 py-1 text-[10px] font-semibold text-[#2dd4bf] disabled:opacity-50"
            >
              <Play className="h-2.5 w-2.5" aria-hidden="true" />
              {preset}
            </button>
          ))}
          <button
            type="button"
            disabled={loading}
            onClick={() => void runCommand("clear")}
            aria-label="Clear terminal output"
            className="font-mono-tech inline-flex cursor-pointer items-center gap-1 border border-slate-700 bg-[#141923] px-2 py-1 text-[10px] font-semibold uppercase text-slate-400 transition hover:border-[#fb7185] hover:text-[#fb7185] disabled:opacity-50"
          >
            <RotateCcw className="h-2.5 w-2.5" aria-hidden="true" />
            clear
          </button>
        </div>
      </div>

      <div
        ref={outputRef}
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
        className={`font-mono-tech space-y-3 overflow-x-auto overflow-y-auto bg-[#07090d] p-3 text-[11px] leading-relaxed sm:p-4 sm:text-xs ${
          compact ? "max-h-60" : "max-h-80"
        }`}
      >
        {history.length === 0 && (
          <p className="text-slate-400">
            Terminal cleared. Click a preset or type &quot;help&quot;.
          </p>
        )}
        {history.map((entry, idx) => (
          <div key={`${entry.cmd}-${idx}`} className="min-w-0 space-y-1">
            <p className="break-words text-[#facc15]">
              <span className="text-[#2dd4bf]">{promptHost}</span>:~$ {entry.cmd}
              {entry.isLive && (
                <span className="ml-2 border border-[#2dd4bf]/50 px-1 py-0.5 text-[9px] uppercase tracking-wider text-[#2dd4bf]">
                  Live
                </span>
              )}
            </p>
            {entry.output.map((line, i) => (
              <p
                key={i}
                className={
                  line.startsWith("PASS") || line.startsWith("HTTP 200")
                    ? "break-words font-bold text-[#2dd4bf]"
                    : line.startsWith("!")
                      ? "break-words text-[#facc15]"
                      : line.startsWith("ERR")
                        ? "break-words text-[#fb7185]"
                        : "whitespace-pre-wrap break-words text-slate-300"
                }
              >
                {line}
              </p>
            ))}
          </div>
        ))}
        {loading && (
          <p className="flex items-center gap-2 text-[#2dd4bf]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Fetching live response from /api/status...
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runCommand(input);
          setInput("");
        }}
        className="mt-3 flex items-stretch gap-2"
      >
        <div className="flex min-w-0 flex-1 items-center border-2 border-slate-700 bg-[#141923] transition focus-within:border-[#2dd4bf]">
          <span className="font-mono-tech shrink-0 px-2.5 text-xs font-bold text-[#2dd4bf] sm:px-3">
            $
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder='Try "curl /api/status", "whoami", "help"...'
            aria-label="Terminal command input"
            className="font-mono-tech min-w-0 w-full bg-transparent py-2 pr-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none sm:pr-3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex shrink-0 cursor-pointer items-center gap-1.5 bg-[#2dd4bf] px-3 py-2 text-xs font-bold uppercase text-[#0d1017] disabled:opacity-50 sm:px-4"
        >
          Run
          <Play className="h-3 w-3" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
