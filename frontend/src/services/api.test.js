import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let getDocument;

beforeAll(async () => {
  vi.stubEnv("VITE_USE_MOCK", "false");
  ({ getDocument } = await import("./api"));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api errors", () => {
  it("reads a string detail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "Not found" }), { status: 404 }),
      ),
    );
    await expect(getDocument("missing")).rejects.toThrow("Not found");
  });

  it("uses a standard error for array detail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: ["Invalid"] }), { status: 422 }),
      ),
    );
    await expect(getDocument("bad")).rejects.toThrow(
      "Something went wrong. Please try again.",
    );
  });

  it("reports network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(getDocument("offline")).rejects.toThrow(
      "Cannot reach the server. Please try again.",
    );
  });
});
