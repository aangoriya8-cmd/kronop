import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LiveStreamScreen from '../AllLive/LiveStreamScreen.js';

export default function LiveTab() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <LiveStreamScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});