import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CHECKMARK_SIZE,
  createHabitStyles,
} from "@/assets/styles/habit.styles";
import WeekDaySelector from "@/components/WeekDaySelector";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import { Period } from "@/utils/habitFormLabels";

export default function HabitFrequency() {
  const { colors } = useTheme();
  const styles = createHabitStyles(colors);

  const updateSchedule = useHabitFormStore((state) => state.updateSchedule);

  const period = useHabitFormStore((state) => state.habitForm.schedule.period);
  const interval = useHabitFormStore(
    (state) => state.habitForm.schedule.interval,
  );
  const setInterval = (newInterval: number | number[]) =>
    updateSchedule({
      period,
      interval: newInterval,
    });

  const periods = [
    { title: "Daily goal", data: Period.Daily },
    { title: "Weekly goal", data: Period.Weekly },
    { title: "Monthly goal", data: Period.Monthly },
  ];

  const singleInterval = (period: Period) => {
    switch (period) {
      case Period.Daily:
        return "Every day";
      case Period.Weekly:
        return "Every week";
      case Period.Monthly:
        return "Every month";
      default:
        return null;
    }
  };

  const getDayFrequency = (interval: number | number[]) => {
    switch (interval) {
      case 1:
        return "Every day";
      default:
        return "Select days";
    }
  };

  const pickerPeriod = (period: Period) => {
    switch (period) {
      case Period.Daily:
        return "days";
      case Period.Weekly:
        return "weeks";
      case Period.Monthly:
        return "months";
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.container}>
              <Text style={styles.inputLabel}>PERIOD</Text>
              <View style={styles.inputGroup}>
                <FlashList
                  data={periods}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => {
                        // set period and interval simultaneously
                        updateSchedule({
                          period: item.data,
                          interval: 1,
                        });
                      }}
                    >
                      <Text style={styles.body}>{item.title}</Text>
                      <View style={styles.inputIcon}>
                        {item.data === period ? (
                          <Ionicons
                            name="checkmark"
                            color={colors.primary}
                            size={CHECKMARK_SIZE}
                          />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.inputDivider} />
                  )}
                />
              </View>
            </View>

            <View style={styles.container}>
              <Text style={styles.inputLabel}>REPEAT</Text>
              <View style={styles.inputGroup}>
                {/* Every week or Every month has separate UI from Every day*/}
                {period !== Period.Daily ? (
                  <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => setInterval(1)}
                  >
                    <Text style={styles.body}>{singleInterval(period)}</Text>
                    <View style={styles.inputIcon}>
                      {interval === 1 ? (
                        <Ionicons
                          name="checkmark"
                          color={colors.primary}
                          size={CHECKMARK_SIZE}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => setInterval(1)}
                    >
                      <Text style={styles.body}>
                        {getDayFrequency(interval)}
                      </Text>
                      <View style={styles.inputIcon}>
                        {Array.isArray(interval) || interval === 1 ? (
                          <Ionicons
                            name="checkmark"
                            color={colors.primary}
                            size={CHECKMARK_SIZE}
                          />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    {Array.isArray(interval) || interval === 1 ? (
                      <WeekDaySelector
                        interval={interval}
                        setInterval={setInterval}
                      />
                    ) : null}
                  </>
                )}

                <View style={styles.inputDivider} />

                {/* Custom repeat (Interval >= 2) */}
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setInterval(2)}
                >
                  <Text style={styles.body}>Custom repeat</Text>
                  <View style={styles.inputIcon}>
                    {!Array.isArray(interval) && interval >= 2 ? (
                      <Ionicons
                        name="checkmark"
                        color={colors.primary}
                        size={CHECKMARK_SIZE}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>

                {!Array.isArray(interval) && interval >= 2 ? (
                  <View>
                    <Text style={styles.pickerTextLeft}>Every</Text>
                    <Text style={styles.pickerTextRight}>
                      {pickerPeriod(period)}
                    </Text>
                    <Picker
                      selectedValue={interval}
                      onValueChange={(itemValue) => setInterval(itemValue)}
                      itemStyle={{
                        fontSize: 28,
                        color: colors.foreground,
                      }}
                    >
                      <Picker.Item label="2" value={2} />
                      <Picker.Item label="3" value={3} />
                      <Picker.Item label="4" value={4} />
                      <Picker.Item label="5" value={5} />
                      <Picker.Item label="6" value={6} />
                    </Picker>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
