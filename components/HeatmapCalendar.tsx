import { Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";

interface HeatmapCalendarProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;
}
export default function HeatmapCalendar({
  startDate,
  endDate,
}: HeatmapCalendarProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // convert strings to Date objects
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);

  // get the difference between ending date and starting date in days
  const daysInMonth =
    Math.ceil(
      (endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1; // add 1 to include the ending date

  // create each date in between starting and ending dates
  const calendarGrid = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  return (
    <View>
      {calendarGrid.map((day, index) => (
        <View key={index} style={[s.w4, s.h4, s.roundedSm, c.bgPrimary]} />
      ))}
    </View>
  );
}
