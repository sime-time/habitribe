import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createColorStyles } from "@/assets/styles/color.styles";
import { toastConfig } from "@/assets/styles/toast.config";
import { s } from "@/assets/styles/utility.styles";
import ProofCard from "@/components/ProofCard";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import type { ProofWithUrl } from "@/types/HabitTypes";

export default function ProofSelect() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const { habitId, date, entryId } = useLocalSearchParams<{
    habitId: string;
    date: string;
    entryId: string;
  }>();

  const proofs = useQuery(api.exec.read.getProofs, {
    habitId: habitId as Id<"habits">,
    date,
  });

  const editProofCaption = useMutation(api.exec.update.editProofCaption);

  const editCaption = async (
    proofId: Id<"proofs">,
    caption: string | undefined,
  ) => {
    try {
      if (!caption) throw new Error("Caption is empty");
      await editProofCaption({ id: proofId, caption });
      Toast.show({
        type: "success",
        text1: "Caption updated",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Caption is empty",
        text2: "Failed to update",
      });
    }
  };

  const deleteProof = useMutation(api.exec.delete.deleteProof);

  const handleAddProof = () => {
    router.replace(`/(tabs)/camera?habitId=${habitId}&entryId=${entryId}`);
  };

  const handleDelete = async (proofId: Id<"proofs">) => {
    Alert.alert(
      "Delete Proof",
      "This will remove the current proof and decrease the habit's progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProof({ proofId });
              Toast.show({
                type: "success",
                text1: "Proof deleted successfully",
                text2: "Habit progress decreased",
              });
            } catch (err) {
              console.error(err);
              Toast.show({
                type: "error",
                text1: "Failed to delete proof",
              });
            }
          },
        },
      ],
    );
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

  const renderProofCard = ({
    item,
    index,
  }: {
    item: ProofWithUrl;
    index: number;
  }) => (
    <ProofCard
      item={item}
      index={index}
      x={x}
      cardSize={CARD_SIZE}
      colors={colors}
      updateCaption={editCaption}
      handleDelete={handleDelete}
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

              <TouchableOpacity onPress={handleAddProof}>
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
