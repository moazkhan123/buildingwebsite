export const SPINE_COLORS = [
  "#b0651f", "#6b1f28", "#d9822b", "#8a3018", "#4a1420",
  "#c9722e", "#7a2a14", "#5a2416", "#e0954a", "#963a1a",
  "#4a1f14", "#6b2f1c", "#d68a3a", "#3a1712", "#8a4a2e",
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
