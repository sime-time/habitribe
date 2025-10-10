import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { createSettingsStyles } from "@/assets/styles/settings.styles";
import useTheme from "@/hooks/useTheme";

export default function DangerZone() {
  const { colors } = useTheme();
  const styles = createSettingsStyles(colors);

  const { signOut } = useAuthActions();
  const handleSignOut = async () => {
    Alert.alert("Sign Out", "This will sign you out of the app.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Failed to sign out", error);
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitleDanger}>Danger Zone</Text>

      <TouchableOpacity
        style={[styles.actionButton, { borderBottomWidth: 0 }]}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <View style={styles.actionLeft}>
          <View
            style={[
              styles.settingIcon,
              { backgroundColor: colors.destructive },
            ]}
          >
            <Ionicons name="exit-outline" size={18} color={colors.background} />
          </View>
          <Text style={styles.actionTextDanger}>Sign Out</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </TouchableOpacity>
    </View>
  );
}
