import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SayarshareProps {
  onPress: () => void;
}

function Sayarshare({ onPress }: SayarshareProps) {
  return (
    <TouchableOpacity style={styles.shareButton} onPress={onPress}>
      <Ionicons name="share-social" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

export default Sayarshare;

const styles = StyleSheet.create({
  shareButton: {
    alignItems: 'center',
    padding: 8,
  },
});
