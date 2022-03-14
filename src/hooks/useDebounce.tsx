import { useEffect } from "react";

const useDebounce = (
  effect: Function,
  deps: Array<any> = [],
  delay: number
) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]);
};

export default useDebounce;
