import {
  Calendar,
  type CalendarTheme,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { spacing } from "@/assets/styles/token.styles";
import { combine, s } from "@/assets/styles/utility.styles";
import { ProofCalendar } from "@/components/calendar/ProofCalendar";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const { habitId } = useLocalSearchParams<{ habitId?: string }>();

  const data = useQuery(
    api.exec.read.getHabitWithStreaksAndProofs,
    habitId
      ? {
          habitId: habitId as Id<"habits">,
        }
      : "skip",
  );

  const proofMap = data?.proofDateUrl
    ? new Map(Object.entries(data.proofDateUrl))
    : undefined;

  const handleCalendarDayPress = (dateId: string) => {
    if (data) {
      router.navigate(
        `/proof/select?habitId=${data?.habit._id}&date=${dateId}`,
      );
    }
  };

  const calTheme: CalendarTheme = {
    rowMonth: {
      content: combine(s.textLeft, c.textForeground, s.fontSemibold, s.text2xl),
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
    <SafeAreaView style={[s.flex1, c.bgBackground]}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <View style={[s.mb4]}>
        <Text>header</Text>
      </View>
      <Calendar.List
        calendarInitialMonthId={toDateId(new Date())}
        calendarMaxDateId={toDateId(new Date())}
        calendarMinDateId={data?.habit.startDate || "2025-01-01"}
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
  );
}
