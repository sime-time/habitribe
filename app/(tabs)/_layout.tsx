import { Redirect, Tabs } from "expo-router";
import { Camera, Cog, ListCheck } from "lucide-react-native";
import HabitSheet from "@/components/HabitSheet";
import { useFirstTimeOpen } from "@/hooks/useFirstTimeOpen";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";

export default function TabsLayout() {
  const { colors } = useTheme();

  const { isOpen, closeSheet } = useHabitSheetStore();

  // for camera permissions
  const { isFirstTime, isLoading } = useFirstTimeOpen();
  if (isLoading) return null;
  if (isFirstTime) return <Redirect href={"/onboarding"} />;

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
              <ListCheck size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "Camera",
            tabBarIcon: ({ color, size }) => (
              <Camera size={size} color={color} />
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
      {isOpen && <HabitSheet habitSelected={null} closeSheet={closeSheet} />}
    </>
  );
}
