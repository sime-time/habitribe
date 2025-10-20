import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Clock } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { createCommitStyles } from "@/assets/styles/commit.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import {
  getProofMethodDescription,
  getScheduleLabel,
} from "@/utils/habitFormLabels";

export default function CommitStatement() {
  const { colors } = useTheme();
  const styles = createCommitStyles(colors);
  const c = createColorStyles(colors);

  const description = useHabitFormStore((state) => state.habitForm.description);
  const schedule = useHabitFormStore((state) => state.habitForm.schedule);
  const proofMethodId = useHabitFormStore(
    (state) => state.habitForm.proofMethodId,
  );

  const proofMethods = useQuery(api.exec.read.getProofMethods);
  const proofMethodDescription = getProofMethodDescription(
    proofMethodId,
    proofMethods,
  );

  // Get the original proof method name for comparison
  const proofMethod = proofMethods?.find((pm) => pm._id === proofMethodId);
  const proofMethodName = proofMethod?.name || "";

  const renderProofMethodButton = () => (
    <TouchableOpacity
      style={styles.commitPill}
      onPress={() => router.push("/habit/proof")}
    >
      <Text
        style={[styles.commitText, proofMethodId ? c.textPrimary : c.textMuted]}
      >
        {proofMethodDescription}
      </Text>
    </TouchableOpacity>
  );

  const renderDescriptionInput = () => {
    return (
      <TouchableOpacity
        style={styles.commitPill}
        onPress={() => router.push("/habit/description")}
      >
        <Text
          style={[styles.commitText, description ? c.textPrimary : c.textMuted]}
        >
          {description || "describe habit..."}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFrequencyButton = () => (
    <TouchableOpacity
      style={styles.commitPill}
      onPress={() => router.push("/habit/schedule")}
    >
      <Text
        style={[
          styles.commitText,
          Array.isArray(schedule.pattern) && schedule.pattern.length === 0
            ? c.textMuted
            : c.textPrimary,
        ]}
      >
        {getScheduleLabel(schedule.frequency, schedule.pattern).toLowerCase()}
      </Text>
    </TouchableOpacity>
  );

  // Camera format: I'll [proofMethod] of [description] every [frequency]
  if (proofMethodName === "Camera") {
    return (
      <View style={styles.commitContainer}>
        <View style={styles.commitRow}>
          <Text style={styles.commitText}>I'll</Text>
          {renderProofMethodButton()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.commitText}>of</Text>
          {renderDescriptionInput()}
        </View>
        <View style={styles.commitRow}>
          <Clock color={colors.muted} size={18} />
          {renderFrequencyButton()}
        </View>
      </View>
    );
  }

  // Default format: I'll [proofMethod] that I'll [description] every [frequency]
  return (
    <View style={styles.commitContainer}>
      <View style={styles.commitRow}>
        <Text style={styles.commitText}>I'll</Text>
        {renderProofMethodButton()}
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.commitText}>that I'll</Text>
        {renderDescriptionInput()}
      </View>
      <View style={styles.commitRow}>
        <Clock color={colors.muted} size={18} />
        {renderFrequencyButton()}
      </View>
    </View>
  );
}