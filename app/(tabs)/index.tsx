import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "@/assets/styles/utility.styles";
import HabitView from "@/components/views/HabitView";
import WeekDaySelector from "@/components/WeekDaySelector";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useHabitChartStore } from "@/stores/habitChartStore";
import { useHabitDateStore } from "@/stores/habitDateStore";
import type { ProofMethod, ProofMethodId } from "@/types/HabitTypes";
import {
  calculateStartDateFromNumDays,
  getTodayDateString,
  getWeekMonthBounds,
} from "@/utils/dateHelper";

export default function Index() {
  const { colors } = useTheme();

  // dates should be calculated on the client side
  // to prevent timezone issues with client/server
  const date = useHabitDateStore((state) => state.date);
  const dateId = useHabitDateStore((state) => state.dateId); // "YYYY-MM-DD"
  const weekday = date.getDay();
  const showCharts = useHabitChartStore((state) => state.showCharts);
  const setShowCharts = useHabitChartStore((state) => state.setShowCharts);
  const numDays = useHabitChartStore((state) => state.numDays);
  const startDate = calculateStartDateFromNumDays(dateId, numDays);

  // update bounds when date changes
  const bounds = useMemo(() => getWeekMonthBounds(date), [date]);

  // current period entries (always loaded, grouped by frequency)
  const currentHabitEntries = useQuery(api.exec.read.getGroupedHabitData, {
    date: dateId,
    weekday,
    bounds,
  });

  // skip this query when showCharts is false
  const chartData = useQuery(
    api.exec.read.getHabitActivity,
    showCharts ? { startDate, endDate: getTodayDateString() } : "skip",
  );

  // categorize by proof method
  const proofMethods = useQuery(api.exec.read.getProofMethods);
  const proofMethodMap = proofMethods
    ? new Map(
        proofMethods.map((pm) => [pm._id as ProofMethodId, pm as ProofMethod]),
      )
    : new Map<ProofMethodId, ProofMethod>();

  // create missing entries before querying
  const createMissingEntries = useMutation(api.exec.create.addMissingEntries);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-run when date changes
  useEffect(() => {
    createMissingEntries({
      date: dateId,
      weekday,
      bounds,
    });
  }, [dateId]); // only re-run when date changes

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        {/* HEADER */}
        <View style={[s.p4, s.pt8, s.flexRow, s.justifyBetween, s.itemsCenter]}>
          {/* TOGGLE VIEW BUTTON */}
          <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
            <Switch
              value={showCharts}
              onChange={() => setShowCharts(!showCharts)}
              thumbColor={colors.primaryForeground}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              ios_backgroundColor={colors.border}
            />
            <Ionicons
              name={showCharts ? "bar-chart" : "list"}
              size={24}
              color={colors.foreground}
            />
          </View>

          {/* ADD HABIT BUTTON */}
          <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.foreground}
              />
            </TouchableOpacity>

            <Link href="/habit/form" asChild>
              <TouchableOpacity>
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={[
                    s.roundedFull,
                    s.itemsCenter,
                    s.justifyCenter,
                    { width: 40, height: 40 },
                  ]}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={colors.primaryForeground}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* CONTENT */}
        <ScrollView
          style={[s.flex1, s.px4]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.mb4}>
            <WeekDaySelector />
          </View>

          {currentHabitEntries && (
            <HabitView
              date={date}
              dailyHabits={currentHabitEntries.dailyHabits}
              weeklyHabits={currentHabitEntries.weeklyHabits}
              monthlyHabits={currentHabitEntries.monthlyHabits}
              proofMethodMap={proofMethodMap}
              dailyActivity={chartData?.dailyActivity}
              weeklyActivity={chartData?.weeklyActivity}
              monthlyActivity={chartData?.monthlyActivity}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
