import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import DateGroupTitle from "@/components/DateGroupTitle";
import HabitCard from "@/components/habit/HabitCard";
import HabitChart from "@/components/habit/HabitChart";
import type { Id } from "@/convex/_generated/dataModel";
import type {
  Activity,
  HabitActivity,
  HabitWithEntry,
  ProofMethod,
  ProofMethodId,
} from "@/types/HabitTypes";

// Converts array of HabitActivity into a Map for O(1) lookup by habitId
export function createActivityMap(
  habitActivities: HabitActivity[],
): Map<Id<"habits">, Activity[]> {
  return new Map(habitActivities.map((ha) => [ha.habitId, ha.activity]));
}

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
}: HabitActivityViewProps) {
  // create maps for O(1) lookup
  const dailyActivityMap = useMemo(
    () => (dailyActivity ? createActivityMap(dailyActivity) : null),
    [dailyActivity],
  );
  const weeklyActivityMap = useMemo(
    () => (weeklyActivity ? createActivityMap(weeklyActivity) : null),
    [weeklyActivity],
  );
  const monthlyActivityMap = useMemo(
    () => (monthlyActivity ? createActivityMap(monthlyActivity) : null),
    [monthlyActivity],
  );
  return (
    <ScrollView style={[s.flex1, s.px4]}>
      {dailyHabits.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="daily" />

          {dailyHabits.map((d) => {
            const activity = dailyActivityMap
              ? dailyActivityMap.get(d.habit._id)
              : [];

            return (
              <View key={d.habit._id}>
                <HabitCard
                  habit={d.habit}
                  entry={d.entry}
                  proofMethodType={
                    proofMethodMap.get(d.habit.proofMethodId)?.type as string
                  }
                >
                  {dailyActivityMap && activity && (
                    <HabitChart
                      variant="daily"
                      activity={activity}
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
            );
          })}
        </>
      )}

      {weeklyHabits.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="weekly" />

          {weeklyHabits.map((w) => {
            const activity = weeklyActivityMap
              ? weeklyActivityMap.get(w.habit._id)
              : [];

            return (
              <View key={w.habit._id}>
                <HabitCard
                  habit={w.habit}
                  entry={w.entry}
                  proofMethodType={
                    proofMethodMap.get(w.habit.proofMethodId)?.type as string
                  }
                >
                  {weeklyActivityMap && activity && (
                    <HabitChart
                      variant="weekly"
                      activity={activity}
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
            );
          })}
        </>
      )}

      {monthlyHabits.length > 0 && (
        <>
          <DateGroupTitle date={date} variant="monthly" />

          {monthlyHabits.map((m) => {
            const activity = monthlyActivityMap
              ? monthlyActivityMap.get(m.habit._id)
              : [];

            return (
              <View key={m.habit._id}>
                <HabitCard
                  habit={m.habit}
                  entry={m.entry}
                  proofMethodType={
                    proofMethodMap.get(m.habit.proofMethodId)?.type as string
                  }
                >
                  {monthlyActivityMap && activity && (
                    <HabitChart
                      variant="monthly"
                      activity={activity}
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
            );
          })}
        </>
      )}
    </ScrollView>
  );
}
