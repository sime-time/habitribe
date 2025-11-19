import {
  Calendar,
  type CalendarItemDayWithContainerProps,
  useOptimizedDayMetadata,
} from "@marceloterreiro/flash-calendar";
import { ImageBackground, View } from "react-native";

interface CalendarDayWithImageProps extends CalendarItemDayWithContainerProps {
  imageUrl?: string;
  imageOpacity?: number;
}

/**
 * Custom Calendar Day component that supports per-day background images
 * Wraps Calendar.Item.Day with ImageBackground
 *
 * @param imageSource - Optional image URL (e.g., Cloudflare R2 URL) for the day background
 * @param imageOpacity - Optional opacity for the background image (0-1)
 */
export function CalendarDayWithImage({
  children,
  metadata: baseMetadata,
  onPress,
  theme,
  containerTheme,
  dayHeight,
  daySpacing,
  imageUrl,
  imageOpacity = 0.6,
}: CalendarDayWithImageProps) {
  const metadata = useOptimizedDayMetadata(baseMetadata);

  if (!imageUrl) {
    // If no image provided, render normally
    return (
      <Calendar.Item.Day.Container
        dayHeight={dayHeight}
        daySpacing={daySpacing}
        isStartOfWeek={metadata.isStartOfWeek}
        theme={containerTheme}
      >
        <Calendar.Item.Day
          height={dayHeight}
          metadata={metadata}
          onPress={onPress}
          theme={theme}
        >
          {children}
        </Calendar.Item.Day>
      </Calendar.Item.Day.Container>
    );
  }

  // Wrap container with ImageBackground for per-day images
  return (
    <ImageBackground
      source={{ uri: imageUrl }}
      style={{
        height: dayHeight,
        overflow: "hidden",
      }}
      imageStyle={{
        opacity: imageOpacity,
      }}
    >
      {/* Overlay to ensure text is readable over the image */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      />
      <Calendar.Item.Day.Container
        dayHeight={dayHeight}
        daySpacing={daySpacing}
        isStartOfWeek={metadata.isStartOfWeek}
        theme={containerTheme}
      >
        <Calendar.Item.Day
          height={dayHeight}
          metadata={metadata}
          onPress={onPress}
          theme={theme}
        >
          {children}
        </Calendar.Item.Day>
      </Calendar.Item.Day.Container>
    </ImageBackground>
  );
}
