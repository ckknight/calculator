import { BlurView, DangerZone, ScreenOrientation } from "expo";
import React, { useEffect, useState } from "react";
import { useDimensions } from "./hooks/useDimensions";
import { useHandler } from "./hooks/useHandler";

function areSimilarOrientations(x: 0 | 90 | -90 | 180, y: 0 | 90 | -90 | 180) {
  return (x - y + 360) % 180 === 0;
}

export const ScreenRotater = () => {
  useEffect(() => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
  }, []);
  const screenDimensions = useDimensions("screen");
  const { width, height } = screenDimensions;
  const screenSize = Math.max(width, height);
  const dimensionsOrientation = width > height ? 90 : 0;
  const motionOrientation = useMotionOrientation(dimensionsOrientation);
  const [showBlur, setShowBlur] = useState(false);
  useEffect(() => {
    const shouldBlur = !areSimilarOrientations(
      dimensionsOrientation,
      motionOrientation
    );
    if (shouldBlur && !showBlur) {
      setShowBlur(shouldBlur);
    }
  });

  const onLayout = useHandler(() => {
    ScreenOrientation.allowAsync(
      motionOrientation % 180 === 0
        ? ScreenOrientation.Orientation.PORTRAIT
        : ScreenOrientation.Orientation.LANDSCAPE
    );
    setTimeout(() => setShowBlur(false), 250);
  });

  if (showBlur) {
    return (
      <BlurView
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            width: screenSize,
            height: screenSize
          }
        ]}
        tint="dark"
        intensity={100}
        onLayout={onLayout}
      />
    );
  }
  return null;
};

function useMotionOrientation(
  initialOrientation: 0 | 90 | -90 | 180 = 0
): 0 | 90 | -90 | 180 {
  const [motionOrientation, setMotionOrientation] = useState(
    initialOrientation
  );
  useEffect(
    () => {
      const subscription = DangerZone.DeviceMotion.addListener(
        ({ orientation }) => {
          if (motionOrientation !== orientation) {
            setMotionOrientation(orientation);
          }
        }
      );
      return () => subscription.remove();
    },
    [motionOrientation]
  );
  return motionOrientation;
}
