import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { createCommitStyles } from "@/assets/styles/commit.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import {
  getFrequencyLabel,
  getProofMethodDescription,
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
      onPress={() => router.push("/habit/frequency")}
    >
      <Text
        style={[
          styles.commitText,
          Array.isArray(schedule.interval) && schedule.interval.length === 0
            ? c.textMuted
            : c.textPrimary,
        ]}
      >
        {getFrequencyLabel(schedule.period, schedule.interval)}
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
          <Text style={styles.commitText}>every</Text>
          {renderFrequencyButton()}
        </View>
      </View>
    );
  }

  // Default format: I'll [proofMethod] that I'll [description] every [frequency]. goal: [goalTarget]
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
        <Text style={styles.commitText}>every</Text>
        {renderFrequencyButton()}
      </View>
    </View>
  );
}

// const renderGoalButton = () => (
//   <TouchableOpacity
//     style={styles.commitPill}
//     onPress={() => router.push("/habit/goal")}
//   >
//     <Text
//       style={[
//         styles.commitText,
//         goalTarget && goalUnit ? c.textPrimary : c.textMuted,
//       ]}
//     >
//       {getGoalLabel(goalTarget, goalUnit)}
//     </Text>
//   </TouchableOpacity>
// );

// const renderTimeButton = () => (
//   <TouchableOpacity
//     style={styles.commitPill}
//     onPress={() => router.push("/habit/time")}
//   >
//     <Text
//       style={[
//         styles.commitText,
//         goalTarget && goalUnit ? c.textPrimary : c.textMuted,
//       ]}
//     >
//       {getGoalLabel(goalTarget, goalUnit)}
//     </Text>
//   </TouchableOpacity>
// );
// Time-lapse format: I'll [proofMethod] of [description] for [goalTarget] every [frequency]
// if (proofMethodName === "Time-lapse") {
//   return (
//     <View style={styles.commitContainer}>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>I'll</Text>
//         {renderProofMethodButton()}
//       </View>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>of</Text>
//         {renderDescriptionInput()}
//       </View>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>for</Text>
//         {renderTimeButton()}
//       </View>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>every</Text>
//         {renderFrequencyButton()}
//       </View>
//     </View>
//   );
// }

// Focus Timer format: I'll [proofMethod] for [goalTarget] to [description] every [frequency]
// if (proofMethodName === "Focus Timer") {
//   return (
//     <View style={styles.commitContainer}>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>I'll</Text>
//         {renderProofMethodButton()}
//       </View>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>for</Text>
//         {renderTimeButton()}
//       </View>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>to</Text>
//         {renderDescriptionInput()}
//       </View>
//       <View style={styles.commitRow}>
//         <Text style={styles.commitText}>every</Text>
//         {renderFrequencyButton()}
//       </View>
//     </View>
//   );
// }
