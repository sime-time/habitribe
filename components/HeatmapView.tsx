import { ScrollView } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import HeatmapCard from "@/components/HeatmapCard";
import type { HabitActivity } from "@/validation/HabitSchema";
import DateGroupTitle from "./DateGroupTitle";

interface HeatmapViewProps {
  date: Date;
  daily: HabitActivity[];
  weekly: HabitActivity[];
  monthly: HabitActivity[];
  endDate: string;
  numDays: number;
}

export default function HeatmapView({
  date,
  daily,
  weekly,
  monthly,
  endDate,
  numDays,
}: HeatmapViewProps) {
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
              endDate={endDate}
              numDays={numDays}
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
              endDate={endDate}
              numDays={numDays}
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
              endDate={endDate}
              numDays={numDays}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}
