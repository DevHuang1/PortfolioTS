import type { LucideIcon } from "lucide-react";

const ACCENTS = {
  cyan: {
    icon: "border-[#2dd4bf]/70 bg-[#2dd4bf]/10 text-[#2dd4bf]",
    bar: "bg-[#2dd4bf]",
    badge: "border-[#2dd4bf]/50 bg-[#2dd4bf]/10 text-[#2dd4bf]",
  },
  amber: {
    icon: "border-[#facc15]/70 bg-[#facc15]/10 text-[#facc15]",
    bar: "bg-[#facc15]",
    badge: "border-[#facc15]/50 bg-[#facc15]/10 text-[#facc15]",
  },
  coral: {
    icon: "border-[#fb7185]/70 bg-[#fb7185]/10 text-[#fb7185]",
    bar: "bg-[#fb7185]",
    badge: "border-[#fb7185]/50 bg-[#fb7185]/10 text-[#fb7185]",
  },
} as const;

interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon: LucideIcon;
  accent?: "cyan" | "amber" | "coral";
}

export default function SectionHeading({
  index,
  title,
  subtitle,
  badge,
  icon: Icon,
  accent = "cyan",
}: SectionHeadingProps) {
  const style = ACCENTS[accent];

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center border-2 ${style.icon}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono-tech flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
              Sector {index}
              <span
                className={`inline-block h-0.5 w-7 ${style.bar}`}
                aria-hidden="true"
              />
            </p>
            {badge ? (
              <span
                className={`font-mono-tech border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
              >
                {badge}
              </span>
            ) : null}
          </div>
          <h2 className="font-mono-tech mt-0.5 text-lg font-bold uppercase tracking-wider text-white md:text-xl">
            {title}
          </h2>
        </div>
      </div>
      {subtitle ? (
        <p className="max-w-md text-xs leading-relaxed text-slate-300 md:text-sm">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
