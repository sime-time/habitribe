import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createColorStyles } from "@/assets/styles/color.styles";
import { borderRadius } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitSelectStore } from "@/stores/habitSelectStore";
import { getTodayDateString, getWeekMonthBounds } from "@/utils/dateHelper";
import { type Frequency, getScheduleLabel } from "@/utils/habitLabelHelper";

type Habit = Doc<"habits">;
type HabitEntry = Doc<"habitEntries">;

interface HabitSelectSheetProps {
  closeSheet: () => void;
}
export default function HabitSelectSheet({
  closeSheet,
}: HabitSelectSheetProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const habitSelected = useHabitSelectStore((state) => state.habitSelected);
  const selectHabit = useHabitSelectStore((state) => state.selectHabit);
  const selectEntry = useHabitSelectStore((state) => state.selectEntry);

  // client side should calculate any dates
  // this prevents timezone issues with client/server
  const habitDate = getTodayDateString();
  const today = new Date(habitDate);
  const weekday = today.getDay(); // 0-6 for daily habit pattern matching
  const bounds = getWeekMonthBounds(today);

  // create any of today's missing habit entries before querying them
  const createMissingEntries = useMutation(api.exec.create.addMissingEntries);

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress mutation dependency
  useEffect(() => {
    createMissingEntries({
      date: habitDate,
      weekday,
      bounds,
    });
  }, [habitDate]); // only re-run when date changes

  // get today's habit entries
  const flatHabitEntries = useQuery(api.exec.read.getFlatHabitEntries, {
    date: habitDate,
    weekday,
    bounds,
  });

  const renderHabitOption = ({
    item,
  }: {
    item: { habit: Habit; entry: HabitEntry | null };
  }) => (
    <Pressable
      style={[
        s.flexRow,
        s.roundedLg,
        s.mb3,
        s.m1,
        s.gap4,
        s.p4,
        s.itemsCenter,
        item.habit._id === habitSelected?._id ? c.bgForeground : c.bgCard,
        s.outline1,
        c.outlineDefault,
        item.habit._id === habitSelected?._id
          ? c.outlineForeground
          : c.outlineDefault,
      ]}
      onPress={() => {
        selectHabit(item.habit);
        selectEntry(item.entry);
      }}
    >
      <View
        style={[
          s.p2,
          s.roundedLg,
          s.itemsCenter,
          s.justifyCenter,
          { backgroundColor: `${item.habit.color}30` },
        ]}
      >
        <Emoji
          iconName={item.habit.icon}
          iconColor={item.habit.color}
          iconSize={18}
        />
      </View>
      <View style={[s.gap1]}>
        <Text
          style={[
            s.textBase,
            c.textForeground,
            item.habit._id === habitSelected?._id
              ? c.textBackground
              : c.textForeground,
            item.habit._id === habitSelected?._id ? s.fontMedium : s.fontNormal,
          ]}
        >
          {item.habit.name}
        </Text>
        <Text style={[s.textXs, c.textMuted]}>
          {item.habit.description}{" "}
          {getScheduleLabel(
            item.habit.schedule.frequency as Frequency,
            item.habit.schedule.pattern,
          ).toLowerCase()}
        </Text>
      </View>
    </Pressable>
  );

  // Bottom Sheet Slide Animation
  const slide = useSharedValue(300);
  const backdrop = useSharedValue(0);
  const duration = 250;

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));
  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slide.value }],
  }));

  const slideUp = () => {
    slide.value = withSpring(0, { duration });
    backdrop.value = withSpring(1, { duration });
  };
  const slideDown = () => {
    slide.value = withSpring(300, { duration });
    backdrop.value = withSpring(0, { duration });
  };

  useEffect(() => {
    slideUp();
  });

  const close = () => {
    slideDown();
    setTimeout(() => {
      closeSheet();
    }, duration);
  };

  return (
    <Animated.View
      style={[
        s.flex1,
        s.wFull,
        s.hFull,
        s.justifyEnd,
        s.zTop,
        {
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        backdropAnimatedStyle,
      ]}
    >
      <Pressable onPress={close} style={[s.flex1, s.wFull, s.justifyEnd]}>
        <Pressable style={{ width: "100%", height: "50%" }}>
          <Animated.View
            style={[
              s.wFull,
              s.hFull,
              {
                borderTopLeftRadius: borderRadius.xl,
                borderTopRightRadius: borderRadius.xl,
                backgroundColor: colors.gradients.background[1],
              },
              slideAnimatedStyle,
            ]}
          >
            <View style={[s.flex1, s.p6, s.gap6]}>
              <Text
                style={[
                  s.textCenter,
                  s.textLg,
                  c.textForeground,
                  s.fontSemibold,
                ]}
              >
                Select your Habit
              </Text>

              <FlashList
                data={flatHabitEntries}
                renderItem={renderHabitOption}
                keyExtractor={(item) => item.habit._id}
              />
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
