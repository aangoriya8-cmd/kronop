import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { Home, Sparkles, Youtube, User } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.colors.primary.main,
          tabBarInactiveTintColor: theme.colors.text.tertiary,
          animation: 'none',
          sceneStyle: { backgroundColor: '#000000' },
          tabBarStyle: {
            backgroundColor: theme.colors.background.primary,
            borderTopColor: theme.colors.border.primary,
            borderTopWidth: 1,
            height: Platform.select({
              ios: insets.bottom + 50,
              android: insets.bottom + 50,
              default: 56,
            }),
            paddingTop: 6,
            paddingBottom: Platform.select({
              ios: insets.bottom + 6,
              android: insets.bottom + 6,
              default: 6,
            }),
            paddingHorizontal: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: 'Reels',
            tabBarIcon: ({ color }) => <Sparkles size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="video"
          options={{
            title: 'Video',
            tabBarIcon: ({ color }) => <Youtube size={24} color={color} strokeWidth={1.5} />,
          }}
        />
        {/* --- 1. LIVE SECTION --- */}
        <Tabs.Screen
          name="live"
          options={{
            title: 'Live',
            tabBarIcon: ({ color }) => <Ionicons name="radio" size={26} color={color} />,
          }}
        />
        {/* --- 2. DATABASE SECTION - MOVED BETWEEN LIVE AND PROFILE --- */}
        <Tabs.Screen
          name="databas"
          options={{
            title: 'Database',
            tabBarIcon: ({ color }) => <Ionicons name="server-outline" size={24} color={color} />,
          }}
        />
        {/* --- 3. PROFILE SECTION --- */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}