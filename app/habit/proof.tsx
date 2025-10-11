import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Camera, FilePenLine, Info } from "lucide-react-native";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

type ProofMethod = Doc<"proofMethods">;

export default function HabitProof() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

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
      default:
        return <FilePenLine color={colors.primary} size={iconSize} />;
    }
  };

  // update the habit's proof type on press
  const renderProofMethod = ({ item }: { item: ProofMethod }) => (
    <Pressable
      onPress={() => updateProofMethod(item._id, item.name)}
      style={[
        s.p5,
        s.roundedLg,
        s.justifyBetween,
        s.itemsCenter,
        s.mb4,
        s.border2,
        s.flexRow,
        {
          borderColor: item._id === proofId ? colors.primary : colors.border,
          backgroundColor:
            item._id === proofId ? colors.secondary : colors.card,
        },
      ]}
    >
      <View style={[s.flexRow, s.itemsCenter, s.gap5]}>
        <View
          style={[
            s.itemsCenter,
            s.justifyCenter,
            s.roundedFull,
            { width: 36, height: 36 },
          ]}
        >
          {renderIcon(item.name)}
        </View>
        <View style={[s.flexCol, s.gap1]}>
          <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
            {item.name}
          </Text>
          <Text style={[s.textBase, c.textMuted]}>{item.description}</Text>
        </View>
      </View>
      <Pressable
        onPress={() => null}
        style={[
          s.itemsCenter,
          s.justifyCenter,
          s.roundedFull,
          { width: 36, height: 36 },
        ]}
      >
        <Info size={26} color={colors.muted} />
      </Pressable>
    </Pressable>
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={[s.flex1, s.p4]}>
        <FlashList
          data={proofMethods}
          renderItem={renderProofMethod}
          keyExtractor={(item) => item._id}
          ListFooterComponent={
            <TouchableOpacity style={s.mt2} onPress={() => router.back()}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={s.button}
              >
                <Text style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}>
                  Done
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
