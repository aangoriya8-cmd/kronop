// RunningTitle.js - Premium Running Title Component
// The Speed King - Smooth Scrolling Text System
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RunningTitle = ({
  title = 'Kronop Premium',
  speed = 50,
  color = '#FFFFFF',
  fontSize = 16
}) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    // Start the animation
    const animate = () => {
      Animated.timing(translateX, {
        toValue: -textWidth - SCREEN_WIDTH,
        duration: (textWidth / speed) * 1000,
        useNativeDriver: true,
      }).start(() => {
        // Reset and loop
        translateX.setValue(SCREEN_WIDTH);
        animate();
      });
    };

    // Start animation after a short delay
    const timeout = setTimeout(animate, 500);
    return () => clearTimeout(timeout);
  }, [textWidth, speed]);

  const handleTextLayout = (event) => {
    const { width } = event.nativeEvent;
    setTextWidth(width);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <Text
          onLayout={handleTextLayout}
          style={[
            styles.text,
            {
              color,
              fontSize,
            },
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 20,
  },
});

export default RunningTitle;
