import { Tabs } from "expo-router";
import { Cog, ScrollText } from "lucide-react-native";
import HabitSheet from "@/components/HabitSheet";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { isOpen, closeSheet, habit } = useHabitSheetStore();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 10,
            height: 90,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Habits",
            tabBarIcon: ({ color, size }) => (
              <ScrollText size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => <Cog size={size} color={color} />,
          }}
        />
      </Tabs>
      {isOpen && <HabitSheet habit={habit} closeSheet={closeSheet} />}
    </>
  );
}
