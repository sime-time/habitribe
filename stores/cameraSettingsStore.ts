import type { CameraMode, CameraType, FlashMode } from "expo-camera";
import { create } from "zustand";

interface CameraSettings {
  picture: string;
  mode: CameraMode;
  flash: FlashMode;
  zoom: number;
  facing: CameraType;
  isRecording: boolean;
  setPicture: (uri: string) => void;
  setMode: (mode: CameraMode) => void;
  setFlash: (mode: FlashMode) => void;
  setZoom: (value: number) => void;
  setFacing: (type: CameraType) => void;
  setIsRecording: (value: boolean) => void;
}

export const useCameraSettings = create<CameraSettings>((set) => ({
  // Initial state
  picture: "",
  mode: "picture",
  flash: "off",
  zoom: 0,
  facing: "back",
  isRecording: false,
  setPicture: (uri) =>
    set({
      picture: uri,
    }),
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
