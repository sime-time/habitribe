import { ActivityIndicator, ScrollView, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import DateGroupTitle from "@/components/DateGroupTitle";
import HabitCard from "@/components/habit/HabitCard";
import HabitChart from "@/components/habit/HabitChart";
import useTheme from "@/hooks/useTheme";
import { useHabitChartStore } from "@/stores/habitChartStore";
import type {
  HabitActivity,
  HabitWithEntry,
  ProofMethod,
  ProofMethodId,
} from "@/validation/HabitSchema";

interface HabitActivityViewProps {
  date: Date;
  dailyHabits: HabitWithEntry[];
  weeklyHabits: HabitWithEntry[];
  monthlyHabits: HabitWithEntry[];
  proofMethodMap: Map<ProofMethodId, ProofMethod>;

  // Chart-specific data
  dailyActivity?: HabitActivity[];
  weeklyActivity?: HabitActivity[];
  monthlyActivity?: HabitActivity[];
  isLoadingCharts?: boolean;
}

export default function HabitActivityView({
  date,
  dailyHabits,
  weeklyHabits,
  monthlyHabits,
  proofMethodMap,
  dailyActivity,
  weeklyActivity,
  monthlyActivity,
  isLoadingCharts,
}: HabitActivityViewProps) {
  const { colors } = useTheme();
  const showCharts = useHabitChartStore((state) => state.showCharts);

  if (showCharts && isLoadingCharts) {
    return (
      <View style={[s.flex1, s.justifyCenter, s.itemsCenter]}>
        <ActivityIndicator size="large" color={colors.muted} />
      </View>
    );
  }

  return (
    <ScrollView style={[s.flex1, s.px4]}>
      {dailyHabits.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="daily" />

          {dailyHabits.map((d) => (
            <View key={d.habit._id}>
              <HabitCard
                habit={d.habit}
                entry={d.entry}
                proofMethodType={
                  proofMethodMap.get(d.habit.proofMethodId)?.type as string
                }
              >
                {dailyActivity && (
                  <HabitChart
                    variant="daily"
                    activity={dailyActivity}
                    maxValue={
                      Array.isArray(d.habit.schedule.pattern)
                        ? d.habit.schedule.pattern.length
                        : Number(d.habit.schedule.pattern)
                    }
                    color={d.habit.color}
                  />
                )}
              </HabitCard>
            </View>
          ))}
        </>
      )}

      {weeklyHabits.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="weekly" />

          {weeklyHabits.map((w) => (
            <View key={w.habit._id}>
              <HabitCard
                habit={w.habit}
                entry={w.entry}
                proofMethodType={
                  proofMethodMap.get(w.habit.proofMethodId)?.type as string
                }
              >
                {weeklyActivity && (
                  <HabitChart
                    variant="weekly"
                    activity={weeklyActivity}
                    maxValue={
                      Array.isArray(w.habit.schedule.pattern)
                        ? w.habit.schedule.pattern.length
                        : Number(w.habit.schedule.pattern)
                    }
                    color={w.habit.color}
                  />
                )}
              </HabitCard>
            </View>
          ))}
        </>
      )}

      {monthlyHabits.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="monthly" />

          {monthlyHabits.map((m) => (
            <View key={m.habit._id}>
              <HabitCard
                habit={m.habit}
                entry={m.entry}
                proofMethodType={
                  proofMethodMap.get(m.habit.proofMethodId)?.type as string
                }
              >
                {monthlyActivity && (
                  <HabitChart
                    variant="monthly"
                    activity={monthlyActivity}
                    maxValue={
                      Array.isArray(m.habit.schedule.pattern)
                        ? m.habit.schedule.pattern.length
                        : Number(m.habit.schedule.pattern)
                    }
                    color={m.habit.color}
                  />
                )}
              </HabitCard>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
