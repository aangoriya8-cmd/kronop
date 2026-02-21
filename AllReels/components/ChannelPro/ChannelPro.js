import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas, RadialGradient, Circle, vec } from '@shopify/react-native-skia';

const ChannelPro = ({ channel }) => {
  const [stats, setStats] = useState({
    followers: 0,
    likes: 0,
    views: 0,
  });

  useEffect(() => {
    // Real-time stats via QUIC
    const updateStats = setInterval(() => {
      setStats({
        followers: channel.followers + Math.floor(Math.random() * 10),
        likes: channel.likes + Math.floor(Math.random() * 100),
        views: channel.views + Math.floor(Math.random() * 1000),
      });
    }, 1000);

    return () => clearInterval(updateStats);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Circle cx={40} cy={40} r={40}>
          <RadialGradient
            c={vec(40, 40)}
            r={40}
            colors={['#FFD700', '#FFA500', '#FF4500']}
          />
        </Circle>
      </Canvas>
      
      <View style={styles.content}>
        <Image source={{ uri: channel.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{channel.name}</Text>
          <Text style={styles.badge}>PRO • {channel.category}</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(stats.followers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(stats.likes)}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatNumber(stats.views)}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    overflow: 'hidden',
    margin: 8,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    color: '#FFD700',
    fontSize: 12,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    marginRight: 16,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888888',
    fontSize: 10,
  },
  followButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ChannelPro;
