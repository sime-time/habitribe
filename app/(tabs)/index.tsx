import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import {
  Image,
  type ImageStyle,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { type Frequency, getScheduleLabel } from "@/utils/habitFormLabels";

type Habit = Doc<"habits">;

export default function Index() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const today = new Date();
  const longDateName = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const day = today.getDate();
  const month = today.getMonth() + 1; // January is 0, so we have to add 1
  const year = today.getFullYear();

  // format today's date to YYYY-MM-DD
  const habitDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // create any of today's missing habit entries before querying them
  const createMissingEntries = useMutation(api.exec.create.addMissingEntries);

  // get today's habit entries
  const habits = useQuery(api.exec.read.getTodaysHabits, {
    date: habitDate,
  });

  useEffect(() => {
    createMissingEntries({ date: habitDate });
  }, [habitDate, createMissingEntries]);

  // useMemo to avoid re-filtering on every render
  const { dailyHabits, weeklyHabits, monthlyHabits } = useMemo(() => {
    if (!habits)
      return { dailyHabits: [], weeklyHabits: [], monthlyHabits: [] };

    return {
      dailyHabits: habits.dailyHabits || [],
      weeklyHabits: habits.weeklyHabits || [],
      monthlyHabits: habits.monthlyHabits || [],
    };
  }, [habits]);

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <Pressable
      style={[
        s.mb5,
        s.p4,
        s.gap3,
        s.roundedLg,
        c.bgCard,
        c.borderDefault,
        s.border1,
      ]}
      onPress={() => router.navigate(`/habit/form?id=${item._id}`)}
    >
      {/* Header: Icon + Name + Description */}
      <View style={[s.flexRow, s.justifyBetween, s.itemsCenter]}>
        <View style={[s.flexRow, s.itemsCenter, s.gap3]}>
          <View
            style={[
              s.p3,
              s.roundedLg,
              s.itemsCenter,
              s.justifyCenter,
              { backgroundColor: `${item.color}30` },
            ]}
          >
            <Emoji iconName={item.icon} iconColor={item.color} />
          </View>
          <View style={[s.flexCol, s.gap1]}>
            <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
              {item.name}
            </Text>
            <Text style={[s.textSm, c.textMuted]}>
              {getScheduleLabel(
                item.schedule.frequency as Frequency,
                item.schedule.pattern,
              )}
            </Text>
          </View>
        </View>

        {/* Checkbox */}
        <Pressable
          style={{ width: 56, height: 56 }}
          onPress={() => router.push("/camera")}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={
              [
                s.rounded,
                s.border1,
                c.borderDefault,
                {
                  width: 56,
                  height: 56,
                },
              ] as ImageStyle[]
            }
            resizeMode="cover"
          />
          {/* Overlay + Icon */}
          <View
            style={[
              s.absolute,
              c.bgSuccess,
              s.opacity75,
              s.rounded,
              {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}
          />
          <View
            style={[
              s.absolute,
              s.itemsCenter,
              s.justifyCenter,
              {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}
          >
            <Check size={32} color="white" />
          </View>
        </Pressable>
      </View>
    </Pressable>
  );

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

              {dailyHabits.map((item) => (
                <View key={item._id}>{renderHabitCard({ item })}</View>
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

              {weeklyHabits.map((item) => (
                <View key={item._id}>{renderHabitCard({ item })}</View>
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

              {monthlyHabits.map((item) => (
                <View key={item._id}>{renderHabitCard({ item })}</View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
