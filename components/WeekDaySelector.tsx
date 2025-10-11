import { Check } from "lucide-react-native";
import { Text, type TextStyle, TouchableOpacity, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { CHECKMARK_SIZE } from "@/constants/sizes";
import useTheme from "@/hooks/useTheme";

interface WeeklyDaySelectorProps {
  pattern: number | number[];
  setPattern: (pattern: number | number[]) => void;
}

export default function WeekDaySelector({
  pattern,
  setPattern,
}: WeeklyDaySelectorProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const days = [
    { label: "Su", value: 0 },
    { label: "Mo", value: 1 },
    { label: "Tu", value: 2 },
    { label: "We", value: 3 },
    { label: "Th", value: 4 },
    { label: "Fr", value: 5 },
    { label: "Sa", value: 6 },
  ];

  const selectedDays = Array.isArray(pattern)
    ? pattern
    : pattern === 1
      ? [0, 1, 2, 3, 4, 5, 6]
      : [];

  const toggleDay = (dayValue: number) => {
    // console.log("WeekDaySelector: toggleDay called with", dayValue);
    // console.log("WeekDaySelector: current pattern", pattern);
    // console.log("WeekDaySelector: selectedDays", selectedDays);

    // if (!Array.isArray(pattern)) {
    //   console.error("WeekDaySelector: pattern is not an array, returning");
    //   return;
    // }

    const newPattern = selectedDays.includes(dayValue)
      ? selectedDays.filter((day) => day !== dayValue)
      : [...selectedDays, dayValue];

    // console.log("WeekDaySelector: Setting pattern to", newPattern);

    // If all 7 days are selected, switch to "every day" (pattern = 1)
    if (newPattern.length === 7) {
      setPattern(1);
    } else {
      setPattern(newPattern);
    }
  };

  return (
    <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
      {days.map((day) => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <View
            key={day.value}
            style={[s.flex1, s.itemsCenter, s.justifyBetween]}
          >
            <TouchableOpacity
              style={[
                s.roundedFull,
                s.justifyCenter,
                s.itemsCenter,
                s.border2,
                isSelected ? c.bgPrimary : c.bgTransparent,
                isSelected ? c.borderPrimary : c.borderDefault,
                {
                  width: CHECKMARK_SIZE + 12,
                  height: CHECKMARK_SIZE + 12,
                },
              ]}
              onPress={() => toggleDay(day.value)}
            >
              {isSelected && (
                <Check size={CHECKMARK_SIZE} color={colors.primaryForeground} />
              )}
            </TouchableOpacity>
            <Text
              style={
                [
                  c.textMuted,
                  s.textBase,
                  s.mt2,
                  c.textForeground,
                ] as TextStyle[]
              }
            >
              {day.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
