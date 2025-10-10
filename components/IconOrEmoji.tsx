import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

interface IconOrEmojiProps {
  iconName: string | undefined;
  iconColor: string | undefined;
}

export default function IconOrEmoji({ iconName, iconColor }: IconOrEmojiProps) {
  const iconSize = 24;

  // Check if string contains emoji/non-ASCII characters
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Regex Emoji Test
  const isEmoji = iconName && /[^\x00-\x7F]/.test(iconName);

  if (isEmoji) {
    return <Text style={{ fontSize: iconSize }}>{iconName}</Text>;
  } else {
    return (
      <Ionicons
        name={iconName as keyof typeof Ionicons.glyphMap}
        size={iconSize}
        color={iconColor}
      />
    );
  }
}
