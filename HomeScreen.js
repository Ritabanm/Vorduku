// components/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const HomeScreen = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Vorduku</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;