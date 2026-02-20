import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LivestarProps {
  isStarred: boolean;
  starsCount: number;
  onPress: () => void;
}

function Livestar({ isStarred, starsCount, onPress }: LivestarProps) {
  return (
    <TouchableOpacity style={styles.starContainer} onPress={onPress}>
      <Ionicons 
        name={isStarred ? "star" : "star-outline"} 
        size={24} 
        color={isStarred ? "#FFD700" : "#FFFFFF"} 
      />
      <Text style={styles.starCount}>{starsCount}</Text>
    </TouchableOpacity>
  );
}

export default Livestar;

const styles = StyleSheet.create({
  starContainer: {
    alignItems: 'center',
    gap: 4,
  },
  starCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
