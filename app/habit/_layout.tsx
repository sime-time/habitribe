import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { combine, s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";

export default function CreateHabitLayout() {
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
        name="form"
        options={{
          headerTitle: "Habit",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Cancel"),
        }}
      />
      <Stack.Screen
        name="icon"
        options={{
          headerTitle: "Icon",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="frequency"
        options={{
          headerTitle: "Set Frequency",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="goal"
        options={{
          headerTitle: "Set Goal",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="time"
        options={{
          headerTitle: "Set Time",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="proof"
        options={{
          headerTitle: "Select Proof",
          headerTitleStyle: combine(s.fontMedium, s.textLg, c.textForeground),
          headerStyle: combine(c.bgBackground),
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
    </Stack>
  );
}
