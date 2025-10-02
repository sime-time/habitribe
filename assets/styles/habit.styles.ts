import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, shadows, spacing, text, typography } from "./token.styles";

export const CHECKMARK_SIZE = 30;

export const createHabitStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
    header: {
      backgroundColor: colors.background,
    },
    inputLabel: {
      color: colors.mutedForeground,
      letterSpacing: 0.5,
      fontSize: text.xs,
      marginBottom: spacing.xs,
      marginLeft: spacing.xs,
    },
    inputGroup: {
      flex: 1,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.card,
      borderRadius: border.radiusMedium,
      borderWidth: border.width,
      borderColor: colors.border,
    },
    inputDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: CHECKMARK_SIZE * 1.7, // must be greater than 30px
    },
    inputIcon: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    weekContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: spacing.sm,
    },
    dayContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
    },
    dayCheckbox: {
      width: CHECKMARK_SIZE,
      height: CHECKMARK_SIZE,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: border.width,
    },
    pickerText: {
      fontSize: text.xl,
      color: colors.foreground,
    },
    pickerTextLeft: {
      fontSize: text.xl,
      color: colors.foreground,
      position: "absolute",
      top: "50%",
      marginTop: -text.xl / 2, // nullify the fontsize for top positioning
      left: spacing.lg,
    },
    pickerTextRight: {
      fontSize: text.xl,
      color: colors.foreground,
      position: "absolute",
      top: "50%",
      marginTop: -text.xl / 2, // nullify the fontsize for top positioning
      right: spacing.lg,
    },
    countContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: spacing.md,
      height: "auto",
    },
    countButton: {
      padding: spacing.sm,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: border.radiusSmall,
    },
    countText: {
      flex: 1,
      textAlign: "center",
      color: colors.foreground,
      fontSize: text.xl6,
      fontWeight: "bold",
    },
  });

  return styles;
};
