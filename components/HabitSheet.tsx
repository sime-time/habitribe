import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Button,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { createSheetStyles } from "@/assets/styles/sheet.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { getGoalDisplayText } from "@/utils/habitFormLabels";

type Habit = Doc<"habits">;

interface HabitSheetProps {
  habit: Habit | null;
  closeSheet: () => void;
}

export default function HabitSheet({ habit, closeSheet }: HabitSheetProps) {
  const { colors } = useTheme();
  const styles = createSheetStyles(colors);

  const deleteHabit = useMutation(api.exec.delete.deleteHabit);

  const slide = useSharedValue(300);
  const backdrop = useSharedValue(0);
  const duration = 250;

  const slideUp = () => {
    slide.value = withSpring(0, { duration });
    backdrop.value = withSpring(1, { duration });
  };
  const slideDown = () => {
    slide.value = withSpring(300, { duration });
    backdrop.value = withSpring(0, { duration });
  };

  useEffect(() => {
    slideUp();
  });

  const close = () => {
    slideDown();
    setTimeout(() => {
      closeSheet();
    }, duration);
  };

  const confirmDelete = () => {
    if (!habit) return null;
    Alert.alert(
      "Delete Habit",
      "This will remove all habit progress and history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              deleteHabit({ id: habit._id });
              close();
            } catch (error) {
              console.error("Failed to delete habit", error);
              Alert.alert("Error", "Failed to delete habit");
            }
          },
        },
      ],
    );
  };

  if (!habit) return null;

  return (
    <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
      <Pressable onPress={close} style={styles.backdropPressable}>
        <Pressable style={styles.bottomSheetContainer}>
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}
          >
            <View style={styles.sheetHeading}>
              <TouchableOpacity onPress={confirmDelete}>
                <Ionicons
                  name="trash-outline"
                  color={colors.destructive}
                  size={26}
                />
              </TouchableOpacity>
              <Button
                title="Edit"
                color={colors.primary}
                onPress={() => {
                  closeSheet();
                  router.navigate(`/habit/form?id=${habit._id}`);
                }}
              />
            </View>
            <View style={styles.sheetBody}>
              <View style={styles.sheetTextContainer}>
                <Text style={styles.sheetTitle}>{habit.name}</Text>
                <Text style={styles.sheetText}>
                  {getGoalDisplayText(habit.goalTarget, habit.goalUnit)}
                </Text>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Complete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
