import { useAuthActions } from "@convex-dev/auth/react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ConvexError } from "convex/values";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ZodError } from "zod";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import { EmailSchema } from "@/validation/EmailSchema";

export default function SignIn() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const { signIn } = useAuthActions();

  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const valid = EmailSchema.parse({ email });
      await signIn("resend-otp", {
        email: valid.email,
        flow: step,
      });
      setStep({ email: valid.email });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        Toast.show({ type: "error", text1: err.issues[0].message });
      } else if (err instanceof ConvexError) {
        Toast.show({ type: "error", text1: err.data });
      } else {
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      await signIn("resend-otp", {
        email: email,
        code: code,
        flow: "email-verification",
      });
    } catch (err: unknown) {
      console.error("Verification Error", err);
      if (err instanceof ConvexError) {
        Toast.show({ type: "error", text1: err.data });
      } else if (
        err instanceof Error &&
        err.message?.includes("Could not verify code")
      ) {
        Toast.show({
          type: "error",
          text1: "The verification code is incorrect.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unexpected error occured during verification.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return step === "signIn" ? (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={[s.flex1, s.px4]}>
        <View style={[s.pt8, s.pb6, s.gap4, s.itemsCenter]}>
          <Text style={[c.textForeground, s.textCenter, s.text3xl, s.fontBold]}>
            Welcome to Habitribe!
          </Text>
          <Text style={[c.textMuted, s.textLg, s.fontMedium]}>
            Sign in or create an account to continue
          </Text>
        </View>

        <View style={[s.flex1, s.gap6]}>
          {/* OAUTH PROVIDERS */}
          <View style={[s.gap4]}>
            <TouchableOpacity
              disabled={loading}
              style={[s.button, c.bgForeground]}
            >
              <AntDesign name="apple" size={24} color={colors.background} />
              <Text style={[s.textBase, c.textBackground]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              style={[s.button, c.bgCard, s.border2, c.borderDefault]}
            >
              <AntDesign name="google" size={24} color={colors.foreground} />
              <Text style={[s.textBase, c.textForeground]}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
            <View style={[s.divider, s.flex1, c.bgMuted, s.opacity50]} />
            <Text style={[s.textSm, c.textMuted]}>or</Text>
            <View style={[s.divider, s.flex1, c.bgMuted, s.opacity50]} />
          </View>

          {/* EMAIL OTP */}
          <View style={s.gap4}>
            <View style={[s.input, c.borderDefault]}>
              <TextInput
                style={c.textForeground}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                onChangeText={setEmail}
                value={email}
                inputMode="email"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity onPress={handleSignIn} disabled={loading}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.muted} />
                ) : (
                  <Text style={[s.textBase, c.textPrimaryForeground]}>
                    Continue with Email
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  ) : (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={[s.flex1, s.px6]}>
        <View style={[s.pt8, s.pb6, s.gap2, s.itemsCenter]}>
          <Text style={[c.textForeground, s.textCenter, s.text3xl, s.fontBold]}>
            Verify your Email
          </Text>
          <Text style={[c.textMuted, s.textLg, s.fontMedium, s.textCenter]}>
            We have sent a code to {email}
          </Text>
        </View>

        {/* VERIFY OTP */}
        <View style={[s.flex1, s.gap6]}>
          <View style={[s.gap4]}>
            <View style={[s.input, c.borderDefault]}>
              <TextInput
                style={c.textForeground}
                placeholder="Code"
                placeholderTextColor={colors.muted}
                onChangeText={setCode}
                value={code}
              />
            </View>
            <TouchableOpacity onPress={handleVerifyCode} disabled={loading}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.muted} />
                ) : (
                  <Text style={[c.textPrimaryForeground, s.textBase]}>
                    Submit
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <Button
              title="Cancel"
              color={colors.muted}
              onPress={() => setStep("signIn")}
              disabled={loading}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
