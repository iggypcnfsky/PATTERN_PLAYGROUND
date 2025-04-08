'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the VoronoiTessellation component with proper SSR disabled
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
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-4xl h-[600px] bg-gray-100 animate-pulse"></div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-4xl h-[600px]">
        <VoronoiTessellation 
          parameters={{
            cellCount: 50,
            borderThickness: 2,
            jitter: 1
          }}
          isPlaying={true}
        />
      </div>
    </main>
  );
}