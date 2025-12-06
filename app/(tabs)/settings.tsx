import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  rightElement?: "chevron" | "toggle";
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  isDanger?: boolean;
};

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const c = createColorStyles(colors);
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
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

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert("Not Implemented", "Account deletion coming soon");
          },
        },
      ],
    );
  };

  const accountItems: MenuItem[] = [
    {
      icon: "person-outline",
      iconBg: colors.primary,
      iconColor: colors.primaryForeground,
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: () => Alert.alert("Coming Soon", "Edit Profile feature"),
      rightElement: "chevron",
    },
    {
      icon: "notifications-outline",
      iconBg: colors.primary,
      iconColor: colors.primaryForeground,
      title: "Notifications",
      subtitle: "Manage your alert preferences",
      onPress: () => Alert.alert("Coming Soon", "Notifications settings"),
      rightElement: "chevron",
    },
    {
      icon: "moon",
      iconBg: colors.primary,
      iconColor: colors.primaryForeground,
      title: "Dark Mode",
      subtitle: "Switch app color scheme",
      rightElement: "toggle",
      toggleValue: isDarkMode,
      onToggle: toggleDarkMode,
    },
    {
      icon: "card-outline",
      iconBg: colors.primary,
      iconColor: colors.primaryForeground,
      title: "Subscription",
      subtitle: "Manage your plan and billing",
      onPress: () => Alert.alert("Coming Soon", "Subscription management"),
      rightElement: "chevron",
    },
    {
      icon: "exit-outline",
      iconBg: colors.primary,
      iconColor: colors.primaryForeground,
      title: "Logout",
      subtitle: "Sign out of your account",
      onPress: handleSignOut,
      rightElement: "chevron",
    },
    {
      icon: "trash-outline",
      iconBg: colors.destructive,
      iconColor: colors.primaryForeground,
      title: "Delete Account",
      subtitle: "Permanently delete your account",
      onPress: handleDeleteAccount,
      rightElement: "chevron",
      isDanger: true,
    },
  ];

  const generalItems: MenuItem[] = [
    {
      icon: "information-circle-outline",
      iconBg: colors.muted,
      iconColor: colors.primaryForeground,
      title: "About",
      subtitle: "Learn more about the app",
      onPress: () => Alert.alert("Coming Soon", "About page"),
      rightElement: "chevron",
    },
    {
      icon: "document-text-outline",
      iconBg: colors.muted,
      iconColor: colors.primaryForeground,
      title: "Terms & Conditions",
      subtitle: "Read our legal terms",
      onPress: () => Alert.alert("Coming Soon", "Terms & Conditions"),
      rightElement: "chevron",
    },
    {
      icon: "shield-checkmark-outline",
      iconBg: colors.muted,
      iconColor: colors.primaryForeground,
      title: "Privacy Policy",
      subtitle: "Understand our data practices",
      onPress: () => Alert.alert("Coming Soon", "Privacy Policy"),
      rightElement: "chevron",
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.title}
      onPress={item.onPress}
      disabled={!item.onPress}
      activeOpacity={0.7}
      style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.py5]}
    >
      <View style={[s.flexRow, s.itemsCenter, s.flex1]}>
        {/* Icon Container */}
        <View
          style={[
            s.roundedMd,
            {
              width: 40,
              height: 40,
              backgroundColor: item.iconBg,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            },
          ]}
        >
          <Ionicons name={item.icon} size={20} color={item.iconColor} />
        </View>

        {/* Text Container */}
        <View style={s.flex1}>
          <Text
            style={[
              s.textBase,
              s.fontSemibold,
              item.isDanger ? c.textDestructive : c.textForeground,
            ]}
          >
            {item.title}
          </Text>
          <Text style={[s.textSm, c.textMuted, { marginTop: 2 }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>

      {/* Right Element */}
      {item.rightElement === "chevron" && (
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      )}
      {item.rightElement === "toggle" && (
        <Switch
          value={item.toggleValue}
          onValueChange={item.onToggle}
          thumbColor={colors.primaryForeground}
          trackColor={{ false: colors.border, true: colors.primary }}
          ios_backgroundColor={colors.border}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        {/* HEADER */}
        <Header title="Settings" options={true} />

        {/* CONTENT */}
        <ScrollView
          style={s.flex1}
          contentContainerStyle={[s.px4, s.gap5, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Section */}
          <View style={s.gap3}>
            <Text
              style={[
                s.textXl,
                s.fontBold,
                c.textForeground,
                { letterSpacing: -0.5 },
              ]}
            >
              Account
            </Text>
            <View
              style={[s.roundedLg, c.bgCard, s.px5, s.border1, c.borderDefault]}
            >
              {accountItems.map((item, index) => (
                <View key={item.title}>
                  {renderMenuItem(item)}
                  {index < accountItems.length - 1 && (
                    <View style={[s.divider, c.bgMuted]} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* General Section */}
          <View style={s.gap3}>
            <Text
              style={[
                s.textXl,
                s.fontBold,
                c.textForeground,
                { letterSpacing: -0.5 },
              ]}
            >
              General
            </Text>
            <View
              style={[s.roundedLg, c.bgCard, s.px5, s.border1, c.borderDefault]}
            >
              {generalItems.map((item, index) => (
                <View key={item.title}>
                  {renderMenuItem(item)}
                  {index < generalItems.length - 1 && (
                    <View style={[s.divider, c.bgMuted]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
