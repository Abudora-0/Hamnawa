import { createContext, useCallback, useContext, useRef, useState } from "react";

const BusyContext = createContext(null);

export function BusyProvider({ children }) {
  const activeOperations = useRef(new Set());
  const [count, setCount] = useState(0);

  const start = useCallback(() => {
    const operation = {};
    activeOperations.current.add(operation);
    setCount(activeOperations.current.size);
    return operation;
  }, []);

  const stop = useCallback((operation) => {
    if (!activeOperations.current.delete(operation)) {
      return;
    }
      setCount(activeOperations.current.size);
  }, []);

  return (
    <BusyContext.Provider value={{ count, isBusy: count > 0, start, stop }}>
      {children}
    </BusyContext.Provider>
  );
}

export function useBusy() {
  return useContext(BusyContext);
}
