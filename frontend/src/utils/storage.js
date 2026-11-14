export function getJSON(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? fallback : JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}
