import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextStyle,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { iconColors } from "@/constants/colors";
import { emojiData } from "@/constants/emojis";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

export default function HabitIcon() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const { width } = useWindowDimensions();

  // Calculate dynamic emoji size based on screen width
  // 6 columns with gaps, so divide by ~7 to account for spacing
  const emojiSize = Math.floor(width / 13);

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

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <ScrollView style={[s.flex1, s.px4]} contentContainerStyle={s.pb8}>
          {/* Preview Section */}
          <View style={[s.itemsCenter, s.py6]}>
            <View
              style={[
                s.roundedFull,
                s.itemsCenter,
                s.justifyCenter,
                {
                  backgroundColor: `${selectedColor}30`,
                  height: 120,
                  width: 120,
                },
              ]}
            >
              <Text style={{ fontSize: 64 }}>{selectedIcon}</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={[
              s.flexRow,
              s.itemsCenter,
              s.px4,
              s.py3,
              s.gap3,
              s.roundedMd,
              s.mb6,
              c.bgCard,
              c.borderDefault,
              s.border1,
            ]}
          >
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              style={[s.flex1, s.textBase, c.textForeground] as TextStyle[]}
              placeholder="Search icons..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={colors.muted} />
              </Pressable>
            )}
          </View>

          {/* Color Selection */}
          <FlatList
            data={iconColors}
            scrollEnabled={false}
            numColumns={6}
            columnWrapperStyle={s.justifyBetween}
            contentContainerStyle={[s.gap3, s.p1]}
            keyExtractor={(item) => item}
            renderItem={({ item: color }) => (
              <Pressable
                onPress={() => setSelectedColor(color)}
                style={[
                  s.itemsCenter,
                  s.justifyCenter,
                  s.roundedFull,
                  { backgroundColor: `${color}20`, height: 48, width: 48 },
                  selectedColor === color && [c.outlinePrimary, s.outline3],
                ]}
              >
                <View
                  style={[
                    s.roundedFull,
                    {
                      width: emojiSize,
                      height: emojiSize,
                      backgroundColor: color,
                    },
                  ]}
                />
              </Pressable>
            )}
          />

          {/* Icon Selection */}
          <View style={[s.divider, c.bgForeground, s.my6]} />

          {filteredEmojis.length === 0 ? (
            <View style={[s.itemsCenter, s.py8, s.gap2]}>
              <Text style={[s.textLg, c.textMuted]}>No icons found</Text>
              <Text style={[s.textSm, c.textMuted]}>
                Try a different search term
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredEmojis}
              scrollEnabled={false}
              numColumns={6}
              columnWrapperStyle={s.gap2}
              contentContainerStyle={[s.gap2, s.p1]}
              keyExtractor={(item) => item.emoji}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedIcon(item.emoji)}
                  style={[
                    s.flex1,
                    s.itemsCenter,
                    s.justifyCenter,
                    s.p1,
                    s.roundedMd,
                    { backgroundColor: `${selectedColor}10` },
                    selectedIcon === item.emoji && [
                      { backgroundColor: `${selectedColor}30` },
                      c.outlinePrimary,
                      s.outline2,
                    ],
                  ]}
                >
                  <Text style={{ fontSize: emojiSize }}>{item.emoji}</Text>
                </Pressable>
              )}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
