import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActionButton,
  DigitButton,
  DotButton,
  OperationButton
} from "./Buttons";
import {
  CalculatorActionType,
  CalculatorContext,
  Operation
} from "./hooks/useCalculator";

function AllClearButton() {
  const dispatch = useContext(CalculatorContext);
  return (
    <ActionButton
      text="AC"
      onPress={() =>
        dispatch({
          type: CalculatorActionType.AllClear
        })
      }
    />
  );
}

function NegateButton() {
  const dispatch = useContext(CalculatorContext);
  return (
    <ActionButton
      text="±"
      onPress={() =>
        dispatch({
          type: CalculatorActionType.Negate
        })
      }
    />
  );
}

function PercentageButton() {
  const dispatch = useContext(CalculatorContext);
  return (
    <ActionButton
      text="%"
      onPress={() =>
        dispatch({
          type: CalculatorActionType.Percentage
        })
      }
    />
  );
}

export const Controls = ({
  recentOperation
}: {
  recentOperation: Operation | null;
}) => {
  return (
    <View style={styles.controls}>
      <View style={styles.row}>
        <AllClearButton />
        <NegateButton />
        <PercentageButton />
        <OperationButton
          text="÷"
          action={{ type: CalculatorActionType.Divide }}
          highlighted={recentOperation === Operation.Division}
        />
      </View>
      <View style={styles.row}>
        <DigitButton digit={7} />
        <DigitButton digit={8} />
        <DigitButton digit={9} />
        <OperationButton
          text="×"
          action={{ type: CalculatorActionType.Multiply }}
          highlighted={recentOperation === Operation.Multiplication}
        />
      </View>
      <View style={styles.row}>
        <DigitButton digit={4} />
        <DigitButton digit={5} />
        <DigitButton digit={6} />
        <OperationButton
          text="−"
          action={{ type: CalculatorActionType.Subtract }}
          highlighted={recentOperation === Operation.Subtraction}
        />
      </View>
      <View style={styles.row}>
        <DigitButton digit={1} />
        <DigitButton digit={2} />
        <DigitButton digit={3} />
        <OperationButton
          text="+"
          action={{ type: CalculatorActionType.Add }}
          highlighted={recentOperation === Operation.Addition}
        />
      </View>
      <View style={styles.row}>
        <DigitButton digit={0} widthMultiplier={2} />
        <DotButton />
        <OperationButton
          text="="
          action={{ type: CalculatorActionType.Equals }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {},
  row: {
    flexDirection: "row"
  }
});
