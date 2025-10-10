import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { EllipsisVertical } from "lucide-react-native";
import {
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import IconOrEmoji from "@/components/IconOrEmoji";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";
import { getGoalLabel } from "@/utils/habitFormLabels";

type Habit = Doc<"habits">;

// Sample images for habit card gallery
const SAMPLE_IMAGES: ImageSourcePropType[] = [
  require("@/assets/images/icon.png"),
  require("@/assets/images/react-logo.png"),
  require("@/assets/images/partial-react-logo.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/splash-icon.png"),
];

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
      {/* Header: Icon + Name + Menu */}
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
            <IconOrEmoji iconName={item.icon} iconColor={item.color} />
          </View>
          <View style={[s.flexCol, s.gap1]}>
            <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
              {item.name}
            </Text>
            <Text style={[s.textSm, c.textMuted]}>{item.description}</Text>
          </View>
        </View>

        <View>
          <Image
            source={SAMPLE_IMAGES[0]}
            style={
              [
                s.rounded,
                c.borderDefault,
                s.border1,
                {
                  width: 56,
                  height: 56,
                },
              ] as ImageStyle[]
            }
            resizeMode="cover"
          />
        </View>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1} edges={["top"]}>
        <View style={[s.flex1, s.px4]}>
          {/* HEADER */}
          <View style={[s.flexRow, s.justifyBetween, s.itemsCenter, s.pb6]}>
            <View style={s.flex1}>
              <Text style={[s.text3xl, s.fontBold, c.textForeground]}>
                Today
              </Text>
              <Text style={[s.textSm, c.textMuted]}>{formattedDate}</Text>
            </View>
            <Link href="/habit/form" asChild>
              <Pressable>
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
              </Pressable>
            </Link>
          </View>

          {/* HABIT LIST */}
          <FlashList
            data={habits}
            renderItem={renderHabitCard}
            keyExtractor={(item) => item._id}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
