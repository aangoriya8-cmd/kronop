// SupportVIP.js - Premium VIP Support Component
// The Speed King - Elite Customer Support System
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Alert, Linking } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SupportVIPProps {
  size?: number;
  color?: string;
}

const SupportVIP: React.FC<SupportVIPProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => {
  const [scale] = useState(new Animated.Value(1));

  const handleSupportPress = () => {
    // Elite haptic feedback
    if (typeof window !== 'undefined' && window.navigator) {
      window.navigator.vibrate?.(20);
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      'VIP Support 🌟',
      'Welcome to Premium Support!\n\nFeatures:\n• 24/7 Elite Support\n• Priority Response\n• Exclusive Features\n• Premium Assistance',
      [
        { 
          text: 'Contact VIP', 
          onPress: () => {
            Linking.openURL('mailto:vip@kronop.app?subject=VIP%20Support%20Request');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleSupportPress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <FontAwesome6 
          name="crown" 
          size={size} 
          color={color} 
        />
      </Animated.View>
      <Text style={[styles.label, { color }]}>
        VIP
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
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SupportVIP;
