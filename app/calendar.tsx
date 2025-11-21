import {
  Calendar,
  type CalendarTheme,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { SquarePen } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { createColorStyles } from "@/assets/styles/color.styles";
import { spacing } from "@/assets/styles/token.styles";
import { combine, s } from "@/assets/styles/utility.styles";
import { ProofCalendar } from "@/components/calendar/ProofCalendar";
import Emoji from "@/components/Emoji";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const { habitId } = useLocalSearchParams<{ habitId: string }>();

  const { habit, proofDateUrl, longestStreak, currentStreak } =
    useQuery(api.exec.read.getHabitWithStreaksAndProofs, {
      habitId: habitId as Id<"habits">,
    }) || {};

  const proofMap = proofDateUrl
    ? new Map(Object.entries(proofDateUrl))
    : undefined;

  const handleCalendarDayPress = (dateId: string) => {
    router.navigate(`/proof/select?habitId=${habit?._id}&date=${dateId}`);
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => scheduleOnRN(() => router.back()));

  const calTheme: CalendarTheme = {
    rowMonth: {
      content: combine(s.textLeft, c.textForeground, s.fontSemibold, s.textXl),
    },
    rowWeek: {
      container: combine(s.borderB1, c.borderDefault),
    },
    itemWeekName: { content: c.textMuted },
    itemDay: {
      disabled: () => ({
        content: combine(c.textMuted, s.fontSemibold),
      }),
      idle: () => ({
        container: combine(s.rounded, c.bgTransparent),
        content: combine(c.textForeground, s.fontSemibold),
      }),
      today: () => ({
        container: combine(s.rounded, s.border0, c.bgTransparent),
        content: combine(
          c.textBackground,
          s.fontSemibold,
          c.bgForeground,
          s.p2,
          s.roundedFull,
        ),
      }),
    },
  };

  return (
    <GestureDetector gesture={flingGesture}>
      <SafeAreaView style={[s.flex1, c.bgBackground]}>
        <StatusBar barStyle={colors.statusBarStyle} />
        <View
          style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.px4, s.py3]}
        >
          <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
            <View
              style={[
                s.p3,
                s.roundedMd,
                s.itemsCenter,
                s.justifyCenter,
                { backgroundColor: `${habit?.color}30` },
              ]}
            >
              <Emoji name={habit?.icon} size={30} />
            </View>

            <View style={[s.flexCol, s.gap1]}>
              <Text style={[s.textXl, s.fontSemibold, c.textForeground]}>
                {habit?.name}
              </Text>
              <Text style={[s.textSm, c.textMuted]}>
                {`streak: ${currentStreak}, longest: ${longestStreak}`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.navigate(`/habit/form?id=${habit?._id}`)}
          >
            <SquarePen size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Calendar.List
          calendarInitialMonthId={toDateId(new Date())}
          calendarMaxDateId={toDateId(new Date())}
          calendarMinDateId={habit?.startDate || "2025-01-01"}
          calendarPastScrollRangeInMonths={12}
          calendarDayHeight={spacing[16]}
          calendarMonthHeaderHeight={spacing[6]}
          calendarWeekHeaderHeight={spacing[10]}
          calendarFirstDayOfWeek="monday"
          calendarRowVerticalSpacing={spacing[4]}
          calendarRowHorizontalSpacing={spacing[2]}
          onCalendarDayPress={(dateId) => handleCalendarDayPress(dateId)}
          theme={calTheme}
          renderItem={({ item }) => (
            <View style={[s.pb8, s.px2]}>
              <ProofCalendar
                calendarMonthId={item.id}
                {...item.calendarProps}
                proofMap={proofMap}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </GestureDetector>
  );
}
