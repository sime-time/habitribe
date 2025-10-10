import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { borderRadius, fontSize, fontWeight, spacing } from "./token.styles";

export const createCommitStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    commitContainer: {
      flex: 1,
      gap: spacing[2],
      paddingVertical: spacing[4],
      paddingLeft: spacing[4],
      paddingRight: spacing[1],
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    commitRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[4],
      flexWrap: "wrap",
    },
    commitPill: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: borderRadius.full,
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      flexShrink: 1,
    },
    commitText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.medium,
      color: colors.muted,
    },
  });

  return styles;
};
