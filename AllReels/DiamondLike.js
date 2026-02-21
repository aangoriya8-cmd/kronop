// DiamondLike.js - Premium Diamond Like Button Component
// The Speed King - Ultra Performance Like System
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import CustomDiamondIcon from '../components/icons/CustomDiamondIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DiamondLikeProps {
  initialLikes?: number;
  onLikeChange?: (liked: boolean, count: number) => void;
  size?: number;
  color?: string;
}

const DiamondLike: React.FC<DiamondLikeProps> = ({
  initialLikes = 0,
  onLikeChange,
  size = 24,
  color = '#FFFFFF'
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [scale] = useState(new Animated.Value(1));

  const handleLike = () => {
    // Haptic feedback for premium feel
    if (typeof window !== 'undefined' && window.navigator) {
      window.navigator.vibrate?.(10);
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likes + 1 : Math.max(0, likes - 1);
    
    setIsLiked(newLikedState);
    setLikes(newLikesCount);
    
    onLikeChange?.(newLikedState, newLikesCount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleLike}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <CustomDiamondIcon 
          size={size} 
          color={isLiked ? '#FFD700' : color} 
        />
      </Animated.View>
      <Text style={[styles.count, { color }]}>
        {formatNumber(likes)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  count: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default DiamondLike;
