import { createContext, useContext, useState } from "react";

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const [document, setDocument] = useState(null);

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  return useContext(DocumentContext);
}
