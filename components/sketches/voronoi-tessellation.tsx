'use client';

import { useEffect, useRef, useState } from 'react';
// Import Delaunay with a type assertion to handle module resolution
import { Delaunay, Point } from 'd3-delaunay';

// Define types for p5 to avoid direct import during SSR
type P5 = any;
type P5Constructor = any;

interface VoronoiTessellationProps {
  parameters: {
    cellCount: number;
    borderThickness: number;
    jitter: number;
  };
  isPlaying: boolean;
}

// Using function declaration instead of arrow function to avoid potential class/function confusion
function VoronoiTessellation({ parameters, isPlaying }: VoronoiTessellationProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<P5 | null>(null);
  // Use a more general type for the p5 module
  const [p5Module, setP5Module] = useState<P5Constructor | null>(null);

  // Load p5 only on client-side
  useEffect(() => {
    let isMounted = true;
    
    // Only import p5 if we're in the browser
    if (typeof window !== 'undefined') {
      // Use a safe dynamic import pattern
      import('p5').then((mod) => {
        // Only update state if component is still mounted
        if (isMounted) {
          // Handle different module formats (ESM vs CommonJS)
          const p5Constructor = typeof mod.default === 'function' ? mod.default : mod;
          setP5Module(p5Constructor);
        }
      }).catch(error => {
        console.error("Failed to load p5:", error);
      });
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (p5Instance.current) {
        try {
          p5Instance.current.remove();
        } catch (e) {
          console.error("Error removing p5 instance:", e);
        }
      }
    };
  }, []);

  // Initialize sketch after p5 is loaded
  useEffect(() => {
    // Only proceed if we have p5 and a container element
    if (!p5Module || !sketchRef.current) return;

    let isSketchActive = true;

    try {
      const sketch = (p: P5) => {
        // Use tuple type to match Point interface requirements
        let points: Array<[number, number]> = [];
        let time = 0;

        p.setup = () => {
          try {
            const parentWidth = sketchRef.current?.clientWidth || 800;
            const parentHeight = sketchRef.current?.clientHeight || 800;
            p.createCanvas(parentWidth, parentHeight);
            p.colorMode(p.HSB, 360, 100, 100, 1);
            initPoints();
          } catch (e) {
            console.error("Error in p5 setup:", e);
          }
        };

        function initPoints() {
          points = [];
          for (let i = 0; i < parameters.cellCount; i++) {
            points.push([p.random(p.width), p.random(p.height)]);
          }
        }

        p.draw = () => {
          if (!isPlaying || !isSketchActive) return;

          try {
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
          } catch (e) {
            console.error("Error in p5 draw:", e);
          }
        };

        p.windowResized = () => {
          if (!sketchRef.current || !isSketchActive) return;
          try {
            const parentWidth = sketchRef.current.clientWidth;
            const parentHeight = sketchRef.current.clientHeight;
            p.resizeCanvas(parentWidth, parentHeight);
            initPoints();
          } catch (e) {
            console.error("Error in p5 windowResized:", e);
          }
        };
      };

      // Ensure p5Module is a constructor function
      if (typeof p5Module !== 'function') {
        throw new Error("p5 module is not a constructor function");
      }

      // Use Function.prototype.bind to ensure 'this' context is preserved
      const BoundP5Constructor = p5Module.bind({});
      
      // Initialize p5 instance using the bound constructor
      p5Instance.current = new BoundP5Constructor(sketch, sketchRef.current);

    } catch (e) {
      console.error("Error initializing p5:", e);
    }

    // Clean up function
    return () => {
      isSketchActive = false;
      if (p5Instance.current) {
        try {
          p5Instance.current.remove();
          p5Instance.current = null;
        } catch (e) {
          console.error("Error cleaning up p5:", e);
        }
      }
    };
  }, [p5Module, parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
}

// Explicitly mark as default export
export default VoronoiTessellation;