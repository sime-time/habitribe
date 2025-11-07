import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import HeatmapHabitCard from "@/components/HeatmapHabitCard";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { getYearBounds } from "@/utils/dateHelper";

export default function History() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const today = new Date();
  const { start, end } = getYearBounds(today);

  const heatmapData = useQuery(api.exec.read.getHabitHeatmaps, {
    startDate: start,
    endDate: end,
  });

  if (!heatmapData)
    return (
      <LinearGradient colors={colors.gradients.background} style={s.flex1}>
        <SafeAreaView
          style={[s.flex1, s.justifyCenter, s.itemsCenter]}
          edges={["top"]}
        >
          <ActivityIndicator size="large" color={colors.muted} />
        </SafeAreaView>
      </LinearGradient>
    );

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        <Header title="Overview" />
        <ScrollView style={[s.flex1, s.px4]}>
          {heatmapData.daily.length > 0 && (
            <>
              <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
                <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
                  Daily Habits
                </Text>
              </View>

              {heatmapData?.daily.map((item) => (
                <HeatmapHabitCard
                  key={item.habit._id}
                  variant="daily"
                  habit={item.habit}
                  activity={item.activity}
                  startDate={start}
                  endDate={end}
                />
              ))}
            </>
          )}

          {heatmapData.weekly.length > 0 && (
            <>
              <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
                <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
                  Weekly Habits
                </Text>
              </View>

              {heatmapData?.weekly.map((item) => (
                <HeatmapHabitCard
                  key={item.habit._id}
                  variant="weekly"
                  habit={item.habit}
                  activity={item.activity}
                  startDate={start}
                  endDate={end}
                />
              ))}
            </>
          )}

          {heatmapData.monthly.length > 0 && (
            <>
              <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
                <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
                  Monthly Habits
                </Text>
              </View>

              {heatmapData?.monthly.map((item) => (
                <HeatmapHabitCard
                  key={item.habit._id}
                  variant="monthly"
                  habit={item.habit}
                  activity={item.activity}
                  startDate={start}
                  endDate={end}
                />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
