import React from 'react';
import LivePlayer from './liveLayout';

// Mock data for testing
const mockStream = {
  id: '1',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  title: 'Amazing Live Stream',
  creatorName: 'Test Channel',
  views: 12345,
  likes: 987,
  music: 'Original Audio',
  viewers: '12345'
};

export default function App() {
  const [isStarred, setIsStarred] = React.useState(false);
  const [starsCount, setStarsCount] = React.useState(0);

  const handleStarPress = () => {
    setIsStarred(prev => !prev);
    setStarsCount(prev => isStarred ? prev - 1 : prev + 1);
  };

  const handleSharePress = () => {
    console.log('Share pressed');
  };

  const handleCommentPress = () => {
    console.log('Comment pressed');
  };

  return (
    <LivePlayer 
      videoUrl={mockStream.videoUrl}
      streamTitle={mockStream.title}
      creatorName={mockStream.creatorName}
      creatorId={mockStream.id}
      viewers={mockStream.viewers}
      isActive={true}
      isStarred={isStarred}
      starsCount={starsCount}
      onStarPress={handleStarPress}
      onSharePress={handleSharePress}
      onCommentPress={handleCommentPress}
    />
  );
}
