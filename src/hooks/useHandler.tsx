import { useMemo, useRef, useEffect } from "react";

export function useHandler<A extends any[], R>(
  handler: (...args: A) => R
): (...args: A) => R {
  const handlerRef = useRef(handler as ((...args: A) => R) | undefined);
  handlerRef.current = handler;
  useEffect(
    () => () => {
      handlerRef.current = undefined;
    },
    [handlerRef]
  );
  return useMemo(
    () => (...args: A) => {
      const currentHandler = handlerRef.current;
      if (!currentHandler) {
        throw new TypeError("Cannot call handler after component is unmounted");
      }
      return currentHandler(...args);
    },
    [handlerRef]
  );
}
