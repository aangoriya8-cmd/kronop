import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const VideoPlayer = ({ videoUrl, isActive, onEnd }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive, videoUrl]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onEnd?.();
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isActive}
        isLooping={true}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && !status.isPlaying && isActive) {
            videoRef.current.playAsync();
            setIsPlaying(true);
          }
        }}
        onPlaybackFinish={handleVideoEnd}
        volume={1.0}
        isMuted={false}
        useNativeControls={false}
        resizeMode="cover"
      />
      
      {/* Video placeholder overlay - will be replaced by actual video */}
      <View style={styles.overlay}>
        <Text style={styles.playText}>
          {isPlaying ? 'Playing...' : 'Tap to Play'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
