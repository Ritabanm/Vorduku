import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Timer from '../../components/Game/Timer';
import GameGrid from '../../components/Game/GameGrid';

const ExploreScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Timer initialTime={90} />
      <GameGrid />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around', // Ensure there is space around items
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

export default ExploreScreen;
