import { createContext, useContext, useState } from "react";

const AnnouncementContext = createContext(null);

export function AnnouncementProvider({ children }) {
  const [announcement, setAnnouncement] = useState("");

  return (
    <AnnouncementContext.Provider value={{ announcement, announce: setAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncer() {
  return useContext(AnnouncementContext);
}
