// components/Splash.js
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

const Splash = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  useEffect(() => {
    // Start the animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Fade in duration
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Fade out duration
        delay: 1000, // Stay visible for a while before fading out
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call the callback function to indicate the animation is complete
      onAnimationComplete();
    });
  }, [fadeAnim, onAnimationComplete]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        Vorduku
      </Animated.Text>
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
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Splash;