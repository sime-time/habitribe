import { Redirect, Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Calendar, Camera, Cog } from "lucide-react-native";
import HabitSelectSheet from "@/components/HabitSelectSheet";
import { useFirstTimeOpen } from "@/hooks/useFirstTimeOpen";
import useTheme from "@/hooks/useTheme";
import { useHabitSelectStore } from "@/stores/habitSelectStore";

export default function TabsLayout() {
  const { colors } = useTheme();

  const { isOpen, closeSheet } = useHabitSelectStore();

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
              <SymbolView
                name="calendar"
                size={size}
                tintColor={color}
                fallback={<Calendar size={size} color={color} />}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "Camera",
            tabBarIcon: ({ color, size }) => (
              <SymbolView
                name="camera"
                size={size}
                tintColor={color}
                fallback={<Camera size={size} color={color} />}
              />
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
      {isOpen && <HabitSelectSheet closeSheet={closeSheet} />}
    </>
  );
}
