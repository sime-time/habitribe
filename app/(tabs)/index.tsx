import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Camera, Check, X } from "lucide-react-native";
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
import { getTodayDateString } from "@/utils/dateHelper";
import { type Frequency, getScheduleLabel } from "@/utils/habitFormLabels";

type Habit = Doc<"habits">;

export default function Index() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const longDateName = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // format today's date to YYYY-MM-DD
  const habitDate = getTodayDateString();

  // create any of today's missing habit entries before querying them
  const createMissingEntries = useMutation(api.exec.create.addMissingEntries);

  // get today's habit entries
  const habits = useQuery(api.exec.read.getGroupedHabitEntries, {
    date: habitDate,
  });

  // get all proof methods
  const proofMethods = useQuery(api.exec.read.getProofMethods);
  const proofMethodMap = useMemo(() => {
    if (!proofMethods) return new Map();
    return new Map(proofMethods.map((pm) => [pm._id, pm]));
  }, [proofMethods]);

  // toggle habit entry completion
  const toggleHabitEntry = useMutation(api.exec.update.toggleHabitEntry);

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress mutation dependency
  useEffect(() => {
    createMissingEntries({ date: habitDate });
  }, [habitDate]); // only re-run when date changes

  // arrays need to be defined to an empty array by default
  const {
    dailyHabits = [],
    weeklyHabits = [],
    monthlyHabits = [],
  } = habits || {}; // if habit is undefined, use an empty object

  const renderHabitCard = ({
    habit,
    entry,
  }: {
    habit: Habit;
    entry: any | null;
  }) => {
    const proofMethod = proofMethodMap.get(habit.proofMethodId);
    return (
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
        onPress={() => router.navigate(`/habit/form?id=${habit._id}`)}
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
                { backgroundColor: `${habit.color}30` },
              ]}
            >
              <Emoji iconName={habit.icon} iconColor={habit.color} />
            </View>
            <View style={[s.flexCol, s.gap1]}>
              <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                {habit.name}
              </Text>
              <Text style={[s.textSm, c.textMuted]}>
                {getScheduleLabel(
                  habit.schedule.frequency as Frequency,
                  habit.schedule.pattern,
                )}
              </Text>
            </View>
          </View>

          {/* Checkbox */}
          <Pressable
            style={[s.rounded, s.inputHeight, { width: 51 }]}
            onPress={() => {
              if (proofMethod.type === "camera") {
                // take a picture with camera to complete habit
                router.push("/camera");
              } else {
                // manually toggle habit entry completion
                toggleHabitEntry({ id: entry._id });
              }
            }}
          >
            <Image
              source={{
                uri: entry.proof ? entry.proof.at(-1).url : undefined,
              }}
              style={
                [
                  s.rounded,
                  s.border2,
                  c.borderDefault,
                  s.inputHeight,
                  {
                    width: 51,
                  },
                ] as ImageStyle[]
              }
              resizeMode="cover"
            />

            {/* Success Overlay */}
            {entry.isCompleted ? (
              <>
                <View
                  style={[
                    s.absolute,
                    s.opacity75,
                    s.rounded,
                    c.bgSuccess,
                    s.z10,
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
                    s.z20,
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
              </>
            ) : (
              <View
                style={[
                  s.absolute,
                  s.itemsCenter,
                  s.justifyCenter,
                  s.z20,
                  {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  },
                ]}
              >
                {proofMethod.type === "camera" ? (
                  <Camera size={32} color={colors.border} />
                ) : (
                  <X size={32} color={colors.border} />
                )}
              </View>
            )}
          </Pressable>
        </View>
      </Pressable>
    );
  };

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
                  {renderHabitCard({ habit: d.habit, entry: d.entry })}
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
                  {renderHabitCard({ habit: w.habit, entry: w.entry })}
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
                  {renderHabitCard({ habit: m.habit, entry: m.entry })}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
