import { useEffect, useState } from "react";

export function useDelayed<T>(value: T, ms: number) {
  const [delayedValue, setDelayedValue] = useState(value);
  useEffect(
    () => {
      const timer = setTimeout(() => {
        setDelayedValue(value);
      }, ms);
      return () => clearTimeout(timer);
    },
    [value]
  );
  return delayedValue;
}
