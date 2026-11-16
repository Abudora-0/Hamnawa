import { describe, expect, it } from "vitest";
import { formatExpiry } from "./expiry";

const now = Date.parse("2026-01-01T12:00:00Z");

describe("formatExpiry", () => {
  it("formats future and past expiry times", () => {
    expect(formatExpiry("2026-01-02T11:30:00Z", now)).toBe("Deleted in 24 hours");
    expect(formatExpiry("2026-01-01T11:59:00Z", now)).toBe("Deletion due");
  });

  it("handles a missing expiry time", () => {
    expect(formatExpiry(undefined, now)).toBe("Deletion time unavailable");
  });
});
