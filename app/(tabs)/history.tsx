import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

const TIME_PERIODS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 365 days", days: 365 },
];

export default function History() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        <Header title="Overview" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[s.px4, s.inputHeight]}
        >
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period.days}
              onPress={() => setSelectedPeriod(period.days)}
            >
              <LinearGradient
                colors={
                  selectedPeriod === period.days
                    ? colors.gradients.primary
                    : colors.gradients.muted
                }
                style={[s.px4, s.py1, s.roundedFull, s.mr2, s.justifyCenter]}
              >
                <Text style={[c.textForeground, s.textSm]}>{period.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
