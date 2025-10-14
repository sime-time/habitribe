import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import useTheme from "@/hooks/useTheme";
import { useCameraSettings } from "@/stores/cameraSettingsStore";

const SIZE = 90;

export default function CameraRecordIcon() {
  const { colors } = useTheme();
  const mode = useCameraSettings((state) => state.mode);
  const isRecording = useCameraSettings((state) => state.isRecording);

  return (
    <SymbolView
      name={
        mode === "picture"
          ? "circle"
          : isRecording
            ? "record.circle"
            : "circle.circle"
      }
      size={SIZE}
      type="hierarchical"
      tintColor={isRecording ? colors.destructive : "white"}
      animationSpec={{
        effect: {
          type: isRecording ? "pulse" : "bounce",
        },
        repeating: isRecording,
      }}
      fallback={
        <Ionicons
          name={
            mode === "picture"
              ? "radio-button-on"
              : isRecording
                ? "recording"
                : "stop-circle-outline"
          }
          size={SIZE}
          color={isRecording ? colors.destructive : "white"}
        />
      }
    />
  );
}
