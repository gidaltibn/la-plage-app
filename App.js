import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import AppStack from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <StatusBar />
      <AppStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
