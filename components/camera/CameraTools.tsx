import { View } from "react-native";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import IconButton from "@/components/IconButton";
import { useCameraSettings } from "@/stores/cameraSettingsStore";

const ZOOM_VALUE = 0.2;

export default function CameraTools() {
  const zoom = useCameraSettings((state) => state.zoom);
  const flash = useCameraSettings((state) => state.flash);
  const setZoom = useCameraSettings((state) => state.setZoom);
  const setFlash = useCameraSettings((state) => state.setFlash);

  return (
    <View
      style={[
        s.gap4,
        s.z10,
        { position: "absolute", top: spacing[2], right: spacing[2] },
      ]}
    >
      <IconButton
        onPress={() => {
          const newFlash = flash === "on" ? "off" : "on";
          setFlash(newFlash);
        }}
        iosName={flash === "on" ? "bolt" : "bolt.slash"}
        androidName={flash === "on" ? "flash-outline" : "flash-off-outline"}
      />
      <IconButton
        onPress={() => {
          // increment zoom and avoid floating point imprecision
          const newZoom = zoom + ZOOM_VALUE;
          setZoom(Math.max(0, Math.min(1, newZoom)));
        }}
        iosName={"plus.magnifyingglass"}
        androidName="add"
        containerStyle={zoom >= 1 ? s.opacity25 : null}
      />
      <IconButton
        onPress={() => {
          // decrement zoom and avoid floating point imprecision
          const newZoom = zoom - ZOOM_VALUE;
          setZoom(Math.max(0, Math.min(1, newZoom)));
        }}
        iosName={"minus.magnifyingglass"}
        androidName="remove"
        containerStyle={zoom <= 0 ? s.opacity25 : null}
      />
    </View>
  );
}
