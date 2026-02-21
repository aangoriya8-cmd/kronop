
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import RunningTitle from '../../components/feature/RunningTitle';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { useSWRContent } from '../../hooks/swr';
// import { hlsOptimizerService } from '../../services/hlsOptimizer'; // Service removed
import { CommentSheet } from '../../components/feature/CommentSheet';
import StatusBarOverlay from '../../components/common/StatusBarOverlay';
import SupportSection from '../../components/feature/SupportSection';
import ChannelInfo from '../../components/feature/ChannelInfo';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Simple Button Component - No Background (Fixed: Original icons, medium size)
const ActionButton = ({ icon, count, onPress, color = '#FFFFFF', isReport = false, iconType = 'MaterialIcons' }: any) => (
  <TouchableOpacity 
    style={{ alignItems: 'center' }} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    {iconType === 'AntDesign' ? (
      <AntDesign name={icon} size={24} color={color} />
    ) : (
      <MaterialIcons name={icon} size={26} color={color} />
    )}
    {isReport ? (
      <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '600', marginTop: 3 }}>
        Report
      </Text>
    ) : (
      <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginTop: 3 }}>
        {count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}
      </Text>
    )}
  </TouchableOpacity>
);

interface Reel {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: number;
  views_count: number;
  likes_count: number;
  tags: string[];
  is_public: boolean;
  created_at: string;
  user_profiles?: {
    username: string;
    avatar_url: string;
  };
  song_name?: string;
  song_artist?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

// Simple Reel Item
function ReelItem({ 
  item, 
  isActive,
  onChannelPress,
  onLikeChange,
  onCommentPress,
  onShareChange,
  onSaveChange,
  onSupportChange,
  onReportPress,
  likes,
  comments,
  shares,
  starred,
  saved,
  supported
}: any) {
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const lastTap = useRef(0);
  const playerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef(false);

  useEffect(() => {
    if (isActive) setIsPaused(false);
  }, [isActive]);

  const getVideoSource = () => {
    let videoUrl = item.video_url;
    console.log('🎬 Video URL:', videoUrl);
    
    // If the main URL doesn't work, try a backup
    if (!videoUrl || videoUrl.includes('mixkit.co')) {
      // Try a different working video URL
      videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      console.log('🔄 Using backup video URL:', videoUrl);
    }
    
    return videoUrl;
  };

  const player = useVideoPlayer({
    uri: getVideoSource(),
    headers: {
      'User-Agent': 'KronopApp',
      'Referer': 'https://kronop.app',
      'Origin': 'https://kronop.app'
    }
  }, (playerInstance) => {
    console.log('🎮 Player instance created:', playerInstance);
    if (playerInstance) {
      playerRef.current = playerInstance;
      playerInstance.loop = true; // Loop instead of auto-advance
      isPlayerReadyRef.current = true;
      setIsVideoReady(true);

      if (isActive) {
        console.log('▶️ Playing video...');
        setTimeout(() => {
          try {
            if (playerInstance && typeof playerInstance.play === 'function') {
              playerInstance.play();
            } else {
              console.warn('⚠️ Player instance not ready or invalid');
            }
          } catch (err: any) {
            console.error('❌ Play error:', err);
          }
        }, 100);
      }
    }
  });

  // Player manages itself automatically - no manual cleanup needed

  useEffect(() => {
    if (playerRef.current && isPlayerReadyRef.current) {
      if (isActive && !isPaused) {
        try {
          playerRef.current.play();
        } catch (err: any) {
          console.error('❌ Play error in useEffect:', err);
        }
      } else if (!isActive) {
        try {
          playerRef.current.pause();
        } catch (err: any) {
          console.error('❌ Pause error in useEffect:', err);
        }
      }
    }
  }, [isActive, isPaused]);

  const handleVideoTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
      setIsPaused(prev => !prev);
    }
    lastTap.current = now;
  };

  const channelName = item.user_profiles?.username || 'Unknown User';
  const channelAvatar = item.user_profiles?.avatar_url || 'https://via.placeholder.com/100';

  return (
    <View style={styles.reelContainer} key={item.id}>
      <TouchableOpacity 
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleVideoTap}
      >
        <VideoView 
          player={player} 
          style={[
            styles.reelVideo,
            { opacity: isVideoReady ? 1 : 0 }
          ]}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
        
        {isPaused && (
          <View style={styles.pauseOverlay}>
            <MaterialIcons name="play-circle-outline" size={80} color="rgba(255,255,255,0.8)" />
          </View>
        )}
      </TouchableOpacity>

      <View pointerEvents="box-none" style={styles.leftOverlay}>
        {/* Channel Name - Above */}
        <View style={styles.channelRow}>
          <ChannelInfo
            avatarUrl={channelAvatar}
            channelName={channelName}
            onPress={() => onChannelPress?.(item)}
          />
          <SupportSection
            itemId={item.id}
            isSupported={!!supported[item.id]}
            onSupportChange={(id: string, isSupportedValue: boolean) => onSupportChange?.(id, isSupportedValue, 0)}
          />
        </View>

        {/* Song Information - Below Channel Name */}
        {item.song_name && (
          <View style={styles.songInfo}>
            <View style={styles.songRow}>
              <MaterialIcons name="music-note" size={16} color="#FFFFFF" />
              <Text style={styles.songName}>{item.song_name}</Text>
            </View>
          </View>
        )}

        {/* Main Title - Below Song */}
        <View style={styles.leftTitleRow}>
          <RunningTitle title={item.title || item.description || ''} />
        </View>
      </View>

      {/* Right Side Buttons - No Background, Save Removed */}
      <View style={styles.rightButtons}>
        <ActionButton 
          icon="weibo"
          count={likes[item.id] || item.likes_count || 0}
          onPress={() => {
            const current = likes[item.id] || item.likes_count || 0;
            const newCount = starred[item.id] ? current - 1 : current + 1;
            onLikeChange(item.id, !starred[item.id], newCount);
          }}
          color={starred[item.id] ? '#8B00FF' : '#FFFFFF'}
          iconType="AntDesign"
        />
        
        <ActionButton 
          icon="wechat-work"
          count={(comments[item.id] || []).length}
          onPress={() => onCommentPress?.(item.id)}
          iconType="AntDesign"
        />
        
        <ActionButton 
          icon="send"
          count={shares[item.id] || 0}
          onPress={() => {
            const current = shares[item.id] || 0;
            onShareChange?.(item.id, current + 1);
          }}
        />
        
        <ActionButton 
          icon="flag"
          count={0}
          onPress={() => onReportPress?.(item.id)}
          isReport={true}
        />
      </View>
    </View>
  );
}

