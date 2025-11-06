import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import HabitCard from "@/components/HabitCard";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { getDateBounds, getTodayDateString } from "@/utils/dateHelper";

export default function Index() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const longDateName = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // format today's date to YYYY-MM-DD
  const habitDate = getTodayDateString();

  // client side should calculate any dates
  // this prevents timezone issues with client/server
  const today = new Date(habitDate);
  const weekday = today.getDay(); // 0-6 for daily habit pattern matching
  const bounds = getDateBounds(today);

  // get all proof methods
  const proofMethods = useQuery(api.exec.read.getProofMethods);
  const proofMethodMap = useMemo(() => {
    if (!proofMethods) return new Map();
    return new Map(proofMethods.map((pm) => [pm._id, pm]));
  }, [proofMethods]);

  // create any of today's missing habit entries before querying them
  const createMissingEntries = useMutation(api.exec.create.addMissingEntries);

  // get today's habit entries
  const habits = useQuery(api.exec.read.getGroupedHabitEntries, {
    date: habitDate,
    weekday,
    bounds,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress mutation dependency
  useEffect(() => {
    createMissingEntries({
      date: habitDate,
      weekday,
      bounds,
    });
  }, [habitDate]); // only re-run when date changes

  // arrays need to be defined to an empty array by default
  const {
    dailyHabits = [],
    weeklyHabits = [],
    monthlyHabits = [],
  } = habits || {}; // if habit is undefined, use an empty object

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        {/* HEADER */}
        <View style={[s.p4, s.pt8, s.flexRow, s.justifyBetween, s.itemsCenter]}>
          <View style={s.flex1}>
            <Text style={[s.text3xl, s.fontBold, c.textForeground]}>Today</Text>
            <Text style={[s.textSm, c.textMuted]}>{longDateName}</Text>
          </View>
          <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
            <View>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.foreground}
              />
            </View>

            {/* ADD HABIT BUTTON */}
            <Link href="/habit/form" asChild>
              <TouchableOpacity>
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={[
                    s.roundedFull,
                    s.itemsCenter,
                    s.justifyCenter,
                    { width: 40, height: 40 },
                  ]}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={colors.primaryForeground}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* HABIT LIST */}
        <ScrollView style={[s.flex1, s.px4]}>
          {dailyHabits.length > 0 && (
            <>
              <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
                <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
                  Daily Habits
                </Text>
              </View>

              {dailyHabits.map((d) => (
                <View key={d.habit._id}>
                  <HabitCard
                    habit={d.habit}
                    entry={d.entry}
                    proofMethodType={
                      proofMethodMap.get(d.habit.proofMethodId).type
                    }
                  />
                </View>
              ))}
            </>
          )}

          {weeklyHabits.length > 0 && (
            <>
              <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
                <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
                  Weekly Habits
                </Text>
              </View>

              {weeklyHabits.map((w) => (
                <View key={w.habit._id}>
                  <HabitCard
                    habit={w.habit}
                    entry={w.entry}
                    proofMethodType={
                      proofMethodMap.get(w.habit.proofMethodId).type
                    }
                  />
                </View>
              ))}
            </>
          )}

          {monthlyHabits.length > 0 && (
            <>
              <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb2]}>
                <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
                  Monthly Habits
                </Text>
              </View>

              {monthlyHabits.map((m) => (
                <View key={m.habit._id}>
                  <HabitCard
                    habit={m.habit}
                    entry={m.entry}
                    proofMethodType={
                      proofMethodMap.get(m.habit.proofMethodId).type
                    }
                  />
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
