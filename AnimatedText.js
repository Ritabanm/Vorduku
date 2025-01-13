// AnimatedText.js
import React, { useEffect, useCallback } from 'react';
import { Animated, Text } from 'react-native';

const AnimatedText = ({ text, onAnimationComplete }) => {
  const textAnimatedValue = new Animated.Value(0);
  const duration = 3000; // 3 seconds

  const animateText = useCallback(() => {
    Animated.timing(textAnimatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(() => {
      onAnimationComplete();
    });
  }, [textAnimatedValue, duration, onAnimationComplete]);

  useEffect(() => {
    animateText();
  }, [animateText]);

  return (
    <Animated.Text
      style={{
        opacity: textAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
      }}
    >
      {text}
    </Animated.Text>
  );
};

export default AnimatedText;