'use client';

import { useEffect, useRef, useState } from 'react';
// Import Delaunay with a type assertion to handle module resolution
import { Delaunay, Point } from 'd3-delaunay';

// Define types for p5 to avoid direct import during SSR
type P5 = any;

interface VoronoiTessellationProps {
  parameters: {
    cellCount: number;
    borderThickness: number;
    jitter: number;
  };
  isPlaying: boolean;
}

const VoronoiTessellation = ({ parameters, isPlaying }: VoronoiTessellationProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<P5 | null>(null);
  const [p5Module, setP5Module] = useState<any>(null);

  // Load p5 only on client-side
  useEffect(() => {
    // Only import p5 if we're in the browser
    if (typeof window !== 'undefined') {
      import('p5').then((mod) => {
        setP5Module(mod.default);
      });
    }
    
    // Cleanup function
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []);

  // Initialize sketch after p5 is loaded
  useEffect(() => {
    // Only proceed if we have p5 and a container element
    if (!p5Module || !sketchRef.current) return;

    const sketch = (p: P5) => {
      // Use tuple type to match Point interface requirements
      let points: Array<[number, number]> = [];
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
        ] as [number, number]);

        // Keep points within bounds
        points = points.map(([x, y]) => [
          p.constrain(x, 0, p.width),
          p.constrain(y, 0, p.height)
        ] as [number, number]);

        // Create Voronoi diagram with properly typed points
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

    // Initialize p5 instance
    p5Instance.current = new p5Module(sketch, sketchRef.current);

    // Clean up function
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [p5Module, parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
};

export default VoronoiTessellation;