import { Ionicons } from "@expo/vector-icons";
import type { CameraMode } from "expo-camera";
import { SymbolView } from "expo-symbols";
import useTheme from "@/hooks/useTheme";

const SIZE = 90;

interface CameraRecordIconProps {
  cameraMode: CameraMode;
  isRecording: boolean;
}

export default function CameraRecordIcon({
  cameraMode,
  isRecording,
}: CameraRecordIconProps) {
  const { colors } = useTheme();
  return (
    <SymbolView
      name={
        cameraMode === "picture"
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
            cameraMode === "picture"
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
