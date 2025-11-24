import { Text, TouchableOpacity, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import { getWeekBounds } from "@/utils/dateHelper";

interface WeekDaySelectorProps {
  selectedDate: Date;
  onSelectDate?: (date: Date) => void;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekDaySelector({
  selectedDate,
  onSelectDate,
}: WeekDaySelectorProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // Get Monday of the week containing selectedDate
  const weekBounds = getWeekBounds(selectedDate);
  const mondayDate = weekBounds.start;

  // Generate all 7 days of the week starting from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(mondayDate);
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

  return (
    <View style={[s.flexRow, s.gap2, s.justifyBetween]}>
      {weekDays.map((date, index) => {
        const isSelected = isDateSelected(date);
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
              s.border1,
              isSelected ? c.borderPrimary : c.borderDefault,
            ]}
            onPress={() => onSelectDate?.(date)}
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
