// PremiumShare.js - Ultra Premium Share Component
// The Speed King - Lightning Fast Share System
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Share, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PremiumShare = ({
  initialShares = 0,
  onShareChange,
  size = 24,
  color = '#FFFFFF'
}) => {
  const [shares, setShares] = useState(initialShares);
  const [scale] = useState(new Animated.Value(1));

  const handleShare = async () => {
    // Premium haptic feedback
    if (typeof window !== 'undefined' && window.navigator) {
      window.navigator.vibrate?.(12);
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await Share.share({
        message: 'Check out this amazing content on Kronop! 🚀',
        url: 'https://kronop.app',
        title: 'Premium Content - Kronop'
      });

      const newSharesCount = shares + 1;
      setShares(newSharesCount);
      onShareChange?.(newSharesCount);

      Alert.alert(
        'Shared Successfully! 🎉',
        'Content shared with premium quality',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleShare}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcons 
          name="share" 
          size={size} 
          color={color} 
        />
      </Animated.View>
      <Text style={[styles.count, { color }]}>
        {formatNumber(shares)}
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

export default PremiumShare;
