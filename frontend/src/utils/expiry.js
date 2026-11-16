export function formatExpiry(expiresAt, now = Date.now()) {
  const timestamp = new Date(expiresAt).getTime();
  if (!Number.isFinite(timestamp)) {
    return "Deletion time unavailable";
  }
  const remainingHours = Math.ceil((timestamp - now) / 3600000);
  if (remainingHours <= 0) {
    return "Deletion due";
  }
  return `Deleted in ${remainingHours} hour${remainingHours === 1 ? "" : "s"}`;
}
