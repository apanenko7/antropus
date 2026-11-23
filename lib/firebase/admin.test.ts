import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { normalizePrivateKey } = await import("./admin");

const BODY = "-----BEGIN PRIVATE KEY-----\nABC\nDEF\n-----END PRIVATE KEY-----\n";

describe("normalizePrivateKey", () => {
  it.each([
    ["real newlines", BODY],
    ["literal \\n", BODY.replace(/\n/g, "\\n")],
    ["wrapped in quotes", `"${BODY.replace(/\n/g, "\\n")}"`],
    ["doubled \\\\n", BODY.replace(/\n/g, "\\\\n")],
    ["CRLF, no trailing newline", BODY.replace(/\n/g, "\r\n").trimEnd()],
  ])("handles %s", (_name, input) => {
    expect(normalizePrivateKey(input)).toBe(BODY);
  });
});
