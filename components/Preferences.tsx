import { Ionicons } from "@expo/vector-icons";
import { Switch, Text, View } from "react-native";
import { createSettingsStyles } from "@/assets/styles/settings.styles";
import useTheme from "@/hooks/useTheme";

export default function Preferences() {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const styles = createSettingsStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>

      {/* DARK MODE */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View
            style={[styles.settingIcon, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="moon" size={18} color={colors.primaryForeground} />
          </View>
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={colors.primaryForeground}
          trackColor={{ false: colors.border, true: colors.primary }}
          ios_backgroundColor={colors.border}
        />
      </View>
    </View>
  );
}
