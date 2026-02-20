import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import AudioController from './AudioController';

// Import existing components
import Livestar from './Livestar';
import Livecomment from './livecomment';
import Sayarshare from './sayarshare';
import Livetaital from './Livetaital';
import Livechannelinfo from './livechannelinfo';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LiveLayoutProps {
  videoUrl: string;
  streamTitle: string;
  creatorName: string;
  creatorId: string;
  viewers: string;
  isActive: boolean;
  isStarred: boolean;
  starsCount: number;
  onStarPress: () => void;
  onSharePress: () => void;
  onCommentPress: () => void;
}

function LiveLayout({
  videoUrl,
  streamTitle,
  creatorName,
  creatorId,
  viewers,
  isActive,
  isStarred,
  starsCount,
  onStarPress,
  onSharePress,
  onCommentPress
}: LiveLayoutProps) {
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  
  const playerRef = React.useRef<any>(null);

  // Initialize Audio Controller
  React.useEffect(() => {
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
  } : null, (playerInstance: any) => {
    console.log(' Live Player created:', playerInstance);
    if (playerInstance) {
      playerRef.current = playerInstance;
      playerInstance.loop = true;
      playerInstance.muted = true;
      setIsVideoReady(true);

      if (AudioController && typeof AudioController.applyToPlayer === 'function') {
        AudioController.applyToPlayer(playerInstance, isActive);
      }

      if (isActive) {
        setTimeout(() => {
          try {
            if (playerInstance && typeof playerInstance.play === 'function') {
              playerInstance.play();
            }
          } catch (err) {
            console.error(' Play error:', err);
          }
        }, 100);
      }
    }
  });


  return (
    <View style={styles.container}>
      {/* Full Screen Video Player */}
      <View style={styles.videoWrapper}>
        <VideoView 
          player={player} 
          style={[
            styles.video,
            { opacity: isVideoReady && player ? 1 : 0 }
          ]}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
        
        {/* Loading Overlay */}
        {(!isVideoReady || !player) && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading Live Stream...</Text>
          </View>
        )}

        {/* Live Badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        {/* Right Side - Traffic */}
        <View style={styles.rightSideInfo}>
          <Text style={styles.trafficText}>Traffic</Text>
        </View>

        {/* Right Side Components */}
        <View style={styles.rightComponents}>
          <Livestar 
            isStarred={isStarred}
            starsCount={starsCount}
            onPress={onStarPress}
          />
          
          <Livecomment onPress={onCommentPress} />
          
          <Sayarshare onPress={onSharePress} />
        </View>

        {/* Bottom Left - Channel Info */}
        <View style={styles.bottomLeftControls}>
          <Livechannelinfo creatorName={creatorName} />
        </View>

              </View>
    </View>
  );
}

export default LiveLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoWrapper: {
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
  rightSideInfo: {
    position: 'absolute',
    top: 60,
    right: 16,
    alignItems: 'flex-end',
    zIndex: 20,
  },
  counsellingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  trafficText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  viewerCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rightComponents: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    zIndex: 25,
  },
  bottomLeftControls: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    zIndex: 15,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 100,
    zIndex: 15,
  },
});

