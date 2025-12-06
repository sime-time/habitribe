import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import TribeHabit from "@/components/tribe/TribeHabit";
import useTheme from "@/hooks/useTheme";
import { useTribeStore } from "@/stores/tribeStore";

export default function TribeHabits() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const habits = useTribeStore((state) => state.habits);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Tribe Habits" />
        <View style={[s.px4, s.justifyBetween, s.flex1]}>
          <View style={s.gap4}>
            <Text style={[s.textBase, c.textForeground]}>
              (Optional) Set the habits that every tribe member is required to
              complete.
            </Text>

            {/* Tribe Habit List */}
            <View>
              {habits.length > 0 &&
                habits.map((data) => (
                  <TribeHabit
                    key={data.index}
                    index={data.index}
                    habit={data.habit}
                  />
                ))}
            </View>

            {/* Add Habit Button */}
            <View style={s.itemsCenter}>
              <TouchableOpacity
                onPress={() => router.push("/habit/form?tribeHabit=true")}
              >
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
            </View>
          </View>

          <View style={s.gap4}>
            <TouchableOpacity
              onPress={() => router.navigate("/tribe/create/share")}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                  Create Tribe
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[s.textLg, c.textPrimary, s.textCenter]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
