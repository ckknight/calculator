import { isEqual } from "lodash";
import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";
import { useHandler } from "./useHandler";

export function useLayout(
  initialLayout: LayoutRectangle
): [LayoutRectangle, (event: LayoutChangeEvent) => void];
export function useLayout(
  initialLayout?: LayoutRectangle | null
): [LayoutRectangle | null, (event: LayoutChangeEvent) => void];
export function useLayout(
  initialLayout: LayoutRectangle | null = null
): [LayoutRectangle | null, (event: LayoutChangeEvent) => void] {
  const [state, setState] = useState(initialLayout || null);

  return [
    state,
    useHandler(function onLayout(event: LayoutChangeEvent) {
      const { layout } = event.nativeEvent;
      if (!isEqual(state, layout)) {
        setState({ ...layout });
      }
    })
  ];
}
