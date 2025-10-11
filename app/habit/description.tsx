import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import { getProofMethodDescription } from "@/utils/habitFormLabels";

const MAX_CHARACTERS = 100;

export default function HabitDescription() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const description = useHabitFormStore((state) => state.habitForm.description);
  const updateForm = useHabitFormStore((state) => state.updateForm);
  const proofMethodId = useHabitFormStore(
    (state) => state.habitForm.proofMethodId,
  );

  // create description hints and examples based on proof method
  const proofMethods = useQuery(api.exec.read.getProofMethods);
  const getHints = (): { label: string; placeholder: string } => {
    const proofMethodDescription = getProofMethodDescription(
      proofMethodId,
      proofMethods,
    );
    switch (proofMethodDescription) {
      case "send a photo":
        return {
          label: "I'll send a photo of",
          placeholder:
            "E.g., myself at the gym, the book I'm reading, my feet with shoes on...",
        };
      default:
        return {
          label: "I'll self-verify that I'll",
          placeholder: "E.g., go to the gym, read for 30 minutes, meditate...",
        };
    }
  };

  // limit description length
  const characterCount = description.length;
  const isNearLimit = characterCount >= MAX_CHARACTERS * 0.5; // 50% threshold
  const isAtLimit = characterCount >= MAX_CHARACTERS;

  const getCharCountColor = () => {
    if (isAtLimit) return colors.destructive;
    if (isNearLimit) return colors.warning;
    return colors.muted;
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <View style={[s.flex1, s.p4]}>
          <View style={[s.flex1, s.gap2]}>
            <Text style={[s.textXs, s.ml2, c.textMuted] as TextStyle[]}>
              {getHints().label.toUpperCase()}
            </Text>

            <View
              style={[
                s.p4,
                c.bgCard,
                s.roundedMd,
                s.border1,
                c.borderDefault,
                { minHeight: 120 },
              ]}
            >
              <TextInput
                value={description}
                onChangeText={(text) => updateForm("description", text)}
                placeholder={getHints().placeholder}
                placeholderTextColor={colors.muted}
                multiline
                autoFocus
                textAlignVertical="top"
                maxLength={MAX_CHARACTERS}
                autoCapitalize="none"
                style={
                  [
                    s.flex1,
                    s.textLg,
                    c.textForeground,
                    { lineHeight: 24 },
                  ] as TextStyle[]
                }
              />
            </View>

            <View style={[s.flexCol, s.justifyBetween, s.px2, s.mt1]}>
              <Text style={[s.textSm, c.textMuted] as TextStyle[]}>
                What specific action, situation, or task would you like to
                repeat consistently?{" "}
                <Text
                  style={[
                    s.textSm,
                    s.fontMedium,
                    { color: getCharCountColor() },
                  ]}
                >
                  {characterCount}/{MAX_CHARACTERS}
                </Text>
              </Text>
            </View>

            <TouchableOpacity style={s.mt2} onPress={() => router.back()}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                  Done
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
