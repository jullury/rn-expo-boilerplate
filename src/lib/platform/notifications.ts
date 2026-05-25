import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) {
    return settings;
  }
  return Notifications.requestPermissionsAsync();
}

export async function getExpoPushToken() {
  return Notifications.getExpoPushTokenAsync();
}

export function addNotificationReceivedListener(
  listener: Parameters<typeof Notifications.addNotificationReceivedListener>[0],
) {
  return Notifications.addNotificationReceivedListener(listener);
}
