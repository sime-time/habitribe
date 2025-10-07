import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CHECKMARK_SIZE,
  createHabitStyles,
} from "@/assets/styles/habit.styles";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

export default function HabitTarget() {
  const { colors } = useTheme();
  const styles = createHabitStyles(colors);

  // Habit state
  const updateForm = useHabitFormStore((state) => state.updateForm);

  const goalTarget = useHabitFormStore((state) => state.habitForm.goalTarget);
  const setGoalTarget = (target: number) => updateForm("goalTarget", target);

  const goalUnit = useHabitFormStore((state) => state.habitForm.goalUnit);
  const setGoalUnit = (unit: string) => {
    updateForm("goalUnit", unit.toLowerCase());
  };

  // Increment/Decrement goal target
  const incrementGoal = () => {
    setGoalTarget(goalTarget + 1);
  };
  const decrementGoal = () => {
    // cannot go lower than 0
    const newGoalTarget = goalTarget - 1;
    if (newGoalTarget >= 0) {
      setGoalTarget(newGoalTarget);
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.container}>
              <Text style={styles.inputLabel}>TARGET</Text>

              <View style={styles.inputGroup}>
                <View style={styles.countContainer}>
                  <TouchableOpacity
                    style={styles.countButton}
                    onPress={decrementGoal}
                  >
                    <Minus color={colors.card} size={CHECKMARK_SIZE} />
                  </TouchableOpacity>
                  <TextInput
                    value={goalTarget ? String(goalTarget) : undefined}
                    style={styles.countText}
                    placeholder={"0"}
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      // Only allow whole numbers
                      const numericText = text.replace(/[^0-9]/g, "");
                      const num = Number(numericText);
                      if (!Number.isNaN(num)) {
                        setGoalTarget(num);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={styles.countButton}
                    onPress={incrementGoal}
                  >
                    <Plus color={colors.card} size={CHECKMARK_SIZE} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputDivider} />

                <TouchableOpacity style={styles.inputContainer}>
                  <Text style={styles.body}>Count</Text>
                  <View style={styles.inputIcon}>
                    <ChevronDown
                      color={colors.mutedForeground}
                      size={CHECKMARK_SIZE}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
