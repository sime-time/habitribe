import { Link } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import CameraRecordIcon from "@/components/CameraRecordIcon";
import { useCameraSettings } from "@/stores/cameraSettingsStore";
import IconButton from "./IconButton";

interface CameraMainRowProps {
  handleTakePicture: () => void;
}

export default function CameraMainRow({
  handleTakePicture,
}: CameraMainRowProps) {
  const facing = useCameraSettings((state) => state.facing);
  const setFacing = useCameraSettings((state) => state.setFacing);

  return (
    <View style={[s.wFull, s.flexRow, s.itemsCenter, s.justifyAround]}>
      <Link asChild href={"/media-library"}>
        <IconButton
          iosName="photo.stack"
          androidName="library"
          onPress={() => {}}
        />
      </Link>
      <TouchableOpacity onPress={handleTakePicture}>
        <CameraRecordIcon />
      </TouchableOpacity>
      <IconButton
        onPress={() => {
          const newFacing = facing === "back" ? "front" : "back";
          setFacing(newFacing);
        }}
        iosName={"arrow.2.circlepath"}
        androidName="camera-reverse-outline"
      />
    </View>
  );
}
