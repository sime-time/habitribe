import type { CalendarProps } from "@marceloterreiro/flash-calendar";
import { Calendar, useCalendar } from "@marceloterreiro/flash-calendar";
import { memo } from "react";
import { spacing } from "@/assets/styles/token.styles";
import { CalendarItemDayWithImage } from "./CalendarItemDayWithImage";

interface ProofCalendarProps extends CalendarProps {
  proofMap?: Map<string, string | undefined>;
}

export const ProofCalendar = memo(
  ({
    onCalendarDayPress,
    theme,
    calendarDayHeight = spacing[16],
    calendarWeekHeaderHeight = spacing[10],
    calendarMonthHeaderHeight = spacing[10],
    calendarRowVerticalSpacing = spacing[4],
    calendarRowHorizontalSpacing = spacing[2],
    proofMap,

    ...buildCalendarParams
  }: ProofCalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList } =
      useCalendar(buildCalendarParams);

    return (
      <Calendar.VStack alignItems="center" spacing={calendarRowVerticalSpacing}>
        <Calendar.Row.Month
          height={calendarMonthHeaderHeight}
          theme={theme?.rowMonth}
        >
          {calendarRowMonth}
        </Calendar.Row.Month>

        <Calendar.Row.Week spacing={8} theme={theme?.rowWeek}>
          {weekDaysList.map((weekDay, i) => (
            <Calendar.Item.WeekName
              height={calendarWeekHeaderHeight}
              key={i}
              theme={theme?.itemWeekName}
            >
              {weekDay}
            </Calendar.Item.WeekName>
          ))}
        </Calendar.Row.Week>

        {weeksList.map((week, index) => (
          <Calendar.Row.Week key={index}>
            {week.map((dayProps) => {
              if (dayProps.isDifferentMonth) {
                return (
                  <Calendar.Item.Day.Container
                    dayHeight={calendarDayHeight}
                    daySpacing={calendarRowHorizontalSpacing}
                    isStartOfWeek={dayProps.isStartOfWeek}
                    key={dayProps.id}
                    theme={theme?.itemDayContainer}
                  >
                    <Calendar.Item.Empty
                      height={calendarDayHeight}
                      theme={theme?.itemEmpty}
                    />
                  </Calendar.Item.Day.Container>
                );
              }
              return (
                <Calendar.Item.Day.Container
                  key={dayProps.id}
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  isStartOfWeek={dayProps.isStartOfWeek}
                  theme={theme?.itemDayContainer}
                >
                  <CalendarItemDayWithImage
                    theme={theme?.itemDay}
                    height={calendarDayHeight}
                    key={dayProps.id}
                    metadata={dayProps}
                    onPress={onCalendarDayPress}
                    imageUrl={proofMap?.get(dayProps.id)}
                  >
                    {dayProps.displayLabel}
                  </CalendarItemDayWithImage>
                </Calendar.Item.Day.Container>
              );
            })}
          </Calendar.Row.Week>
        ))}
      </Calendar.VStack>
    );
  },
);
