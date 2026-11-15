import { describe, expect, it } from "vitest";
import { getShortcuts, matchShortcut } from "./shortcuts";

function event(values) {
  return {
    key: values.key,
    code: values.code,
    altKey: Boolean(values.altKey),
    shiftKey: Boolean(values.shiftKey),
    ctrlKey: Boolean(values.ctrlKey),
    metaKey: Boolean(values.metaKey),
  };
}

describe("shortcuts", () => {
  it("matches normal shortcuts and ignores modifiers", () => {
    expect(matchShortcut(event({ key: "p", code: "KeyP" })).action).toBe(
      "toggle",
    );
    expect(
      matchShortcut(event({ key: "p", code: "KeyP", ctrlKey: true })),
    ).toBeNull();
  });

  it("matches screen reader shortcuts by code", () => {
    expect(
      matchShortcut(
        event({ key: "x", code: "KeyP", altKey: true, shiftKey: true }),
        true,
      ).action,
    ).toBe("toggle");
    expect(
      matchShortcut(
        event({ key: "p", code: "KeyP", altKey: true }),
        true,
      ),
    ).toBeNull();
    expect(getShortcuts(true).filter((shortcut) => shortcut.srCode === "KeyF"))
      .toHaveLength(1);
  });
});
