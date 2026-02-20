import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LivetaitalProps {
  streamTitle: string;
  creatorName: string;
  viewers: string;
}

export default function Livetaital({ streamTitle, creatorName, viewers }: LivetaitalProps) {
  return (
    <View style={styles.streamInfo}>
      <Text style={styles.streamTitle} numberOfLines={1}>{streamTitle}</Text>
      <Text style={styles.creatorName}>{creatorName}</Text>
      <View style={styles.viewerCount}>
        <MaterialIcons name="visibility" size={14} color="#FFFFFF" />
        <Text style={styles.viewerText}>{viewers}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streamInfo: {
    maxWidth: '70%',
  },
  streamTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  creatorName: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});
