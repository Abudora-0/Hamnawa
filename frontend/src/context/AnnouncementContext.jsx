import { createContext, useCallback, useContext, useRef, useState } from "react";

const AnnouncementContext = createContext(null);

export function AnnouncementProvider({ children }) {
  const [announcement, setAnnouncement] = useState("");
  const timeoutRef = useRef(null);

  const announce = useCallback((message) => {
    setAnnouncement("");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnnouncement(message), 50);
  }, []);

  return (
    <AnnouncementContext.Provider value={{ announcement, announce }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncer() {
  return useContext(AnnouncementContext);
}
