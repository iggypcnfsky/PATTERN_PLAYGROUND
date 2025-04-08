'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
// Import Delaunay with a type assertion to handle module resolution
import { Delaunay } from 'd3-delaunay';

// Define types for p5 to avoid direct import during SSR
type P5Type = any;

interface VoronoiTessellationProps {
  parameters: {
    cellCount: number;
    borderThickness: number;
    jitter: number;
  };
  isPlaying: boolean;
}

// Use Next.js dynamic import to prevent SSR issues with p5.js
const VoronoiTessellationComponent = ({ parameters, isPlaying }: VoronoiTessellationProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<P5Type>();
  const [p5, setP5] = useState<any>(null);

  // Load p5 only on client-side
  useEffect(() => {
    import('p5').then((p5Module) => {
      setP5(p5Module.default);
    });
  }, []);

  useEffect(() => {
    if (!p5 || !sketchRef.current) return;

    const sketch = (p: P5Type) => {
      let points: number[][] = [];
      let time = 0;

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        initPoints();
      };

      function initPoints() {
        points = [];
        for (let i = 0; i < parameters.cellCount; i++) {
          points.push([p.random(p.width), p.random(p.height)]);
        }
      }

      p.draw = () => {
        if (!isPlaying) return;

        p.background(220, 20, 95);
        time += 0.01;

        // Update points with jitter
        points = points.map(([x, y]) => [
          x + p.random(-parameters.jitter, parameters.jitter),
          y + p.random(-parameters.jitter, parameters.jitter)
        ]);

        // Keep points within bounds
        points = points.map(([x, y]) => [
          p.constrain(x, 0, p.width),
          p.constrain(y, 0, p.height)
        ]);

        // Create Voronoi diagram
        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi([0, 0, p.width, p.height]);

        // Draw cells
        for (let i = 0; i < points.length; i++) {
          const cell = voronoi.cellPolygon(i);
          if (cell) {
            const hue = (i * 360 / points.length + time * 10) % 360;
            p.fill(hue, 60, 90);
            p.stroke(hue, 70, 60);
            p.strokeWeight(parameters.borderThickness);

            p.beginShape();
            cell.forEach(([x, y]) => {
              p.vertex(x, y);
            });
            p.endShape(p.CLOSE);
          }
        }
      };

      p.windowResized = () => {
        if (!sketchRef.current) return;
        const parentWidth = sketchRef.current.clientWidth;
        const parentHeight = sketchRef.current.clientHeight;
        p.resizeCanvas(parentWidth, parentHeight);
        initPoints();
      };
    };

    // Only initialize p5 on the client side
    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [p5, parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
};

// Export a dynamically loaded component to prevent SSR issues
export default dynamic(() => Promise.resolve(VoronoiTessellationComponent), {
  ssr: false
});