import { useRef } from "react";
import Animated from "react-native-reanimated";

export function useReanimatedValue<T extends string | number | boolean>(
  initialValue: T
) {
  const ref = useRef<Animated.Value<T>>(undefined!);
  if (ref.current === undefined) {
    ref.current = new Animated.Value(initialValue);
  }
  return ref.current;
}
