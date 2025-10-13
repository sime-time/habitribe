import type { CameraType, FlashMode } from "expo-camera";
import { Text, View } from "react-native";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import IconButton from "./IconButton";

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
          // increment zoom
          if (cameraZoom < 1) {
            setCameraZoom((prev) => prev + 0.25);
          }
        }}
        iosName={"plus.magnifyingglass"}
        androidName="add"
        containerStyle={cameraZoom >= 1 ? s.opacity25 : null}
      />
      <IconButton
        onPress={() => {
          // decrement zoom
          if (cameraZoom > 0) {
            setCameraZoom((prev) => prev - 0.25);
          }
        }}
        iosName={"minus.magnifyingglass"}
        androidName="remove"
        containerStyle={cameraZoom <= 0 ? s.opacity25 : null}
      />
    </View>
  );
}
