import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchRemoteFeatureFlags } from "@/lib/feature-flags/client";
import {
  defaultFeatureFlags,
  type FeatureFlags,
} from "@/lib/feature-flags/types";
import { logWarn } from "@/lib/observability/logger";

type FeatureFlagsContextValue = {
  flags: FeatureFlags;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({
  flags: defaultFeatureFlags,
});

export function FeatureFlagsProvider({ children }: PropsWithChildren) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFeatureFlags);

  useEffect(() => {
    let active = true;

    void fetchRemoteFeatureFlags()
      .then((remoteFlags) => {
        if (!active) return;
        setFlags(remoteFlags);
      })
      .catch((error) => {
        logWarn("feature-flags.fetch.failed", {
          reason: error instanceof Error ? error.message : "unknown",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ flags }), [flags]);

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext).flags;
}
