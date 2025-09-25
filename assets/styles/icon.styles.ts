import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, spacing, text } from "./token.styles";

export const createIconStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);
  const styles = StyleSheet.create({
    ...baseStyles,
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderWidth: border.width,
      borderColor: colors.border,
      borderRadius: border.radiusMedium,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xl,
      height: 48,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: text.base,
      color: colors.foreground,
    },
    sectionTitle: {
      fontSize: text.xl2,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: spacing.lg,
    },

    // Color selection grid
    colorGrid: {
      marginBottom: spacing.xl,
    },
    colorSwatch: {
      width: 46,
      height: 46,
      borderRadius: border.radiusRound,
      outlineColor: "transparent",
      outlineStyle: "solid",
      outlineWidth: 3,
      outlineOffset: 0,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 6,
      marginHorizontal: 4,
    },
    colorSwatchInner: {
      width: 28,
      height: 28,
      borderRadius: 14,
    },
    selectedColorSwatch: {
      outlineColor: colors.foregroundSecondary,
      outlineWidth: 3,
    },

    // Tab navigation
    tabContainer: {
      flexDirection: "row",
      backgroundColor: colors.secondary,
      borderRadius: border.radiusMedium,
      padding: 4,
      marginBottom: spacing.lg,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.xs,
      borderRadius: border.radiusSmall,
      alignItems: "center",
      justifyContent: "center",
    },
    activeTab: {
      backgroundColor: colors.mutedForeground,
    },
    tabText: {
      fontSize: text.sm,
      fontWeight: "500",
      color: colors.mutedForeground,
    },
    activeTabText: {
      color: colors.background,
    },

    // Icon FlashList grid

    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: border.radiusRound,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
      outlineWidth: 3,
      outlineColor: "transparent",
      marginVertical: 6,
      marginHorizontal: 4,
    },
    selectedIconContainer: {
      outlineColor: colors.foregroundSecondary,
      outlineWidth: 3,
    },

    // Emoji styling
    emoji: {
      fontSize: 26,
      textAlign: "center",
    },
  });

  return styles;
};
