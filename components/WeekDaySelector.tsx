import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { createHabitStyles } from "@/assets/styles/habit.styles";
import { spacing } from "@/assets/styles/token.styles";
import useTheme from "@/hooks/useTheme";

interface WeeklyDaySelectorProps {
  interval: number | number[];
  setInterval: (interval: number | number[]) => void;
}

export default function WeekDaySelector({
  interval,
  setInterval,
}: WeeklyDaySelectorProps) {
  const { colors } = useTheme();
  const styles = createHabitStyles(colors);

  const days = [
    { label: "Su", value: 0 },
    { label: "Mo", value: 1 },
    { label: "Tu", value: 2 },
    { label: "We", value: 3 },
    { label: "Th", value: 4 },
    { label: "Fr", value: 5 },
    { label: "Sa", value: 6 },
  ];

  const selectedDays = Array.isArray(interval) ? interval : [];

  const toggleDay = (dayValue: number) => {
    // console.log('WeekDaySelector: toggleDay called with', dayValue);
    // console.log('WeekDaySelector: current interval', interval);
    // console.log('WeekDaySelector: selectedDays', selectedDays);

    if (!Array.isArray(interval)) {
      console.error("WeekDaySelector: interval is not an array, returning");
      return;
    }

    const newInterval = selectedDays.includes(dayValue)
      ? selectedDays.filter((day) => day !== dayValue)
      : [...selectedDays, dayValue];

    // console.log('WeeklyDaySelector: Setting interval to', newInterval);

    // If all 7 days are selected, switch to "every day" (interval = 1)
    if (newInterval.length === 7) {
      setInterval(1);
    } else {
      setInterval(newInterval);
    }
  };

  return (
    <View style={styles.weekContainer}>
      {days.map((day) => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <View key={day.value} style={styles.dayContainer}>
            <TouchableOpacity
              style={[
                styles.dayCheckbox,
                {
                  backgroundColor: isSelected ? colors.primary : "transparent",
                  borderColor: isSelected
                    ? colors.primary
                    : colors.mutedForeground,
                },
              ]}
              onPress={() => toggleDay(day.value)}
            >
              {isSelected ? (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={colors.primaryForeground}
                />
              ) : null}
            </TouchableOpacity>
            <Text
              style={[
                styles.muted,
                {
                  marginTop: spacing.xs,
                  color: colors.foreground,
                },
              ]}
            >
              {day.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
