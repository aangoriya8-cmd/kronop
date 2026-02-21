export default {
  // BunnyCDN Edge Configuration
  edge: {
    primary: 'https://kronop.b-cdn.net',
    fallback: 'https://kronop.fallback.b-cdn.net',
    zone: 'kronop-reels',
    pullZone: 123456,
  },
  
  // Streaming Optimization
  streaming: {
    protocol: 'quic',
    bufferSize: 1024 * 1024 * 5, // 5MB buffer
    preloadCount: 3,
    maxBitrate: 8000, // 8Mbps
    adaptiveBitrate: true,
    segmentSize: 2, // 2 seconds
  },
  
  // Cache Strategy
  cache: {
    memory: 1024 * 1024 * 100, // 100MB memory cache
    disk: 1024 * 1024 * 1024, // 1GB disk cache
    ttl: 3600, // 1 hour
    warmup: true,
    predictive: true,
  },
  
  // Performance Tuning
  performance: {
    parallelConnections: 6,
    connectionTimeout: 100,
    retryAttempts: 2,
    dnsPrefetch: true,
    http3: true,
  },
};
