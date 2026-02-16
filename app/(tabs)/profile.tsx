import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera, Video } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme';
import profileService from '../../services/profileService';

const { width: screenWidth } = Dimensions.get('window');

// Define user data type
interface UserData {
  displayName: string;
  username: string;
  avatar: string;
  bio: string;
  badge: string;
  supporters: number;
  supporting: number;
  posts: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('reels');
  const [tabIndicatorPosition, setTabIndicatorPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Profile states
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Content tabs
  const contentTabs = [
    { id: 'reels', label: 'Reels' },
    { id: 'video', label: 'Video' },
    { id: 'live', label: 'Live' },
    { id: 'photo', label: 'Photo' },
    { id: 'shayari', label: 'Shayari' },
    { id: 'songs', label: 'Songs' }
  ];

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get profile from service
      const profileResult = await profileService.getProfile();
      
      if (profileResult.success) {
        setUserData(profileResult.data);
      } else {
        // Use default data
        const defaultData: UserData = {
          displayName: 'John Doe',
          username: '@johndoe',
          avatar: 'https://picsum.photos/80/80?random=profile',
          bio: 'Content Creator | Photography Enthusiast | Travel Lover',
          badge: 'Photographers of Kronop',
          supporters: 15420,
          supporting: 892,
          posts: 234
        };
        setUserData(defaultData);
      }
    } catch (error) {
      console.error('Load Profile Error:', error);
      setError('Failed to load profile');
      // Fallback to default data
      const fallbackData: UserData = {
        displayName: 'John Doe',
        username: '@johndoe',
        avatar: 'https://picsum.photos/80/80?random=profile',
        bio: 'Content Creator | Photography Enthusiast | Travel Lover',
        badge: 'Photographers of Kronop',
        supporters: 15420,
        supporting: 892,
        posts: 234
      };
      setUserData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Profile sharing feature coming soon!');
  };

  const handleCameraPress = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        console.log('Photo taken:', result.assets[0].uri);
        // TODO: Update profile picture
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleVideoEditorPress = () => {
    Alert.alert('Video Editor', 'Video editor coming soon!');
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Settings coming soon!');
  };

  const handleTabPress = (tabId: string, index: number) => {
    setActiveTab(tabId);
    const tabWidth = 80;
    const indicatorPosition = 16 + (index * (tabWidth + 8));
    setTabIndicatorPosition(indicatorPosition);
    
    scrollViewRef.current?.scrollTo({ x: Math.max(0, indicatorPosition - 100), animated: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'reels':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>No reels yet</Text>
          </View>
        );
      case 'video':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>No videos yet</Text>
          </View>
        );
      case 'live':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>Not live right now</Text>
          </View>
        );
      case 'photo':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>No photos yet</Text>
          </View>
        );
      case 'shayari':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>No shayari yet</Text>
          </View>
        );
      case 'songs':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>No songs yet</Text>
          </View>
        );
      default:
        return null;
    }
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Error loading profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCameraPress}>
            <Camera size={24} color={theme.colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleVideoEditorPress}>
            <Video size={24} color={theme.colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
          <MaterialIcons name="settings" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {userData && (
          <>
            {/* User Info Section */}
            <View style={styles.userInfoSection}>
              <View style={styles.nameSection}>
                <Text style={styles.displayName}>{userData.displayName}</Text>
                <Text style={styles.username}>{userData.username}</Text>
              </View>
              <View style={styles.photoSection}>
                <View style={styles.photoContainer}>
                  <Image source={{ uri: userData.avatar }} style={styles.profilePhoto} />
                  <TouchableOpacity style={styles.addPhotoButton}>
                    <MaterialIcons name="add" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Bio and Badge */}
            <View style={styles.bioSection}>
              <Text style={styles.bio}>{userData.bio}</Text>
              <TouchableOpacity style={styles.badgeButton}>
                <Text style={styles.badgeText}>{userData.badge}</Text>
              </TouchableOpacity>
            </View>

            {/* Supporters Section */}
            <View style={styles.supportersSection}>
              <TouchableOpacity style={styles.supporterItem}>
                <Text style={styles.supporterNumber}>{userData.supporters.toLocaleString()}</Text>
                <Text style={styles.supporterLabel}>Supporters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supporterItem}>
                <Text style={styles.supporterNumber}>{userData.supporting.toLocaleString()}</Text>
                <Text style={styles.supporterLabel}>Supporting</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
                <Text style={styles.actionButtonText}>Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
                <Text style={styles.actionButtonText}>Share profile</Text>
              </TouchableOpacity>
            </View>

            {/* Content Tabs */}
            <View style={styles.tabsContainer}>
              <ScrollView 
                ref={scrollViewRef}
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScroll}
              >
                {contentTabs.map((tab, index) => (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.tab,
                      activeTab === tab.id && styles.activeTab
                    ]}
                    onPress={() => handleTabPress(tab.id, index)}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === tab.id && styles.activeTabText
                    ]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Active Tab Indicator */}
            <View style={[styles.tabIndicator, { left: tabIndicatorPosition }]} />

            {/* Content Area */}
            {renderContent()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: 12,
  },


  // Top Bar
  topBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  leftIcon: {
    padding: 8,
  },
  rightIcon: {
    padding: 8,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },

  // User Info Section
  userInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  nameSection: {
    flex: 1,
    marginRight: 20,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    fontWeight: 'normal',
  },
  photoSection: {
    alignItems: 'flex-end',
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },

  // Bio and Badge
  bioSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  bio: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
    marginBottom: 8,
  },
  badgeButton: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // Supporters Section
  supportersSection: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  supporterItem: {
    marginRight: 30,
    alignItems: 'center',
  },
  supporterNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  supporterLabel: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  // Content Tabs
  tabsContainer: {
    marginTop: 20,
    position: 'relative',
    backgroundColor: theme.colors.background.primary,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
  },
  activeTab: {
    // Active tab styling (can be empty if using indicator)
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },

  // Tab Indicator
  tabIndicator: {
    height: 2,
    backgroundColor: theme.colors.text.primary,
    width: 60,
    position: 'absolute',
    bottom: 0,
  },

  // Content Area
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
