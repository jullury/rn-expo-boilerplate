jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("@/lib/platform/permissions", () => ({
  requestCorePermissions: jest.fn(async () => ({
    notifications: { granted: false },
    camera: { granted: true },
    mediaLibrary: { granted: true },
  })),
}));

jest.mock("@/lib/platform/notifications", () => ({
  requestNotificationPermissions: jest.fn(async () => ({ granted: true })),
  getExpoPushToken: jest.fn(async () => ({ data: "ExponentPushToken[demo]" })),
  addNotificationReceivedListener: jest.fn(),
}));

describe("platform bootstrap", () => {
  it("returns push token when notifications are granted", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { bootstrapNotificationOnly } = require("@/lib/platform/bootstrap");
    const token = await bootstrapNotificationOnly();
    expect(token).toBe("ExponentPushToken[demo]");
  });
});
