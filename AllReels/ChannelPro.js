// ChannelPro.js - Premium Channel Management Component
// The Speed King - Professional Channel System
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ChannelPro = ({
  channelName = 'Kronop Premium',
  subscribers = 0,
  isSubscribed = false,
  onSubscribeChange,
  size = 24,
  color = '#FFFFFF'
}) => {
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [scale] = useState(new Animated.Value(1));

  const handleSubscribe = () => {
    // Premium haptic feedback
    if (typeof window !== 'undefined' && window.navigator) {
      window.navigator.vibrate?.(18);
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const newSubscribeState = !subscribed;
    setSubscribed(newSubscribeState);
    onSubscribeChange?.(newSubscribeState);

    Alert.alert(
      newSubscribeState ? 'Channel Subscribed! ' : 'Unsubscribed',
      newSubscribeState 
        ? `You're now a premium subscriber to ${channelName}!` 
        : `You've unsubscribed from ${channelName}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleSubscribe}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcons 
          name={subscribed ? "notifications" : "notifications-none"} 
          size={size} 
          color={subscribed ? '#FFD700' : color} 
        />
      </Animated.View>
      <Text style={[styles.count, { color }]}>
        {formatNumber(subscribers)}
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

export default ChannelPro;
