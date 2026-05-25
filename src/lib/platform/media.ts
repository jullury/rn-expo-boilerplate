import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export async function requestCameraPermissions() {
  const existing = await Camera.getCameraPermissionsAsync();
  if (existing.granted) {
    return existing;
  }
  return Camera.requestCameraPermissionsAsync();
}

export async function requestMediaLibraryPermissions() {
  const existing = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (existing.granted) {
    return existing;
  }
  return ImagePicker.requestMediaLibraryPermissionsAsync();
}

export async function pickImageFromLibrary() {
  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 1,
  });
}
