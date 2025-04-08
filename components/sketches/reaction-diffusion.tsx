'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface ReactionDiffusionProps {
  parameters: {
    feed: number;
    kill: number;
    diffusionA: number;
    diffusionB: number;
  };
  isPlaying: boolean;
}

export default function ReactionDiffusion({ parameters, isPlaying }: ReactionDiffusionProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let grid: { a: number; b: number }[][] = [];
      let next: { a: number; b: number }[][] = [];
      const dA = parameters.diffusionA;
      const dB = parameters.diffusionB;
      const f = parameters.feed;
      const k = parameters.kill;

      function init() {
        const cols = Math.floor(p.width / 4);
        const rows = Math.floor(p.height / 4);

        for (let i = 0; i < cols; i++) {
          grid[i] = [];
          next[i] = [];
          for (let j = 0; j < rows; j++) {
            grid[i][j] = { a: 1, b: 0 };
            next[i][j] = { a: 1, b: 0 };
          }
        }

        // Add random B spots
        for (let i = 0; i < 5; i++) {
          const x = Math.floor(p.random(cols));
          const y = Math.floor(p.random(rows));
          grid[x][y].b = 1;
        }
      }

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.pixelDensity(1);
        init();
      };

      p.draw = () => {
        if (!isPlaying) return;

        p.loadPixels();
        
        for (let x = 1; x < grid.length - 1; x++) {
          for (let y = 1; y < grid[x].length - 1; y++) {
            const a = grid[x][y].a;
            const b = grid[x][y].b;
            
            next[x][y].a = a + (dA * laplaceA(x, y) - a * b * b + f * (1 - a));
            next[x][y].b = b + (dB * laplaceB(x, y) + a * b * b - (k + f) * b);

            next[x][y].a = p.constrain(next[x][y].a, 0, 1);
            next[x][y].b = p.constrain(next[x][y].b, 0, 1);

            const pix = (x + y * p.width) * 4;
            const c = Math.floor((next[x][y].a - next[x][y].b) * 255);
            p.pixels[pix + 0] = c;
            p.pixels[pix + 1] = c;
            p.pixels[pix + 2] = c;
            p.pixels[pix + 3] = 255;
          }
        }

        p.updatePixels();

        // Swap buffers
        [grid, next] = [next, grid];
      };

      function laplaceA(x: number, y: number) {
        let sum = 0;
        sum += grid[x][y].a * -1;
        sum += grid[x-1][y].a * 0.2;
        sum += grid[x+1][y].a * 0.2;
        sum += grid[x][y+1].a * 0.2;
        sum += grid[x][y-1].a * 0.2;
        sum += grid[x-1][y-1].a * 0.05;
        sum += grid[x+1][y-1].a * 0.05;
        sum += grid[x-1][y+1].a * 0.05;
        sum += grid[x+1][y+1].a * 0.05;
        return sum;
      }

      function laplaceB(x: number, y: number) {
        let sum = 0;
        sum += grid[x][y].b * -1;
        sum += grid[x-1][y].b * 0.2;
        sum += grid[x+1][y].b * 0.2;
        sum += grid[x][y+1].b * 0.2;
        sum += grid[x][y-1].b * 0.2;
        sum += grid[x-1][y-1].b * 0.05;
        sum += grid[x+1][y-1].b * 0.05;
        sum += grid[x-1][y+1].b * 0.05;
        sum += grid[x+1][y+1].b * 0.05;
        return sum;
      }

      p.windowResized = () => {
        if (!sketchRef.current) return;
        const parentWidth = sketchRef.current.clientWidth;
        const parentHeight = sketchRef.current.clientHeight;
        p.resizeCanvas(parentWidth, parentHeight);
        init();
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
}