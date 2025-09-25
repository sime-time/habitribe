import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createSettingsStyles } from "@/assets/styles/settings.styles";
import DangerZone from "@/components/DangerZone";
import Preferences from "@/components/Preferences";
import useTheme from "@/hooks/useTheme";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const styles = createSettingsStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons
                name="settings"
                size={28}
                color={colors.primaryForeground}
              />
            </View>
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>

        {/* OPTIONS */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Preferences />
          <DangerZone />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
