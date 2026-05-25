import * as Haptics from "expo-haptics";

export async function triggerImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) {
  return Haptics.impactAsync(style);
}

export async function triggerSuccess() {
  return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
