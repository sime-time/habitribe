import { useAuthActions } from "@convex-dev/auth/react";
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
import { createAuthStyles } from "@/assets/styles/auth.styles";
import useTheme from "@/hooks/useTheme";
import { EmailSchema } from "@/validation/EmailSchema";

export default function SignIn() {
  const { colors } = useTheme();
  const styles = createAuthStyles(colors);

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
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome! Let's get started.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.mutedForeground}
            onChangeText={setEmail}
            value={email}
            inputMode="email"
            autoCapitalize="none"
          />

          <TouchableOpacity onPress={handleSignIn} disabled={loading}>
            <LinearGradient
              colors={
                loading ? colors.gradients.muted : colors.gradients.primary
              }
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.mutedForeground}
                />
              ) : (
                <Text style={styles.buttonText}>
                  {step === "signIn" ? "Sign in" : "Sign up"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  ) : (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify your Email</Text>
          <Text style={styles.subtitle}>We have sent a code to {email}</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Code"
            placeholderTextColor={colors.mutedForeground}
            onChangeText={setCode}
            value={code}
          />
          <TouchableOpacity onPress={handleVerifyCode} disabled={loading}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={colors.mutedForeground}
                />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <Button
            title="Cancel"
            color={colors.secondaryForeground}
            onPress={() => setStep("signIn")}
            disabled={loading}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
