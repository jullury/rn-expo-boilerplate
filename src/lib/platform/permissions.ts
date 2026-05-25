import {
  requestCameraPermissions,
  requestMediaLibraryPermissions,
} from "@/lib/platform/media";
import { requestNotificationPermissions } from "@/lib/platform/notifications";

export async function requestCorePermissions() {
  const [notifications, camera, mediaLibrary] = await Promise.all([
    requestNotificationPermissions(),
    requestCameraPermissions(),
    requestMediaLibraryPermissions(),
  ]);

  return {
    notifications,
    camera,
    mediaLibrary,
  };
}
