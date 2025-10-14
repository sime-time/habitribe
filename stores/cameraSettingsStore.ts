import type { CameraMode, CameraType, FlashMode } from "expo-camera";
import { create } from "zustand";

interface CameraSettings {
  mode: CameraMode;
  flash: FlashMode;
  zoom: number;
  facing: CameraType;
  isRecording: boolean;
  setMode: (mode: CameraMode) => void;
  setFlash: (mode: FlashMode) => void;
  setZoom: (value: number) => void;
  setFacing: (type: CameraType) => void;
  setIsRecording: (value: boolean) => void;
}

export const useCameraSettings = create<CameraSettings>((set) => ({
  // Initial state
  mode: "picture",
  flash: "off",
  zoom: 0,
  facing: "back",
  isRecording: false,
  setMode: (mode) =>
    set({
      mode,
    }),
  setFlash: (mode) =>
    set({
      flash: mode,
    }),
  setZoom: (value) =>
    set({
      zoom: value,
    }),
  setFacing: (type) =>
    set({
      facing: type,
    }),
  setIsRecording: (value) =>
    set({
      isRecording: value,
    }),
}));
