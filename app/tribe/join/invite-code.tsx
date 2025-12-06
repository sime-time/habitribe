import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

export default function TribeInviteCode() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={[s.flex1]}>
        <Header title="Invite Code" />
        {/* VERIFY OTP */}
        <View style={[s.flex1, s.gap6, s.px4]}>
          <Text style={[s.textBase, c.textForeground]}>
            Input the tribe's unique invite code.
          </Text>
          <View style={[s.gap4]}>
            <View style={[s.input, c.borderDefault]}>
              <TextInput
                style={[c.textForeground, s.textBase]}
                placeholder="Code"
                placeholderTextColor={colors.muted}
                onChangeText={setCode}
                inputMode={"numeric"}
                value={code}
              />
            </View>
            <TouchableOpacity disabled={loading}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.muted} />
                ) : (
                  <Text
                    style={[c.textPrimaryForeground, s.textLg, s.fontMedium]}
                  >
                    Continue
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.button, c.bgTransparent]}
              onPress={() => router.back()}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.muted} />
              ) : (
                <Text style={[s.textLg, c.textPrimary]}>Back</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
