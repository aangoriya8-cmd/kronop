import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SupportButtonProps {
  creatorName: string;
  isSupported: boolean;
  onPress: () => void;
}

export default function SupportButton({ creatorName, isSupported, onPress }: SupportButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.channelName}>{creatorName}</Text>
      <TouchableOpacity style={[styles.button, isSupported ? styles.supported : styles.unsupported]}>
        <MaterialIcons 
          name={isSupported ? "favorite" : "favorite-border"} 
          size={16} 
          color="#FFFFFF" 
        />
        <Text style={styles.buttonText}>
          {isSupported ? "Supported" : "Support"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  supported: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
  unsupported: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
