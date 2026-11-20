interface PixelPortraitProps {
  src: string | null;
  alt: string;
}

export default function PixelPortrait({ src, alt }: PixelPortraitProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[280px] shrink-0 items-center justify-center lg:mx-0 lg:w-[290px]">
      <img
        src={src}
        alt={alt}
        className="pixelated h-auto max-h-[380px] w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
