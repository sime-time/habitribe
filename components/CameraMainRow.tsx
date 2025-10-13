import type { CameraMode, CameraType } from "expo-camera";
import { Link } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { s } from "@/assets/styles/utility.styles";
import CameraRecordIcon from "@/components/CameraRecordIcon";
import IconButton from "./IconButton";

interface CameraMainRowProps {
  cameraMode: CameraMode;
  isRecording: boolean;
  setCameraFacing: React.Dispatch<React.SetStateAction<CameraType>>;
  handleTakePicture: () => void;
}

export default function CameraMainRow({
  cameraMode,
  isRecording,
  setCameraFacing,
  handleTakePicture,
}: CameraMainRowProps) {
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
        <CameraRecordIcon cameraMode={cameraMode} isRecording={isRecording} />
      </TouchableOpacity>
      <IconButton
        onPress={() =>
          setCameraFacing((current) => (current === "back" ? "front" : "back"))
        }
        iosName={"arrow.2.circlepath"}
        androidName="camera-reverse-outline"
      />
    </View>
  );
}
