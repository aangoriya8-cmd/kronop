import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LivecommentProps {
  onPress: () => void;
}

function Livecomment({ onPress }: LivecommentProps) {
  return (
    <TouchableOpacity style={styles.commentButton} onPress={onPress}>
      <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

export default Livecomment;

const styles = StyleSheet.create({
  commentButton: {
    alignItems: 'center',
    padding: 8,
  },
});
