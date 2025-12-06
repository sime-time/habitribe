import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ClipboardCopy, Copy, Share, Share2 } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

export default function TribeShare() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Grow your Tribe!" />
        <View style={[s.px4, s.justifyBetween, s.flex1]}>
          <View style={s.gap4}>
            <Text style={[s.textBase, c.textForeground]}>
              Invite your friends and clients to join and complete habits
              together.
            </Text>

            <TouchableOpacity
              style={[
                s.p4,
                s.rounded,
                c.bgCard,
                s.border1,
                c.borderDefault,
                s.justifyBetween,
                s.flexRow,
                s.itemsCenter,
              ]}
            >
              <View style={[s.gap1, s.flex5]}>
                <View style={[s.flexRow, s.gap2, s.itemsCenter]}>
                  <ClipboardCopy size={24} color={colors.primary} />
                  <Text style={[s.fontSemibold, s.textLg]}>
                    Invite Code: 123456
                  </Text>
                </View>
                <Text style={[s.textBase, c.textMuted, s.leading6]}>
                  Copy your unique code and send to friends to join your tribe.
                </Text>
              </View>

              <View style={[s.flex1, s.itemsEnd, s.justifyCenter]}>
                <Copy size={24} color={colors.muted} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                s.p4,
                s.rounded,
                c.bgCard,
                s.border1,
                c.borderDefault,
                s.justifyBetween,
                s.flexRow,
                s.itemsCenter,
              ]}
            >
              <View style={[s.gap1, s.flex5]}>
                <View style={[s.flexRow, s.gap2, s.itemsCenter]}>
                  <Share2 size={24} color={colors.primary} />
                  <Text style={[s.fontSemibold, s.textLg]}>
                    Send Invite Link
                  </Text>
                </View>
                <Text style={[s.textBase, c.textMuted, s.leading6]}>
                  Share a personalized deep link with your network
                </Text>
              </View>

              <View style={[s.flex1, s.itemsEnd, s.justifyCenter]}>
                <Share size={24} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={s.gap4}>
            <TouchableOpacity onPress={() => router.navigate("/tribe")}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                  Continue to Tribe
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
