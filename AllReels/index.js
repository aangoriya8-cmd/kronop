import React, { lazy, Suspense } from 'react';
import { View } from 'react-native';
import { ReelProvider } from './core/ReelContext';
import PerformanceMonitor from './core/PerformanceMonitor';

// Ultra-fast lazy loading with prefetch
const DiamondLike = lazy(() => import('./components/DiamondLike/DiamondLike'));
const WechatComment = lazy(() => import('./components/WechatComment/WechatComment'));
const PremiumShare = lazy(() => import('./components/PremiumShare/PremiumShare'));
const LuxurySave = lazy(() => import('./components/LuxurySave/LuxurySave'));
const SupportVIP = lazy(() => import('./components/SupportVIP/SupportVIP'));
const ChannelPro = lazy(() => import('./components/ChannelPro/ChannelPro'));
const RunningTitle = lazy(() => import('./components/RunningTitle/RunningTitle'));

export {
  DiamondLike,
  WechatComment,
  PremiumShare,
  LuxurySave,
  SupportVIP,
  ChannelPro,
  RunningTitle,
  ReelProvider,
  PerformanceMonitor
};

export const initReelEngine = async () => {
  // Initialize WASM bridge instead of direct Zig import
  const { wasmBridge } = await import('./core/wasm_bridge');
  await wasmBridge.initialize();
  
  // Initialize QUIC protocol
  const quic = await import('./services/quic/QUICClient');
  
  // Initialize BunnyCDN
  const bunny = await import('./services/bunnycdn/BunnyEdge');
  
  return { 
    engine: wasmBridge, 
    quic: quic.default, 
    bunny: bunny.default 
  };
};
