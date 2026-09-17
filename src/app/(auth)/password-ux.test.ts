import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const passwordField = read("../../components/ui/PasswordField.tsx");
const signup = read("./signup/page.tsx");
const login = read("./login/page.tsx");
const validation = read("../../server/validation.ts");

describe("password UX wiring", () => {
  it("PasswordField has an accessible show/hide toggle that cannot submit the form", () => {
    expect(passwordField).toContain('type="button"');
    expect(passwordField).toContain('aria-label={visible ? "Hide password" : "Show password"}');
    expect(passwordField).toContain("aria-pressed={visible}");
  });

  it("signup uses PasswordField for password + confirm and shows the live checklist", () => {
    expect((signup.match(/<PasswordField/g) ?? []).length).toBe(2);
    expect(signup).toContain("<PasswordRequirements");
    expect(signup).toContain("isPasswordValid(password");
    expect(signup).toContain('Passwords do not match.');
  });

  it("login uses PasswordField for the password", () => {
    expect(login).toContain("<PasswordField");
  });

  it("keeps entered values (controlled inputs) after a failed submit", () => {
    expect(signup).toContain("value={fullName}");
    expect(signup).toContain("value={email}");
    expect(signup).toContain("value={password}");
  });

  it("server validation shares the same password policy", () => {
    expect(validation).toContain("firstPasswordError(value.password");
  });
});
