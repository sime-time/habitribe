import { launchImageLibraryAsync } from "expo-image-picker";
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
  const setPicture = useCameraSettings((state) => state.setPicture);

  const handleOpenLibrary = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false, // single selection for now
      quality: 1,
    });

    if (!result.canceled) {
      // result.assets is an array of selected media
      setPicture(result.assets[0].uri);
    }
  };

  return (
    <View style={[s.wFull, s.flexRow, s.itemsCenter, s.justifyAround]}>
      <IconButton
        iosName="photo.stack"
        androidName="library"
        onPress={handleOpenLibrary}
      />
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
