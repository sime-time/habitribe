import { Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import { getWeekMonthBounds } from "@/utils/dateHelper";

interface DateGroupTitleProps {
  date: Date;
  variant: "daily" | "weekly" | "monthly";
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatShortDate(dateString: string): string {
  const date = parseLocalDate(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatMonthName(dateString: string): string {
  const date = parseLocalDate(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);
}

function getDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Today";
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Yesterday";
  } else {
    return "Day";
  }
}

export default function DateGroupTitle({ date, variant }: DateGroupTitleProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  let title: string;
  let subtitle: string;
  const bounds = getWeekMonthBounds(date);

  switch (variant) {
    case "daily": {
      title = getDayLabel(date);
      const dateString = date.toISOString().split("T")[0];
      subtitle = formatShortDate(dateString);
      break;
    }
    case "weekly": {
      title = "Week";
      const weekStartDate = parseLocalDate(bounds.weekStart);
      const weekEndDate = parseLocalDate(bounds.weekEnd);
      const startMonth = weekStartDate.getMonth();
      const endMonth = weekEndDate.getMonth();

      if (startMonth === endMonth) {
        // Same month: "Oct. 21 - 26"
        const startDay = weekStartDate.getDate();
        const endDay = weekEndDate.getDate();
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format(weekStartDate);
        subtitle = `${monthName}. ${startDay} - ${endDay}`;
      } else {
        // Different months: "Oct. 27 - Nov. 2"
        subtitle = `${formatShortDate(bounds.weekStart)} - ${formatShortDate(bounds.weekEnd)}`;
      }
      break;
    }
    case "monthly":
      title = "Month";
      subtitle = formatMonthName(bounds.monthStart);
      break;
  }

  return (
    <View style={[s.flexRow, s.justifyBetween, s.itemsCenter]}>
      <Text style={[s.fontBold, s.text2xl, c.textForeground]}>{title}</Text>
      <Text style={[s.fontNormal, s.textBase, c.textMuted]}>{subtitle}</Text>
    </View>
  );
}
