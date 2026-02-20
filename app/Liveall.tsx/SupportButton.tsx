import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SupportButtonProps {
  creatorName: string;
  isSupported: boolean;
  onPress: () => void;
}

export default function SupportButton({ creatorName, isSupported, onPress }: SupportButtonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.channelInfo}>
        <Image 
          source={{ uri: 'https://picsum.photos/seed/channel-logo/40/40.jpg' }}
          style={styles.channelLogo}
        />
        <Text style={styles.channelName}>{creatorName}</Text>
      </View>
      <TouchableOpacity style={[styles.button, isSupported ? styles.supported : styles.unsupported]} onPress={onPress}>
        <MaterialIcons 
          name={isSupported ? "favorite" : "favorite-border"} 
          size={16} 
          color="#FFFFFF" 
        />
        <Text style={styles.buttonText}>
          {isSupported ? "Supported" : "Support"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
