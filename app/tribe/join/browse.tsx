import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import useTheme from "@/hooks/useTheme";

export default function BrowseTribes() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Browse Tribes" />
        <TouchableOpacity
          style={[s.button, c.bgTransparent]}
          onPress={() => router.back()}
        >
          <Text style={[s.textLg, c.textPrimary]}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
