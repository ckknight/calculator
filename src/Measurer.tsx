import React, { forwardRef, ReactNode, Ref } from "react";
import { LayoutRectangle, View, ViewProps } from "react-native";
import { useLayout } from "./hooks/useLayout";

type MeasurerProps = Pick<
  ViewProps,
  Exclude<keyof ViewProps, "children" | "onLayout">
> & {
  children: (size: LayoutRectangle) => ReactNode;
};
export const Measurer = forwardRef((props: MeasurerProps, ref: Ref<View>) => {
  const { children, ...rest } = props;
  const [size, onLayout] = useLayout(null);

  return (
    <View ref={ref} {...rest} onLayout={onLayout}>
      {size && children(size)}
    </View>
  );
});
