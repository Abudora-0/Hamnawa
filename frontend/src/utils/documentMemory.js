import { getJSON, setJSON } from "./storage";

const RECENT_KEY = "hamnawa-recent-documents";
const PROGRESS_PREFIX = "hamnawa-progress-";
const BOOKMARKS_PREFIX = "hamnawa-bookmarks-";

export function getRecent() {
  const recent = getJSON(RECENT_KEY, []);
  return Array.isArray(recent) ? recent : [];
}

export function addRecent(document) {
  const nextRecent = [
    document,
    ...getRecent().filter((item) => item.id !== document.id),
  ].slice(0, 10);
  setJSON(RECENT_KEY, nextRecent);
}

export function saveProgress(docId, progress) {
  setJSON(`${PROGRESS_PREFIX}${docId}`, progress);
}

export function getProgress(docId) {
  return getJSON(`${PROGRESS_PREFIX}${docId}`, null);
}

export function getBookmarks(docId) {
  const bookmarks = getJSON(`${BOOKMARKS_PREFIX}${docId}`, []);
  return Array.isArray(bookmarks) ? bookmarks : [];
}

export function addBookmark(docId, bookmark) {
  const bookmarks = [bookmark, ...getBookmarks(docId)];
  setJSON(`${BOOKMARKS_PREFIX}${docId}`, bookmarks);
}

export function removeBookmark(docId, bookmarkId) {
  const bookmarks = getBookmarks(docId).filter(
    (bookmark) => bookmark.id !== bookmarkId,
  );
  setJSON(`${BOOKMARKS_PREFIX}${docId}`, bookmarks);
}

export function eraseAll() {
  try {
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (
        key === RECENT_KEY ||
        key === "hamnawa-quick-phrases" ||
        key === "hamnawa-speak-history" ||
        key?.startsWith(PROGRESS_PREFIX) ||
        key?.startsWith(BOOKMARKS_PREFIX)
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    return;
  }
}
