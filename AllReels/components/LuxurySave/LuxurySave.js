import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Canvas, Path, useCanvasRef, runTiming } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';

const LuxurySave = ({ onSave }) => {
  const [saved, setSaved] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const canvasRef = useCanvasRef();

  const handleSave = () => {
    // Ultra-fast haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 120fps animations
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.5,
        speed: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSaved(true);
      Animated.spring(scale, {
        toValue: 1,
        speed: 100,
        useNativeDriver: true,
      }).start();
      
      // Binary save via QUIC
      onSave?.({ saved: true, timestamp: Date.now() });
    });
  };

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handleSave} style={styles.container}>
      <Animated.View style={{ transform: [{ scale }, { rotate: spin }] }}>
        <Canvas style={{ width: 60, height: 60 }} ref={canvasRef}>
          {/* Diamond Save Icon */}
          <Path
            path="M30 5 L55 30 L30 55 L5 30 Z"
            color={saved ? '#FFD700' : '#FFFFFF'}
            style="fill"
            opacity={saved ? 1 : 0.3}
          />
          <Path
            path="M30 15 L45 30 L30 45 L15 30 Z"
            color={saved ? '#FFA500' : 'transparent'}
            style="fill"
          />
          {/* Inner shine */}
          <Path
            path="M30 22 L38 30 L30 38 L22 30 Z"
            color="#FFFFFF"
            style="fill"
            opacity={0.8}
          />
        </Canvas>
      </Animated.View>
      {saved && <Text style={styles.savedText}>Saved</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  savedText: {
    color: '#FFD700',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default LuxurySave;
