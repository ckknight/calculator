import { useEffect, useState } from "react";

function strictEqual<T>(left: T, right: T) {
  return left === right;
}

export function useRafDebounce<T>(
  value: T,
  comparer: (left: T, right: T) => boolean = strictEqual
) {
  const [state, setState] = useState(value);
  useEffect(
    () => {
      if (comparer(state, value)) {
        return;
      }
      const id = requestAnimationFrame(() => {
        setState(value);
      });
      return () => {
        cancelAnimationFrame(id);
      };
    },
    [state, value]
  );
  return state;
}
