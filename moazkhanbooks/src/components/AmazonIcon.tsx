export default function AmazonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className={className}>
      <path
        d="M3 14c4 4 14 4 18 0"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M19 11l4 3-4 3z" fill="#FF9900" />
    </svg>
  );
}
