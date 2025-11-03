import { useMutation } from "convex/react";
import { router } from "expo-router";
import { Camera, Check, X } from "lucide-react-native";
import { Image, type ImageStyle, Pressable, Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { type Frequency, getScheduleLabel } from "@/utils/habitFormLabels";
import { calculateIsCompleted } from "@/utils/isCompletedCalculation";

type HabitCardProps = {
  habit: Doc<"habits">;
  // biome-ignore lint/suspicious/noExplicitAny: entry type comes from Convex query
  entry: any | null;
  proofMethodType: string;
};

export default function HabitCard({
  habit,
  entry,
  proofMethodType,
}: HabitCardProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // toggle habit entry completion
  const toggleHabitEntry = useMutation(api.exec.update.toggleHabitEntry);

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
          style={[s.rounded, s.h13, s.w13]}
          onPress={() => {
            if (proofMethodType === "camera") {
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
              uri:
                entry.proof && entry.proof.length > 0
                  ? entry.proof[entry.proof.length - 1].url
                  : undefined,
            }}
            style={
              [
                s.rounded,
                s.border2,
                c.borderDefault,
                s.h13,
                s.w13,
              ] as ImageStyle[]
            }
            resizeMode="cover"
          />

          {/* Success Overlay */}
          {calculateIsCompleted(entry.progress, habit) ? (
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
              {proofMethodType === "camera" ? (
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
}
