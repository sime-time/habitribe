import {
  Calendar,
  type CalendarItemDayProps,
  useOptimizedDayMetadata,
} from "@marceloterreiro/flash-calendar";
import { ImageBackground, View } from "react-native";
import { borderRadius, fontWeight } from "@/assets/styles/token.styles";

interface CalendarItemDayWithImageProps extends CalendarItemDayProps {
  imageUrl?: string;
}

/**
 * Custom Calendar Day component that supports per-day background images
 * Wraps Calendar.Item.Day with ImageBackground
 *
 * @param imageSource - Optional image URL (e.g., Cloudflare R2 URL) for the day background
 * @param imageOpacity - Optional opacity for the background image (0-1)
 */
export function CalendarItemDayWithImage({
  children,
  metadata: baseMetadata,
  onPress,
  height,
  theme,
  imageUrl,
}: CalendarItemDayWithImageProps) {
  const metadata = useOptimizedDayMetadata(baseMetadata);

  if (!imageUrl) {
    // If no image provided, render normally
    return (
      <Calendar.Item.Day
        height={height}
        metadata={metadata}
        onPress={onPress}
        theme={theme}
      >
        {children}
      </Calendar.Item.Day>
    );
  }

  // Render container with ImageBackground applied to the Day itself
  return (
    <ImageBackground
      source={{ uri: imageUrl }}
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borderRadius.base,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: borderRadius.base,
        }}
      />
      <Calendar.Item.Day
        height={height}
        metadata={metadata}
        onPress={onPress}
        theme={{
          ...theme,
          idle: () => ({
            container: {
              backgroundColor: "transparent",
            },
            content: { color: "white", fontWeight: fontWeight.semibold },
          }),
        }}
      >
        {children}
      </Calendar.Item.Day>
    </ImageBackground>
  );
}
