import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { spacing, typography } from "./token.styles";

export const createAuthStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
    header: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      alignItems: "center",
      textAlign: "center",
    },
    subtitle: {
      ...typography.subheading,
      color: colors.mutedForeground,
      textAlign: "center",
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
  });

  return styles;
};
