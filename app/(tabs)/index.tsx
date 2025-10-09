import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { EllipsisVertical } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCardStyles } from "@/assets/styles/card.styles";
import { baseFontSize, border, spacing } from "@/assets/styles/token.styles";
import IconOrEmoji from "@/components/IconOrEmoji";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";

type Habit = Doc<"habits">;

// Sample images for habit card gallery
const SAMPLE_IMAGES = [
  require("@/assets/images/icon.png"),
  require("@/assets/images/react-logo.png"),
  require("@/assets/images/partial-react-logo.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/splash-icon.png"),
];

export default function Index() {
  const { colors } = useTheme();
  const styles = createCardStyles(colors);
  const openSheet = useHabitSheetStore((state) => state.openSheet);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const habits = useQuery(api.exec.read.getUserHabits);

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <Pressable style={styles.card} onPress={() => openSheet(item)}>
      <View style={styles.cardContainer}>
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.cardIconContainer,
              { backgroundColor: `${item.color}30` },
            ]}
          >
            <IconOrEmoji iconName={item.icon} iconColor={item.color} />
          </View>
          <Text style={styles.body}>{item.name}</Text>
        </View>

        <View style={styles.cardRight}>
          <View style={styles.cardIconContainer}>
            <EllipsisVertical
              color={colors.mutedForeground}
              size={baseFontSize}
            />
          </View>
        </View>
      </View>

      <Pressable
        style={[
          styles.cardContainer,
          {
            marginVertical: spacing.sm,
            borderWidth: 1,
          },
        ]}
      >
        <FlashList
          data={SAMPLE_IMAGES}
          renderItem={({ item: image }) => (
            <Image
              source={image}
              style={imageStyles.image}
              resizeMode="cover"
            />
          )}
          keyExtractor={(_, index) => `image-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </Pressable>

      <View style={styles.cardTextContainer}>
        <View style={styles.divider} />
        <Text style={styles.muted}>{item.description}</Text>
      </View>
    </Pressable>
  );

  const imageStyles = StyleSheet.create({
    image: {
      width: 64,
      height: 64,
      borderRadius: border.radiusMedium,
      borderWidth: border.width,
      borderColor: colors.border,
      marginRight: spacing.sm,
    },
  });

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollView}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.container}>
              <Text style={styles.title}>Today</Text>
              <Text style={styles.muted}>{formattedDate}</Text>
            </View>
            <Link href="/habit/form" asChild>
              <Pressable>
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={styles.addIconContainer}
                >
                  <Ionicons
                    name="add"
                    size={spacing.lg}
                    color={colors.primaryForeground}
                  />
                </LinearGradient>
              </Pressable>
            </Link>
          </View>

          {/* HABIT LIST */}
          <FlashList
            data={habits}
            renderItem={renderHabitCard}
            keyExtractor={(item) => item._id}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
