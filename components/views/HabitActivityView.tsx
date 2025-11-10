import { ActivityIndicator, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
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
  const { showCharts } = useHabitChartStore();

  if (showCharts && isLoadingCharts) {
    <View style={[s.flex1, s.justifyCenter, s.itemsCenter]}>
      <ActivityIndicator size="large" color={colors.muted} />
    </View>;
  }
}
