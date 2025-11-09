import { ScrollView, Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import HeatmapCard from "@/components/HeatmapCard";
import useTheme from "@/hooks/useTheme";
import type { HabitActivity } from "@/validation/HabitSchema";
import DateGroupTitle from "./DateGroupTitle";

interface HeatmapViewProps {
  date: Date;
  daily: HabitActivity[];
  weekly: HabitActivity[];
  monthly: HabitActivity[];
  startDate: string;
  endDate: string;
}

export default function HeatmapView({
  date,
  daily,
  weekly,
  monthly,
  startDate,
  endDate,
}: HeatmapViewProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <ScrollView style={[s.flex1, s.px4]} showsVerticalScrollIndicator={false}>
      {daily.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="daily" />
          {daily.map((item) => (
            <HeatmapCard
              key={item.habit._id}
              variant="daily"
              habit={item.habit}
              activity={item.activity}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </>
      )}

      {weekly.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="weekly" />
         {weekly.map((item) => (
            <HeatmapCard
              key={item.habit._id}
              variant="weekly"
              habit={item.habit}
              activity={item.activity}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </>
      )}

      {monthly.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="monthly" />
         {monthly.map((item) => (
            <HeatmapCard
              key={item.habit._id}
              variant="monthly"
              habit={item.habit}
              activity={item.activity}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}
