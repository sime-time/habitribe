import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Check } from "lucide-react-native";
import {
  Image,
  type ImageStyle,
  Pressable,
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
import { useHabitSheetStore } from "@/stores/habitSheetStore";

type Habit = Doc<"habits">;

export default function Index() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const openSheet = useHabitSheetStore((state) => state.openSheet);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const habits = useQuery(api.exec.read.getUserHabits);

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <Pressable
      style={[
        s.mb4,
        s.p4,
        s.gap3,
        s.roundedLg,
        c.bgCard,
        c.borderDefault,
        s.border1,
      ]}
      onPress={() => openSheet(item)}
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
              { backgroundColor: `${item.color}30` },
            ]}
          >
            <Emoji iconName={item.icon} iconColor={item.color} />
          </View>
          <View style={[s.flexCol, s.gap1]}>
            <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
              {item.name}
            </Text>
            <Text style={[s.textSm, c.textMuted]}>{item.description}</Text>
          </View>
        </View>

        {/* Checkbox */}
        <Pressable style={{ width: 56, height: 56 }}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={
              [
                s.rounded,
                s.border1,
                c.borderDefault,
                {
                  width: 56,
                  height: 56,
                },
              ] as ImageStyle[]
            }
            resizeMode="cover"
          />
          {/* Overlay + Icon */}
          <View
            style={[
              s.absolute,
              c.bgSuccess,
              s.opacity75,
              s.rounded,
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
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        {/* HEADER */}
        <View
          style={[s.px4, s.py8, s.flexRow, s.justifyBetween, s.itemsCenter]}
        >
          <View style={s.flex1}>
            <Text style={[s.text3xl, s.fontBold, c.textForeground]}>Today</Text>
            <Text style={[s.textSm, c.textMuted]}>{formattedDate}</Text>
          </View>
          <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
            <View>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.foreground}
              />
            </View>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
            />
          </View>
        </View>
        <View style={[s.flex1, s.px4]}>
          {/* HABITS HEADER */}
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb6]}>
            <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
              Daily Habits
            </Text>
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

          {/* HABIT LIST */}
          <FlashList
            data={habits}
            renderItem={renderHabitCard}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
