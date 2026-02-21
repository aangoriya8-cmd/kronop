import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { Ionicons } from '@expo/vector-icons';

const SupportVIP = ({ creatorName, onSupport }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const scale = useRef(new Animated.Value(1)).current;

  const vipTiers = [
    { id: 1, name: 'Bronze', price: 100, color: '#CD7F32', perks: ['Badge', 'Emotes'] },
    { id: 2, name: 'Silver', price: 500, color: '#C0C0C0', perks: ['Badge', 'Emotes', 'Priority'] },
    { id: 3, name: 'Gold', price: 1000, color: '#FFD700', perks: ['Badge', 'Emotes', 'Priority', 'Exclusive'] },
    { id: 4, name: 'Platinum', price: 5000, color: '#E5E4E2', perks: ['All perks', 'Mod', 'VIP chat'] },
  ];

  const handlePress = () => {
    Animated.spring(scale, {
      toValue: 1.2,
      speed: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scale, {
        toValue: 1,
        speed: 100,
        useNativeDriver: true,
      }).start();
      setModalVisible(true);
    });
  };

  const handleSupport = (tier) => {
    setSelectedTier(tier);
    onSupport?.({ tier, creator: creatorName });
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Canvas style={{ width: 60, height: 60 }}>
            <Rect x={10} y={10} width={40} height={40}>
              <LinearGradient
                start={vec(10, 10)}
                end={vec(50, 50)}
                colors={['#FFD700', '#FFA500', '#FF6347']}
              />
            </Rect>
          </Canvas>
        </Animated.View>
        <Text style={styles.vipText}>VIP</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Support {creatorName}</Text>
            <Text style={styles.modalSubtitle}>Choose your VIP tier</Text>
            
            {vipTiers.map(tier => (
              <TouchableOpacity
                key={tier.id}
                style={[styles.tierCard, { borderColor: tier.color }]}
                onPress={() => handleSupport(tier)}
              >
                <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
                  <Text style={styles.tierName}>{tier.name}</Text>
                </View>
                <View style={styles.tierInfo}>
                  {tier.perks.map((perk, i) => (
                    <Text key={i} style={styles.perkText}>✓ {perk}</Text>
                  ))}
                </View>
                <Text style={styles.tierPrice}>₹{tier.price}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  vipText: {
    color: '#FFD700',
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  tierName: {
    color: '#000000',
    fontWeight: 'bold',
  },
  tierInfo: {
    flex: 1,
  },
  perkText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  tierPrice: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  closeText: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SupportVIP;
