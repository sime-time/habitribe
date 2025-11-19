import {
  Calendar,
  type CalendarTheme,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { borderRadius, spacing } from "@/assets/styles/token.styles";
import { combine, s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const calTheme: CalendarTheme = {
    rowMonth: {
      container:s.h10,
      content: combine(s.textLeft, c.textForeground, s.fontSemibold, s.text2xl),
    },
    rowWeek: {
      container: combine(s.borderB1, c.borderDefault),
    },
    itemWeekName: { content: c.textMuted },
    itemDay: {
      idle: ({ isPressed }) => ({
        container: combine(s.rounded, isPressed ? c.bgPrimary : c.bgCard),
        content: c.textForeground,
      }),
      today: ({ isPressed }) => ({
        container: combine(
          s.rounded,
          s.border0,
          s.outline1,
          c.outlinePrimary,
          isPressed ? c.bgForeground : c.bgTransparent,
        ),
        content: c.textPrimary,
      }),
    },
  };

  return (
    <SafeAreaView style={[s.flex1, c.bgBackground]}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <Calendar.List
        calendarFutureScrollRangeInMonths={1}
        calendarInitialMonthId={toDateId(new Date())}
        calendarMaxDateId={toDateId(new Date())}
        calendarMinDateId="2024-01-01"
        calendarPastScrollRangeInMonths={50}
        calendarDayHeight={spacing[16]}
        calendarWeekHeaderHeight={spacing[10]}
        calendarFirstDayOfWeek="monday"
        calendarRowVerticalSpacing={spacing[4]}
        calendarRowHorizontalSpacing={spacing[2]}
        onCalendarDayPress={(dateId) => console.log(`Pressed date ${dateId}`)}
        theme={calTheme}
      />
    </SafeAreaView>
  );
}
