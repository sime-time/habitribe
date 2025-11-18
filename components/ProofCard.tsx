import { Image, type ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import type { ColorScheme } from "@/constants/colors";
import type { Id } from "@/convex/_generated/dataModel";
import type { ProofWithUrl } from "@/types/HabitTypes";

export default function ProofCard({
  item,
  index,
  x,
  cardSize,
  colors,
  updateCaption,
}: {
  item: ProofWithUrl;
  index: number;
  x: SharedValue<number>;
  cardSize: number;
  colors: ColorScheme;
  updateCaption: (proofId: Id<"proofs">, caption: string | undefined) => void;
}) {
  const c = createColorStyles(colors);

  const [newCaption, setNewCaption] = useState<string | undefined>(
    item.caption,
  );
  const [isLoading, setIsLoading] = useState(true);

  const scrollAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 1) * cardSize, index * cardSize, (index + 1) * cardSize],
      [0.8, 1, 0.8],
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={{ width: cardSize }}>
      <Animated.View
        style={[scrollAnimation, s.hFull, s.overflowHidden, s.gap4]}
      >
        {item.url ? (
          <>
            {isLoading && (
              <View
                style={[
                  s.wFull,
                  s.roundedMd,
                  s.absolute,
                  c.bgBorder,
                  s.z10,
                  s.justifyCenter,
                  s.itemsCenter,
                  { height: cardSize },
                ]}
              >
                <ActivityIndicator size="small" color={colors.muted} />
              </View>
            )}
            <Image
              source={{ uri: item.url }}
              style={
                [
                  s.wFull,
                  s.roundedMd,
                  { aspectRatio: 1, height: cardSize },
                ] as ImageStyle[]
              }
              onLoad={() => setIsLoading(false)}
            />
          </>
        ) : (
          <View
            style={[
              s.wFull,
              s.roundedMd,
              s.itemsCenter,
              s.justifyCenter,
              c.bgMuted,
              { height: cardSize },
            ]}
          >
            <Text style={c.textForeground}>No Image URL</Text>
          </View>
        )}

        <View style={[s.input, c.borderDefault]}>
          <TextInput
            style={[c.textForeground, s.textBase]}
            placeholder="Add caption"
            placeholderTextColor={colors.muted}
            onChangeText={setNewCaption}
            value={newCaption}
            inputMode="text"
          />
        </View>

        <TouchableOpacity onPress={() => updateCaption(item._id, newCaption)}>
          <LinearGradient colors={colors.gradients.primary} style={s.button}>
            <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
              Update caption
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
