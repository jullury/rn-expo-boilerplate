type RuntimeSetupContract = {
  requiredKeys: readonly string[];
};

type RuntimeSetupValidationResult = {
  valid: boolean;
  missingKeys: string[];
  warnings: string[];
};

export function validateRuntimeSetup(
  contract: RuntimeSetupContract,
  env: Record<string, string | undefined>,
): RuntimeSetupValidationResult {
  const missingKeys = contract.requiredKeys.filter((key) => {
    const value = env[key];
    return value === undefined || value.trim().length === 0;
  });

  const appEnv = (env.EXPO_PUBLIC_APP_ENV ?? "").toLowerCase();
  const warnings: string[] = [];
  if (missingKeys.length > 0 && ["production", "prod"].includes(appEnv)) {
    warnings.push(
      `Production runtime is missing required env keys: ${missingKeys.join(", ")}`,
    );
  }

  return {
    valid: missingKeys.length === 0,
    missingKeys,
    warnings,
  };
}
