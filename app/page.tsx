'use client';

import dynamic from 'next/dynamic';

// Dynamically import the VoronoiTessellation component with SSR disabled
const VoronoiTessellation = dynamic(() => import('@/components/sketches/voronoi-tessellation'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />
});

export default function Home() {
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