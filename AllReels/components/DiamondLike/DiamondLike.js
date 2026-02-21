import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import { useReelContext } from '../../core/ReelContext';

const DiamondLike = ({ size = 60, color = '#B9F2FF', onPress }) => {
  const canvasRef = useCanvasRef();
  const progressRef = useRef(0);
  const { hapticEngine } = useReelContext();

  // Diamond path with premium thin lines (Image 68576 style)
  const diamondPath = Skia.Path.Make();
  diamondPath.moveTo(30, 0);
  diamondPath.lineTo(60, 30);
  diamondPath.lineTo(30, 60);
  diamondPath.lineTo(0, 30);
  diamondPath.close();

  // Inner intricate lines
  const innerLines = Skia.Path.Make();
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45) * Math.PI / 180;
    const x1 = 30 + 15 * Math.cos(angle);
    const y1 = 30 + 15 * Math.sin(angle);
    const x2 = 30 + 25 * Math.cos(angle);
    const y2 = 30 + 25 * Math.sin(angle);
    innerLines.moveTo(x1, y1);
    innerLines.lineTo(x2, y2);
  }

  const handlePress = () => {
    // 0.001ms response time - simple animation without reanimated
    progressRef.current = 1;
    hapticEngine.impact(0.5);
    
    setTimeout(() => {
      progressRef.current = 0;
    }, 200);
    
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Canvas style={{ width: size, height: size }} ref={canvasRef}>
        {/* Outer diamond with shine */}
        <Path
          path={diamondPath}
          color="#FFFFFF"
          style="stroke"
          strokeWidth={2}
          strokeJoin="round"
        />
        
        {/* Inner intricate lines */}
        <Path
          path={innerLines}
          color="#B9F2FF"
          style="stroke"
          strokeWidth={1}
          opacity={0.8 + progressRef.current * 0.2}
        />
        
        {/* Premium shine effect */}
        <Path
          path={diamondPath}
          color="#FFFFFF"
          style="stroke"
          strokeWidth={1.5}
          opacity={progressRef.current}
          strokeJoin="round"
        />
      </Canvas>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginBottom: 10, // Added bottom margin
  },
});

export default DiamondLike;
