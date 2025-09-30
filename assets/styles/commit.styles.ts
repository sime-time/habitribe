import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, spacing } from "./token.styles";

export const createCommitStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
    commitContainer: {
      flex: 1,
      gap: spacing.sm,
      padding: spacing.sm,
      paddingLeft: spacing.lg,
      backgroundColor: colors.card,
      borderRadius: border.radiusMedium,
      borderWidth: border.width,
      borderColor: colors.border,
    },
    commitRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      flexWrap: "wrap",
    },
    commitPill: {
      backgroundColor: "transparent",
      borderWidth: border.width,
      borderColor: colors.primary,
      borderRadius: border.radiusRound,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      flexShrink: 1,
    },
  });

  return styles;
};
