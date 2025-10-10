import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
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
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import { Period } from "@/utils/habitFormLabels";

const CHECKMARK_SIZE = 28;

export default function HabitFrequency() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

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
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <ScrollView style={[s.flex1, s.p4]}>
          <View style={[s.flex1, s.gap6]}>
            {/* PERIOD */}
            <View style={s.flex1}>
              <Text
                style={[s.textXs, s.mb2, s.ml2, c.textMuted] as TextStyle[]}
              >
                PERIOD
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
                  data={periods}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        s.flex1,
                        s.flexRow,
                        s.justifyBetween,
                        s.itemsCenter,
                        s.inputHeight,
                      ]}
                      onPress={() => {
                        // set period and interval simultaneously
                        updateSchedule({
                          period: item.data,
                          interval: 1,
                        });
                      }}
                    >
                      <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                        {item.title}
                      </Text>
                      <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                        {item.data === period ? (
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
                {period !== Period.Daily ? (
                  <TouchableOpacity
                    style={[
                      s.flex1,
                      s.flexRow,
                      s.justifyBetween,
                      s.itemsCenter,
                      s.inputHeight,
                    ]}
                    onPress={() => setInterval(1)}
                  >
                    <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                      {singleInterval(period)}
                    </Text>
                    <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                      {interval === 1 ? (
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
                        s.inputHeight,
                      ]}
                      onPress={() => setInterval(1)}
                    >
                      <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                        {getDayFrequency(interval)}
                      </Text>
                      <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                        {Array.isArray(interval) || interval === 1 ? (
                          <Check color={colors.primary} size={CHECKMARK_SIZE} />
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

                <View style={[s.divider, c.bgMuted]} />

                {/* Custom repeat (Interval >= 2) */}
                <TouchableOpacity
                  style={[
                    s.flex1,
                    s.flexRow,
                    s.justifyBetween,
                    s.itemsCenter,
                    s.inputHeight,
                  ]}
                  onPress={() => setInterval(2)}
                >
                  <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                    Custom repeat
                  </Text>
                  <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                    {!Array.isArray(interval) && interval >= 2 ? (
                      <Check color={colors.primary} size={CHECKMARK_SIZE} />
                    ) : null}
                  </View>
                </TouchableOpacity>

                {!Array.isArray(interval) && interval >= 2 ? (
                  <View>
                    <Text
                      style={[
                        s.textXl,
                        c.textForeground,
                        {
                          position: "absolute",
                          top: "50%",
                          marginTop: -11, // Half of fontSize for centering
                          left: 32,
                          zIndex: 1,
                        },
                      ]}
                    >
                      Every
                    </Text>
                    <Text
                      style={[
                        s.textXl,
                        c.textForeground,
                        {
                          position: "absolute",
                          top: "50%",
                          marginTop: -11, // Half of fontSize for centering
                          right: 32,
                          zIndex: 1,
                        },
                      ]}
                    >
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
