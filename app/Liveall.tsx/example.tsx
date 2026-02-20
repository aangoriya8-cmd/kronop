import React from 'react';
import Liveall from './index';

// Example usage of Liveall component
const ExampleUsage = () => {
  const mockStreams = [
    {
      id: '1',
      videoUrl: 'https://example.com/stream1.mp4',
      title: 'Amazing Live Stream 1',
      creatorName: 'John Doe',
      viewers: '1.2K',
      views: 5000,
      likes: 120,
      music: 'Popular Song - Artist',
      user: {
        username: 'johndoe'
      },
      isLive: true
    },
    {
      id: '2', 
      videoUrl: 'https://example.com/stream2.mp4',
      title: 'Another Cool Stream',
      creatorName: 'Jane Smith',
      viewers: '800',
      views: 3000,
      likes: 89,
      music: 'Background Music',
      user: {
        username: 'janesmith'
      },
      isLive: true
    },
    {
      id: '3',
      videoUrl: 'https://example.com/stream3.mp4', 
      title: 'Third Live Stream',
      creatorName: 'Bob Wilson',
      viewers: '2.5K',
      views: 8000,
      likes: 250,
      music: 'Original Audio',
      user: {
        username: 'bobwilson'
      },
      isLive: true
    }
  ];

  const handleIndexChange = (index: number) => {
    console.log('Stream changed to index:', index);
  };

  const handleVideoEnd = () => {
    console.log('Video ended');
  };

  return (
    <Liveall 
      streams={mockStreams}
      initialIndex={0}
      onIndexChange={handleIndexChange}
      onVideoEnd={handleVideoEnd}
    />
  );
};

export default ExampleUsage;
