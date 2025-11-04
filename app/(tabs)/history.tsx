import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import Header from "@/components/Header";
import HeatmapGrid from "@/components/HeatmapGrid";
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
              {/* Header: Icon + Name + Streak */}
              <View style={[s.flexRow, s.itemsCenter, s.gap3]}>
                <View
                  style={[
                    s.p2,
                    s.roundedMd,
                    s.itemsCenter,
                    s.justifyCenter,
                    { backgroundColor: `${item.habit.color}30` },
                  ]}
                >
                  <Emoji
                    iconName={item.habit.icon}
                    iconColor={item.habit.color}
                    iconSize={20}
                  />
                </View>
                <View style={[s.flexCol, s.gap1]}>
                  <Text style={[s.textBase, s.fontMedium, c.textForeground]}>
                    {item.habit.name}
                  </Text>
                  <Text style={[s.textXs, c.textMuted]}>
                    Streak: 3, Completed 47
                  </Text>
                </View>
              </View>

              <HeatmapGrid
                startDate={start}
                endDate={end}
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
