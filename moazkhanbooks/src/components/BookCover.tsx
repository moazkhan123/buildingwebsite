interface BookCoverProps {
  title: string;
  color: string;
  cover?: string;
  /**
   * Whether the real cover image should be requested yet. Cards far from
   * the active book stay on the lightweight color placeholder instead, so
   * a 17-book carousel doesn't fetch every cover on first render.
   */
  shouldLoad?: boolean;
}

export default function BookCover({ title, color, cover, shouldLoad = true }: BookCoverProps) {
  if (cover && shouldLoad) {
    return (
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm shadow-md ring-1 ring-black/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
        <img
          src={cover}
          alt={`${title} cover`}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-sm p-5 shadow-md ring-1 ring-black/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{
        background: `linear-gradient(155deg, ${color} 0%, color-mix(in srgb, ${color} 60%, black) 100%)`,
      }}
    >
      <div className="h-px w-8 bg-white/40" />
      <p className="font-serif text-lg leading-snug text-white/95 text-balance">
        {title}
      </p>
      <p className="text-xs uppercase tracking-widest text-white/60">
        Moaz Khan
      </p>
    </div>
  );
}
