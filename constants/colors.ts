export interface ColorScheme {
  background: string;
  backgroundSecondary: string;
  foreground: string;
  foregroundSecondary: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  success: string;
  warning: string;
  destructive: string;
  info: string;
  gradients: {
    background: [string, string];
    card: [string, string];
    primary: [string, string];
    muted: [string, string];
    destructive: [string, string];
  };
  statusBarStyle: "light-content" | "dark-content";
}

export const lightColors: ColorScheme = {
  background: "#eeeeee",
  backgroundSecondary: "#dfe0f0",
  foreground: "#18181a",
  foregroundSecondary: "#334155",
  card: "#FFFFFF",
  cardForeground: "#252527",
  primary: "#7777ff",
  primaryForeground: "#FFFFFF",
  secondary: "#dfe0f0",
  secondaryForeground: "#666666",
  muted: "#f0f5f7",
  mutedForeground: "#979797",
  border: "#c3c4e0",
  input: "#F1F5F9",
  success: "#10B981",
  warning: "#F59E0B",
  destructive: "#EF4444",
  info: "#0EA5E9",
  gradients: {
    background: ["#eeeeee", "#f8fafc"],
    card: ["#FFFFFF", "#f1f5f9"],
    primary: ["#7777ff", "#5555dd"],
    muted: ["#f0f5f7", "#ffffff"],
    destructive: ["#EF4444", "#DC2626"],
  },
  statusBarStyle: "dark-content" as const,
};

export const darkColors: ColorScheme = {
  background: "#000000",
  backgroundSecondary: "#161618",
  foreground: "#e4e4e7",
  foregroundSecondary: "#E2E8F0",
  card: "#212124",
  cardForeground: "#fafafa",
  muted: "#2d3748",
  mutedForeground: "#98989b",
  border: "#202035",
  input: "#202035",
  primary: "#7777ff",
  primaryForeground: "#FFF",
  secondary: "#334155",
  secondaryForeground: "#F1F5F9",
  success: "#34D399",
  warning: "#FBBF24",
  destructive: "#F87171",
  info: "#38BDF8",
  gradients: {
    background: ["#000000", "#161618"],
    card: ["#1E293B", "#334155"],
    primary: ["#7777ff", "#5555dd"],
    muted: ["#2d3748", "#1b262d"],
    destructive: ["#F87171", "#DC2626"],
  },
  statusBarStyle: "light-content" as const,
};

// Icon colors for habit customization
export const iconColors = [
  "#ff5716", // red-orange
  "#ff9f0a", // orange
  "#ffd60a", // yellow
  "#2fd159", // green
  "#63d2ff", // light blue
  "#0a84ff", // blue
  "#787bff", // purple
  "#be5af2", // magenta
  "#ff375e", // hot pink
  "#ac8e68", // brown
  "#8f8e94", // gray
  "#ffffff", // white
] as const;
