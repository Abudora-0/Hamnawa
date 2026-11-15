import { describe, expect, it } from "vitest";
import { parseCommand } from "./commandParser";

describe("command parser", () => {
  const commands = [
    ["play", "play"],
    ["pause", "pause"],
    ["next", "next"],
    ["previous", "back"],
    ["nextSection", "next heading"],
    ["previousSection", "previous chapter"],
    ["repeat", "say again"],
    ["faster", "speed up"],
    ["slower", "slow down"],
    ["goToStart", "start over"],
    ["goToEnd", "go to end"],
    ["announcePosition", "where am I"],
    ["addBookmark", "bookmark"],
    ["help", "what can I say"],
    ["nextMatch", "next match"],
    ["previousMatch", "previous match"],
  ];

  it.each(commands)("parses %s", (action, text) => {
    expect(parseCommand(text)).toEqual({ action, value: null });
  });

  it("parses page and search values", () => {
    expect(parseCommand("go to page 5")).toEqual({
      action: "goToPage",
      value: 5,
    });
    expect(parseCommand("search for algebra")).toEqual({
      action: "search",
      value: "algebra",
    });
  });

  it("returns null for unknown text", () => {
    expect(parseCommand("say something else")).toBeNull();
  });
});
