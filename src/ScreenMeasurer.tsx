import React, { createContext, useContext, useMemo } from "react";
import { LayoutRectangle, SafeAreaView, StyleSheet, View } from "react-native";
import { useDimensions } from "./hooks/useDimensions";
import { useLayout } from "./hooks/useLayout";

interface ScreenSize {
  screenWidth: number;
  screenHeight: number;
  safeWidth: number;
  safeHeight: number;
  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;
  landscape: boolean;
}

function createScreenSize(
  { width: screenWidth, height: screenHeight }: LayoutRectangle,
  {
    width: safeWidth,
    height: safeHeight,
    x: safeLeft,
    y: safeTop
  }: LayoutRectangle
): ScreenSize {
  return {
    screenWidth,
    screenHeight,
    safeWidth,
    safeHeight,
    safeTop,
    safeBottom: screenHeight - safeTop - safeHeight,
    safeLeft,
    safeRight: screenWidth - safeLeft - safeWidth,
    landscape: screenWidth > screenHeight
  };
}

function createUnsafeScreenSize(width: number, height: number): ScreenSize {
  const rect = { width, height, x: 0, y: 0 };
  return createScreenSize(rect, rect);
}

const ScreenSizeContext = createContext<ScreenSize>(undefined!);

export function useScreenSize(): ScreenSize {
  const size = useContext(ScreenSizeContext);
  if (!size) {
    throw new Error(`Expected to be within a ScreenMeasurer`);
  }
  return size;
}

export const ScreenMeasurer = ({ children }: { children: JSX.Element }) => {
  const screenDimensions = useDimensions("screen");
  const [outerSize, onOuterLayout] = useLayout();
  const [innerSize, onInnerLayout] = useLayout();

  const screenSize = useMemo(
    (): ScreenSize => {
      if (!outerSize) {
        return createUnsafeScreenSize(
          screenDimensions.width,
          screenDimensions.height
        );
      }
      if (!innerSize) {
        return createUnsafeScreenSize(outerSize.width, outerSize.height);
      }
      return createScreenSize(outerSize, innerSize);
    },
    [screenDimensions, outerSize, innerSize]
  );

  return (
    <>
      <SafeAreaView
        style={StyleSheet.absoluteFillObject}
        onLayout={onOuterLayout}
      >
        <View style={styles.inner} onLayout={onInnerLayout} />
      </SafeAreaView>
      <ScreenSizeContext.Provider value={screenSize}>
        {children}
      </ScreenSizeContext.Provider>
    </>
  );
};

const styles = StyleSheet.create({
  inner: { flex: 1 }
});
