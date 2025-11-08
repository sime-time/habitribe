import { ScrollView, Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import HabitCard from "@/components/HabitCard";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import type { HabitWithEntry } from "@/validation/HabitSchema";

type ProofMethodId = Id<"proofMethods">;
type ProofMethod = Doc<"proofMethods">;

interface CurrentPeriodViewProps {
  dailyHabits: HabitWithEntry[];
  weeklyHabits: HabitWithEntry[];
  monthlyHabits: HabitWithEntry[];
  proofMethodMap: Map<ProofMethodId, ProofMethod>;
}

export default function CurrentPeriodView({
  dailyHabits,
  weeklyHabits,
  monthlyHabits,
  proofMethodMap,
}: CurrentPeriodViewProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <ScrollView style={[s.flex1, s.px4]}>
      {dailyHabits.length > 0 && (
        <>
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Daily Habits
            </Text>
          </View>

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
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Weekly Habits
            </Text>
          </View>

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
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Monthly Habits
            </Text>
          </View>

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
