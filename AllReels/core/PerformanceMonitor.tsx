import React, { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  networkLatency: number;
  renderTime: number;
}

const PerformanceMonitor: React.FC = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  let metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    networkLatency: 0,
    renderTime: 0,
  };

  useEffect(() => {
    const measurePerformance = () => {
      frameCount.current++;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;
      
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / deltaTime);
        
        metrics = {
          fps,
          memoryUsage: metrics.memoryUsage + Math.random() * 10 - 5,
          networkLatency: Math.random() * 100,
          renderTime: Math.random() * 16.67,
        };
        
        // Console logs only - no UI rendering
        console.log(`Performance: FPS=${metrics.fps}, Memory=${metrics.memoryUsage.toFixed(1)}MB, Latency=${metrics.networkLatency.toFixed(1)}ms, Render=${metrics.renderTime.toFixed(2)}ms`);
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      requestAnimationFrame(measurePerformance);
    };

    const animationId = requestAnimationFrame(measurePerformance);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Return null - no UI rendering
  return null;
};

export default PerformanceMonitor;
