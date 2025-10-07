import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { createHabitStyles } from "@/assets/styles/habit.styles";
import useTheme from "@/hooks/useTheme";

export default function CreateHabitLayout() {
  const { colors } = useTheme();
  const styles = createHabitStyles(colors);
  const router = useRouter();

  const renderReturnButton = (text: string) => (
    <TouchableOpacity onPress={() => router.back()}>
      <Text style={[styles.body, { color: colors.primary }]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="form"
        options={{
          headerTitle: "Habit",
          headerTitleStyle: styles.body,
          headerStyle: styles.header,
          headerLeft: () => renderReturnButton("Cancel"),
        }}
      />
      <Stack.Screen
        name="icon"
        options={{
          headerTitle: "Icon",
          headerTitleStyle: styles.body,
          headerStyle: styles.header,
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="frequency"
        options={{
          headerTitle: "Frequency",
          headerTitleStyle: styles.body,
          headerStyle: styles.header,
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="goal"
        options={{
          headerTitle: "Set Goal",
          headerTitleStyle: styles.body,
          headerStyle: styles.header,
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="time"
        options={{
          headerTitle: "Set Time",
          headerTitleStyle: styles.body,
          headerStyle: styles.header,
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
      <Stack.Screen
        name="proof"
        options={{
          headerTitle: "Proof",
          headerTitleStyle: styles.body,
          headerStyle: styles.header,
          headerLeft: () => renderReturnButton("Back"),
        }}
      />
    </Stack>
  );
}
