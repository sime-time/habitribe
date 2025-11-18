// biome-ignore-all lint/suspicious/noExplicitAny: ProofCard props use dynamic data

import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image, type ImageStyle } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createColorStyles } from "@/assets/styles/color.styles";
import { toastConfig } from "@/assets/styles/toast.config";
import { s } from "@/assets/styles/utility.styles";
import type { ColorScheme } from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";

export default function ProofSelect() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const { entryId } = useLocalSearchParams<{ entryId?: string }>();

  const proofs = useQuery(
    api.exec.read.getProofs,
    entryId
      ? {
          entryId: entryId as Id<"habitEntries">,
        }
      : "skip",
  );

  const editProofCaption = useMutation(api.exec.update.editProofCaption);

  const editCaption = async (proofId: Id<"proofs">, caption: string) => {
    try {
      await editProofCaption({ id: proofId, caption });
      Toast.show({
        type: "success",
        text1: "Caption updated",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Caption failed to update",
      });
    }
  };

  const { width } = useWindowDimensions();
  const CARD_SIZE = width * 0.8;
  const SPACER = (width - CARD_SIZE) / 2;
  const x = useSharedValue(0);
  const xScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderProofCard = ({ item, index }: { item: any; index: number }) => (
    <ProofCard
      item={item}
      index={index}
      x={x}
      cardSize={CARD_SIZE}
      colors={colors}
      updateCaption={editCaption}
    />
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Animated.FlatList
          data={proofs}
          renderItem={renderProofCard}
          keyExtractor={(item) => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          snapToInterval={CARD_SIZE}
          decelerationRate="fast"
          onScroll={xScroll}
          ListHeaderComponent={() => <View style={{ width: SPACER }} />}
          ListFooterComponent={() => <View style={{ width: SPACER }} />}
          ListEmptyComponent={() => (
            <View style={[s.gap6, { width: CARD_SIZE }]}>
              <View
                style={[
                  s.roundedMd,
                  s.itemsCenter,
                  s.hFull,
                  s.justifyCenter,
                  s.border3,
                  c.borderMuted,
                  { borderStyle: "dashed", height: CARD_SIZE },
                ]}
              >
                <Ionicons name="camera" size={48} color={colors.muted} />
              </View>

              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/camera")}
              >
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={s.button}
                >
                  <Text
                    style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}
                  >
                    Add Proof
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
      <Toast config={toastConfig} topOffset={0} />
    </LinearGradient>
  );
}

function ProofCard({
  item,
  index,
  x,
  cardSize,
  colors,
  updateCaption,
}: {
  item: any;
  index: number;
  x: SharedValue<number>;
  cardSize: number;
  colors: ColorScheme;
  updateCaption: (proofId: Id<"proofs">, caption: string) => void;
}) {
  const c = createColorStyles(colors);

  const [newCaption, setNewCaption] = useState<string>(item.caption);
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
