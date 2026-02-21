import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Text, ViewToken, SafeAreaView } from 'react-native';
import { Canvas, useFont } from '@shopify/react-native-skia';

// Import Video Player
import VideoPlayer from '../../AllReels/components/VideoPlayer';

// Types
interface ReelStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

interface Creator {
  name: string;
  avatar: string;
  followers: number;
  likes: number;
  views: number;
  category: string;
}

interface Reel {
  id: number;
  videoUrl: string;
  title: string;
  creator: Creator;
  stats: ReelStats;
}

interface EngineData {
  engine: any;
  quic: any;
  bunny: any;
}

// Import AllReels components and provider
import { ReelProvider } from '../../AllReels/core/ReelContext';
import DiamondLike from '../../AllReels/components/DiamondLike/DiamondLike';
import WechatComment from '../../AllReels/components/WechatComment/WechatComment';
import PremiumShare from '../../AllReels/components/PremiumShare/PremiumShare';
import LuxurySave from '../../AllReels/components/LuxurySave/LuxurySave';
import SupportVIP from '../../AllReels/components/SupportVIP/SupportVIP';
import ChannelPro from '../../AllReels/components/ChannelPro/ChannelPro';
import RunningTitle from '../../AllReels/components/RunningTitle/RunningTitle';

// Import AllReels hooks and services
import { useReelPreload } from '../../AllReels/hooks/useReelPreload';
import { use120FPS } from '../../AllReels/hooks/use120FPS';
import BunnyEdge from '../../AllReels/services/bunnycdn/BunnyEdge';
import { initReelEngine } from '../../AllReels/index';

const { height, width } = Dimensions.get('window');

const Reels = () => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [reels, setReels] = useState<Reel[]>([]);
  const [engine, setEngine] = useState<EngineData | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Mock data for reels
  useEffect(() => {
    const mockReels = [
      {
        id: 1,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        title: 'Nature Beauty',
        creator: {
          name: 'Nature Lover',
          avatar: 'https://i.pravatar.cc/150?img=1',
          followers: 10000,
          likes: 50000,
          views: 100000,
          category: 'Nature'
        },
        stats: {
          likes: 50000,
          comments: 1200,
          shares: 800,
          views: 100000
        }
      },
      {
        id: 2,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
        title: 'Yellow Flowers',
        creator: {
          name: 'Flower Garden',
          avatar: 'https://i.pravatar.cc/150?img=2',
          followers: 15000,
          likes: 75000,
          views: 150000,
          category: 'Nature'
        },
        stats: {
          likes: 75000,
          comments: 2000,
          shares: 1200,
          views: 150000
        }
      },
      {
        id: 3,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
        title: 'Garden Paradise',
        creator: {
          name: 'Garden Expert',
          avatar: 'https://i.pravatar.cc/150?img=3',
          followers: 20000,
          likes: 100000,
          views: 200000,
          category: 'Nature'
        },
        stats: {
          likes: 100000,
          comments: 3000,
          shares: 2000,
          views: 200000
        }
      }
    ];
    setReels(mockReels);
  }, []);

  // Initialize AllReels engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        const engineData = await initReelEngine();
        setEngine(engineData);
        console.log('AllReels engine initialized:', engineData);
      } catch (error) {
        console.error('Failed to initialize AllReels engine:', error);
      }
    };
    initializeEngine();
  }, []);

  // Use AllReels hooks
  useReelPreload(reels[currentReelIndex]?.id, reels);
  
  use120FPS((time: number) => {
    // 120fps animation callback
    // Can be used for smooth animations
  });

  const handleLike = () => {
    console.log('Liked reel:', reels[currentReelIndex]?.id);
  };

  const handleShare = (result: any) => {
    console.log('Shared reel:', result);
  };

  const handleSave = (data: any) => {
    console.log('Saved reel:', data);
  };

  const handleSupport = (data: any) => {
    console.log('Supported creator:', data);
  };

  const renderReel = ({ item, index }: { item: Reel; index: number }) => {
    const isActive = index === currentReelIndex;
    
    return (
      <View style={[styles.reelContainer, { height }]}>
        {/* Actual Video Player */}
        <VideoPlayer 
          videoUrl={item.videoUrl} 
          isActive={isActive}
          onEnd={() => {
            // Auto-advance to next video
            if (index < reels.length - 1) {
              flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
            } else {
              // Loop back to first video
              flatListRef.current?.scrollToIndex({ index: 0, animated: true });
            }
          }}
        />
        
        {/* Overlay components */}
        <View style={styles.overlay}>
          {/* Running Title */}
          <RunningTitle title={item.title} speed={30} />
          
          {/* Channel Pro Component */}
          <ChannelPro channel={item.creator} />
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <DiamondLike onPress={handleLike} />
            <WechatComment streamId={item.id} />
            <PremiumShare reelData={item} onShare={handleShare} />
            <LuxurySave onSave={handleSave} />
            <SupportVIP creatorName={item.creator.name} onSupport={handleSupport} />
          </View>
          
          {/* Stats Overlay */}
          <View style={styles.statsOverlay}>
            <Text style={styles.statText}>❤️ {item.stats.likes.toLocaleString()}</Text>
            <Text style={styles.statText}>💬 {item.stats.comments}</Text>
            <Text style={styles.statText}>🔄 {item.stats.shares}</Text>
            <Text style={styles.statText}>👁️ {item.stats.views.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = ({ viewableItems, changed }: { viewableItems: ViewToken<any>[]; changed: ViewToken<any>[] }) => {
    changed.forEach(({ item, index, isViewable }) => {
      if (isViewable && index !== null) {
        setCurrentReelIndex(index);
        // Preload next reels via BunnyEdge
        if (engine) {
          BunnyEdge.prefetchNext(reels.slice(index + 1));
        }
      }
    });
  };

  return (
    <ReelProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={reels}
          renderItem={renderReel}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 300,
          }}
          decelerationRate="fast"
          snapToInterval={height}
          snapToAlignment="center"
        />
      </SafeAreaView>
    </ReelProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 0,
    paddingBottom: 50,
  },
  reelContainer: {
    width,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  creatorName: {
    color: '#aaa',
    fontSize: 16,
  },
  actionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    alignItems: 'center',
    gap: 20,
  },
  statsOverlay: {
    position: 'absolute',
    left: 20,
    bottom: 100,
    alignItems: 'flex-start',
    gap: 10,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Reels;