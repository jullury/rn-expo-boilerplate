import { Platform } from "react-native";

import { logInfo, logWarn } from "@/lib/observability/logger";
import {
  addNotificationReceivedListener,
  getExpoPushToken,
  requestNotificationPermissions,
} from "@/lib/platform/notifications";
import { requestCorePermissions } from "@/lib/platform/permissions";

export async function bootstrapPlatformCapabilities() {
  try {
    const permissions = await requestCorePermissions();

    logInfo("platform.permissions", {
      notifications: permissions.notifications.granted,
      camera: permissions.camera.granted,
      mediaLibrary: permissions.mediaLibrary.granted,
    });

    if (permissions.notifications.granted) {
      const token = await getExpoPushToken().catch(() => null);
      if (token?.data) {
        logInfo("platform.pushToken", {
          token: token.data,
          platform: Platform.OS,
        });
      }

      addNotificationReceivedListener((notification) => {
        logInfo("platform.notification.received", {
          id: notification.request.identifier,
          title: notification.request.content.title,
        });
      });
    }
  } catch (error) {
    logWarn("platform.bootstrap.failed", {
      reason: error instanceof Error ? error.message : "unknown",
    });
  }
}

export async function bootstrapNotificationOnly() {
  const permissions = await requestNotificationPermissions();
  if (!permissions.granted) {
    return null;
  }

  const token = await getExpoPushToken().catch(() => null);
  return token?.data ?? null;
}
