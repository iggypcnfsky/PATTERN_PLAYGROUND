'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Correctly import with ssr: false to prevent React hook errors
const VoronoiTessellation = dynamic(
  () => import('@/components/sketches/voronoi-tessellation'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
  }
);

export default function Home() {
  // Only render the component once we're in the browser
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
    
    return () => {
      // Cleanup function
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-4xl h-[600px]">
        {isClient ? (
          <VoronoiTessellation 
            parameters={{
              cellCount: 50,
              borderThickness: 2,
              jitter: 1
            }}
            isPlaying={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse"></div>
        )}
      </div>
    </main>
  );
}