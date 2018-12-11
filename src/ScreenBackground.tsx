import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useDimensions } from "./hooks/useDimensions";

export const ScreenBackground = ({ style, ...rest }: ViewProps) => {
  const dim = useDimensions("window");
  const { width, height } = dim;
  const size = Math.max(width, height);
  return (
    <View
      style={[
        styles.background,
        {
          width: size,
          height: size
        },
        style
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    top: 0
  }
});
