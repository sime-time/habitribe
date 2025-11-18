import { AnimatedFlashList, FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createColorStyles } from "@/assets/styles/color.styles";
import { borderRadius } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useProofSelectStore } from "@/stores/proofSelectStore";

interface ProofSelectSheetProps {
  closeSheet: () => void;
}
export default function ProofSelectSheet({
  closeSheet,
}: ProofSelectSheetProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const entryId = useProofSelectStore((state) => state.entryId);

  const proofs = useQuery(
    api.exec.read.getProofs,
    entryId
      ? {
          entryId,
        }
      : "skip",
  );
  console.log("proofs", proofs);

  const renderProof = ({ item }: { item: any }) => (
    <View
      style={[s.border1, c.borderWarning, s.p6, s.flexCol, s.justifyBetween]}
    >
      <Text>{item._creationTime}</Text>
      {item.url ? (
        <Image
          source={{ uri: item.url }}
          style={{ width: "100%", height: 400, borderRadius: 8 }}
          onError={(error) => console.log("Image load error:", error)}
          onLoad={() => console.log("Image loaded successfully")}
        />
      ) : (
        <Text>No URL</Text>
      )}
    </View>
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
        backdropAnimatedStyle,
        s.flex1,
        s.wFull,
        s.hFull,
        s.justifyEnd,
        s.zTop,
        s.absolute,
        {
          top: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      ]}
    >
      <Pressable onPress={close} style={[s.flex1, s.wFull, s.justifyEnd]}>
        <Pressable style={{ width: "100%", height: "75%" }}>
          <Animated.View
            style={[
              slideAnimatedStyle,
              s.wFull,
              s.hFull,
              {
                borderTopLeftRadius: borderRadius.xl,
                borderTopRightRadius: borderRadius.xl,
                backgroundColor: colors.gradients.background[1],
              },
            ]}
          >
            <View style={[s.flex1]}>
              <FlashList
                data={proofs}
                renderItem={renderProof}
                keyExtractor={(item) => item._id}
              />
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
