import { StyleSheet } from "react-native";
import type { ColorScheme } from "@/constants/colors";
import { shadows } from "./token.styles";

export const createSettingsStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 32,
      paddingBottom: 24,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      letterSpacing: -1,
      color: colors.foreground,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      gap: 20,
      paddingBottom: 120,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      ...shadows.md,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
      letterSpacing: -0.5,
      color: colors.foreground,
    },
    sectionTitleDanger: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
      letterSpacing: -0.5,
      color: colors.destructive,
    },
    statsContainer: {
      gap: 16,
    },
    statCard: {
      backgroundColor: colors.card,
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 16,
      borderLeftWidth: 4,
    },
    statIconContainer: {
      marginRight: 16,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    statNumber: {
      fontSize: 28,
      fontWeight: "800",
      letterSpacing: -1,
      color: colors.foreground,
    },
    statLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 2,
      color: colors.mutedForeground,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 20,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    settingText: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.foreground,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    actionText: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.foreground,
    },
    actionTextDanger: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.destructive,
    },
  });

  return styles;
};
