import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, spacing } from "./token.styles";

export const createCardStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
    card: {
      backgroundColor: colors.card,
      borderRadius: border.radiusLarge,
      padding: spacing.md,
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: spacing.md,
      borderWidth: border.width,
      borderColor: colors.border,
    },
    cardTextContainer: {
      flexDirection: "column",
      gap: spacing.xs2,
    },
    cardContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    cardRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardIconContainer: {
      width: 36,
      height: 36,
      borderRadius: border.radiusRound,
      alignItems: "center",
      justifyContent: "center",
      outlineWidth: 1,
      outlineColor: "transparent",
    },
  });

  return styles;
};
