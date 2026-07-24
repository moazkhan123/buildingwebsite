interface BookCoverProps {
  title: string;
  color: string;
}

export default function BookCover({ title, color }: BookCoverProps) {
  return (
    <div
      className="relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-sm p-5 shadow-md ring-1 ring-black/10 transition-shadow duration-300 group-hover:shadow-xl"
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
