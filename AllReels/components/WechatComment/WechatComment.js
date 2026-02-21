import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, Animated, Text } from 'react-native';
import { Canvas, Text as SkiaText, useFont } from '@shopify/react-native-skia';

const WechatComment = ({ streamId }) => {
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Mock QUIC client without hook dependency
  const mockQuicClient = {
    send: async (path, data) => {
      console.log(`Mock QUIC send to ${path}:`, data);
      await new Promise(resolve => setTimeout(resolve, 0.001));
      return { success: true, data: 'ack' };
    }
  };
  
  // WeChat-style floating comments
  const CommentFloater = ({ comment }) => {
    const left = useRef(new Animated.Value(400)).current;
    
    useEffect(() => {
      Animated.timing(left, {
        toValue: -200,
        duration: 5000,
        useNativeDriver: true,
      }).start(() => {
        setComments(prev => prev.filter(c => c.id !== comment.id));
      });
    }, []);

    return (
      <Animated.View style={[styles.floatingComment, { transform: [{ translateX: left }] }]}>
        <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
        <View style={styles.commentBubble}>
          <Text style={styles.commentUsername}>{comment.username}</Text>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
      </Animated.View>
    );
  };

  const sendComment = async () => {
    if (!inputText.trim()) return;

    // Binary protocol via QUIC (0.001ms)
    const commentData = {
      id: Date.now(),
      streamId,
      text: inputText,
      timestamp: Date.now(),
    };

    // Send via QUIC protocol
    if (mockQuicClient) {
      await mockQuicClient.send('/comment', commentData);
    }

    const newComment = {
      id: Date.now(),
      username: 'You',
      avatar: 'https://i.pravatar.cc/150?img=8',
      text: inputText,
    };

    setComments(prev => [newComment, ...prev]);
    setInputText('');
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Floating comments layer */}
      <View style={styles.floatingLayer}>
        {comments.map(comment => (
          <CommentFloater key={comment.id} comment={comment} />
        ))}
      </View>

      {/* Modern WeChat-style input */}
      <View style={styles.inputContainer}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=8' }} 
          style={styles.inputAvatar}
        />
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendComment}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80, // Reduced from 140
  },
  floatingLayer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 150, // Increased bottom margin
    overflow: 'hidden',
  },
  floatingComment: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  commentUsername: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  commentText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 80, // Back to 80
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default WechatComment;
