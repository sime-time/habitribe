import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ClipboardCopy, Copy, CopyCheck } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

export default function TribeShare() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const { inviteCode } = useLocalSearchParams<{
    inviteCode: string;
  }>();

  const [copied, setCopied] = useState(false);

  const copyInviteCode = async () => {
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    Toast.show({
      type: "success",
      text1: "Copied Invite Code",
    });
  };
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
              onPress={copyInviteCode}
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
                    Invite Code: {inviteCode}
                  </Text>
                </View>
                <Text style={[s.textBase, c.textMuted, s.leading6]}>
                  Copy your unique code and send to friends to join your tribe.
                </Text>
              </View>

              <View style={[s.flex1, s.itemsEnd, s.justifyCenter]}>
                {copied ? (
                  <CopyCheck size={24} color={colors.muted} />
                ) : (
                  <Copy size={24} color={colors.muted} />
                )}
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
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
