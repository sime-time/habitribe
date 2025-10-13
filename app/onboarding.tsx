import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { usePermissions } from "expo-media-library";
import { router } from "expo-router";
import { Camera } from "lucide-react-native";
import { Alert, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "@/assets/styles/utility.styles";

export default function Onboarding() {
  const [_cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [_microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [_mediaLibraryPermission, requestMediaLibraryPermission] =
    usePermissions();

  const requestAllPermissions = async () => {
    const cameraStatus = await requestCameraPermission();
    if (!cameraStatus.granted) {
      Alert.alert("Error", "Camera permissions are required");
      return false;
    }
    const microphoneStatus = await requestMicrophonePermission();
    if (!microphoneStatus.granted) {
      Alert.alert("Error", "Microphone permissions are required");
      return false;
    }
    const mediaLibraryStatus = await requestMediaLibraryPermission();
    if (!mediaLibraryStatus.granted) {
      Alert.alert("Error", "Media Library permissions are required");
      return false;
    }

    // only set to true once user provides permissions
    // this prevents taking user to home screen without permissions
    // check "useFirstTimeOpen" hook
    await AsyncStorage.setItem("hasOpened", "true");
    return true;
  };

  const handleContinue = async () => {
    const allPermissionGranted = await requestAllPermissions();
    if (allPermissionGranted) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("To continue, please provide permissions in settings");
    }
  };

  return (
    <SafeAreaView style={[s.flex1, s.p4]}>
      <View style={[s.mb6, s.gap2]}>
        <Camera size={56} />
        <Text>
          Welcome! To provide the best experience, this app requires permissions
          for the following:
        </Text>
      </View>
      <View style={[s.mb6, s.gap2]}>
        <Text>Camera Permissions</Text>
        <Text>🎥 For taking pictures and videos</Text>
      </View>
      <View style={[s.mb6, s.gap2]}>
        <Text>Microphone Permissions</Text>
        <Text>🎙️ For taking videos with audio</Text>
      </View>
      <View style={[s.mb6, s.gap2]}>
        <Text>Media Library Permissions</Text>
        <Text>📸 To save/view your amazing shots </Text>
      </View>
      <Button title="Allow Permissions" onPress={handleContinue} />
    </SafeAreaView>
  );
}
