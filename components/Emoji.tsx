import { Text } from "react-native";

interface EmojiProps {
  name: string | undefined;
  size?: number;
}

export default function Emoji({ name, size = 24 }: EmojiProps) {
  return <Text style={{ fontSize: size }}>{name}</Text>;
}
