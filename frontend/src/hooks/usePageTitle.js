import { useEffect } from "react";

function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Hamnawa`;
  }, [title]);
}

export default usePageTitle;
