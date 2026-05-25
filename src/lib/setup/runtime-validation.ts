type RuntimeSetupContract = {
  requiredKeys: readonly string[];
};

type RuntimeSetupValidationResult = {
  valid: boolean;
  missingKeys: string[];
};

export function validateRuntimeSetup(
  contract: RuntimeSetupContract,
  env: Record<string, string | undefined>,
): RuntimeSetupValidationResult {
  const missingKeys = contract.requiredKeys.filter((key) => {
    const value = env[key];
    return value === undefined || value.trim().length === 0;
  });

  return {
    valid: missingKeys.length === 0,
    missingKeys,
  };
}
