import * as React from 'react';
import { StyleSheet,View } from 'react-native';
import { PaperProvider,DefaultTheme } from 'react-native-paper';
import Header from "./components/Header";
import Home from "./screens/Home";

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#e91e63',
      secondary: '#d500f9',
      primaryContainer: "#aa00ff",
      secondaryContainer: "#ff4081",
      flex: 1,
    },
  };

export default function App() {
return (
    <PaperProvider theme={theme} >
    <View style={styles.container}>
      <Header/>
      <Home/>
    </View>
    </PaperProvider>
);
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
    },
  }); 
  