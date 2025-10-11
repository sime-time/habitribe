import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Camera, Images } from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  Image,
  type ImageStyle,
  Pressable,
  ScrollView,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { getProofMethodRequirements } from "@/utils/habitFormLabels";

type Habit = Doc<"habits">;

interface HabitSheetProps {
  habit: Habit | null;
  closeSheet: () => void;
}

export default function HabitSheet({ habit, closeSheet }: HabitSheetProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const deleteHabit = useMutation(api.exec.delete.deleteHabit);

  const proofMethods = useQuery(api.exec.read.getProofMethods);

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

  const confirmDelete = () => {
    if (!habit) return null;
    Alert.alert(
      "Delete Habit",
      "This will remove all habit progress and history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              deleteHabit({ id: habit._id });
              close();
            } catch (error) {
              console.error("Failed to delete habit", error);
              Alert.alert("Error", "Failed to delete habit");
            }
          },
        },
      ],
    );
  };

  if (!habit) return null;

  return (
    <Animated.View
      style={[
        s.absolute,
        s.flex1,
        s.wFull,
        s.hFull,
        s.justifyEnd,
        {
          top: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
        },
        backdropAnimatedStyle,
      ]}
    >
      <Pressable onPress={close} style={[s.flex1, s.wFull, s.justifyEnd]}>
        <Pressable style={{ width: "100%", height: "70%" }}>
          <Animated.View
            style={[
              s.wFull,
              s.hFull,
              c.bgCard,
              {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              },
              slideAnimatedStyle,
            ]}
          >
            {/* HABIT OPTIONS */}
            <View
              style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.px4, s.pt4]}
            >
              <TouchableOpacity onPress={confirmDelete}>
                <Ionicons
                  name="trash-outline"
                  color={colors.destructive}
                  size={26}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  closeSheet();
                  router.navigate(`/habit/form?id=${habit._id}`);
                }}
              >
                <Text style={[s.textLg, c.textPrimary]}>Edit</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={[s.flex1, s.px6, s.gap4]}>
              {/* HEADER */}
              <View style={s.gap2}>
                <Text
                  style={[
                    s.text3xl,
                    s.fontSemibold,
                    s.textCenter,
                    c.textForeground,
                  ]}
                >
                  {habit.name}
                </Text>
                <Text style={[s.textBase, s.textCenter, c.textForeground]}>
                  {habit.description}
                </Text>
                <Text style={[s.textBase, s.textCenter, c.textMuted]}>
                  {getProofMethodRequirements(
                    habit.proofMethodId,
                    proofMethods,
                  )}
                </Text>
              </View>

              {/* PROOF */}
              <View style={[s.itemsCenter, s.justifyCenter, s.py4]}>
                <View
                  style={[
                    s.roundedMd,
                    s.overflowHidden,
                    s.border4,
                    c.borderSuccess,
                    {
                      width: "80%",
                      maxHeight: 300,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: "https://i.pravatar.cc/150?img=3" }}
                    style={[s.wFull, s.hFull] as ImageStyle[]}
                    resizeMode="cover"
                  />
                </View>
                <Text style={[s.textSm, s.mt3, c.textMuted] as TextStyle[]}>
                  Today's Proof
                </Text>
              </View>

              {/* BUTTONS */}
              <View style={[s.gap4]}>
                <TouchableOpacity>
                  <LinearGradient
                    colors={colors.gradients.primary}
                    style={s.button}
                  >
                    <Camera color={colors.primaryForeground} size={20} />
                    <Text
                      style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}
                    >
                      Use Camera
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={[s.button, c.bgSecondary]}>
                  <Images color={colors.primary} size={20} />
                  <Text style={[s.textLg, s.fontMedium, c.textPrimary]}>
                    Open Photo Library
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
