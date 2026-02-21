import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Canvas, Text, useFont, LinearGradient, vec } from '@shopify/react-native-skia';

const { width } = Dimensions.get('window');

const RunningTitle = ({ title, speed = 50 }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  // Use a system font instead of custom font for now
  const font = useFont(null, 32);

  useEffect(() => {
    const animate = () => {
      translateX.setValue(width);
      Animated.timing(translateX, {
        toValue: -width,
        duration: speed * 1000,
        useNativeDriver: true,
      }).start(animate);
    };
    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Canvas style={{ width: width * 2, height: 60 }}>
          <Text
            x={0}
            y={40}
            text={title}
            font={font}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(200, 0)}
              colors={['#FFD700', '#FFA500', '#FFD700']}
            />
          </Text>
        </Canvas>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    height: 60,
    marginTop: 20, // Added top margin
  },
});

export default RunningTitle;
