import { ScrollView, Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import HeatmapCard from "@/components/HeatmapCard";
import useTheme from "@/hooks/useTheme";
import type { HabitActivity } from "@/validation/HabitSchema";

interface HeatmapViewProps {
  daily: HabitActivity[];
  weekly: HabitActivity[];
  monthly: HabitActivity[];
  startDate: string;
  endDate: string;
}

export default function HeatmapView({
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
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Daily Habits
            </Text>
          </View>
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
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Weekly Habits
            </Text>
          </View>
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
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Monthly Habits
            </Text>
          </View>
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
