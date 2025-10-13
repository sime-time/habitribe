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

export default function CameraScreen() {
  const { colors } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const [cameraZoom, setCameraZoom] = useState<number>(0);
  const [cameraFlash, setCameraFlash] = useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

  return (
    <SafeAreaView
      style={[s.flex1, { backgroundColor: colors.gradients.background[0] }]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <CameraView
        ref={cameraRef}
        mode={cameraMode}
        zoom={cameraZoom}
        flash={cameraFlash}
        facing={cameraFacing}
        style={s.flex1}
      >
        <CameraTools
          cameraZoom={cameraZoom}
          cameraFlash={cameraFlash}
          setCameraZoom={setCameraZoom}
          setCameraFlash={setCameraFlash}
        />
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
          <CameraMainRow
            handleTakePicture={() => {}}
            cameraMode={cameraMode}
            setCameraFacing={setCameraFacing}
            isRecording={false}
          />
        </View>
      </CameraView>
    </SafeAreaView>
  );
}
