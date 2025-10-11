// toast.config.tsx
// Edit the style and layout of toast components

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { BaseToastProps } from "react-native-toast-message";
import Toast from "react-native-toast-message";
import useTheme from "@/hooks/useTheme";
import { createColorStyles } from "./color.styles";
import { s } from "./utility.styles";

type ToastType = "success" | "error" | "warning";

const CustomToast = ({
  text1,
  text2,
  type,
}: BaseToastProps & { type: ToastType }) => {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // Define toast type details with utility-first approach
  const toastDetails = {
    success: {
      icon: "checkmark-circle" as const,
      iconColor: colors.success,
      backgroundColor: `${colors.success}15`,
      borderColor: colors.success,
    },
    error: {
      icon: "warning-outline" as const,
      iconColor: colors.destructive,
      backgroundColor: `${colors.destructive}15`,
      borderColor: colors.destructive,
    },
    warning: {
      icon: "warning" as const,
      iconColor: colors.warning,
      backgroundColor: `${colors.warning}15`,
      borderColor: colors.warning,
    },
  };

  const details = toastDetails[type];

  return (
    <View
      style={[
        s.flexRow,
        s.itemsCenter,
        s.p4,
        s.gap3,
        s.roundedLg,
        s.border2,
        c.bgCard,
        s.wFull,
        {
          borderColor: details.borderColor,
        },
        { maxWidth: 400, minWidth: 280 },
      ]}
    >
      {/* Icon Container */}
      <View
        style={[
          s.itemsCenter,
          s.justifyCenter,
          s.roundedFull,
          { width: 40, height: 40, backgroundColor: `${details.iconColor}20` },
        ]}
      >
        <Ionicons name={details.icon} size={24} color={details.iconColor} />
      </View>

      {/* Text Container */}
      <View style={[s.flex1, s.gap1]}>
        {text1 && (
          <Text
            style={[s.textBase, s.fontSemibold, { color: details.iconColor }]}
          >
            {text1}
          </Text>
        )}
        {text2 && (
          <Text style={[s.textSm, c.textMuted]} numberOfLines={2}>
            {text2}
          </Text>
        )}
      </View>

      {/* Close Button */}
      <Pressable
        onPress={() => Toast.hide()}
        style={[
          s.itemsCenter,
          s.justifyCenter,
          s.roundedFull,
          s.p2,
          { backgroundColor: `${colors.foreground}10` },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={20} color={colors.muted} />
      </Pressable>
    </View>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
  error: (props: BaseToastProps) => <CustomToast {...props} type="error" />,
  warning: (props: BaseToastProps) => <CustomToast {...props} type="warning" />,
};
