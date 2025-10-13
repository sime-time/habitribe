import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createColorStyles } from "@/assets/styles/color.styles";
import { borderRadius } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";
import { type Frequency, getScheduleLabel } from "@/utils/habitFormLabels";
import Emoji from "./Emoji";

type Habit = Doc<"habits">;

interface HabitSheetProps {
  closeSheet: () => void;
}
export default function HabitSheet({ closeSheet }: HabitSheetProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const habits = useQuery(api.exec.read.getUserHabits);
  const habitSelected = useHabitSheetStore((state) => state.habitSelected);
  const selectHabit = useHabitSheetStore((state) => state.selectHabit);

  const renderHabitOption = ({ item }: { item: Habit }) => (
    <Pressable
      style={[
        s.flexRow,
        s.roundedLg,
        s.mb3,
        s.m1,
        s.gap4,
        s.p4,
        s.itemsCenter,
        item._id === habitSelected?._id ? c.bgForeground : c.bgCard,
        // item._id === habitSelected?._id ? s.outline2 : s.outline1,
        // item._id === habitSelected?._id ? c.outlinePrimary : c.outlineDefault,
      ]}
      onPress={() => selectHabit(item)}
    >
      <View
        style={[
          s.p2,
          s.roundedLg,
          s.itemsCenter,
          s.justifyCenter,
          { backgroundColor: `${item.color}30` },
        ]}
      >
        <Emoji iconName={item.icon} iconColor={item.color} iconSize={18} />
      </View>
      <View style={[s.gap1]}>
        <Text
          style={[
            s.textBase,
            c.textForeground,
            item._id === habitSelected?._id
              ? c.textBackground
              : c.textForeground,
            item._id === habitSelected?._id ? s.fontMedium : s.fontNormal,
          ]}
        >
          {item.name}
        </Text>
        <Text style={[s.textXs, c.textMuted]}>
          {item.description}{" "}
          {getScheduleLabel(
            item.schedule.frequency as Frequency,
            item.schedule.pattern,
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
                data={habits}
                renderItem={renderHabitOption}
                keyExtractor={(item) => item._id}
              />
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
