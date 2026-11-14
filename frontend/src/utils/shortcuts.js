export const shortcuts = [
  { key: "p", code: "KeyP", srCode: "KeyP", action: "toggle", label: "Play or pause" },
  { key: "n", code: "KeyN", srCode: "KeyN", action: "next", label: "Next sentence" },
  { key: "b", code: "KeyB", srCode: "KeyB", action: "previous", label: "Previous sentence" },
  { key: "h", code: "KeyH", srCode: "KeyH", action: "nextSection", label: "Next section" },
  {
    key: "H",
    code: "KeyH",
    srCode: "KeyJ",
    action: "previousSection",
    label: "Previous section",
  },
  { key: "r", code: "KeyR", srCode: "KeyR", action: "repeat", label: "Repeat sentence" },
  { key: "m", code: "KeyM", srCode: "KeyM", action: "addBookmark", label: "Add bookmark" },
  { key: "v", code: "KeyV", srCode: "KeyV", action: "toggleVoiceCommands", label: "Toggle voice commands" },
  {
    key: "i",
    code: "KeyI",
    srCode: "KeyI",
    action: "announcePosition",
    label: "Announce position",
  },
  { key: "[", code: "BracketLeft", srCode: "KeyS", action: "goToStart", label: "Go to start" },
  { key: "]", code: "BracketRight", srCode: "KeyE", action: "goToEnd", label: "Go to end" },
  { key: "+", code: "Equal", srCode: "KeyF", action: "faster", label: "Speak faster" },
  { key: "=", code: "Equal", srCode: "KeyF", action: "faster", label: "Speak faster" },
  { key: "-", code: "Minus", srCode: "KeyD", action: "slower", label: "Speak slower" },
  {
    key: "/",
    code: "Slash",
    srCode: "Slash",
    action: "focusSearch",
    label: "Focus the search box",
  },
  { key: "g", code: "KeyG", srCode: "KeyG", action: "focusPage", label: "Focus the page box" },
  { key: "?", code: "Slash", srCode: "KeyQ", action: "help", label: "Open help" },
];

export function getShortcuts(screenReaderMode = false) {
  if (!screenReaderMode) {
    return shortcuts;
  }
  return shortcuts.filter(
    (shortcut, index, allShortcuts) =>
      allShortcuts.findIndex((item) => item.srCode === shortcut.srCode) ===
      index,
  );
}

export function getShortcutLabel(shortcut, screenReaderMode = false) {
  if (!screenReaderMode) {
    return shortcut.key;
  }
  const key = shortcut.srCode.startsWith("Key")
    ? shortcut.srCode.slice(3)
    : shortcut.srCode === "Slash"
      ? "/"
      : shortcut.srCode;
  return `Alt+Shift+${key}`;
}

export function matchShortcut(event, screenReaderMode = false) {
  if (event.ctrlKey || event.metaKey) {
    return null;
  }
  if (screenReaderMode) {
    if (!event.altKey || !event.shiftKey) {
      return null;
    }
    return (
      getShortcuts(true).find((shortcut) => shortcut.srCode === event.code) ||
      null
    );
  } else if (event.altKey) {
    return null;
  }

  return (
    getShortcuts(false).find(
      (shortcut) =>
        shortcut.code === event.code &&
        shortcut.key === event.key,
    ) || null
  );
}
