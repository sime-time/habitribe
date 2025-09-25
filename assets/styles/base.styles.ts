import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { border, spacing, typography } from "./token.styles";

export const createBaseStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    // Layouts
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      padding: spacing.lg,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    // Typography (add colors)
    title: {
      ...typography.title,
      color: colors.foreground,
    },
    subtitle: {
      ...typography.title,
      color: colors.mutedForeground,
    },
    body: {
      ...typography.body,
      color: colors.foreground,
    },
    muted: {
      ...typography.muted,
      color: colors.mutedForeground,
    },

    // Form Elements
    form: {
      flex: 1,
      gap: spacing.lg,
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
      flex: 1,
      gap: spacing.md,
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });

  return styles;
};
