// toast.config.tsx
// Edit the style and layout of toast components

import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { BaseToastProps } from "react-native-toast-message";
import type { ColorScheme } from "@/constants/colors";
import useTheme from "@/hooks/useTheme";
import { createToastStyles } from "./toast.styles";

// Define a mapping from toast type to icon and color
const toastTypeDetails = (colors: ColorScheme) => ({
  success: {
    icon: "checkmark-circle" as const,
    iconColor: "#fff",
    iconContainerStyle: createToastStyles(colors).successIcon,
    containerStyle: createToastStyles(colors).success,
  },
  error: {
    icon: "alert-circle" as const,
    iconColor: "#fff",
    iconContainerStyle: createToastStyles(colors).errorIcon,
    containerStyle: createToastStyles(colors).error,
  },
  warning: {
    icon: "warning" as const,
    iconColor: "#fff",
    iconContainerStyle: createToastStyles(colors).warningIcon,
    containerStyle: createToastStyles(colors).warning,
  },
});

const CustomToast = ({
  text1,
  text2,
  type,
  onPress,
}: BaseToastProps & { type: "success" | "error" | "warning" }) => {
  const { colors } = useTheme();
  const styles = createToastStyles(colors);
  const details = toastTypeDetails(colors)[type];

  return (
    <TouchableOpacity
      style={[styles.toastContainer, details.containerStyle]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, details.iconContainerStyle]}>
        <Ionicons name={details.icon} size={24} color={details.iconColor} />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
  error: (props: BaseToastProps) => <CustomToast {...props} type="error" />,
  warning: (props: BaseToastProps) => <CustomToast {...props} type="warning" />,
};
