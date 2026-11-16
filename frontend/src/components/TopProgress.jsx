import { useBusy } from "../context/BusyContext";

function TopProgress() {
  const { isBusy } = useBusy();
  return isBusy ? <span className="top-progress" aria-hidden="true" /> : null;
}

export default TopProgress;
