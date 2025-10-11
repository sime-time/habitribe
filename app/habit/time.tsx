// This screen is not being used right now
// The default goal is always "1 count"
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, type TextStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

export default function HabitTarget() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // Habit state
  const updateForm = useHabitFormStore((state) => state.updateForm);

  const goalTarget = useHabitFormStore((state) => state.habitForm.goalTarget);
  const setGoalTarget = (target: number) => updateForm("goalTarget", target);

  const goalUnit = useHabitFormStore((state) => state.habitForm.goalUnit);
  const setGoalUnit = (unit: string) => {
    updateForm("goalUnit", unit.toLowerCase());
  };

  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  // This is important for habit "edit" mode:
  // Initialize selectedHours and selectedMinutes based on goalTarget when goalUnit is "seconds"
  useEffect(() => {
    if (goalUnit === "seconds" && goalTarget > 0) {
      const totalMinutes = Math.floor(goalTarget / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setSelectedHours(hours);
      setSelectedMinutes(minutes);
    }
  }, [goalTarget, goalUnit]);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <View style={[s.flex1, s.p4]}>
          <View style={[s.flex1, s.gap2]}>
            <Text style={[s.textXs, s.ml2, c.textMuted] as TextStyle[]}>
              SELECT AMOUNT OF TIME
            </Text>
            <View
              style={[
                s.px4,
                c.bgCard,
                s.roundedMd,
                s.border1,
                c.borderDefault,
                {
                  height: 200,
                },
              ]}
            >
              <View style={[s.flex1, s.itemsCenter, s.justifyCenter]}>
                <View style={[s.flexRow, s.itemsCenter]}>
                  <Picker
                    selectedValue={selectedHours}
                    style={{ flex: 1 }}
                    onValueChange={(value) => {
                      setSelectedHours(value);
                      setGoalTarget(value * 3600 + selectedMinutes * 60);
                      setGoalUnit("seconds");
                    }}
                    itemStyle={{
                      color: colors.foreground,
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <Picker.Item key={i} label={`${i} hr`} value={i} />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={selectedMinutes}
                    style={{ flex: 1 }}
                    onValueChange={(value) => {
                      setSelectedMinutes(value);
                      setGoalTarget(selectedHours * 3600 + value * 60);
                      setGoalUnit("seconds");
                    }}
                    itemStyle={{
                      color: colors.foreground,
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <Picker.Item key={i} label={`${i} min`} value={i} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
