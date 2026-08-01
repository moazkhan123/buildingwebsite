export const SPINE_COLORS = [
  "#8a63d6", "#4a2f7a", "#e0b34d", "#6b46c1", "#5c3a99",
  "#c9a35a", "#7a5cd6", "#3a2b6b", "#8a7228", "#9b6fd4",
  "#4a3b1f", "#2f1f5e", "#b8862b", "#3a3f4a", "#6b1f28",
];

/** Builds a repeating-linear-gradient of varied-width "book spines" for the library motifs. */
export function buildSpineGradient(colors: string[] = SPINE_COLORS, count = 40) {
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
