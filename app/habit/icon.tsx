import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createIconStyles } from "@/assets/styles/icon.styles";
import { iconColors } from "@/constants/colors";
import { emojiData } from "@/constants/emojis";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

export default function HabitIcon() {
  const { colors } = useTheme();
  const styles = createIconStyles(colors);

  // UI state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Habit state
  const selectedColor = useHabitFormStore((state) => state.selectedColor);
  const selectedIcon = useHabitFormStore((state) => state.selectedIcon);
  const setSelectedColor = useHabitFormStore((state) => state.setSelectedColor);
  const setSelectedIcon = useHabitFormStore((state) => state.setSelectedIcon);

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
  const renderEmoji = ({ item, index }: any) => (
    <Pressable
      key={index}
      style={[
        styles.iconContainer,
        { backgroundColor: `${selectedColor}30` },
        selectedIcon === item.emoji && styles.selectedIconContainer,
      ]}
      onPress={() => setSelectedIcon(item.emoji)}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.muted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search icons"
              placeholderTextColor={colors.muted}
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

          {/* Choose Emoji Section */}
          <Text style={styles.sectionTitle}>Choose icon</Text>

          {/* Emoji Grid */}
          <View>
            <FlashList
              data={filteredEmojis}
              renderItem={renderEmoji}
              numColumns={6}
              keyExtractor={(item) => item.emoji}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
