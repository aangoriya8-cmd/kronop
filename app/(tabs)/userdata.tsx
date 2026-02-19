import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { reelsApi , videosApi , photosApi , liveApi , storiesApi } from '../../services/api';

// Shayari Photos API
const shayariPhotosApi = {
  getShayariPhotos: async () => {
    try {
      const response = await fetch(`${process.env.KOYEB_API_URL || process.env.EXPO_PUBLIC_API_URL}/content/shayari-photos`);
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      return { data: [] };
    }
  }
};

interface ContentStats {
  total: number;
  stars: number;
  comments: number;
  shares: number;
  views: number;
}

interface TotalData {
  totalContent: number;
  totalStars: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
}

interface SectionData {
  name: string;
  icon: string;
  stats: ContentStats;
  expanded: boolean;
}

export default function UserDataScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [totalData, setTotalData] = useState<TotalData>({
    totalContent: 0,
    totalStars: 0,
    totalComments: 0,
    totalShares: 0,
    totalViews: 0,
  });
  
  const [sections, setSections] = useState<SectionData[]>([
    { name: 'Video Tool', icon: 'videocam', stats: { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }, expanded: false },
    { name: 'Reels Tool', icon: 'movie', stats: { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }, expanded: false },
    { name: 'Photo Tool', icon: 'photo', stats: { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }, expanded: false },
    { name: 'Story Tool', icon: 'auto-stories', stats: { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }, expanded: false },
    { name: 'Live Tool', icon: 'live-tv', stats: { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }, expanded: false },
    { name: 'Song Tool', icon: 'music-note', stats: { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }, expanded: false },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [reelsData, videosData, photosData, liveData, storiesData, shayariPhotosData] = await Promise.all([
        reelsApi.getReels().catch(() => ({ data: [] })),
        videosApi.getVideos().catch(() => ({ data: [] })),
        photosApi.getPhotos().catch(() => ({ data: [] })),
        liveApi.getLive().catch(() => ({ data: [] })),
        storiesApi.getStories().catch(() => ({ data: [] })),
        shayariPhotosApi.getShayariPhotos().catch(() => ({ data: [] })),
      ]);

      const calculateStats = (data: any[]): ContentStats => {
        return data.reduce(
          (acc, item) => {
            acc.total += 1;
            acc.stars += item.stars || 0;
            acc.comments += item.comments || 0;
            acc.shares += item.shares || 0;
            acc.views += item.views || 0;
            return acc;
          },
          { total: 0, stars: 0, comments: 0, shares: 0, views: 0 }
        );
      };

      const allStats = [
        calculateStats(Array.isArray(videosData) ? videosData : []),
        calculateStats(Array.isArray(reelsData) ? reelsData : []),
        calculateStats(Array.isArray(photosData) ? photosData : []),
        calculateStats(Array.isArray(storiesData) ? storiesData : []),
        calculateStats(Array.isArray(liveData) ? liveData : []),
        calculateStats(Array.isArray(shayariPhotosData) ? shayariPhotosData : []),
      ];

      const newSections = sections.map((section, index) => ({
        ...section,
        stats: allStats[index]
      }));
      
      setSections(newSections);

      const total = newSections.reduce(
        (acc, section) => {
          acc.totalContent += section.stats.total;
          acc.totalStars += section.stats.stars;
          acc.totalComments += section.stats.comments;
          acc.totalShares += section.stats.shares;
          acc.totalViews += section.stats.views;
          return acc;
        },
        { totalContent: 0, totalStars: 0, totalComments: 0, totalShares: 0, totalViews: 0 }
      );

      setTotalData(total);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (index: number) => {
    const newSections = [...sections];
    newSections[index].expanded = !newSections[index].expanded;
    setSections(newSections);
  };

  const handleAddBankAccount = () => {
    Alert.alert(
      "Add Bank Account",
      "This feature will be available soon!",
      [{ text: "OK" }]
    );
  };

  const handleYourEarning = () => {
    Alert.alert(
      "Your Earning",
      `Total Stars: ${totalData.totalStars}\nTotal Comments: ${totalData.totalComments}\nTotal Shares: ${totalData.totalShares}\nTotal Views: ${totalData.totalViews}`,
      [{ text: "OK" }]
    );
  };

  // Calculate rank based on total stars (example)
  const getRank = () => {
    const total = totalData.totalStars;
    if (total > 10000) return "Diamond";
    if (total > 5000) return "Platinum";
    if (total > 1000) return "Gold";
    if (total > 500) return "Silver";
    if (total > 100) return "Bronze";
    return "Beginner";
  };

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
        }
      >

        {/* Your Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="stars" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Your Rank</Text>
          </View>
          
          <View style={styles.rankContainer}>
            <View style={styles.rankBadge}>
              <Ionicons name="trophy" size={32} color="#FFD700" />
              <Text style={styles.rankText}>{getRank()}</Text>
            </View>
            
            <View style={styles.rankStats}>
              <View style={styles.rankStatItem}>
                <Text style={styles.rankStatLabel}>Total Stars</Text>
                <Text style={styles.rankStatValue}>{totalData.totalStars.toLocaleString()}</Text>
              </View>
              <View style={styles.rankStatItem}>
                <Text style={styles.rankStatLabel}>Content Count</Text>
                <Text style={styles.rankStatValue}>{totalData.totalContent}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Database Sections */}
        <View style={styles.databaseContainer}>
          <View style={styles.databaseHeader}>
            <MaterialIcons name="storage" size={20} color="#2196F3" />
            <Text style={styles.databaseTitle}>Database</Text>
          </View>
          
          {sections.map((section, index) => (
            <View key={index} style={styles.databaseCard}>
              <TouchableOpacity 
                style={styles.databaseRow} 
                onPress={() => toggleSection(index)}
                activeOpacity={0.7}
              >
                <View style={styles.databaseLeft}>
                  <MaterialIcons name={section.icon as any} size={20} color="#2196F3" />
                  <Text style={styles.databaseName}>{section.name}</Text>
                  <Text style={styles.databaseCount}>({section.stats.total})</Text>
                </View>
                
                <MaterialIcons 
                  name={section.expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>

              {section.expanded && (
                <View style={styles.databaseDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>{section.stats.stars.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <MaterialIcons name="comment" size={16} color="#4CAF50" />
                      <Text style={styles.detailText}>{section.stats.comments.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <MaterialIcons name="share" size={16} color="#2196F3" />
                      <Text style={styles.detailText}>{section.stats.shares.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <MaterialIcons name="visibility" size={16} color="#FF9800" />
                      <Text style={styles.detailText}>{section.stats.views.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Two Buttons - Bank Account and Your Earning */}
        <View style={styles.buttonsContainer}>
          {/* Add Bank Account Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleAddBankAccount}>
            <MaterialIcons name="account-balance" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Add Bank Account</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Your Earning Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleYourEarning}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Your Earning</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  rankCard: {
    backgroundColor: '#0A0A0A',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    alignItems: 'center',
    marginRight: 20,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginTop: 4,
  },
  rankStats: {
    flex: 1,
  },
  rankStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rankStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  rankStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  databaseContainer: {
    margin: 12,
  },
  databaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  databaseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
    marginLeft: 6,
  },
  databaseCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginBottom: 8,
  },
  databaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  databaseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  databaseName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 10,
  },
  databaseCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  databaseDetails: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 4,
    width: '48%',
  },
  detailText: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 4,
  },
  buttonsContainer: {
    margin: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
});