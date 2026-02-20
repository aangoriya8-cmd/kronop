import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AudioController from '../../services/AudioController';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LivePlayerProps {
  videoUrl: string;
  streamTitle: string;
  creatorName: string;
  creatorId: string;
  viewers: string;
  isActive: boolean;
  onStarPress: () => void;
  onSharePress: () => void;
  onCommentPress: () => void;
  isStarred: boolean;
  starsCount: number;
}

export default function LivePlayer({
  videoUrl,
  streamTitle,
  creatorName,
  creatorId,
  isActive,
  onStarPress,
  onSharePress,
  onCommentPress,
  isStarred,
  starsCount,
  viewers
}: LivePlayerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayerReadyRef = useRef(false);

  // Initialize Audio Controller
  useEffect(() => {
    AudioController.initialize();
  }, []);

  // Create video player with expo-video
  const player = useVideoPlayer(videoUrl ? {
    uri: videoUrl,
    headers: {
      'User-Agent': 'KronopApp',
      'Referer': 'https://kronop.app',
      'Origin': 'https://kronop.app'
    }
  } : null, (playerInstance) => {
    console.log('🎥 Live Player created:', playerInstance);
    if (playerInstance) {
      playerRef.current = playerInstance;
      playerInstance.loop = true;
      playerInstance.muted = true; // Start muted for live
      isPlayerReadyRef.current = true;
      setIsVideoReady(true);

      // Apply audio settings from AudioController - Add null check
      if (AudioController && typeof AudioController.applyToPlayer === 'function') {
        AudioController.applyToPlayer(playerInstance, isActive);
      }

      if (isActive) {
        console.log('▶️ Starting live stream...');
        setTimeout(() => {
          try {
            if (playerInstance && typeof playerInstance.play === 'function') {
              playerInstance.play();
            }
          } catch (err) {
            console.error('❌ Play error:', err);
          }
        }, 100);
      }
    }
  });

  // Handle play/pause based on active state
  useEffect(() => {
    if (playerRef.current && isPlayerReadyRef.current) {
      if (isActive && !isPaused) {
        try {
          playerRef.current.play();
        } catch (err) {
          console.error('❌ Play error in useEffect:', err);
        }
      } else {
        try {
          playerRef.current.pause();
        } catch (err) {
          console.error('❌ Pause error in useEffect:', err);
        }
      }
    }
  }, [isActive, isPaused]);

  // Handle video tap for play/pause
  const handleVideoTap = useCallback(() => {
    setIsPaused(prev => !prev);
    setShowControls(true);
    
    // Hide controls after 3 seconds
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000) as unknown as NodeJS.Timeout;
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      playerRef.current.muted = newMuted;
      AudioController.setEnabled(!newMuted);
    }
  }, [isMuted]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    // Implement fullscreen logic if needed
    console.log('🔳 Fullscreen toggle');
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress
  const handleProgress = useCallback((progress: any) => {
    setCurrentTime(progress.currentTime);
    setDuration(progress.duration);
  }, []);

  // Seek video
  const handleSeek = useCallback((event: any) => {
    if (playerRef.current) {
      const { locationX } = event.nativeEvent;
      const percentage = locationX / SCREEN_WIDTH;
      const seekTime = duration * percentage;
      if (playerRef.current.seekTo) {
        playerRef.current.seekTo(seekTime);
      }
    }
  }, [duration]);

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <TouchableOpacity 
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleVideoTap}
      >
        <VideoView 
          player={player} 
          style={[
            styles.video,
            { opacity: isVideoReady && player ? 1 : 0 }
          ]}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
          onProgress={handleProgress}
        />
        
        {/* Loading Indicator */}
        {(!isVideoReady || !player) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6A5ACD" />
            <Text style={styles.loadingText}>Loading Live Stream...</Text>
          </View>
        )}

        {/* Paused Overlay */}
        {isPaused && isVideoReady && player && (
          <View style={styles.pauseOverlay}>
            <MaterialIcons name="play-circle-outline" size={80} color="rgba(255,255,255,0.8)" />
          </View>
        )}

        {/* Live Badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <View style={styles.streamInfo}>
                <Text style={styles.streamTitle} numberOfLines={1}>{streamTitle}</Text>
                <Text style={styles.creatorName}>{creatorName}</Text>
                <View style={styles.viewerCount}>
                  <MaterialIcons name="visibility" size={14} color="#FFFFFF" />
                  <Text style={styles.viewerText}>{viewers}</Text>
                </View>
              </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <TouchableOpacity 
                style={styles.progressBar}
                onPress={handleSeek}
              >
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${(currentTime / duration) * 100}%` }
                    ]}
                  />
                </View>
              </TouchableOpacity>

              {/* Control Buttons */}
              <View style={styles.controlButtons}>
                {/* Play/Pause Button */}
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => setIsPaused(!isPaused)}
                >
                  <MaterialIcons 
                    name={isPaused ? "play-arrow" : "pause"} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>

                {/* Mute Button */}
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={toggleMute}
                >
                  <MaterialIcons 
                    name={isMuted ? "volume-off" : "volume-up"} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>

                {/* Star Button */}
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={onStarPress}
                >
                  <Ionicons 
                    name={isStarred ? "star" : "star-outline"} 
                    size={24} 
                    color={isStarred ? "#FFD700" : "#FFFFFF"} 
                  />
                  <Text style={styles.starCount}>{starsCount}</Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={onSharePress}
                >
                  <Ionicons name="share-social" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={onCommentPress}
                >
                  <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Fullscreen Button */}
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={toggleFullscreen}
                >
                  <MaterialIcons name="fullscreen" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 15,
  },
  topControls: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
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
  bottomControls: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 4,
    marginBottom: 12,
  },
  progressBackground: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A5ACD',
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
  },
  starCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});