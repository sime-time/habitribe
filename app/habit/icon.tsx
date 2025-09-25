import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createIconStyles } from "@/assets/styles/icon.styles";
import { iconColors } from "@/constants/colors";
import { emojiData } from "@/constants/emojis";
import { iconData } from "@/constants/icons";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

type TabType = "Icons" | "Emojis";

export default function HabitIcon() {
  const { colors } = useTheme();
  const styles = createIconStyles(colors);

  // UI state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("Icons");

  // Habit state
  const selectedColor = useHabitFormStore((state) => state.selectedColor);
  const selectedIcon = useHabitFormStore((state) => state.selectedIcon);
  const selectedEmoji = useHabitFormStore((state) => state.selectedEmoji);
  const setSelectedColor = useHabitFormStore((state) => state.setSelectedColor);
  const setSelectedIcon = useHabitFormStore((state) => state.setSelectedIcon);
  const setSelectedEmoji = useHabitFormStore((state) => state.setSelectedEmoji);

  const filteredIcons = iconData.filter((icon) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      icon.name.toLowerCase().includes(query) ||
      icon.category.toLowerCase().includes(query) ||
      icon.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  const filteredEmojis = emojiData.filter((emoji) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      emoji.name.toLowerCase().includes(query) ||
      emoji.category.toLowerCase().includes(query) ||
      emoji.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  // biome-ignore lint/suspicious/noExplicitAny: Flashlist item = any
  const renderColor = ({ item: color }: any) => (
    <Pressable
      key={color}
      style={[
        styles.colorSwatch,
        { backgroundColor: `${color}30` },
        selectedColor === color && styles.selectedColorSwatch,
      ]}
      onPress={() => setSelectedColor(color)}
    >
      <View style={[styles.colorSwatchInner, { backgroundColor: color }]} />
    </Pressable>
  );
  // biome-ignore lint/suspicious/noExplicitAny: Flashlist item = any
  const renderIcon = ({ item, index }: any) => (
    <Pressable
      key={index}
      style={[
        styles.iconContainer,
        { backgroundColor: `${selectedColor}30` },
        selectedIcon === item.name && styles.selectedIconContainer,
      ]}
      onPress={() => setSelectedIcon(item.name)}
    >
      <Ionicons name={item.name} size={26} color={selectedColor} />
    </Pressable>
  );

  // biome-ignore lint/suspicious/noExplicitAny: Flashlist item = any
  const renderEmoji = ({ item, index }: any) => (
    <Pressable
      key={index}
      style={[
        styles.iconContainer,
        { backgroundColor: `${selectedColor}30` },
        selectedEmoji === item.emoji && styles.selectedIconContainer,
      ]}
      onPress={() => setSelectedEmoji(item.emoji)}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.mutedForeground}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search icons"
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Choose Color Section */}
          <Text style={styles.sectionTitle}>Choose color</Text>
          <View style={styles.colorGrid}>
            <FlashList
              data={iconColors}
              renderItem={renderColor}
              keyExtractor={(item) => item}
              numColumns={6}
            />
          </View>

          {/* Choose Icon Section */}
          <Text style={styles.sectionTitle}>Choose icon</Text>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {(["Icons", "Emojis"] as TabType[]).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Icon Grid */}
          {activeTab === "Icons" && (
            <FlashList
              data={filteredIcons}
              renderItem={renderIcon}
              numColumns={6}
              keyExtractor={(item) => item.name}
            />
          )}

          {/* Emoji Grid */}
          {activeTab === "Emojis" && (
            <FlashList
              data={filteredEmojis}
              renderItem={renderEmoji}
              numColumns={6}
              keyExtractor={(item) => item.emoji}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
