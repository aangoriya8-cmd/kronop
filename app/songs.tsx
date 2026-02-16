import React, { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import demoUserService from '../services/demoUserService';

export default memo(function SongsScreen() {
  const [demoMessage, setDemoMessage] = useState(demoUserService.getDemoMessage('songs'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const tracks = [
    { id: 1, title: 'Melody of Dreams', artist: 'Kronop Artist' },
    { id: 2, title: 'Night Vibes', artist: 'Chill Producer' },
    { id: 3, title: 'Summer Beats', artist: 'DJ Kronop' },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleShare = () => {
    // Share functionality
    console.log('Sharing song:', tracks[currentTrackIndex].title);
  };

  const handleUpload = () => {
    // Upload functionality
    console.log('Upload song');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Songs</Text>
        <Text style={styles.subtitle}>{demoMessage.title}</Text>
        <Text style={styles.description}>{demoMessage.subtitle}</Text>
        
        {/* Music Player Controls */}
        <View style={styles.playerContainer}>
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{tracks[currentTrackIndex].title}</Text>
            <Text style={styles.artistName}>{tracks[currentTrackIndex].artist}</Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
              <MaterialIcons name="skip-previous" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={32} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <MaterialIcons name="skip-next" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <MaterialIcons name="share" size={20} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleUpload}>
              <MaterialIcons name="upload" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  playerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#ccc',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
