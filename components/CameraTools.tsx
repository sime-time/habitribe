import type { FlashMode } from "expo-camera";
import { useEffect } from "react";
import { View } from "react-native";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import IconButton from "./IconButton";

const ZOOM_VALUE = 0.2;

interface CameraToolsProps {
  cameraZoom: number;
  cameraFlash: FlashMode;
  setCameraZoom: React.Dispatch<React.SetStateAction<number>>;
  setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>;
}

export default function CameraTools({
  cameraZoom,
  cameraFlash,
  setCameraZoom,
  setCameraFlash,
}: CameraToolsProps) {
  useEffect(() => {
    console.log("zoom", cameraZoom);
  }, [cameraZoom]);

  return (
    <View
      style={[
        s.gap4,
        s.z10,
        { position: "absolute", top: spacing[2], right: spacing[2] },
      ]}
    >
      <IconButton
        onPress={() =>
          setCameraFlash((current) => (current === "on" ? "off" : "on"))
        }
        iosName={cameraFlash === "on" ? "bolt" : "bolt.slash"}
        androidName={
          cameraFlash === "on" ? "flash-outline" : "flash-off-outline"
        }
      />
      <IconButton
        onPress={() => {
          // increment zoom and avoid floating point imprecision
          setCameraZoom((prev) => {
            const newZoom = prev + ZOOM_VALUE;
            return Math.max(0, Math.min(1, newZoom));
          });
        }}
        iosName={"plus.magnifyingglass"}
        androidName="add"
        containerStyle={cameraZoom >= 1 ? s.opacity25 : null}
      />
      <IconButton
        onPress={() => {
          // decrement zoom and avoid floating point imprecision
          setCameraZoom((prev) => {
            const newZoom = prev - ZOOM_VALUE;
            return Math.max(0, Math.min(1, newZoom));
          });
        }}
        iosName={"minus.magnifyingglass"}
        androidName="remove"
        containerStyle={cameraZoom <= 0 ? s.opacity25 : null}
      />
    </View>
  );
}
