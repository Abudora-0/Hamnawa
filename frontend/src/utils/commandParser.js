function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const commands = [
  ["play", ["play", "start", "read", "continue", "resume"]],
  ["pause", ["pause", "stop"]],
  ["next", ["next", "next sentence", "forward"]],
  ["previous", ["previous", "back", "previous sentence", "go back"]],
  [
    "nextSection",
    ["next section", "next heading", "next chapter"],
  ],
  [
    "previousSection",
    ["previous section", "previous heading", "previous chapter"],
  ],
  ["repeat", ["repeat", "say again", "again"]],
  ["faster", ["faster", "speed up"]],
  ["slower", ["slower", "slow down"]],
  ["goToStart", ["go to start", "go to the beginning"]],
  ["goToEnd", ["go to the end"]],
  ["announcePosition", ["where am i", "position"]],
  ["addBookmark", ["bookmark", "add bookmark"]],
  ["help", ["help", "what can i say"]],
  ["nextMatch", ["next match"]],
  ["previousMatch", ["previous match"]],
];

export function parseCommand(text) {
  const normalized = normalize(text);
  if (!normalized) {
    return null;
  }

  const pageMatch = normalized.match(/^(?:go to )?(?:page|slide) (\d+)$/);
  if (pageMatch) {
    return { action: "goToPage", value: Number(pageMatch[1]) };
  }

  const searchMatch = normalized.match(/^(?:search for|find) (.+)$/);
  if (searchMatch) {
    return { action: "search", value: searchMatch[1] };
  }

  for (const [action, phrases] of commands) {
    if (phrases.includes(normalized)) {
      return { action, value: null };
    }
  }

  return null;
}
