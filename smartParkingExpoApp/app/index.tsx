import * as React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import Header from "./components/Header";
import Home from "./screens/Home";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#e91e63",
    secondary: "#d500f9",
    primaryContainer: "#aa00ff",
    secondaryContainer: "#ff4081",
    surfaceVariant: "red",
    flex: 1,
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Header />
        <Home />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
    flex: 1,
  },
});
