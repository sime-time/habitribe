import {
  type CameraMode,
  type CameraType,
  CameraView,
  type FlashMode,
} from "expo-camera";
import { useRef, useState } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import CameraMainRow from "@/components/CameraMainRow";
import CameraSelectRow from "@/components/CameraSelectRow";
import CameraTools from "@/components/CameraTools";
import useTheme from "@/hooks/useTheme";
import { useCameraSettings } from "@/stores/cameraSettingsStore";

export default function CameraScreen() {
  const { colors } = useTheme();
  const cameraRef = useRef<CameraView>(null);

  const zoom = useCameraSettings((state) => state.zoom);
  const mode = useCameraSettings((state) => state.mode);
  const flash = useCameraSettings((state) => state.flash);
  const facing = useCameraSettings((state) => state.facing);

  return (
    <SafeAreaView
      style={[s.flex1, { backgroundColor: colors.gradients.background[0] }]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <CameraView
        ref={cameraRef}
        mode={mode}
        zoom={zoom}
        flash={flash}
        facing={facing}
        style={s.flex1}
      >
        <CameraTools />
        <View
          style={[
            s.wFull,
            s.gap4,
            {
              position: "absolute",
              bottom: spacing[6],
            },
          ]}
        >
          <CameraSelectRow />
          <CameraMainRow handleTakePicture={() => {}} />
        </View>
      </CameraView>
    </SafeAreaView>
  );
}
