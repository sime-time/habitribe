import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { Pressable } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";

type HabitCheckboxProps = {
  entry: Doc<"habitEntries"> | null;
  proofMethodType: string;
};

export default function HabitCheckbox({
  entry,
  proofMethodType,
}: HabitCheckboxProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // toggle habit entry completion
  const _toggleHabitEntry = useMutation(api.exec.update.toggleHabitEntry);

  return (
    <Pressable>
      <LinearGradient
        colors={colors.gradients.muted}
        style={[
          s.roundedFull,
          s.outline1,
          c.outlineDefault,
          s.p2,
          s.itemsCenter,
          s.justifyCenter,
        ]}
      >
        <Check size={20} color={colors.muted} />
      </LinearGradient>
    </Pressable>
  );
}
