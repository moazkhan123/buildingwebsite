const DEFAULT_COLORS = [
  "#8a6d1f", "#6b1f28", "#1f3350", "#2f4a2b", "#c9a35a",
  "#5a2f4a", "#3a2b6b", "#7a2331", "#1c2b45", "#8a7228",
  "#4a3b1f", "#17213d", "#b8862b", "#3a3f4a", "#6b1f28",
];

/** Builds a repeating-linear-gradient of varied-width "book spines" for the library motifs. */
export function buildSpineGradient(colors: string[] = DEFAULT_COLORS, count = 40) {
  const stops: string[] = [];
  let pos = 0;
  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    const width = 26 + ((i * 13) % 22); // varied spine widths, deterministic
    stops.push(`${color} ${pos}px ${pos + width - 2}px`);
    pos += width;
    stops.push(`rgba(21,15,10,0.35) ${pos - 2}px ${pos}px`); // gutter between spines
  }
  return `repeating-linear-gradient(90deg, ${stops.join(", ")})`;
}
