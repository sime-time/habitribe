import type { TextStyle, ViewStyle } from "react-native";
import type { ColorScheme } from "@/constants/colors";

/**
 * Theme-aware color utilities
 * Usage: const c = createColorStyles(colors);
 * Then: <View style={[s.p4, c.bgCard]} />
 */
export const createColorStyles = (colors: ColorScheme) =>
  ({
    // Background colors
    bgBackground: { backgroundColor: colors.background } as ViewStyle,
    bgForeground: { backgroundColor: colors.foreground } as ViewStyle,
    bgCard: { backgroundColor: colors.card } as ViewStyle,
    bgPrimary: { backgroundColor: colors.primary } as ViewStyle,
    bgPrimaryForeground: {
      backgroundColor: colors.primaryForeground,
    } as ViewStyle,
    bgSecondary: { backgroundColor: colors.secondary } as ViewStyle,
    bgSecondaryForeground: {
      backgroundColor: colors.secondaryForeground,
    } as ViewStyle,
    bgMuted: { backgroundColor: colors.muted } as ViewStyle,
    bgTransparent: { backgroundColor: "transparent" } as ViewStyle,

    // State backgrounds
    bgSuccess: { backgroundColor: colors.success } as ViewStyle,
    bgWarning: { backgroundColor: colors.warning } as ViewStyle,
    bgDestructive: { backgroundColor: colors.destructive } as ViewStyle,

    // Text colors
    textBackground: { color: colors.background } as TextStyle,
    textForeground: { color: colors.foreground } as TextStyle,
    textCard: { color: colors.card } as TextStyle,
    textPrimary: { color: colors.primary } as TextStyle,
    textPrimaryForeground: { color: colors.primaryForeground } as TextStyle,
    textSecondary: { color: colors.secondary } as TextStyle,
    textSecondaryForeground: { color: colors.secondaryForeground } as TextStyle,
    textMuted: { color: colors.muted } as TextStyle,
    textWhite: { color: "white" } as TextStyle,

    // State text colors
    textSuccess: { color: colors.success } as TextStyle,
    textWarning: { color: colors.warning } as TextStyle,
    textDestructive: { color: colors.destructive } as TextStyle,

    // Border colors
    borderDefault: { borderColor: colors.border } as ViewStyle,
    borderPrimary: { borderColor: colors.primary } as ViewStyle,
    borderSecondary: { borderColor: colors.secondary } as ViewStyle,
    borderMuted: { borderColor: colors.muted } as ViewStyle,
    borderForeground: { borderColor: colors.foreground } as ViewStyle,
    borderSuccess: { borderColor: colors.success } as ViewStyle,
    borderWarning: { borderColor: colors.warning } as ViewStyle,
    borderDestructive: { borderColor: colors.destructive } as ViewStyle,

    // Outline colors
    outlineDefault: { outlineColor: colors.border } as ViewStyle,
    outlinePrimary: { outlineColor: colors.primary } as ViewStyle,
    outlineSecondary: { outlineColor: colors.secondary } as ViewStyle,
    outlineMuted: { outlineColor: colors.muted } as ViewStyle,
    outlineForeground: { outlineColor: colors.foreground } as ViewStyle,
    outlineSuccess: { outlineColor: colors.success } as ViewStyle,
    outlineWarning: { outlineColor: colors.warning } as ViewStyle,
    outlineDestructive: { outlineColor: colors.destructive } as ViewStyle,
  }) as const;

/**
 * Convenience type export
 */
export type ColorStyles = ReturnType<typeof createColorStyles>;
