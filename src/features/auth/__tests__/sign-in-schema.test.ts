import { signInSchema } from "@/features/auth/schemas/sign-in";

describe("signInSchema", () => {
  it("rejects invalid email", () => {
    const result = signInSchema.safeParse({
      email: "invalid",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid credentials", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });
});
