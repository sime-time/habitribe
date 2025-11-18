import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { combine, s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";

export default function CreateProofSelectLayout() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const router = useRouter();

  const renderReturnButton = (text: string) => (
    <TouchableOpacity onPress={() => router.back()}>
      <Text style={[s.fontMedium, s.textLg, c.textPrimary]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Proof",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Cancel"),
        }}
      />
    </Stack>
  );
}
