import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import HeatmapGrid from "@/components/HeatmapGrid";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { getTodayDateString } from "@/utils/dateHelper";

export default function History() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const today = getTodayDateString();
  const yearAgo = "2024-11-03";

  const heatmapData = useQuery(api.exec.read.getHabitHeatmaps, {
    startDate: yearAgo,
    endDate: today,
  });

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        <Header title="Overview" />
        <ScrollView style={[s.flex1, s.px4]}>
          {heatmapData?.map((item) => (
            <View
              key={item.habit._id}
              style={[
                s.mb5,
                s.p4,
                s.gap3,
                s.roundedLg,
                c.bgCard,
                c.borderDefault,
                s.border1,
              ]}
            >
              <Text style={c.textForeground}>{item.habit.name}</Text>
              <HeatmapGrid
                startDate={yearAgo}
                endDate={today}
                activity={item.activity}
                color={item.habit.color}
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
