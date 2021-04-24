import { useEffect } from "preact/hooks";

export const useKeypress = (key: string, action: () => void) => {
  useEffect(() => {
    const onKeyup = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === key) action();
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [action]);
};
