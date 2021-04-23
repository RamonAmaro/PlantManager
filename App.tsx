import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text> Hello </Text>
      <Text> Nlw#5 </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
