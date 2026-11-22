"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, Pause, Play, Radar, ShieldAlert } from "lucide-react";

/** Project IDs (matching PROJECTS[].id) that have a lightweight native demo. */
export const DEMO_PROJECT_IDS = [
  "fraudshield",
  "beacon",
  "precision-irrigation-ml",
  "skydetective",
  "nodeforge",
] as const;

export function hasDemo(id: string): boolean {
  return (DEMO_PROJECT_IDS as readonly string[]).includes(id);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function DemoShell({
  title,
  hint,
  badge = "Simulated sample data",
  badgeTone = "amber",
  children,
}: {
  title: string;
  hint: string;
  badge?: string;
  badgeTone?: "amber" | "cyan";
  children: ReactNode;
}) {
  const badgeClasses =
    badgeTone === "cyan"
      ? "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]"
      : "border-[#facc15]/60 bg-[#facc15]/10 text-[#facc15]";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border border-slate-700 bg-[#141923] px-3 py-2">
        <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-200">
          {title}
        </span>
        <span className={`font-mono-tech border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeClasses}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-slate-300">{hint}</p>
      {children}
    </div>
  );
}

/* ------------------------------ FraudShield ------------------------------ */

interface Tx {
  id: string;
  amount: number;
  merchant: string;
  country: string;
  score: number;
}

const MERCHANTS = ["Grocery", "Fuel", "Electronics", "Travel", "Crypto Exchange", "Restaurant", "Online Retail", "Wire Transfer"];
const COUNTRIES = ["MM", "SG", "TH", "JP", "US", "NG", "RU"];

function makeTx(n: number): Tx {
  const rng = mulberry32(n * 7919 + 13);
  const risky = rng() < 0.22;
  return {
    id: `TX-${String(1000 + n)}`,
    amount: Math.round(15 + rng() * (risky ? 9000 : 700)),
    merchant: MERCHANTS[Math.floor(rng() * MERCHANTS.length)],
    country: COUNTRIES[Math.floor(rng() * COUNTRIES.length)],
    score: Math.round((risky ? 70 + rng() * 29 : rng() * 62) * 10) / 10,
  };
}

function FraudDemo() {
  const [running, setRunning] = useState(false);
  const [threshold, setThreshold] = useState(80);
  const [rows, setRows] = useState<Tx[]>(() => [1, 2, 3, 4].map(makeTx).reverse());
  const counter = useRef(5);

  useEffect(() => {
    if (!prefersReducedMotion()) setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const tx = makeTx(counter.current++);
      setRows((prev) => [tx, ...prev].slice(0, 40));
    }, 1100);
    return () => clearInterval(id);
  }, [running]);

  const flagged = rows.filter((r) => r.score >= threshold).length;

  return (
    <DemoShell
      title="FraudShield // Live Transaction Stream"
      hint="A simulated stream scored by a stand-in risk model. Drag the threshold to see how many transactions the analyst queue would receive. (The real platform uses a Keras model behind a FastAPI service.)"
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((p) => !p)}
          className="font-mono-tech inline-flex cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#0d1017] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200 transition hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
        >
          {running ? <Pause className="h-3 w-3" aria-hidden="true" /> : <Play className="h-3 w-3" aria-hidden="true" />}
          {running ? "Pause stream" : "Resume stream"}
        </button>
        <label className="font-mono-tech flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
          Alert threshold
          <input
            type="range"
            min={50}
            max={99}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="accent-[#fb7185]"
            aria-label="Alert threshold"
          />
          <span className="tabular-nums text-[#fb7185]">{threshold}</span>
        </label>
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-300">
          {rows.length} scored • <span className="font-bold text-[#fb7185]">{flagged} flagged</span>
        </span>
      </div>

      <div className="overflow-x-auto border-2 border-slate-800">
        <table className="font-mono-tech w-full min-w-[480px] text-left text-[11px]">
          <caption className="sr-only">Simulated scored transactions</caption>
          <thead className="bg-[#141923] text-[10px] uppercase tracking-wider text-slate-300">
            <tr>
              <th scope="col" className="px-3 py-2">Tx</th>
              <th scope="col" className="px-3 py-2">Amount</th>
              <th scope="col" className="px-3 py-2">Merchant</th>
              <th scope="col" className="px-3 py-2">Geo</th>
              <th scope="col" className="px-3 py-2">Risk</th>
              <th scope="col" className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((r) => {
              const isFlag = r.score >= threshold;
              return (
                <tr key={r.id} className={isFlag ? "bg-[#fb7185]/10" : "bg-[#0d1017]"}>
                  <td className="px-3 py-1.5 text-slate-200">{r.id}</td>
                  <td className="px-3 py-1.5 tabular-nums text-slate-200">${r.amount.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-slate-300">{r.merchant}</td>
                  <td className="px-3 py-1.5 text-slate-300">{r.country}</td>
                  <td className="px-3 py-1.5 tabular-nums text-slate-200">{r.score.toFixed(1)}</td>
                  <td className="px-3 py-1.5">
                    {isFlag ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#fb7185]">
                        <ShieldAlert className="h-3 w-3" aria-hidden="true" /> Review
                      </span>
                    ) : (
                      <span className="text-[#2dd4bf]">Clear</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}

/* -------------------------------- Beacon.ai ------------------------------ */

const BEACON_HAZARDS = [
  { id: "flood", label: "Flood extent (NDWI)", color: "#38bdf8" },
  { id: "burn", label: "Burn scar (SAM)", color: "#fb923c" },
  { id: "quake", label: "Quake zone (USGS)", color: "#fb7185" },
] as const;

type HazardId = (typeof BEACON_HAZARDS)[number]["id"];

const BEACON_ROUTES: { id: string; d: string; minutes: number; blockedBy: HazardId; dest: string }[] = [
  { id: "R1", d: "M40,160 C120,120 200,60 280,30", minutes: 6, blockedBy: "flood", dest: "Shelter A" },
  { id: "R2", d: "M40,160 C120,172 200,182 280,170", minutes: 8, blockedBy: "burn", dest: "Shelter B" },
  { id: "R3", d: "M40,160 L40,40 L280,30", minutes: 11, blockedBy: "quake", dest: "Shelter A" },
];

function BeaconDemo() {
  const [active, setActive] = useState<Record<HazardId, boolean>>({
    flood: true,
    burn: false,
    quake: false,
  });

  const chosen = BEACON_ROUTES.find((r) => !active[r.blockedBy]) ?? null;

  return (
    <DemoShell
      title="Beacon.ai // Evacuation Routing"
      hint="Toggle live hazard layers and the evacuation route re-plans around them. (The real app combines NWS, USGS and NASA FIRMS feeds with OSRM turn-by-turn routing and a GeoAI sidecar.)"
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Hazard layers">
        {BEACON_HAZARDS.map((h) => (
          <button
            key={h.id}
            type="button"
            aria-pressed={active[h.id]}
            onClick={() => setActive((p) => ({ ...p, [h.id]: !p[h.id] }))}
            className={`font-mono-tech cursor-pointer border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              active[h.id]
                ? "border-white bg-[#1b2230] text-white"
                : "border-slate-700 bg-[#0d1017] text-slate-300 hover:border-slate-500"
            }`}
          >
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: h.color }} aria-hidden="true" />
            {h.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <svg
          viewBox="0 0 320 200"
          role="img"
          aria-label={chosen ? `Map showing evacuation route ${chosen.id} to ${chosen.dest}` : "Map showing no safe evacuation route"}
          className="w-full border-2 border-slate-800 bg-[#0d1017]"
        >
          <defs>
            <pattern id="beacon-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="200" fill="url(#beacon-grid)" />
          {active.flood && <ellipse cx="150" cy="95" rx="42" ry="26" fill="#38bdf8" fillOpacity="0.28" stroke="#38bdf8" />}
          {active.burn && <ellipse cx="205" cy="174" rx="32" ry="14" fill="#fb923c" fillOpacity="0.3" stroke="#fb923c" />}
          {active.quake && <circle cx="60" cy="90" r="30" fill="#fb7185" fillOpacity="0.25" stroke="#fb7185" strokeDasharray="4 3" />}
          {BEACON_ROUTES.map((r) => (
            <path key={r.id} d={r.d} fill="none" stroke={chosen?.id === r.id ? "#2dd4bf" : "#334155"} strokeWidth={chosen?.id === r.id ? 3 : 1.5} strokeDasharray={chosen?.id === r.id ? undefined : "4 4"} />
          ))}
          <circle cx="40" cy="160" r="5" fill="#facc15" />
          <text x="46" y="176" fontSize="8" fill="#e2e8f0">You</text>
          <rect x="274" y="24" width="12" height="12" fill="#2dd4bf" />
          <text x="236" y="22" fontSize="8" fill="#e2e8f0">Shelter A</text>
          <rect x="274" y="164" width="12" height="12" fill="#2dd4bf" />
          <text x="236" y="190" fontSize="8" fill="#e2e8f0">Shelter B</text>
        </svg>

        <div className="border-2 border-slate-800 bg-[#141923] p-4" aria-live="polite">
          <p className="font-mono-tech mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2dd4bf]">
            <Radar className="h-3.5 w-3.5" aria-hidden="true" /> Route decision
          </p>
          {chosen ? (
            <>
              <p className="text-lg font-bold text-white">{chosen.id} → {chosen.dest}</p>
              <p className="font-mono-tech mt-1 text-xs text-slate-300">ETA ~{chosen.minutes} min (sample)</p>
            </>
          ) : (
            <p className="text-sm font-bold text-[#fb7185]">No safe route — shelter in place and alert responders.</p>
          )}
        </div>
      </div>
    </DemoShell>
  );
}

/* ---------------------------- Precision Irrigation ----------------------- */

function IrrigationDemo() {
  const [rain, setRain] = useState(2);
  const [et0, setEt0] = useState(5);
  const [moisture, setMoisture] = useState(34);

  const kc = 1.05;
  const etc = et0 * kc;
  const rootZoneMm = 300;
  const reserve = Math.max(0, ((moisture - 25) / 100) * rootZoneMm * 0.1);
  const deficit = etc - rain - reserve;
  const irrigate = Math.max(0, Math.round(deficit * 10) / 10);

  return (
    <DemoShell
      title="Precision Irrigation ML // Counterfactual Explorer"
      hint="An illustrative FAO-56-style daily water balance — change the weather and soil and watch the recommendation flip. (The real study benchmarks Logistic Regression, Random Forest and XGBoost against persistence, threshold and FAO-56 baselines over 1,800 counterfactual scenarios.)"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Rain (mm)", value: rain, set: setRain, min: 0, max: 30 },
          { label: "ET₀ (mm/day)", value: et0, set: setEt0, min: 0, max: 10 },
          { label: "Soil moisture (%)", value: moisture, set: setMoisture, min: 15, max: 60 },
        ].map((s) => (
          <label key={s.label} className="font-mono-tech block border-2 border-slate-800 bg-[#141923] p-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {s.label}
            <span className="float-right tabular-nums text-[#2dd4bf]">{s.value}</span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-2 w-full accent-[#2dd4bf]"
            />
          </label>
        ))}
      </div>

      <div className="border-2 border-slate-800 bg-[#141923] p-4" aria-live="polite">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Recommendation</p>
        <p className={`mt-1 text-2xl font-bold ${irrigate > 0 ? "text-[#facc15]" : "text-[#2dd4bf]"}`}>
          {irrigate > 0 ? `Irrigate ~${irrigate} mm` : "Skip irrigation today"}
        </p>
        <p className="font-mono-tech mt-1 text-[11px] text-slate-300">
          ETc {etc.toFixed(1)} mm − rain {rain} mm − soil reserve {reserve.toFixed(1)} mm = {deficit.toFixed(1)} mm
        </p>
      </div>

      <div>
        <p className="font-mono-tech mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Chronological split (as used in the study)</p>
        <div className="flex h-6 w-full overflow-hidden border border-slate-700 text-[10px] font-bold text-[#0d1017]" role="img" aria-label="60 percent train, 20 percent validation, 20 percent test, with a 24 hour embargo">
          <div className="grid place-items-center bg-[#2dd4bf]" style={{ width: "60%" }}>Train 60%</div>
          <div className="grid place-items-center bg-[#facc15]" style={{ width: "20%" }}>Val 20%</div>
          <div className="grid place-items-center bg-[#fb7185]" style={{ width: "20%" }}>Test 20%</div>
        </div>
        <p className="font-mono-tech mt-1 text-[10px] text-slate-400">24 h embargo between splits to prevent leakage.</p>
      </div>
    </DemoShell>
  );
}

/* ------------------------------- SkyDetective ---------------------------- */

const SPHEREX_EPOCHS = [
  {
    id: "2025-05-03",
    label: "2025-05-03",
    detector: "QR2 D1",
    src: "/spherex-previews/spherex-qr2-d1-2025-05-03.png",
    note: "May 2025 pass (bright upper-right background gradient)",
  },
  {
    id: "2025-11-03",
    label: "2025-11-03",
    detector: "QR2 D1",
    src: "/spherex-previews/spherex-qr2-d1-2025-11-03.png",
    note: "Nov 2025 pass (6-month opposite solar elongation)",
  },
  {
    id: "2026-05-21",
    label: "2026-05-21",
    detector: "QR2 D1",
    src: "/spherex-previews/spherex-qr2-d1-2026-05-21.png",
    note: "May 2026 pass (12-month baseline revisit)",
  },
] as const;

function SkyDetectiveDemo() {
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(1);
  const [wipe, setWipe] = useState(50);
  const [blinking, setBlinking] = useState(false);
  const [blinkShowLeft, setBlinkShowLeft] = useState(true);

  const leftEpoch = SPHEREX_EPOCHS[leftIdx];
  const rightEpoch = SPHEREX_EPOCHS[rightIdx];

  useEffect(() => {
    if (!blinking) return;
    const id = setInterval(() => {
      setBlinkShowLeft((prev) => !prev);
    }, 750);
    return () => clearInterval(id);
  }, [blinking]);

  const effectiveWipe = blinking ? (blinkShowLeft ? 100 : 0) : wipe;

  const exportCsv = () => {
    const rows = [
      "survey,detector,left_epoch,right_epoch,wipe_pct,left_asset,right_asset",
      `SPHEREx_QR2,${leftEpoch.detector},${leftEpoch.id},${rightEpoch.id},${effectiveWipe},${leftEpoch.src},${rightEpoch.src}`,
    ];
    downloadText(
      `skydetective-${leftEpoch.id}-vs-${rightEpoch.id}.csv`,
      rows.join("\n") + "\n",
      "text/csv"
    );
  };

  return (
    <DemoShell
      title="SkyDetective // Real SPHEREx QR2 Epoch Wipe"
      badge="Real SPHEREx QR2 renders"
      badgeTone="cyan"
      hint="Drag the slider or toggle Blink to compare three real SPHEREx QR2 Detector 1 infrared sky passes rendered from FITS imagery (May 2025, Nov 2025, and May 2026). Background stars stay locked while sky-background gradients and epoch transients shift."
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="font-mono-tech flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Left
            <select
              value={leftIdx}
              onChange={(e) => setLeftIdx(Number(e.target.value))}
              aria-label="Left comparison epoch"
              className="border border-slate-700 bg-[#0d1017] px-2 py-1 text-[10px] font-bold text-[#2dd4bf]"
            >
              {SPHEREX_EPOCHS.map((ep, idx) => (
                <option key={ep.id} value={idx}>
                  {ep.detector} • {ep.label}
                </option>
              ))}
            </select>
          </label>
          <label className="font-mono-tech flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Right
            <select
              value={rightIdx}
              onChange={(e) => setRightIdx(Number(e.target.value))}
              aria-label="Right comparison epoch"
              className="border border-slate-700 bg-[#0d1017] px-2 py-1 text-[10px] font-bold text-[#facc15]"
            >
              {SPHEREX_EPOCHS.map((ep, idx) => (
                <option key={ep.id} value={idx}>
                  {ep.detector} • {ep.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          aria-pressed={blinking}
          onClick={() => setBlinking((prev) => !prev)}
          className={`font-mono-tech inline-flex cursor-pointer items-center gap-1.5 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
            blinking
              ? "border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf]"
              : "border-slate-700 bg-[#0d1017] text-slate-200 hover:border-[#2dd4bf] hover:text-[#2dd4bf]"
          }`}
        >
          {blinking ? <Pause className="h-3 w-3" aria-hidden="true" /> : <Play className="h-3 w-3" aria-hidden="true" />}
          {blinking ? "Stop blink" : "Blink epochs"}
        </button>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-slate-800 bg-[#05070c]">
        <img
          src={rightEpoch.src}
          alt={`SPHEREx ${rightEpoch.detector} infrared sky pass on ${rightEpoch.label}`}
          decoding="async"
          className="block h-full w-full select-none object-cover"
        />
        <img
          src={leftEpoch.src}
          alt={`SPHEREx ${leftEpoch.detector} infrared sky pass on ${leftEpoch.label}`}
          decoding="async"
          aria-hidden={effectiveWipe === 0}
          className="absolute inset-0 block h-full w-full select-none object-cover"
          style={{ clipPath: `inset(0 ${100 - effectiveWipe}% 0 0)` }}
        />
        {!blinking && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]"
            style={{ left: `${effectiveWipe}%` }}
          />
        )}
        <span className="font-mono-tech absolute left-2 top-2 border border-[#2dd4bf]/50 bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase text-[#2dd4bf]">
          {leftEpoch.detector} • {leftEpoch.label}
        </span>
        <span className="font-mono-tech absolute right-2 top-2 border border-[#facc15]/50 bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase text-[#facc15]">
          {rightEpoch.detector} • {rightEpoch.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={effectiveWipe}
          onChange={(e) => {
            setBlinking(false);
            setWipe(Number(e.target.value));
          }}
          aria-label={`Wipe between ${leftEpoch.label} and ${rightEpoch.label}`}
          className="min-w-[200px] flex-1 accent-[#2dd4bf]"
        />
        <span className="font-mono-tech text-[10px] tabular-nums text-slate-300">
          {effectiveWipe}%
        </span>
        <button
          type="button"
          onClick={exportCsv}
          className="font-mono-tech inline-flex cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#0d1017] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200 transition hover:border-[#facc15] hover:text-[#facc15]"
        >
          <Download className="h-3 w-3" aria-hidden="true" />
          Export epoch CSV
        </button>
      </div>
    </DemoShell>
  );
}

/* -------------------------------- NodeForge ------------------------------ */

const NODE_STEPS = [
  "Human Input",
  "Query Expansion",
  "Execution & Verification",
  "Output Sanitization",
] as const;

const SAMPLE_CODE = `const apiKey = "sk-live-1234567890abcdef";
function render(html) {
  document.getElementById("out").innerHTML = html;
}
function calc(expr) { return eval(expr); }`;

interface Finding {
  rule: string;
  line: number;
  severity: "high" | "medium";
}

const RULES: { rule: string; test: RegExp; severity: "high" | "medium" }[] = [
  { rule: "Use of eval()", test: /\beval\s*\(/, severity: "high" },
  { rule: "Unsanitized innerHTML sink (XSS)", test: /\.innerHTML\s*=/, severity: "high" },
  { rule: "Hardcoded secret", test: /(api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']+["']/i, severity: "high" },
  { rule: "console.log left in code", test: /console\.log\s*\(/, severity: "medium" },
];

function scan(code: string): Finding[] {
  const out: Finding[] = [];
  code.split("\n").forEach((text, i) => {
    for (const r of RULES) {
      if (r.test.test(text)) out.push({ rule: r.rule, line: i + 1, severity: r.severity });
    }
  });
  return out;
}

function sanitize(code: string): string {
  return code.replace(/(["'])(sk-[\w-]+|[A-Za-z0-9_-]{16,})\1/g, '"[REDACTED]"');
}

function NodeForgeDemo() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDone(false);
    setFindings([]);
    const gap = prefersReducedMotion() ? 0 : 450;
    NODE_STEPS.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setStep(i);
          if (i === 2) setFindings(scan(code));
          if (i === NODE_STEPS.length - 1) setDone(true);
        }, i * gap)
      );
    });
  };

  const baseline = findings.filter((f) => f.rule === "Use of eval()").length;
  const redacted = sanitize(code);

  const exportJson = () => {
    downloadText("nodeforge-findings.json", JSON.stringify({ findings }, null, 2) + "\n", "application/json");
  };

  const exportSarif = () => {
    const sarif = {
      version: "2.1.0",
      $schema: "https://json.schemastore.org/sarif-2.1.0.json",
      runs: [
        {
          tool: { driver: { name: "NodeForge demo", rules: RULES.map((r) => ({ id: r.rule, name: r.rule })) } },
          results: findings.map((f) => ({
            ruleId: f.rule,
            level: f.severity === "high" ? "error" : "warning",
            message: { text: f.rule },
            locations: [{ physicalLocation: { artifactLocation: { uri: "input.js" }, region: { startLine: f.line } } }],
          })),
        },
      ],
    };
    downloadText("nodeforge-findings.sarif", JSON.stringify(sarif, null, 2) + "\n", "application/json");
  };

  return (
    <DemoShell
      title="NodeForge.ai // 4-Node Review Pipeline"
      hint="Paste code and run it through four inspectable nodes. This demo uses simple rule matching instead of an LLM, so it runs entirely in your browser. (The real tool orchestrates models via OpenRouter and Featherless.)"
    >
      <label className="block">
        <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-slate-300">Code to review</span>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          spellCheck={false}
          className="font-mono-tech mt-1 w-full border-2 border-slate-700 bg-[#0d1017] p-3 text-[11px] text-slate-100"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          className="brutal-btn brutal-btn-cyan font-mono-tech inline-flex cursor-pointer items-center gap-1.5 bg-[#2dd4bf] px-3 py-1.5 text-[11px] font-bold uppercase text-[#0d1017]"
        >
          <Play className="h-3 w-3" aria-hidden="true" /> Run pipeline
        </button>
        {done && (
          <>
            <button type="button" onClick={exportJson} className="font-mono-tech cursor-pointer border border-slate-700 bg-[#0d1017] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-200 hover:border-[#facc15] hover:text-[#facc15]">
              Export JSON
            </button>
            <button type="button" onClick={exportSarif} className="font-mono-tech cursor-pointer border border-slate-700 bg-[#0d1017] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-200 hover:border-[#facc15] hover:text-[#facc15]">
              Export SARIF
            </button>
          </>
        )}
      </div>

      <ol className="grid gap-2 sm:grid-cols-4" aria-label="Pipeline nodes">
        {NODE_STEPS.map((name, i) => {
          const reached = step >= i;
          return (
            <li
              key={name}
              className={`font-mono-tech border-2 p-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                reached ? "border-[#2dd4bf] bg-[#2dd4bf]/10 text-[#2dd4bf]" : "border-slate-800 bg-[#141923] text-slate-400"
              }`}
            >
              <span className="mr-1.5 opacity-70">{String(i + 1).padStart(2, "0")}</span>
              {name}
            </li>
          );
        })}
      </ol>

      {step >= 2 && (
        <div className="border-2 border-slate-800 bg-[#141923] p-4" aria-live="polite">
          <p className="font-mono-tech mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#facc15]">
            Findings — pipeline {findings.length} vs naive baseline {baseline}
          </p>
          {findings.length === 0 ? (
            <p className="text-sm text-[#2dd4bf]">No issues found.</p>
          ) : (
            <ul className="space-y-1 text-xs text-slate-200">
              {findings.map((f, i) => (
                <li key={`${f.rule}-${f.line}-${i}`} className="flex gap-2">
                  <span className={`font-mono-tech font-bold ${f.severity === "high" ? "text-[#fb7185]" : "text-[#facc15]"}`}>
                    L{f.line}
                  </span>
                  <span>{f.rule}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {done && (
        <div>
          <p className="font-mono-tech mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">Sanitized output</p>
          <pre className="font-mono-tech overflow-x-auto border-2 border-slate-800 bg-[#0d1017] p-3 text-[11px] text-slate-200">{redacted}</pre>
        </div>
      )}
    </DemoShell>
  );
}

export default function ProjectDemo({ projectId }: { projectId: string }) {
  switch (projectId) {
    case "fraudshield":
      return <FraudDemo />;
    case "beacon":
      return <BeaconDemo />;
    case "precision-irrigation-ml":
      return <IrrigationDemo />;
    case "skydetective":
      return <SkyDetectiveDemo />;
    case "nodeforge":
      return <NodeForgeDemo />;
    default:
      return null;
  }
}
