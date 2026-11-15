import { beforeEach, describe, expect, it } from "vitest";
import { getJSON, setJSON } from "./storage";

beforeEach(() => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    key: (index) => Array.from(values.keys())[index] || null,
    get length() {
      return values.size;
    },
  };
});

describe("storage", () => {
  it("stores and reads JSON values", () => {
    setJSON("test", { value: 3 });
    expect(getJSON("test", null)).toEqual({ value: 3 });
    expect(getJSON("missing", "fallback")).toBe("fallback");
  });
});
