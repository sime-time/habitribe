import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";

interface HeaderProps {
  title: string;
}
export default function Header({ title }: HeaderProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  return (
    <View style={[s.p4, s.pt8, s.flexRow, s.justifyBetween, s.itemsCenter]}>
      <Text style={[s.text3xl, s.fontBold, c.textForeground]}>{title}</Text>
      <View style={[s.flexRow, s.itemsCenter, s.gap4]}>
        <TouchableOpacity
          onPress={() => Alert.alert("Coming Soon", "Notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.foreground}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
      </View>
    </View>
  );
}
