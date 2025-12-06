import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";
import { useTribeStore } from "@/stores/tribeStore";

export default function TribeName() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const tribeName = useTribeStore((state) => state.name);
  const setTribeName = useTribeStore((state) => state.setName);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (tribeName !== "" && tribeName.length < 20) {
      setError("");
      router.navigate("/tribe/create/visibility");
    } else {
      setError("Your tribe must have a name less than 20 characters.");
    }
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Name Your Tribe" />
        <View style={[s.gap4, s.px4]}>
          <Text style={[s.textBase, c.textForeground]}>
            Choose a name for your accountability group
          </Text>

          <View style={[s.input, c.borderDefault]}>
            <TextInput
              style={[c.textForeground, s.textBase]}
              placeholder="Name"
              placeholderTextColor={colors.muted}
              value={tribeName}
              onChangeText={setTribeName}
              inputMode="text"
            />
          </View>

          <TouchableOpacity onPress={handleContinue}>
            <LinearGradient colors={colors.gradients.primary} style={s.button}>
              <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                Continue
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={[s.button, c.bgTransparent]}
          >
            <Text style={[s.textLg, c.textPrimary, s.textCenter]}>Back</Text>
          </TouchableOpacity>

          <Text style={[s.textSm, c.textDestructive, s.textCenter]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
