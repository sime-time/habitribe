import { FlashList } from "@shopify/flash-list";
import { EllipsisVertical } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import IconOrEmoji from "@/components/IconOrEmoji";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitSheetStore } from "@/stores/habitSheetStore";

type Habit = Doc<"habits">;

interface HabitCardProps {
  item: Habit;
}

// Sample images for habit card gallery
const SAMPLE_IMAGES = [
  require("@/assets/images/icon.png"),
  require("@/assets/images/react-logo.png"),
  require("@/assets/images/partial-react-logo.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/splash-icon.png"),
];

export default function HabitCard({ item }: HabitCardProps) {
  const { colors } = useTheme();
  const openSheet = useHabitSheetStore((state) => state.openSheet);

  return (
    <Pressable
      className="bg-card rounded-2xl p-4 flex-col justify-between mb-4 border-[1.5px]"
      style={{ borderColor: colors.border }}
      onPress={() => openSheet(item)}
    >
      {/* Header with icon and name */}
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: `${item.color}30` }}
          >
            <IconOrEmoji iconName={item.icon} iconColor={item.color} />
          </View>
          <Text
            className="font-medium text-lg"
            style={{ color: colors.foreground }}
          >
            {item.name}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-9 h-9 items-center justify-center">
            <EllipsisVertical color={colors.mutedForeground} size={18} />
          </View>
        </View>
      </View>

      {/* Image gallery */}
      <Pressable className="my-3">
        <FlashList
          data={SAMPLE_IMAGES}
          renderItem={({ item: image }) => (
            <Image
              source={image}
              className="w-16 h-16 rounded-xl border-[1.5px] mr-3"
              style={{ borderColor: colors.border }}
              resizeMode="cover"
            />
          )}
          keyExtractor={(_, index) => `image-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </Pressable>

      {/* Description */}
      <View className="flex-col gap-1">
        <View
          className="h-[1.5px]"
          style={{ backgroundColor: colors.border }}
        />
        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
          {item.description}
        </Text>
      </View>
    </Pressable>
  );
}
