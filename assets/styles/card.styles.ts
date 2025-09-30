import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, spacing } from "./token.styles";

export const createCardStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
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
    card: {
      backgroundColor: colors.card,
      borderRadius: border.radiusLarge,
      padding: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.md,
      borderWidth: border.width,
      borderColor: colors.border,
    },
    cardTextContainer: {
      gap: spacing.xs2,
    },
    cardStart: {
      flexGrow: 1,
      flexDirection: "row",
      gap: spacing.sm,
    },
    cardEnd: {},
    cardIconContainer: {
      width: 48,
      height: 48,
      borderRadius: border.radiusRound,
      alignItems: "center",
      justifyContent: "center",
      outlineWidth: 1,
      outlineColor: "transparent",
    },
  });

  return styles;
};
