import { ChevronDown } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import { useHabitSheetStore } from "@/stores/habitSheetStore";

export default function CameraSelectRow() {
  const openSheet = useHabitSheetStore((state) => state.openSheet);
  const habitSelected = useHabitSheetStore((state) => state.habitSelected);

  return (
    <View
      style={[
        s.flexRow,
        s.itemsCenter,
        s.justifyCenter,
        s.gap3,
        s.wFull,
        s.selfCenter,
      ]}
    >
      <View style={[s.flexRow, s.itemsCenter, s.gap3]}>
        <TouchableOpacity
          onPress={openSheet}
          style={[
            s.roundedFull,
            s.p2,
            s.px3,
            s.flexRow,
            s.itemsCenter,
            s.justifyBetween,
            s.gap1,
            {
              backgroundColor: "#00000050",
            },
          ]}
        >
          <Text style={[s.textSm, s.fontMedium, { color: "white" }]}>
            {habitSelected ? habitSelected.name : "Select Habit"}
          </Text>
          <ChevronDown color={"white"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
