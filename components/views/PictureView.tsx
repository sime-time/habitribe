import { useUploadFile } from "@convex-dev/r2/react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Image } from "expo-image";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  type ImageStyle,
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createColorStyles } from "@/assets/styles/color.styles";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import IconButton from "@/components/IconButton";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useCameraSettings } from "@/stores/cameraSettingsStore";
import { useHabitSelectStore } from "@/stores/habitSelectStore";
import { getTodayDateString } from "@/utils/dateHelper";
import CameraSelectRow from "../camera/CameraSelectRow";

export default function PictureView() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const uploadFile = useUploadFile(api.bucket);
  const [uploading, setUploading] = useState(false);
  const createProof = useMutation(api.exec.create.addProof);

  const picture = useCameraSettings((state) => state.picture);
  const setPicture = useCameraSettings((state) => state.setPicture);
  const caption = useCameraSettings((state) => state.caption);
  const setCaption = useCameraSettings((state) => state.setCaption);
  const entry = useHabitSelectStore((state) => state.entrySelected);
  const reset = useHabitSelectStore((state) => state.reset);

  const handleSend = async () => {
    setUploading(true);
    try {
      // Validate: Is a habit entry selected?
      if (!entry) throw Error("You must select a habit");
      if (!picture) throw Error("You must select a photo to upload");

      // Convert picture URI string into blob
      const response = await fetch(picture);
      const blob = await response.blob();

      // Create a file object from the blob
      const fileName = `entry_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      // Upload image to R2 and return the storage key
      const storageKey = await uploadFile(file);

      const today = getTodayDateString();

      // Add new proof to habit entry
      createProof({
        habitEntryId: entry._id,
        date: today,
        key: storageKey,
        caption: caption || undefined,
      });

      // Reset state and close view
      Toast.show({ type: "success", text1: "Image uploaded successfully!" });
      reset();
      setPicture("");
      setCaption("");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        Toast.show({ type: "error", text1: err.message });
      } else if (err instanceof ConvexError) {
        Toast.show({ type: "error", text1: err.data });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to upload photo.",
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView
      style={[s.flex1, { backgroundColor: colors.gradients.background[0] }]}
      edges={["top"]}
    >
      <View style={[s.flex1]}>
        {/* CLOSE BUTTON*/}
        <View
          style={[
            s.gap4,
            s.z10,
            s.absolute,
            { top: spacing[2], left: spacing[2] },
          ]}
        >
          <IconButton
            iosName="xmark"
            androidName="close"
            onPress={() => {
              setPicture("");
              setCaption("");
            }}
          />
        </View>

        <View
          style={[
            s.gap4,
            s.z10,
            s.absolute,
            { top: spacing[2], right: spacing[2] },
          ]}
        >
          {/* SHARE BUTTON*/}
          <View style={[s.flexRow, s.itemsCenter, s.gap1, s.justifyEnd]}>
            <Text style={[s.textBase, c.textWhite]}>Share</Text>
            <IconButton
              iosName="square.and.arrow.up"
              androidName="share"
              onPress={() => {
                shareAsync(picture);
              }}
            />
          </View>
          {/* SAVE TO LIBRARY BUTTON*/}
          <View style={[s.flexRow, s.itemsCenter, s.gap1, s.justifyEnd]}>
            <Text style={[s.textBase, c.textWhite]}>Save</Text>
            <IconButton
              iosName="square.and.arrow.down"
              androidName="save"
              onPress={() => {
                saveToLibraryAsync(picture);
                Alert.alert("Picture saved to library");
              }}
            />
          </View>
        </View>

        <Image source={picture} style={[s.wFull, s.hFull] as ImageStyle[]} />

        {/* SELECT HABIT ROW */}
        <View
          style={[
            s.wFull,
            s.absolute,
            s.z10,
            {
              bottom: 104, // double the h13 value
            },
          ]}
        >
          <CameraSelectRow />
        </View>

        <View
          style={[
            s.flexRow,
            s.gap3,
            s.wFull,
            s.p4,
            c.bgBackground,
            s.absolute,
            { bottom: 0 },
          ]}
        >
          {/* ADD CAPTION*/}
          <View
            style={[
              s.h13,
              s.justifyCenter,
              s.px6,
              c.bgCard,
              s.border1,
              c.borderDefault,
              s.roundedFull,
              s.flexGrow,
            ]}
          >
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Add caption (optional)..."
              placeholderTextColor={colors.muted}
              style={[c.textForeground, s.textBase, s.flexGrow] as TextStyle[]}
            />
          </View>

          {/* SEND */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={uploading}
            style={[
              c.bgPrimary,
              s.justifyCenter,
              s.itemsCenter,
              s.roundedFull,
              s.h13,
              s.w13,
            ]}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.muted} />
            ) : (
              <Ionicons
                name="send"
                color={colors.primaryForeground}
                size={24}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
