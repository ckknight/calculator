import React, { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Calculator } from "./Calculator";
import { ScreenBackground } from "./ScreenBackground";
import { ScreenMeasurer } from "./ScreenMeasurer";
import { ScreenRotater } from "./ScreenRotater";

function updateStatusBar() {
  StatusBar.setBarStyle("light-content");
}
export const CalculatorApp: React.FC = () => {
  useEffect(() => {
    updateStatusBar();
  });
  return (
    <>
      <ScreenBackground style={styles.app} />
      <ScreenMeasurer>
        <Calculator />
      </ScreenMeasurer>
      <ScreenRotater />
    </>
  );
};

const styles = StyleSheet.create({
  app: {
    backgroundColor: "#000"
  }
});
