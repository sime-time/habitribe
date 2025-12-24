import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { UsersRound } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

export default function TribeName() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Join Tribe" />
        <View style={[s.gap4, s.px4]}>
          <View
            style={[
              s.p4,
              s.gap3,
              s.roundedLg,
              c.bgCard,
              c.borderDefault,
              s.border1,
            ]}
          >
            <View style={[s.flexRow, s.gap2, s.itemsCenter]}>
              <Ionicons name="code" size={24} color={colors.primary} />
              <Text style={[s.textLg, s.fontSemibold, c.textForeground]}>
                Join with Invite Code
              </Text>
            </View>
            <Text style={[s.fontNormal, s.textSm, c.textForeground]}>
              Have an invite code? Join a tribe directly.
            </Text>
            <TouchableOpacity
              onPress={() => router.navigate("/tribe/join/invite-code")}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                  I have a code
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View
            style={[
              s.p4,
              s.gap3,
              s.roundedLg,
              c.bgCard,
              c.borderDefault,
              s.border1,
            ]}
          >
            <View style={[s.flexRow, s.gap2, s.itemsCenter]}>
              <UsersRound size={24} color={colors.primary} />
              <Text style={[s.textLg, s.fontSemibold, c.textForeground]}>
                Browse Public Tribes
              </Text>
            </View>
            <Text
              style={[s.fontNormal, s.textSm, c.textForeground, s.leading5]}
            >
              Explore a variety of communites tailored to your interests and
              passions.
            </Text>
            <TouchableOpacity
              onPress={() => router.navigate("/tribe/join/browse")}
            >
              <LinearGradient
                colors={colors.gradients.secondary}
                style={[s.button, s.border1, c.borderSecondaryForeground]}
              >
                <Text
                  style={[s.textLg, s.fontMedium, c.textSecondaryForeground]}
                >
                  Browse
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.button, c.bgTransparent]}
            onPress={() => router.back()}
          >
            <Text style={[s.textLg, c.textPrimary]}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
