interface PixelPortraitProps {
  src: string | null;
  alt: string;
}

export default function PixelPortrait({ src, alt }: PixelPortraitProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="animate-float group relative mx-auto flex w-full max-w-[280px] shrink-0 flex-col items-center justify-center lg:mx-0 lg:w-[290px]">
      <div className="brutal-card brutal-card-cyan relative w-full overflow-hidden bg-[#0d1017] p-2.5">
        <div
          aria-hidden="true"
          className="hero-scanbeam pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-transparent via-[#2dd4bf]/15 to-transparent"
        />

        <div className="font-mono-tech mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-[#2dd4bf]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" />
            ID // THUTASITT
          </span>
          <span className="text-[#facc15]">YGN_MMT</span>
        </div>

        <div className="relative overflow-hidden border border-slate-800 bg-[#090b10]">
          <img
            src={src}
            alt={alt}
            fetchPriority="high"
            decoding="async"
            className="pixelated h-auto max-h-[340px] w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </div>
  );
}
