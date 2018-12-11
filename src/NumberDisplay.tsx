import React from "react";
import { Text, View } from "react-native";

function getString(value: number, dot: boolean, fractionalZeroes: number) {
  return (
    (Object.is(value, -0) ? "-0" : String(value)) +
    (dot && value % 1 === 0 ? "." : "") +
    "0".repeat(fractionalZeroes)
  );
}

function guessFontSize(text: string) {
  if (text.length < 10) {
    return 64;
  }
  if (text.length < 15) {
    return 48;
  }
  if (text.length < 20) {
    return 36;
  }
  return 24;
}

export function NumberDisplay({
  value,
  dot,
  fractionalZeroes
}: {
  value: number;
  dot: boolean;
  fractionalZeroes: number;
}) {
  const str = getString(value, dot, fractionalZeroes);
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Text
        style={{
          color: "white",
          fontSize: guessFontSize(str),
          textAlign: "right"
        }}
      >
        {str}
      </Text>
    </View>
  );
}
