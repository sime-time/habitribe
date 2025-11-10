import { ScrollView, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import HabitCard from "@/components/HabitCard";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { HabitWithEntry } from "@/validation/HabitSchema";
import DateGroupTitle from "./DateGroupTitle";

type ProofMethodId = Id<"proofMethods">;
type ProofMethod = Doc<"proofMethods">;

interface CurrentPeriodViewProps {
  date: Date;
  dailyHabits: HabitWithEntry[];
  weeklyHabits: HabitWithEntry[];
  monthlyHabits: HabitWithEntry[];
  proofMethodMap: Map<ProofMethodId, ProofMethod>;
}

export default function CurrentPeriodView({
  date,
  dailyHabits,
  weeklyHabits,
  monthlyHabits,
  proofMethodMap,
}: CurrentPeriodViewProps) {
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
              />
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
              />
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
              />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
