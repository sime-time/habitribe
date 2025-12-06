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
    secondary: [string, string];
    muted: [string, string];
    success: [string, string];
    warning: [string, string];
  };

  statusBarStyle: "light-content" | "dark-content";
}

export const lightColors: ColorScheme = {
  background: "#eeeeee",
  foreground: "#18181a",
  card: "#FFFFFF",
  primary: "#7777ff",
  primaryForeground: "#FFFFFF",
  secondary: "#EAEAFE",
  secondaryForeground: "#5555dd",
  muted: "#979797",
  border: "#dee1e6",
  success: "#10B981",
  warning: "#F59E0B",
  destructive: "#EF4444",
  gradients: {
    background: ["#eeeeee", "#f8fafc"],
    primary: ["#7777ff", "#5555dd"],
    muted: ["#dee1e6", "#e8ecf1"],
    success: ["#10B981", "#059669"],
    secondary: ["#EAEAFE", "#D1D1F5"],
    warning: ["#F59E0B", "#fcd34d"],
  },
  statusBarStyle: "dark-content" as const,
};

export const darkColors: ColorScheme = {
  background: "#000000",
  foreground: "#e4e4e7",
  card: "#1e2128",
  primary: "#7777ff",
  primaryForeground: "#FFFFFF",
  secondary: "#F3F3FF",
  secondaryForeground: "#5555dd",
  muted: "#98989b",
  border: "#323743",
  success: "#34D399",
  warning: "#FBBF24",
  destructive: "#F87171",
  gradients: {
    background: ["#000000", "#0c0c0e"],
    primary: ["#7777ff", "#5555dd"],
    muted: ["#323743", "#3d434d"],
    success: ["#34D399", "#10B981"],
    secondary: ["#EAEAFE", "#D1D1F5"],
    warning: ["#FBBF24", "#facc15"],
  },
  statusBarStyle: "light-content" as const,
};

// Icon colors for habit customization
export const iconColors = [
  "#787bff", // purple (primary)
  "#0a84ff", // blue
  "#63d2ff", // light blue
  "#1de9b6", // mint teal
  "#2fd159", // green
  "#ffd60a", // yellow
  "#ff9f0a", // orange
  "#ff3b30", // red
  "#ff375e", // hot pink
  "#be5af2", // magenta
  "#ac8e68", // brown
  "#8f8e94", // gray
] as const;
