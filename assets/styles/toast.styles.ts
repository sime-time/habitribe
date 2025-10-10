import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { border, spacing } from "./tokenOld.styles";

export const createToastStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    toastContainer: {
      width: "90%",
      maxWidth: 400,
      padding: spacing.md,
      borderRadius: border.radiusLarge,
      borderWidth: border.width,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
    },
    base: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    success: {
      borderColor: colors.success,
    },
    error: {
      borderColor: colors.destructive,
    },
    warning: {
      borderColor: colors.warning,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: border.radiusRound,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    successIcon: {
      backgroundColor: colors.success,
    },
    errorIcon: {
      backgroundColor: colors.destructive,
    },
    warningIcon: {
      backgroundColor: colors.warning,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.foreground,
      marginBottom: 2,
    },
    message: {
      fontSize: 14,
      color: colors.muted,
    },
    closeButton: {
      marginLeft: 12,
      padding: 4,
    },
  });

  return styles;
};
