import { describe, expect, it } from "vitest";
import {
  PASSWORD_MIN_LENGTH,
  firstPasswordError,
  isPasswordValid,
  passwordRequirements,
  passwordStrength,
} from "./password";

describe("password policy", () => {
  it("defines the standardized minimum length", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(12);
  });

  it("rejects weak passwords", () => {
    expect(isPasswordValid("short")).toBe(false);
    expect(isPasswordValid("alllowercase1")).toBe(false); // no uppercase
    expect(isPasswordValid("ALLUPPERCASE1")).toBe(false); // no lowercase
    expect(isPasswordValid("NoDigitsHere")).toBe(false); // no number
    expect(isPasswordValid("          ")).toBe(false); // only spaces
    expect(firstPasswordError("short")).toBeTruthy();
  });

  it("accepts a strong password meeting every rule", () => {
    expect(isPasswordValid("StrongPass12!")).toBe(true);
    expect(firstPasswordError("StrongPass12!")).toBeNull();
  });

  it("rejects passwords containing the user's name or email", () => {
    expect(isPasswordValid("Jonathan123X", { name: "Jonathan Reed" })).toBe(false);
    expect(isPasswordValid("Sunflower1A", { email: "sunflower@mail.com" })).toBe(false);
  });

  it("the checklist reflects each rule's met state", () => {
    const reqs = passwordRequirements("StrongPass12!");
    expect(reqs.every((r) => r.met)).toBe(true);
    const weak = passwordRequirements("weak");
    expect(weak.find((r) => r.id === "length")?.met).toBe(false);
    expect(weak.find((r) => r.id === "number")?.met).toBe(false);
  });

  it("rates strength Weak/Good/Strong", () => {
    expect(passwordStrength("abc")).toBe("Weak");
    expect(passwordStrength("StrongPass12!")).not.toBe("Weak");
    expect(passwordStrength("Str0ng!Passw0rd#2024")).toBe("Strong");
  });
});
