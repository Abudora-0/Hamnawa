import { describe, expect, it } from "vitest";
import { buildQueue, isUrdu, splitSentences } from "./readingQueue";

const document = {
  file_type: "pdf",
  sections: [
    {
      id: 1,
      title: "Intro",
      level: 1,
      location: 1,
      blocks: [
        { id: 1, kind: "paragraph", text: "One. Two!", location: 1 },
        { id: 2, kind: "list_item", text: "First", location: 1 },
        { id: 3, kind: "list_item", text: "Second", location: 1 },
        { id: 4, kind: "notice", text: "Skipped image.", location: 1 },
      ],
      children: [],
    },
  ],
};

describe("reading queue", () => {
  it("splits sentences and detects Urdu", () => {
    expect(splitSentences("One. Two!")).toEqual(["One.", "Two!"]);
    expect(isUrdu("یہ متن ہے")).toBe(true);
    expect(isUrdu("English")).toBe(false);
  });

  it("keeps reading order and adds cues", () => {
    const queue = buildQueue(document, true);
    expect(queue.map((item) => item.searchText)).toEqual([
      "Intro",
      "One.",
      "Two!",
      "",
      "First",
      "Second",
      "Skipped image.",
    ]);
    expect(queue[3].text).toBe("List of 2 items.");
    expect(queue[6].text).toBe("Notice. Skipped image.");
  });

  it("omits heading and list cues when disabled", () => {
    const queue = buildQueue(document, false);
    expect(queue.map((item) => item.text)).toEqual([
      "Intro",
      "One.",
      "Two!",
      "First",
      "Second",
      "Notice. Skipped image.",
    ]);
  });
});
