import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { border, spacing, typography } from "./tokenOld.styles";

export const createBaseStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    // Layouts
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingBottom: spacing.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addIconContainer: {
      backgroundColor: colors.card,
      width: 40,
      height: 40,
      borderRadius: border.radiusRound,
      justifyContent: "center",
      alignItems: "center",
    },

    // Typography (add colors)
    title: {
      ...typography.title,
      color: colors.foreground,
    },
    subtitle: {
      ...typography.subtitle,
      color: colors.foreground,
      opacity: 0.65,
    },
    body: {
      ...typography.body,
      color: colors.foreground,
    },
    muted: {
      ...typography.muted,
      color: colors.muted,
    },
    primaryText: {
      ...typography.body,
      color: colors.primary,
    },

    // Form Elements
    form: {
      flex: 1,
      gap: spacing.lg,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    input: {
      ...typography.body,
      borderWidth: border.width,
      borderRadius: border.radiusMedium,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.input,
      borderColor: colors.border,
      color: colors.foreground,
    },
    button: {
      borderWidth: 0,
      borderRadius: border.radiusMedium,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      ...typography.body,
      color: colors.primaryForeground,
    },
    buttonContainer: {
      gap: spacing.xs,
    },
  });

  return styles;
};
