import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import {
  ScrollView,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import WeekDaySelector from "@/components/WeekDaySelector";
import { CHECKMARK_SIZE } from "@/constants/sizes";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import { Frequency } from "@/utils/habitFormLabels";

export default function HabitSchedule() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // array from 2 to 31
  const PATTERN_RANGE = Array.from({ length: 30 }, (_, i) => i + 2);

  const updateSchedule = useHabitFormStore((state) => state.updateSchedule);

  const frequency = useHabitFormStore(
    (state) => state.habitForm.schedule.frequency,
  );
  const pattern = useHabitFormStore(
    (state) => state.habitForm.schedule.pattern,
  );

  const setPattern = (newPattern: number | number[]) =>
    updateSchedule({
      frequency,
      pattern: newPattern,
    });

  const frequencies = [
    { title: "Daily goal", data: Frequency.Daily },
    { title: "Weekly goal", data: Frequency.Weekly },
    { title: "Monthly goal", data: Frequency.Monthly },
  ];

  const singlePattern = (frequency: Frequency) => {
    switch (frequency) {
      case Frequency.Daily:
        return "Every day";
      case Frequency.Weekly:
        return "Every week";
      case Frequency.Monthly:
        return "Every month";
      default:
        return null;
    }
  };

  const repeatingPattern = (frequency: Frequency) => {
    switch (frequency) {
      case Frequency.Daily:
        return "Amount per day";
      case Frequency.Weekly:
        return "Amount per week";
      case Frequency.Monthly:
        return "Amount per month";
      default:
        return null;
    }
  };

  const getDayPattern = (pattern: number | number[]) => {
    switch (pattern) {
      case 1:
        return "Every day";
      default:
        return "Select days";
    }
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <ScrollView style={[s.flex1, s.p4]}>
          <View style={[s.flex1, s.gap6]}>
            {/* FREQUENCY */}
            <View style={s.flex1}>
              <Text
                style={[s.textXs, s.mb2, s.ml2, c.textMuted] as TextStyle[]}
              >
                FREQUENCY
              </Text>
              <View
                style={[
                  s.px4,
                  c.bgCard,
                  s.roundedMd,
                  s.border1,
                  c.borderDefault,
                ]}
              >
                <FlashList
                  data={frequencies}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        s.flex1,
                        s.flexRow,
                        s.justifyBetween,
                        s.itemsCenter,
                        s.h13,
                      ]}
                      onPress={() => {
                        // set frequency and pattern simultaneously
                        updateSchedule({
                          frequency: item.data,
                          pattern: 1,
                        });
                      }}
                    >
                      <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                        {item.title}
                      </Text>
                      <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                        {item.data === frequency ? (
                          <Check color={colors.primary} size={CHECKMARK_SIZE} />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={[s.divider, c.bgMuted]} />
                  )}
                />
              </View>
            </View>

            {/* REPEAT */}
            <View style={s.flex1}>
              <Text
                style={[s.textXs, s.mb2, s.ml2, c.textMuted] as TextStyle[]}
              >
                REPEAT
              </Text>
              <View
                style={[
                  s.px4,
                  c.bgCard,
                  s.roundedMd,
                  s.border1,
                  c.borderDefault,
                ]}
              >
                {/* Every week or Every month has separate UI from Every day*/}
                {frequency !== Frequency.Daily ? (
                  <TouchableOpacity
                    style={[
                      s.flex1,
                      s.flexRow,
                      s.justifyBetween,
                      s.itemsCenter,
                      s.h13,
                    ]}
                    onPress={() => setPattern(1)}
                  >
                    <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                      {singlePattern(frequency)}
                    </Text>
                    <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                      {pattern === 1 ? (
                        <Check color={colors.primary} size={CHECKMARK_SIZE} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[
                        s.flex1,
                        s.flexRow,
                        s.justifyBetween,
                        s.itemsCenter,
                        s.h13,
                      ]}
                      onPress={() => setPattern(1)}
                    >
                      <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                        {getDayPattern(pattern)}
                      </Text>
                      <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                        {Array.isArray(pattern) || pattern === 1 ? (
                          <Check color={colors.primary} size={CHECKMARK_SIZE} />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    {Array.isArray(pattern) || pattern === 1 ? (
                      <WeekDaySelector
                        pattern={pattern}
                        setPattern={setPattern}
                      />
                    ) : null}
                  </>
                )}

                <View style={[s.divider, c.bgMuted]} />

                {/* Custom repeat (Pattern >= 2) */}
                <TouchableOpacity
                  style={[
                    s.flex1,
                    s.flexRow,
                    s.justifyBetween,
                    s.itemsCenter,
                    s.h13,
                  ]}
                  onPress={() => setPattern(2)}
                >
                  <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                    {repeatingPattern(frequency)}
                  </Text>
                  <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                    {!Array.isArray(pattern) && pattern >= 2 ? (
                      <Check color={colors.primary} size={CHECKMARK_SIZE} />
                    ) : null}
                  </View>
                </TouchableOpacity>

                {!Array.isArray(pattern) && pattern >= 2 ? (
                  <Picker
                    selectedValue={pattern}
                    onValueChange={(itemValue) => setPattern(itemValue)}
                    itemStyle={{
                      fontSize: 28,
                      color: colors.foreground,
                    }}
                  >
                    {PATTERN_RANGE.map((value) => (
                      <Picker.Item
                        key={value}
                        label={String(value)}
                        value={value}
                      />
                    ))}
                  </Picker>
                ) : null}
              </View>
            </View>

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
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
