import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { useRouter } from 'expo-router';

interface WalletData {
  address: string;
  connected: boolean;
  balance?: string;
  nonce?: string;
}

const WalletConnect: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessage, isPending: isSignPending } = useSignMessage();
  
  const [walletData, setWalletData] = useState<WalletData>({
    address: '',
    connected: false,
  });
  const [nonce, setNonce] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Update wallet data when account changes
  useEffect(() => {
    if (address && isConnected) {
      setWalletData({
        address: address,
        connected: true,
      });
    } else {
      setWalletData({
        address: '',
        connected: false,
      });
    }
  }, [address, isConnected]);

  // Get nonce from backend
  const getNonce = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/auth/nonce?address=${walletAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to get nonce');
      }
      
      const data = await response.json();
      setNonce(data.nonce);
      return { nonce: data.nonce, message: data.message };
    } catch (error) {
      console.error('Nonce error:', error);
      Alert.alert('Error', 'Failed to get nonce from server');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign message with nonce
  const signMessageWithNonce = async () => {
    if (!address) return;
    
    try {
      const nonceData = await getNonce(address);
      if (!nonceData) return;

      const signature = await signMessage({ message: nonceData.message });
      
      if (signature) {
        // Verify signature with backend
        await verifySignature(address, signature, nonceData.nonce);
      }
    } catch (error) {
      console.error('Sign error:', error);
      Alert.alert('Error', 'Failed to sign message');
    }
  };

  // Verify signature with backend
  const verifySignature = async (walletAddress: string, signature: string, nonceValue: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletAddress,
          signature: signature,
          nonce: nonceValue,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        Alert.alert(
          '✅ Wallet Connected!',
          `Your wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} has been verified.`,
          [
            {
              text: 'View Banking',
              onPress: () => router.push('/(tabs)/databas'),
            },
            { text: 'OK' }
          ]
        );
        
        // Store token securely (in real app, use secure storage)
        console.log('JWT Token:', data.token);
      } else {
        Alert.alert('❌ Verification Failed', data.error || 'Invalid signature');
      }
    } catch (error) {
      console.error('Verify error:', error);
      Alert.alert('Error', 'Failed to verify signature');
    } finally {
      setIsLoading(false);
    }
  };

  // Connect wallet
  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    disconnect();
    setNonce('');
    setWalletData({ address: '', connected: false });
  };

  // Copy address to clipboard
  const copyAddress = () => {
    // In real app, use Clipboard API
    Alert.alert('Address Copied', walletData.address);
  };

  if (walletData.connected) {
    return (
      <View style={styles.container}>
        <View style={styles.connectedCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusText}>Connected</Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <TouchableOpacity onPress={copyAddress} style={styles.addressRow}>
              <Text style={styles.addressText}>
                {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
              </Text>
              <Text style={styles.copyText}>📋</Text>
            </TouchableOpacity>
          </View>

          {!nonce ? (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={signMessageWithNonce}
              disabled={isSignPending || isLoading}
            >
              {isSignPending || isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>🔐 Verify Wallet</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.verifiedContainer}>
              <Text style={styles.verifiedText}>✅ Wallet Verified</Text>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={() => router.push('/(tabs)/databas')}
              >
                <Text style={styles.buttonText}>🏦 Open Banking</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]} 
            onPress={handleDisconnect}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔗 Connect Your Wallet</Text>
        <Text style={styles.subtitle}>
          Connect your Ethereum wallet to access secure banking services
        </Text>

        <View style={styles.walletList}>
          {connectors.map((connector) => (
            <TouchableOpacity
              key={connector.id}
              style={[
                styles.walletButton,
                isPending && connector.id === connectors[0]?.id && styles.disabledButton
              ]}
              onPress={() => handleConnect(connector)}
              disabled={isPending}
            >
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>
                  {connector.name === 'Injected' ? 'Browser Wallet' : connector.name}
                </Text>
                <Text style={styles.walletDesc}>
                  {connector.name === 'MetaMask' && 'Most popular wallet'}
                  {connector.name === 'WalletConnect' && 'Connect any wallet'}
                  {connector.name === 'Injected' && 'Browser extension wallet'}
                </Text>
              </View>
              {isPending && connector.id === connectors[0]?.id ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <Text style={styles.connectArrow}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.securityNotice}>
          <Text style={styles.securityTitle}>🔒 Security Notice</Text>
          <Text style={styles.securityText}>
            • Your wallet will be securely verified using cryptographic signatures
            • No gas fees required for wallet connection
            • Your private keys never leave your device
            • All transactions require your explicit approval
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  connectedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  walletList: {
    marginBottom: 24,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  disabledButton: {
    opacity: 0.6,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  walletDesc: {
    fontSize: 14,
    color: '#666',
  },
  connectArrow: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  securityNotice: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addressContainer: {
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#1a1a1a',
  },
  copyText: {
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedContainer: {
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 16,
  },
});

export default WalletConnect;
