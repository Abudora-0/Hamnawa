import { useEffect } from "react";
import { useBusy } from "../context/BusyContext";

function PageLoader() {
  const { start, stop } = useBusy();

  useEffect(() => {
    const operation = start();
    return () => stop(operation);
  }, [start, stop]);

  return (
    <div className="page-loader" role="status">
      <span className="thread thread-loading" aria-hidden="true" />
      <span>Loading page</span>
    </div>
  );
}

export default PageLoader;
