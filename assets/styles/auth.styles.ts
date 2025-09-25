import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, spacing, typography } from "./token.styles";

export const createAuthStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
    safeArea: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    header: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
      alignItems: "center",
      textAlign: "center",
    },
    title: {
      ...typography.title,
      color: colors.foreground,
      textAlign: "center",
    },
    subtitle: {
      ...typography.muted,
      color: colors.mutedForeground,
      textAlign: "center",
    },
    appleButton: {
      flexDirection: "row",
      gap: spacing.xs,
      alignItems: "center",
      backgroundColor: colors.foreground,
    },
    googleButton: {
      flexDirection: "row",
      gap: spacing.xs,
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: border.width,
      borderColor: colors.border,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginVertical: spacing.xs2,
    },
    divider: {
      height: border.width,
      flex: 1,
      backgroundColor: colors.border,
    },
    authContainer: {
      gap: spacing.sm,
    },
  });

  return styles;
};
