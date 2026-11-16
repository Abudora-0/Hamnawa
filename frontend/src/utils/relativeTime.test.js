import { describe, expect, it } from "vitest";
import { relativeTime } from "./relativeTime";

const now = Date.parse("2026-01-01T12:00:00Z");

describe("relativeTime", () => {
  it("formats recent minutes, hours, and days", () => {
    expect(relativeTime("2026-01-01T11:59:30Z", now)).toBe("Just now");
    expect(relativeTime("2026-01-01T11:15:00Z", now)).toBe("45 minutes ago");
    expect(relativeTime("2026-01-01T10:00:00Z", now)).toBe("2 hours ago");
    expect(relativeTime("2025-12-30T12:00:00Z", now)).toBe("2 days ago");
  });

  it("handles missing or invalid dates", () => {
    expect(relativeTime(undefined, now)).toBe("Recently opened");
    expect(relativeTime("not a date", now)).toBe("Recently opened");
  });
});
