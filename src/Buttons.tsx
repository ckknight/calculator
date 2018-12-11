import React, { useContext } from "react";
import { PixelRatio, StyleSheet, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import {
  CalculatorAction,
  CalculatorActionType,
  CalculatorContext
} from "./hooks/useCalculator";
import { useHandler } from "./hooks/useHandler";
import { useScreenSize } from "./ScreenMeasurer";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

function useButtonSize() {
  const size = useScreenSize();
  if (size.landscape) {
    return PixelRatio.roundToNearestPixel(size.safeHeight / 6) - 20;
  } else {
    return PixelRatio.roundToNearestPixel(size.safeWidth / 4) - 20;
  }
}

function useButtonStyle({
  colSize = 1,
  rowSize = 1
}: {
  colSize?: number;
  rowSize?: number;
} = {}) {
  const size = useButtonSize();
  return {
    width: size * colSize + 20 * (colSize - 1),
    height: size * rowSize + 20 * (rowSize - 1),
    borderRadius: size / 2
  };
}

export function ActionButton({ text, onPress }: ButtonProps) {
  const style = useButtonStyle();
  return (
    <RectButton style={[styles.button, styles.action, style]} onPress={onPress}>
      <Text style={[styles.text, styles.actionText]}>{text}</Text>
    </RectButton>
  );
}

export function OperationButton({
  text,
  action,
  highlighted = false
}: {
  text: string;
  action: CalculatorAction;
  highlighted?: boolean;
}) {
  const style = useButtonStyle();
  const dispatch = useContext(CalculatorContext);
  const onPress = useHandler(() => dispatch(action));
  return (
    <RectButton
      style={[
        styles.button,
        styles.operation,
        highlighted ? styles.highlighted : null,
        style
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          styles.operationText,
          highlighted ? styles.highlightedOperationText : null
        ]}
      >
        {text}
      </Text>
    </RectButton>
  );
}

export function DigitButton({
  digit,
  widthMultiplier = 1
}: {
  digit: number;
  widthMultiplier?: number;
}) {
  const dispatch = useContext(CalculatorContext);
  const onPress = useHandler(() =>
    dispatch({
      type: CalculatorActionType.PressDigit,
      digit
    })
  );
  const style = useButtonStyle({ colSize: widthMultiplier });

  return (
    <RectButton style={[styles.button, styles.digit, style]} onPress={onPress}>
      <Text style={[styles.text, styles.digitText]}>{String(digit)}</Text>
    </RectButton>
  );
}

export function DotButton() {
  const dispatch = useContext(CalculatorContext);
  const onPress = useHandler(() =>
    dispatch({
      type: CalculatorActionType.Dot
    })
  );
  const style = useButtonStyle();

  return (
    <RectButton style={[styles.button, styles.digit, style]} onPress={onPress}>
      <Text style={[styles.text, styles.digitText]}>.</Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  text: {
    fontSize: 36
  },
  action: {
    backgroundColor: "#aaa"
  },
  actionText: {
    color: "black"
  },
  digit: {
    backgroundColor: "#333"
  },
  digitText: {
    color: "white"
  },
  operation: {
    backgroundColor: "orange"
  },
  operationText: {
    color: "white"
  },
  highlighted: {
    backgroundColor: "white"
  },
  highlightedOperationText: {
    color: "orange"
  }
});
