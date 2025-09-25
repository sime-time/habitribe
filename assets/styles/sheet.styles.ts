import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { createBaseStyles } from "./base.styles";
import { border, spacing, typography } from "./token.styles";

export const createSheetStyles = (colors: ColorScheme) => {
  const baseStyles = createBaseStyles(colors);

  const styles = StyleSheet.create({
    ...baseStyles,
    backdrop: {
      position: "absolute",
      flex: 1,
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      height: "100%",
      width: "100%",
      justifyContent: "flex-end",
      zIndex: 999,
    },
    backdropPressable: {
      flex: 1,
      width: "100%",
      justifyContent: "flex-end",
    },
    bottomSheetContainer: {
      width: "100%",
      height: "40%",
    },
    bottomSheet: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.card,
      borderTopLeftRadius: border.radiusXL,
      borderTopRightRadius: border.radiusXL,
    },
    sheetTitle: {
      ...typography.title,
      fontWeight: "600",
      color: colors.foreground,
      textAlign: "center",
    },
    sheetText: {
      ...typography.body,
      color: colors.mutedForeground,
      textAlign: "center",
    },
    sheetTextContainer: {
      gap: spacing.xs,
    },
    sheetHeading: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    sheetBody: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xs2,
      gap: spacing.md,
    },
  });

  return styles;
};
