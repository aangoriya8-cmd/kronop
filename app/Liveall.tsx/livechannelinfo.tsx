import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LivechannelinfoProps {
  creatorName: string;
}

export default function Livechannelinfo({ creatorName }: LivechannelinfoProps) {
  return (
    <View style={styles.channelContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <Text style={styles.channelName}>{creatorName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6A5ACD',
  },
  avatarText: {
    fontSize: 16,
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