export default function ReelsScreen() {
  const router = useRouter();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [starred, setStarred] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [supported, setSupported] = useState<Record<string, boolean>>({});
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [shares, setShares] = useState<Record<string, number>>({});
  
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  const { data: swrReels, loading: swrLoading, refresh } = useSWRContent('Reel', 1, 50);

  // Player lifecycle managed by useVideoPlayer hook - no manual intervention

  // Data loading
  useEffect(() => {
    setLoading(swrLoading);
    // Use real video data instead of API data
    const realReels: Reel[] = [
      {
        id: 'reel-1',
        user_id: 'user-1',
        title: 'Skateboarding Adventure',
        description: 'Young man skateboarding down city street',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-skateboarding-down-a-city-street-40250-large.mp4',
        thumbnail_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-skateboarding-down-a-city-street-40250-large.jpg',
        duration: 30,
        views_count: 5432,
        likes_count: 1250,
        tags: ['skateboarding', 'street', 'adventure'],
        is_public: true,
        created_at: new Date().toISOString(),
        user_profiles: {
          username: 'SkatePro',
          avatar_url: 'https://i.pravatar.cc/150?img=1'
        },
        song_name: 'Adventure Beats',
        song_artist: 'DJ SkateMaster'
      }
    ];
    setReels(realReels);
  }, [swrLoading]);

  // Simple interaction handlers
  const handleLikeChange = (itemId: string, isLiked: boolean, count: number) => {
    setStarred(prev => ({ ...prev, [itemId]: isLiked }));
    setLikes(prev => ({ ...prev, [itemId]: count }));
  };

  const handleCommentPress = (itemId: string) => {
    const reel = reels.find(r => r.id === itemId);
    if (reel) {
      setSelectedReel(reel);
      setShowCommentsModal(true);
    }
  };

  const handleShareChange = (itemId: string, count: number) => {
    setShares(prev => ({ ...prev, [itemId]: count }));
  };

  const handleSupportChange = (itemId: string, isSupported: boolean, count: number) => {
    setSupported(prev => ({ ...prev, [itemId]: isSupported }));
  };

  const handleReportPress = (itemId: string) => {
    Alert.alert('Report', 'Report submitted');
  };

  const handleSaveChange = (itemId: string, isSaved: boolean) => {
    setSaved(prev => ({ ...prev, [itemId]: isSaved }));
  };

  const handleChannelPress = (reel: Reel) => {};

  const handleViewChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const handleAddComment = async (itemId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://i.pravatar.cc/150?img=0',
      text,
      timestamp: 'Just now',
    };

    setComments(prev => ({
      ...prev,
      [itemId]: [newComment, ...(prev[itemId] || [])]
    }));

    return newComment;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useFocusEffect(
    () => {
      setIsScreenFocused(true);
      return () => setIsScreenFocused(false);
    }
  );

  const renderReel = ({ item, index }: { item: Reel; index: number }) => {
    const isActive = currentIndex === index && isScreenFocused;

    return (
      <ReelItem
        item={item}
        index={index}
        isActive={isActive}
        onChannelPress={handleChannelPress}
        onLikeChange={handleLikeChange}
        onCommentPress={handleCommentPress}
        onShareChange={handleShareChange}
        onSaveChange={handleSaveChange}
        onSupportChange={handleSupportChange}
        onReportPress={handleReportPress}
        likes={likes}
        comments={comments}
        shares={shares}
        starred={starred}
        saved={saved}
        supported={supported}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBarOverlay style="light" backgroundColor="#000000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading reels...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBarOverlay style="light" backgroundColor="#000000" />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#000',
          zIndex: 10000,
          elevation: 10000,
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={reels}
        keyExtractor={(item) => item?.id || `reel-${Math.random()}`}
        renderItem={renderReel}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        bounces={false}
        onMomentumScrollEnd={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const nextIndex = Math.max(0, Math.min(Math.round(offsetY / SCREEN_HEIGHT), reels.length - 1));
          if (nextIndex !== currentIndex) {
            handleViewChange(nextIndex);
          }
        }}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="transparent" 
            colors={['transparent']}
            progressBackgroundColor="transparent"
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <CommentSheet
        visible={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        itemId={selectedReel?.id || ''}
        itemTitle={selectedReel?.title || selectedReel?.description}
        initialComments={comments[selectedReel?.id || ''] || []}
        onAddComment={handleAddComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: '#fff',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
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
  leftOverlay: {
    position: 'absolute',
    bottom: 75,
    left: 12,
    right: 90,
    zIndex: 3,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leftTitleRow: {
    marginTop: 4,
    width: '100%',
  },
  songInfo: {
    marginTop: 2,
    marginBottom: 4,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  songName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  songArtist: {
    color: '#CCCCCC',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  rightButtons: {
    position: 'absolute',
    right: 12,
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 240,
    zIndex: 10,
  },
});
