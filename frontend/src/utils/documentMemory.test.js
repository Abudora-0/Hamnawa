import { beforeEach, describe, expect, it } from "vitest";
import {
  addBookmark,
  addRecent,
  eraseAll,
  getBookmarks,
  getProgress,
  getRecent,
  removeBookmark,
  saveProgress,
} from "./documentMemory";

beforeEach(() => {
  const values = new Map([
    ["hamnawa-theme", "dark"],
    ["hamnawa-voice-name", "voice"],
  ]);
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

describe("document memory", () => {
  it("keeps at most ten recent documents", () => {
    for (let index = 0; index < 11; index += 1) {
      addRecent({ id: String(index), title: `Doc ${index}` });
    }
    expect(getRecent()).toHaveLength(10);
    expect(getRecent()[0].id).toBe("10");
  });

  it("adds and removes bookmarks and saves progress", () => {
    addBookmark("doc", { id: "bookmark", label: "Intro" });
    expect(getBookmarks("doc")).toHaveLength(1);
    removeBookmark("doc", "bookmark");
    expect(getBookmarks("doc")).toHaveLength(0);
    saveProgress("doc", { index: 2 });
    expect(getProgress("doc")).toEqual({ index: 2 });
  });

  it("erases saved data but keeps settings", () => {
    addRecent({ id: "doc", title: "Doc" });
    addBookmark("doc", { id: "bookmark" });
    saveProgress("doc", { index: 1 });
    localStorage.setItem("hamnawa-quick-phrases", "[]");
    localStorage.setItem("hamnawa-speak-history", "[]");
    eraseAll();
    expect(getRecent()).toEqual([]);
    expect(getBookmarks("doc")).toEqual([]);
    expect(getProgress("doc")).toBeNull();
    expect(localStorage.getItem("hamnawa-theme")).toBe("dark");
  });
});
