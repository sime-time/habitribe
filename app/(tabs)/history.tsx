import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import HeatmapCalendar from "@/components/HeatmapCalendar";
import useTheme from "@/hooks/useTheme";

export default function History() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        <Header title="Overview" />
        <HeatmapCalendar startDate={"2025-10-01"} endDate={"2025-10-27"} />
      </SafeAreaView>
    </LinearGradient>
  );
}
