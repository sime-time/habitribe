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

  return (
    <View style={styles.commitContainer}>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>I'll</Text>
        <TouchableOpacity
          style={styles.commitPill}
          onPress={() => router.push("/habit/proof")}
        >
          <Text style={styles.primaryText}>
            {getProofMethodLabel(proofMethodId, proofMethods)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>for</Text>
        <TouchableOpacity
          style={styles.commitPill}
          onPress={() => router.push("/habit/target")}
        >
          <Text style={styles.primaryText}>
            {getGoalLabel(goalTarget, goalUnit)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>to</Text>
        <TouchableOpacity style={styles.commitPill}>
          <TextInput
            value={description}
            style={styles.primaryText}
            placeholder="insert text here..."
            placeholderTextColor={colors.mutedForeground}
            onChangeText={(text) => updateForm("description", text)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.commitRow}>
        <Text style={styles.subtitle}>every</Text>
        <TouchableOpacity
          style={styles.commitPill}
          onPress={() => router.push("/habit/frequency")}
        >
          <Text style={styles.primaryText}>
            {getFrequencyLabel(schedule.period, schedule.interval)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
