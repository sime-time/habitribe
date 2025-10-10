export interface ColorScheme {
  // Base colors
  background: string; // App background
  foreground: string; // Primary text color
  card: string; // Elevated surfaces (cards, modals, sheets)

  // Brand colors
  primary: string; // Primary brand color (buttons, links, highlights)
  primaryForeground: string; // Text/icons on primary color

  // Secondary
  secondary: string; // Secondary brand color (buttons, links, highlights)
  secondaryForeground: string; // Text/icons on secondary color

  // Muted
  muted: string; // Secondary text, hints, placeholders

  // Borders
  border: string; // Dividers, input borders, card outlines

  // Semantic states
  success: string; // Success messages, positive actions
  warning: string; // Warnings, caution states
  destructive: string; // Errors, destructive actions

  // Gradients (optional, app-specific)
  gradients: {
    background: [string, string];
    primary: [string, string];
    muted: [string, string];
  };

  statusBarStyle: "light-content" | "dark-content";
}

export const lightColors: ColorScheme = {
  background: "#eeeeee",
  foreground: "#18181a",
  card: "#FFFFFF",
  primary: "#7777ff",
  primaryForeground: "#FFFFFF",
  secondary: "#dedeff",
  secondaryForeground: "#18181a",
  muted: "#979797",
  border: "#dee1e6",
  success: "#10B981",
  warning: "#F59E0B",
  destructive: "#EF4444",
  gradients: {
    background: ["#eeeeee", "#f8fafc"],
    primary: ["#7777ff", "#5555dd"],
    muted: ["#e8eef2", "#f5f7f9"],
  },
  statusBarStyle: "dark-content" as const,
};

export const darkColors: ColorScheme = {
  background: "#000000",
  foreground: "#e4e4e7",
  card: "#1e2128",
  primary: "#7777ff",
  primaryForeground: "#FFFFFF",
  secondary: "#dedeff",
  secondaryForeground: "#18181a",
  muted: "#98989b",
  border: "#323743",
  success: "#34D399",
  warning: "#FBBF24",
  destructive: "#F87171",
  gradients: {
    background: ["#000000", "#0c0c0e"],
    primary: ["#7777ff", "#5555dd"],
    muted: ["#242936", "#313847"],
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
