import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { s } from "@/assets/styles/utility.styles";
import DateGroupTitle from "@/components/DateGroupTitle";
import EmptyState from "@/components/EmptyState";
import HabitCard from "@/components/habit/HabitCard";
import HabitChart from "@/components/habit/HabitChart";
import ProgressBar from "@/components/ProgressBar";
import WeekDaySelector from "@/components/WeekDaySelector";
import type { Id } from "@/convex/_generated/dataModel";
import type {
  Activity,
  HabitActivity,
  HabitWithEntryAndStreak,
  ProofMethod,
  ProofMethodId,
} from "@/types/HabitTypes";

// Converts array of HabitActivity into a Map for O(1) lookup by habitId
export function createActivityMap(
  habitActivities: HabitActivity[],
): Map<Id<"habits">, Activity[]> {
  return new Map(habitActivities.map((ha) => [ha.habitId, ha.activity]));
}

interface HabitViewProps {
  date: Date;
  dailyHabits: HabitWithEntryAndStreak[];
  weeklyHabits: HabitWithEntryAndStreak[];
  monthlyHabits: HabitWithEntryAndStreak[];
  proofMethodMap: Map<ProofMethodId, ProofMethod>;

  // Chart-specific data
  dailyActivity?: HabitActivity[];
  weeklyActivity?: HabitActivity[];
  monthlyActivity?: HabitActivity[];
}

export default function HabitView({
  date,
  dailyHabits,
  weeklyHabits,
  monthlyHabits,
  proofMethodMap,
  dailyActivity,
  weeklyActivity,
  monthlyActivity,
}: HabitViewProps) {
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
  const allHabitsEmpty =
    dailyHabits.length === 0 &&
    weeklyHabits.length === 0 &&
    monthlyHabits.length === 0;

  return (
    <GestureHandlerRootView style={s.flex1}>
      <ScrollView style={[s.flex1, s.px4]} showsVerticalScrollIndicator={false}>
        <View style={s.mb4}>
          <WeekDaySelector />
        </View>

        {allHabitsEmpty && <EmptyState />}

        {dailyHabits.length > 0 && (
          <>
            <View style={s.mb3}>
              <DateGroupTitle date={date} variant="daily" />
              <ProgressBar habitData={dailyHabits} />
            </View>

            {dailyHabits.map((d) => {
              const activity = dailyActivityMap
                ? dailyActivityMap.get(d.habit._id)
                : null;

              return (
                <View key={d.habit._id}>
                  <HabitCard
                    habit={d.habit}
                    entry={d.entry}
                    streak={d.streak}
                    proofMethodType={
                      proofMethodMap.get(d.habit.proofMethodId)?.type as string
                    }
                  >
                    {activity && (
                      <HabitChart
                        variant="daily"
                        activity={activity}
                        maxValue={
                          Array.isArray(d.habit.schedule.pattern)
                            ? 1
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
            <View style={s.mb3}>
              <DateGroupTitle date={date} variant="weekly" />
              <ProgressBar habitData={weeklyHabits} />
            </View>

            {weeklyHabits.map((w) => {
              const activity = weeklyActivityMap
                ? weeklyActivityMap.get(w.habit._id)
                : null;

              return (
                <View key={w.habit._id}>
                  <HabitCard
                    habit={w.habit}
                    entry={w.entry}
                    streak={w.streak}
                    proofMethodType={
                      proofMethodMap.get(w.habit.proofMethodId)?.type as string
                    }
                  >
                    {activity && (
                      <HabitChart
                        variant="weekly"
                        activity={activity}
                        maxValue={Number(w.habit.schedule.pattern)}
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
            <View style={s.mb3}>
              <DateGroupTitle date={date} variant="monthly" />
              <ProgressBar habitData={monthlyHabits} />
            </View>
            {monthlyHabits.map((m) => {
              const activity = monthlyActivityMap
                ? monthlyActivityMap.get(m.habit._id)
                : null;

              return (
                <View key={m.habit._id}>
                  <HabitCard
                    habit={m.habit}
                    entry={m.entry}
                    streak={m.streak}
                    proofMethodType={
                      proofMethodMap.get(m.habit.proofMethodId)?.type as string
                    }
                  >
                    {activity && (
                      <HabitChart
                        variant="monthly"
                        activity={activity}
                        maxValue={Number(m.habit.schedule.pattern)}
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
    </GestureHandlerRootView>
  );
}
