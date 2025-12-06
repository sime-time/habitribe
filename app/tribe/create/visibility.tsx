import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Globe, Lock } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";
import { useTribeStore } from "@/stores/tribeStore";

export default function TribeVisibility() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const privateTribe = useTribeStore((state) => state.private);
  const setPrivateTribe = useTribeStore((state) => state.setPrivate);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Set Tribe Visibility" />
        <View style={[s.px4, s.justifyBetween, s.flex1]}>
          <View style={s.gap4}>
            <Text style={[s.textBase, c.textForeground]}>
              Choose who can find and join your tribe. This can be changed later
              in your settings.
            </Text>

            <View style={[s.flexRow, s.gap3]}>
              <TouchableOpacity
                onPress={() => setPrivateTribe(false)}
                style={[
                  s.py4,
                  s.px1,
                  s.flex1,
                  s.itemsCenter,
                  s.gap1,
                  s.roundedMd,
                  s.border1,
                  c.borderDefault,
                  privateTribe ? c.bgCard : c.bgPrimary,
                ]}
              >
                <Globe
                  color={privateTribe ? colors.muted : colors.primaryForeground}
                  size={24}
                />
                <Text
                  style={[
                    s.textLg,
                    s.fontSemibold,
                    privateTribe ? c.textMuted : c.textPrimaryForeground,
                  ]}
                >
                  Public
                </Text>
                <Text
                  style={[
                    s.textCenter,
                    s.fontNormal,
                    privateTribe ? c.textMuted : c.textPrimaryForeground,
                  ]}
                >
                  Anyone can find, view, and join your tribe.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPrivateTribe(true)}
                style={[
                  s.py4,
                  s.px1,
                  s.flex1,
                  s.itemsCenter,
                  s.gap1,
                  s.roundedMd,
                  s.border1,
                  c.borderDefault,
                  privateTribe ? c.bgPrimary : c.bgCard,
                ]}
              >
                <Lock
                  color={privateTribe ? colors.primaryForeground : colors.muted}
                  size={24}
                />
                <Text
                  style={[
                    s.textLg,
                    s.fontSemibold,
                    privateTribe ? c.textPrimaryForeground : c.textMuted,
                  ]}
                >
                  Private
                </Text>
                <Text
                  style={[
                    s.textCenter,
                    s.fontNormal,
                    privateTribe ? c.textPrimaryForeground : c.textMuted,
                  ]}
                >
                  Only invited members can join.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.gap4}>
            <TouchableOpacity
              onPress={() => router.navigate("/tribe/create/habits")}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                  Continue
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
