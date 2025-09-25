import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, View } from "react-native";
import { createBaseStyles } from "@/assets/styles/base.styles";
import useTheme from "@/hooks/useTheme";

export default function LoadingSpinner() {
  const { colors } = useTheme();
  const styles = createBaseStyles(colors);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.body}>Loading...</Text>
      </View>
    </LinearGradient>
  );
}
