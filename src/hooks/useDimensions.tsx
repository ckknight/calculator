import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export function useDimensions(
  ...args: Parameters<Dimensions["get"]>
): ReturnType<Dimensions["get"]> {
  const [, forceUpdate] = useState(undefined);
  useEffect(() => {
    function handler() {
      forceUpdate(undefined);
    }
    Dimensions.addEventListener("change", handler);
    return () => {
      Dimensions.removeEventListener("change", handler);
    };
  }, args);
  return Dimensions.get(...args);
}
