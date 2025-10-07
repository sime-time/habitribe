import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { createCommitStyles } from "@/assets/styles/commit.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import {
  getFrequencyLabel,
  getGoalLabel,
  getProofMethodLabel,
} from "@/utils/habitFormLabels";

export default function CommitStatement() {
  const { colors } = useTheme();
  const styles = createCommitStyles(colors);
  const description = useHabitFormStore((state) => state.habitForm.description);
  const schedule = useHabitFormStore((state) => state.habitForm.schedule);
  const proofMethodId = useHabitFormStore(
    (state) => state.habitForm.proofMethodId,
  );
  const goalTarget = useHabitFormStore((state) => state.habitForm.goalTarget);
  const goalUnit = useHabitFormStore((state) => state.habitForm.goalUnit);

  const updateForm = useHabitFormStore((state) => state.updateForm);

  const proofMethods = useQuery(api.exec.read.getProofMethods);
  const proofMethodLabel = getProofMethodLabel(proofMethodId, proofMethods);

  // Get the original proof method name for comparison
  const proofMethod = proofMethods?.find((pm) => pm._id === proofMethodId);
  const proofMethodName = proofMethod?.name || "";

  const renderProofMethodButton = () => (
    <TouchableOpacity
      style={styles.commitPill}
      onPress={() => router.push("/habit/proof")}
    >
      <Text
        style={[
          styles.body,
          {
            color: proofMethodId ? colors.primary : colors.mutedForeground,
          },
        ]}
      >
        {proofMethodLabel}
      </Text>
    </TouchableOpacity>
  );

  const renderDescriptionInput = () => (
    <TouchableOpacity style={styles.commitPill}>
      <TextInput
        value={description}
        autoCapitalize="none"
        style={styles.primaryText}
        placeholder="describe habit..."
        placeholderTextColor={colors.mutedForeground}
        onChangeText={(text) => updateForm("description", text)}
      />
    </TouchableOpacity>
  );

  const renderGoalButton = () => (
    <TouchableOpacity
      style={styles.commitPill}
      onPress={() => router.push("/habit/goal")}
    >
      <Text
        style={[
          styles.body,
          {
            color:
              goalTarget && goalUnit ? colors.primary : colors.mutedForeground,
          },
        ]}
      >
        {getGoalLabel(goalTarget, goalUnit)}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeButton = () => (
    <TouchableOpacity
      style={styles.commitPill}
      onPress={() => router.push("/habit/time")}
    >
      <Text
        style={[
          styles.body,
          {
            color:
              goalTarget && goalUnit ? colors.primary : colors.mutedForeground,
          },
        ]}
      >
        {getGoalLabel(goalTarget, goalUnit)}
      </Text>
    </TouchableOpacity>
  );

  const renderFrequencyButton = () => (
    <TouchableOpacity
      style={styles.commitPill}
      onPress={() => router.push("/habit/frequency")}
    >
      <Text
        style={[
          styles.body,
          {
            color:
              Array.isArray(schedule.interval) && schedule.interval.length === 0
                ? colors.mutedForeground
                : colors.primary,
          },
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
          <Text style={styles.subtitle}>I'll</Text>
          {renderProofMethodButton()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>of</Text>
          {renderDescriptionInput()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>(</Text>
          {renderGoalButton()}
          <Text style={styles.subtitle}>)</Text>
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>every</Text>
          {renderFrequencyButton()}
        </View>
      </View>
    );
  }

  // Time-lapse format: I'll [proofMethod] of [description] for [goalTarget] every [frequency]
  if (proofMethodName === "Time-lapse") {
    return (
      <View style={styles.commitContainer}>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>I'll</Text>
          {renderProofMethodButton()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>of</Text>
          {renderDescriptionInput()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>for</Text>
          {renderTimeButton()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>every</Text>
          {renderFrequencyButton()}
        </View>
      </View>
    );
  }

  // Focus Timer format: I'll [proofMethod] for [goalTarget] to [description] every [frequency]
  if (proofMethodName === "Focus Timer") {
    return (
      <View style={styles.commitContainer}>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>I'll</Text>
          {renderProofMethodButton()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>for</Text>
          {renderTimeButton()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>to</Text>
          {renderDescriptionInput()}
        </View>
        <View style={styles.commitRow}>
          <Text style={styles.subtitle}>every</Text>
          {renderFrequencyButton()}
        </View>
      </View>
    );
  }

  // Default format: I'll [proofMethod] that I'll [description] every [frequency]. goal: [goalTarget]
  return (
    <View style={styles.commitContainer}>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>I'll</Text>
        {renderProofMethodButton()}
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>that I'll</Text>
        {renderDescriptionInput()}
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>(</Text>
        {renderGoalButton()}
        <Text style={styles.subtitle}>)</Text>
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>every</Text>
        {renderFrequencyButton()}
      </View>
    </View>
  );
}
