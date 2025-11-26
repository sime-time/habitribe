import { useQuery } from "convex/react";
import { CameraView } from "expo-camera";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import CameraMainRow from "@/components/camera/CameraMainRow";
import CameraSelectRow from "@/components/camera/CameraSelectRow";
import CameraTools from "@/components/camera/CameraTools";
import PhotoView from "@/components/views/PhotoView";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useCameraSettings } from "@/stores/cameraSettingsStore";
import { useHabitSelectStore } from "@/stores/habitSelectStore";

export default function CameraScreen() {
  const { colors } = useTheme();
  const cameraRef = useRef<CameraView>(null);

  const { habitId, entryId } = useLocalSearchParams<{
    habitId?: string;
    entryId?: string;
  }>();
  const habit = useQuery(
    api.exec.read.getHabit,
    habitId ? { habitId: habitId as Id<"habits"> } : "skip",
  );
  const entry = useQuery(
    api.exec.read.getHabitEntry,
    entryId ? { id: entryId as Id<"habitEntries"> } : "skip",
  );
  const selectHabit = useHabitSelectStore((state) => state.selectHabit);
  const selectEntry = useHabitSelectStore((state) => state.selectEntry);

  useEffect(() => {
    if (habit && entry) {
      selectHabit(habit);
      selectEntry(entry);
    }
  }, [habit, entry, selectHabit, selectEntry]);

  const zoom = useCameraSettings((state) => state.zoom);
  const mode = useCameraSettings((state) => state.mode);
  const flash = useCameraSettings((state) => state.flash);
  const facing = useCameraSettings((state) => state.facing);
  const picture = useCameraSettings((state) => state.picture);
  const setPicture = useCameraSettings((state) => state.setPicture);

  const handleTakePicture = async () => {
    const response = await cameraRef.current?.takePictureAsync();
    if (response) {
      setPicture(response.uri);
    }
  };

  if (picture) return <PhotoView />;

  return (
    <SafeAreaView
      style={[s.flex1, { backgroundColor: colors.gradients.background[0] }]}
      edges={["top"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <CameraView
        ref={cameraRef}
        mode={mode}
        zoom={zoom}
        flash={flash}
        facing={facing}
        style={s.flex1}
      />
      <CameraTools />
      <View
        style={[
          s.wFull,
          s.gap4,
          {
            position: "absolute",
            bottom: spacing[6],
          },
        ]}
      >
        <CameraSelectRow />
        <CameraMainRow handleTakePicture={handleTakePicture} />
      </View>
    </SafeAreaView>
  );
}
