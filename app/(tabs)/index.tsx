import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createEntryStyles } from "@/assets/styles/entry.styles";
import { spacing } from "@/assets/styles/token.styles";
import IconOrEmoji from "@/components/IconOrEmoji";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";
import { getGoalDisplayText } from "@/utils/habitFormLabels";

type Habit = Doc<"habits">;

export default function Index() {
  const { colors } = useTheme();
  const styles = createEntryStyles(colors);
  const openSheet = useHabitSheetStore((state) => state.openSheet);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const habits = useQuery(api.exec.read.getUserHabits);

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <View style={styles.card}>
      <Pressable style={styles.cardStart} onPress={() => openSheet(item)}>
        <View
          style={[
            styles.cardIconContainer,
            { backgroundColor: `${item.color}30` },
          ]}
        >
          <IconOrEmoji iconName={item.icon} iconColor={item.color} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.body}>{item.name}</Text>
          <Text style={styles.muted}>
            {getGoalDisplayText(item.goalTarget, item.goalUnit)}
          </Text>
        </View>
      </Pressable>
      <View style={styles.cardEnd}>
        <View
          style={[
            styles.cardIconContainer,
            { outlineColor: colors.mutedForeground },
          ]}
        >
          <Ionicons
            name="camera-outline"
            size={24}
            color={colors.mutedForeground}
          />
        </View>
      </View>
    </View>
  );

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
