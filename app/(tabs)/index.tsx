import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Switch, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "@/assets/styles/utility.styles";
import HabitView from "@/components/views/HabitView";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useHabitChartStore } from "@/stores/habitChartStore";
import type { ProofMethod, ProofMethodId } from "@/types/HabitTypes";
import {
  calculateStartDateFromNumDays,
  getWeekMonthBounds,
  parseLocalDate,
} from "@/utils/dateHelper";

export default function Index() {
  const { colors } = useTheme();

  const showCharts = useHabitChartStore((state) => state.showCharts);
  const setShowCharts = useHabitChartStore((state) => state.setShowCharts);
  const numDays = useHabitChartStore((state) => state.numDays);
  const currentDate = useHabitChartStore((state) => state.endDate);

  // dates should be calculated on the client side
  // to prevent timezone issues with client/server
  const today = parseLocalDate(currentDate);
  const weekday = today.getDay();
  const bounds = getWeekMonthBounds(today);
  const startDate = calculateStartDateFromNumDays(currentDate, numDays);

  // current period entries (always loaded, grouped by frequency)
  const currentHabitEntries = useQuery(api.exec.read.getGroupedHabitData, {
    date: currentDate,
    weekday,
    bounds,
  });

  // skip this query when showCharts is false
  const chartData = useQuery(
    api.exec.read.getHabitActivity,
    showCharts ? { startDate, endDate: currentDate } : "skip",
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
      date: currentDate,
      weekday,
      bounds,
    });
  }, [currentDate]); // only re-run when date changes

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
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.foreground}
            />
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
        {currentHabitEntries && (
          <HabitView
            date={today}
            dailyHabits={currentHabitEntries.dailyHabits}
            weeklyHabits={currentHabitEntries.weeklyHabits}
            monthlyHabits={currentHabitEntries.monthlyHabits}
            proofMethodMap={proofMethodMap}
            dailyActivity={chartData?.dailyActivity}
            weeklyActivity={chartData?.weeklyActivity}
            monthlyActivity={chartData?.monthlyActivity}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
