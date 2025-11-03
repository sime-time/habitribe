export const spacing = {
  0: 0,
  1: 4, // 0.25rem * 16
  2: 8, // 0.5rem * 16
  3: 12, // 0.75rem * 16
  4: 16, // 1rem * 16
  5: 20, // 1.25rem * 16
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  13: 52,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const fontSize = {
  "2xs": 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontWeight = {
  thin: "100",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
