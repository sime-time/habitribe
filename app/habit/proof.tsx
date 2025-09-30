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

type ProofType = Doc<"proofTypes">;

export default function HabitProof() {
  const { colors } = useTheme();
  const styles = createCardStyles(colors);

  const proofId = useHabitFormStore((state) => state.habitForm.proofTypeId);
  const updateForm = useHabitFormStore((state) => state.updateForm);

  const proofTypes = useQuery(api.exec.read.getProofTypes);

  const renderIcon = (name: string) => {
    const iconSize = 32;
    switch (name) {
      case "Self-Verify":
        return <FilePenLine color={colors.primary} size={iconSize} />;
      case "Photo":
        return <Camera color={colors.primary} size={iconSize} />;
      case "Time-lapse":
        return <Video color={colors.primary} size={iconSize} />;
      case "Focus Timer":
        return <Timer color={colors.primary} size={iconSize} />;
      default:
        return null;
    }
  };

  // update the habit's proof type on press
  const renderProofType = ({ item }: { item: ProofType }) => (
    <View
      style={[
        styles.card,
        {
          borderColor: item._id === proofId ? colors.primary : colors.border,
          backgroundColor:
            item._id === proofId ? colors.secondary : colors.card,
        },
      ]}
    >
      <Pressable
        style={styles.cardStart}
        onPress={() => updateForm("proofTypeId", item._id)}
      >
        <View style={styles.cardIconContainer}>{renderIcon(item.name)}</View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.body}>{item.name}</Text>
          <Text style={styles.muted}>{item.description}</Text>
        </View>
      </Pressable>
      <View style={styles.cardEnd}>
        <View style={styles.cardIconContainer}>
          <Info size={26} color={colors.mutedForeground} />
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.scrollView}>
        <FlashList
          data={proofTypes}
          renderItem={renderProofType}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
