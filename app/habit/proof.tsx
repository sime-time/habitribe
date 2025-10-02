import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, FilePenLine, Info, Timer, Video } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCardStyles } from "@/assets/styles/card.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

type ProofMethod = Doc<"proofMethods">;

export default function HabitProof() {
  const { colors } = useTheme();
  const styles = createCardStyles(colors);

  const proofId = useHabitFormStore((state) => state.habitForm.proofMethodId);
  const updateProofMethod = useHabitFormStore(
    (state) => state.updateProofMethod,
  );

  const proofMethods = useQuery(api.exec.read.getProofMethods);

  const renderIcon = (name: string) => {
    const iconSize = 32;
    switch (name) {
      case "Camera":
        return <Camera color={colors.primary} size={iconSize} />;
      case "Time-lapse":
        return <Video color={colors.primary} size={iconSize} />;
      case "Focus Timer":
        return <Timer color={colors.primary} size={iconSize} />;
      default:
        return <FilePenLine color={colors.primary} size={iconSize} />;
    }
  };

  // update the habit's proof type on press
  const renderProofMethod = ({ item }: { item: ProofMethod }) => (
    <Pressable
      onPress={() => updateProofMethod(item._id, item.name)}
      style={[
        styles.card,
        {
          borderColor: item._id === proofId ? colors.primary : colors.border,
          backgroundColor:
            item._id === proofId ? colors.secondary : colors.card,
        },
      ]}
    >
      <View style={styles.cardStart}>
        <View style={styles.cardIconContainer}>{renderIcon(item.name)}</View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.body}>{item.name}</Text>
          <Text style={styles.muted}>{item.description}</Text>
        </View>
      </View>
      <Pressable onPress={() => null} style={styles.cardEnd}>
        <View style={styles.cardIconContainer}>
          <Info size={26} color={colors.mutedForeground} />
        </View>
      </Pressable>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.scrollView}>
        <FlashList
          data={proofMethods}
          renderItem={renderProofMethod}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
