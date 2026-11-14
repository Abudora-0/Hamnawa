export const shortcuts = [
  { key: "p", code: "KeyP", action: "toggle", label: "Play or pause" },
  { key: "n", code: "KeyN", action: "next", label: "Next sentence" },
  { key: "b", code: "KeyB", action: "previous", label: "Previous sentence" },
  { key: "h", code: "KeyH", action: "nextSection", label: "Next section" },
  {
    key: "H",
    code: "KeyH",
    action: "previousSection",
    label: "Previous section",
  },
  { key: "r", code: "KeyR", action: "repeat", label: "Repeat sentence" },
  { key: "m", code: "KeyM", action: "addBookmark", label: "Add bookmark" },
  {
    key: "i",
    code: "KeyI",
    action: "announcePosition",
    label: "Announce position",
  },
  { key: "[", code: "BracketLeft", action: "goToStart", label: "Go to start" },
  { key: "]", code: "BracketRight", action: "goToEnd", label: "Go to end" },
  { key: "+", code: "Equal", action: "faster", label: "Speak faster" },
  { key: "=", code: "Equal", action: "faster", label: "Speak faster" },
  { key: "-", code: "Minus", action: "slower", label: "Speak slower" },
  {
    key: "/",
    code: "Slash",
    action: "focusSearch",
    label: "Focus the search box",
  },
  { key: "g", code: "KeyG", action: "focusPage", label: "Focus the page box" },
];

export function matchShortcut(event, screenReaderMode = false) {
  if (event.ctrlKey || event.metaKey) {
    return null;
  }
  if (screenReaderMode) {
    if (!event.altKey || !event.shiftKey) {
      return null;
    }
  } else if (event.altKey) {
    return null;
  }

  return (
    shortcuts.find(
      (shortcut) =>
        shortcut.code === event.code &&
        shortcut.key === event.key,
    ) || null
  );
}
