import NetInfo from "@react-native-community/netinfo";

export async function getNetworkState() {
  return NetInfo.fetch();
}

export function subscribeNetworkState(
  listener: (state: Awaited<ReturnType<typeof NetInfo.fetch>>) => void,
) {
  return NetInfo.addEventListener(listener);
}
