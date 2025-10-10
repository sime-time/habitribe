import { Text } from "react-native";

interface EmojiProps {
  iconName: string | undefined;
  iconColor?: string;
  iconSize?: number;
}

export default function Emoji({ iconName, iconSize = 24 }: EmojiProps) {
  return <Text style={{ fontSize: iconSize }}>{iconName}</Text>;
}
