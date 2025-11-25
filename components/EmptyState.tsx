import { CircleX } from "lucide-react-native";
import { Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";

export default function EmptyState() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <View style={[s.flex1, s.itemsCenter, s.justifyCenter, s.p6]}>
      <View style={[s.itemsCenter, s.gap4]}>
        {/* Icon */}
        <View
          style={[
            s.itemsCenter,
            s.justifyCenter,
            s.p2,
            s.roundedFull,
            c.bgMuted,
            s.opacity50,
          ]}
        >
          <CircleX size={48} color={colors.background} strokeWidth={2} />
        </View>

        {/* Text */}
        <View style={[s.itemsCenter, s.gap2]}>
          <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
            No habits yet
          </Text>
          <Text style={[s.textBase, s.textCenter, c.textMuted]}>
            Tap the + button to create your first habit
          </Text>
        </View>
      </View>
    </View>
  );
}
