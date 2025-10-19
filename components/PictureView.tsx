import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import type React from "react";
import {
  Alert,
  type ImageStyle,
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import IconButton from "@/components/IconButton";
import useTheme from "@/hooks/useTheme";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

export default function PictureView({ picture, setPicture }: PictureViewProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

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
            onPress={() => setPicture("")}
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

        {/* ADD CAPTION + SEND*/}
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
          <View
            style={[
              s.inputHeight,
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
              placeholder="Add caption (optional)..."
              placeholderTextColor={colors.muted}
              style={[c.textForeground, s.textBase, s.flexGrow] as TextStyle[]}
            />
          </View>
          <TouchableOpacity
            style={[
              c.bgPrimary,
              s.justifyCenter,
              s.itemsCenter,
              s.roundedFull,
              s.inputHeight,
              {
                width: 51, // from inputHeight
              },
            ]}
          >
            <Ionicons name="send" color={colors.primaryForeground} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
