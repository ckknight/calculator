import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Controls } from "./Controls";
import { CalculatorContext, useCalculator } from "./hooks/useCalculator";
import { NumberDisplay } from "./NumberDisplay";

export const Calculator = React.memo(() => {
  const {
    dispatch,
    value,
    dot,
    fractionalZeroes,
    recentOperation
  } = useCalculator();
  return (
    <CalculatorContext.Provider value={dispatch}>
      <SafeAreaView style={styles.container}>
        <NumberDisplay
          value={value}
          dot={dot}
          fractionalZeroes={fractionalZeroes}
        />
        <Controls recentOperation={recentOperation} />
      </SafeAreaView>
    </CalculatorContext.Provider>
  );
});

export const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
