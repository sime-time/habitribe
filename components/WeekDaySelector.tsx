import { Text, TouchableOpacity, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import { useHabitDateStore } from "@/stores/habitDateStore";
import {
  getTodayDateString,
  getWeekBounds,
  parseLocalDate,
} from "@/utils/dateHelper";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekDaySelector() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // change the habit date
  const selectedDate = useHabitDateStore((state) => state.date);
  const updateDate = useHabitDateStore((state) => state.updateDate);

  // get Monday of the week containing selectedDate
  const weekBounds = getWeekBounds(selectedDate);
  const mondayDate = weekBounds.start;

  // generate all 7 days of the week starting from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = parseLocalDate(mondayDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const isDateSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isFutureDate = (date: Date) => {
    const today = parseLocalDate(getTodayDateString());
    today.setHours(0, 0, 0, 0);

    const dateToCompare = date;
    dateToCompare.setHours(0, 0, 0, 0);

    return dateToCompare > today;
  };

  return (
    <View style={[s.flexRow, s.gap2, s.justifyBetween]}>
      {weekDays.map((date, index) => {
        const isSelected = isDateSelected(date);
        const isFuture = isFutureDate(date);
        return (
          <TouchableOpacity
            key={index}
            style={[
              s.flex1,
              s.py2,
              s.px1,
              s.roundedMd,
              s.itemsCenter,
              s.gap1,
              isSelected ? c.bgPrimary : c.bgCard,
              isFuture ? s.opacity50 : s.opacity100,
              s.border1,
              isSelected ? c.borderPrimary : c.borderDefault,
            ]}
            onPress={() => updateDate(date)}
            disabled={isFuture}
          >
            <Text
              style={[
                s.textXs,
                s.fontMedium,
                isSelected ? c.textPrimaryForeground : c.textMuted,
              ]}
            >
              {DAY_NAMES[index]}
            </Text>
            <Text
              style={[
                s.textBase,
                s.fontSemibold,
                isSelected ? c.textPrimaryForeground : c.textForeground,
              ]}
            >
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
