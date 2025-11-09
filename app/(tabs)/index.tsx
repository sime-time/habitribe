import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "@/assets/styles/utility.styles";
import CurrentPeriodView from "@/components/CurrentPeriodView";
import HeatmapView from "@/components/HeatmapView";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useHabitActivityView } from "@/hooks/useHabitActivityView";
import useTheme from "@/hooks/useTheme";
import {
  getTodayDateString,
  getWeekMonthBounds,
  getYearBounds,
} from "@/utils/dateHelper";

type ProofMethod = Doc<"proofMethods">;
type ProofMethodId = Id<"proofMethods">;

export default function Index() {
  const { colors } = useTheme();

  const habitDate = getTodayDateString();
  const { currentHabitEntries, heatmapData, showHeatmap, setShowHeatmap } =
    useHabitActivityView(habitDate);

  // dates should be calculated on the client side
  // this prevents timezone issues with client/server
  const today = new Date(habitDate);
  const weekday = today.getDay(); // 0-6 for daily habit pattern matching
  const bounds = getWeekMonthBounds(today);
  const { start: yearStart, end: yearEnd } = getYearBounds(today);

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
      date: habitDate,
      weekday,
      bounds,
    });
  }, [habitDate]); // only re-run when date changes

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        {/* HEADER */}
        <View style={[s.p4, s.pt8, s.flexRow, s.justifyBetween, s.itemsCenter]}>
          {/* TOGGLE VIEW BUTTON */}
          <TouchableOpacity
            onPress={() => setShowHeatmap(!showHeatmap)}
            style={[s.p2]}
          >
            <Ionicons
              name={showHeatmap ? "calendar" : "stats-chart"}
              size={24}
              color={colors.foreground}
            />
          </TouchableOpacity>

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
        {!showHeatmap && currentHabitEntries && (
          <CurrentPeriodView
            date={today}
            dailyHabits={currentHabitEntries.dailyHabits}
            weeklyHabits={currentHabitEntries.weeklyHabits}
            monthlyHabits={currentHabitEntries.monthlyHabits}
            proofMethodMap={proofMethodMap}
          />
        )}

        {showHeatmap &&
          (heatmapData ? (
            <HeatmapView
              date={today}
              daily={heatmapData.daily}
              weekly={heatmapData.weekly}
              monthly={heatmapData.monthly}
              startDate={yearStart}
              endDate={yearEnd}
            />
          ) : (
            <View style={[s.flex1, s.justifyCenter, s.itemsCenter]}>
              <ActivityIndicator size="large" color={colors.muted} />
            </View>
          ))}
      </SafeAreaView>
    </LinearGradient>
  );
}
