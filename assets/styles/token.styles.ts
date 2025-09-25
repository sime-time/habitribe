const baseFontSize = 18;

// to simulate css rem values
export function rem(value: number) {
  return value * baseFontSize;
}

export const spacing = {
  xs2: rem(0.25),
  xs: rem(0.5),
  sm: rem(0.75),
  md: rem(1),
  lg: rem(1.5),
  xl: rem(2),
  xl2: rem(2.5),
  xl3: rem(3),
} as const;

export const text = {
  xs: rem(0.75),
  sm: rem(0.875),
  base: rem(1),
  lg: rem(1.125),
  xl: rem(1.25),
  xl2: rem(1.5),
  xl3: rem(1.875),
  xl4: rem(2.25),
  xl5: rem(3),
} as const;

export const typography = {
  title: {
    fontFamily: "Archivo",
    fontSize: text.xl3,
    fontWeight: "700" as "700",
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: "Inter",
    fontSize: text.xl2,
    fontWeight: "500" as "500",
  },
  body: {
    fontFamily: "Inter",
    fontSize: baseFontSize,
    fontWeight: "500" as "500",
  },
  muted: {
    fontFamily: "Inter",
    fontSize: text.sm,
  },
};

export const border = {
  width: 2,
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,
  radiusXL: 18,
  radiusRound: 50,
};

export const shadows = {
  xs2: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  xs: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  sm: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  default: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  xl2: {
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
};
