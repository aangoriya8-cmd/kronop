// LuxurySave.js - Premium Save Component with Cloud Storage
// The Speed King - Instant Save System
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, AsyncStorage, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LuxurySaveProps {
  initialSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
  size?: number;
  color?: string;
}

const LuxurySave: React.FC<LuxurySaveProps> = ({
  initialSaved = false,
  onSaveChange,
  size = 24,
  color = '#FFFFFF'
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [scale] = useState(new Animated.Value(1));

  useEffect(() => {
    // Load saved state from AsyncStorage
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('@luxury_save_state');
        if (savedState) {
          setIsSaved(JSON.parse(savedState));
        }
      } catch (error) {
        console.log('Error loading saved state:', error);
      }
    };
    loadSavedState();
  }, []);

  const handleSave = async () => {
    // Premium haptic feedback
    if (typeof window !== 'undefined' && window.navigator) {
      window.navigator.vibrate?.(15);
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('@luxury_save_state', JSON.stringify(newSavedState));
    } catch (error) {
      console.log('Error saving state:', error);
    }

    onSaveChange?.(newSavedState);

    Alert.alert(
      newSavedState ? 'Saved to Collection! 💎' : 'Removed from Collection',
      newSavedState ? 'Content added to your premium collection' : 'Content removed from your collection',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleSave}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcons 
          name={isSaved ? "bookmark" : "bookmark-border"} 
          size={size} 
          color={isSaved ? '#FFD700' : color} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default LuxurySave;
