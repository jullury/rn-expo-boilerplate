import { Redirect } from "expo-router";
import { useEffect } from "react";

import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/store/auth-store";

export default function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);

  useEffect(() => {
    if (!isHydrated) {
      void hydrateSession();
    }
  }, [hydrateSession, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  if (!accessToken) {
    return <Redirect href={"/sign-in" as never} />;
  }

  return <AppTabs />;
}
