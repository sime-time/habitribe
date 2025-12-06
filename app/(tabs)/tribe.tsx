import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { UserRoundPlus, UsersRound } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

export default function Tribe() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        <Header title="Tribe" options={true} />
        <View style={[s.px4, s.gap4]}>
          <TouchableOpacity
            onPress={() => router.navigate("/tribe/join/options")}
          >
            <LinearGradient
              colors={colors.gradients.primary}
              style={[s.button]}
            >
              <UserRoundPlus color={colors.primaryForeground} />
              <Text style={[c.textPrimaryForeground, s.fontMedium, s.textLg]}>
                Join Tribe
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate("/tribe/create/name")}
          >
            <LinearGradient
              colors={colors.gradients.secondary}
              style={[s.button, s.border1, c.borderSecondaryForeground]}
            >
              <UsersRound color={colors.secondaryForeground} />
              <Text style={[c.textSecondaryForeground, s.fontMedium, s.textLg]}>
                Create Tribe
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
