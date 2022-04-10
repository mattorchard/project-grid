export const palette = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
] as const;
export type PaletteColor = typeof palette[number];

export const asCssVar = (color: PaletteColor, intensity = 500) =>
  `var(--${color}-${intensity})`;
