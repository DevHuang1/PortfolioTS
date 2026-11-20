import { PROFILE } from "@/data/portfolio";

const TICKS = Array.from({ length: 24 }, (_, index) => {
  const angle = (index * 15 * Math.PI) / 180;
  const inner = index % 6 === 0 ? 62 : 66;
  const outer = 70;

  return {
    x1: 80 + Math.cos(angle) * inner,
    y1: 80 + Math.sin(angle) * inner,
    x2: 80 + Math.cos(angle) * outer,
    y2: 80 + Math.sin(angle) * outer,
    major: index % 6 === 0,
  };
});

export default function OrbitalRadar() {
  return (
    <div
      className="corner-brackets relative hidden w-60 shrink-0 border-2 border-slate-700 bg-[#0a0d13]/80 p-4 lg:block"
      aria-hidden="true"
    >
      <div className="font-mono-tech flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
        <span>LUNASPIS // TRACK</span>
        <span className="flex items-center gap-1 text-[#2dd4bf]">
          <span className="h-1 w-1 animate-pulse rounded-full bg-[#2dd4bf]" />
          LEO LOCK
        </span>
      </div>

      <svg viewBox="0 0 160 160" className="mx-auto mt-2 h-44 w-44 animate-float">
        {TICKS.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? "#475569" : "#1e293b"}
            strokeWidth={tick.major ? 1.5 : 1}
          />
        ))}

        <circle
          cx="80"
          cy="80"
          r="62"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
        <circle cx="80" cy="80" r="44" fill="none" stroke="#334155" strokeWidth="1" />
        <circle
          cx="80"
          cy="80"
          r="24"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="1"
          opacity="0.45"
        />

        <line x1="80" y1="8" x2="80" y2="152" stroke="#1e293b" strokeWidth="1" />
        <line x1="8" y1="80" x2="152" y2="80" stroke="#1e293b" strokeWidth="1" />

        <g className="origin-center animate-[spin_7s_linear_infinite]">
          <line x1="80" y1="80" x2="80" y2="18" stroke="#2dd4bf" strokeWidth="1.5" />
          <path d="M80,80 L80,18 A62,62 0 0,1 134,49 Z" fill="#2dd4bf" opacity="0.12" />
        </g>

        <g className="origin-center animate-[spin_11s_linear_infinite]">
          <circle cx="80" cy="36" r="3" fill="#facc15" />
          <circle cx="80" cy="36" r="6" fill="none" stroke="#facc15" opacity="0.3" />
        </g>

        <g className="origin-center animate-[spin_16s_linear_infinite_reverse]">
          <circle cx="80" cy="56" r="2" fill="#fb7185" />
        </g>

        <circle cx="80" cy="80" r="4" fill="#2dd4bf" />
        <circle cx="80" cy="80" r="9" fill="none" stroke="#2dd4bf" opacity="0.35" />
      </svg>

      <div className="font-mono-tech mt-1 grid grid-cols-3 gap-1 text-center text-[8px] uppercase tracking-[0.08em] text-slate-400">
        <div className="border border-slate-800 bg-[#0d1017] px-1 py-1">
          <p className="text-slate-400">Alt</p>
          <p className="font-bold text-slate-200">408km</p>
        </div>
        <div className="border border-slate-800 bg-[#0d1017] px-1 py-1">
          <p className="text-slate-400">Inc</p>
          <p className="font-bold text-slate-200">51.6°</p>
        </div>
        <div className="border border-slate-800 bg-[#0d1017] px-1 py-1">
          <p className="text-slate-400">Vel</p>
          <p className="font-bold text-slate-200">7.66km/s</p>
        </div>
      </div>

      <div className="font-mono-tech mt-2 space-y-1 border-t border-slate-800 pt-2 text-[9px] uppercase tracking-[0.12em]">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">TRK // LEO-ISS</span>
          <span className="flex items-end gap-0.5">
            <span className="h-1 w-1 bg-[#2dd4bf]/40" />
            <span className="h-2 w-1 bg-[#2dd4bf]/60" />
            <span className="h-3 w-1 bg-[#2dd4bf]" />
            <span className="h-1.5 w-1 bg-[#2dd4bf]/50" />
          </span>
        </div>
        <div className="flex items-center justify-between text-[8px] text-slate-400">
          <span>YGN 16.84°N</span>
          <span className="truncate text-right text-slate-400">
            {PROFILE.location}
          </span>
        </div>
      </div>
    </div>
  );
}
