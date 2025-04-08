'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface MandelbrotProps {
  parameters: {
    maxIterations: number;
    zoom: number;
    colorScale: number;
  };
  isPlaying: boolean;
}

export default function Mandelbrot({ parameters, isPlaying }: MandelbrotProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let centerX = 0;
      let centerY = 0;
      let time = 0;

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.pixelDensity(1);
        p.colorMode(p.HSB, 360, 100, 100, 1);
      };

      p.draw = () => {
        if (!isPlaying) return;

        p.loadPixels();
        time += 0.01;

        const w = 4 / parameters.zoom;
        const h = (w * p.height) / p.width;

        for (let x = 0; x < p.width; x++) {
          for (let y = 0; y < p.height; y++) {
            let a = p.map(x, 0, p.width, -w/2, w/2) + centerX;
            let b = p.map(y, 0, p.height, -h/2, h/2) + centerY;

            const ca = a;
            const cb = b;
            let n = 0;

            while (n < parameters.maxIterations) {
              const aa = a * a - b * b;
              const bb = 2 * a * b;
              
              a = aa + ca;
              b = bb + cb;
              
              if (a * a + b * b > 16) {
                break;
              }
              n++;
            }

            const pix = (x + y * p.width) * 4;
            if (n === parameters.maxIterations) {
              p.pixels[pix + 0] = 0;
              p.pixels[pix + 1] = 0;
              p.pixels[pix + 2] = 0;
            } else {
              const hue = (n * parameters.colorScale + time * 10) % 360;
              const col = p.color(hue, 80, 100);
              p.pixels[pix + 0] = p.red(col);
              p.pixels[pix + 1] = p.green(col);
              p.pixels[pix + 2] = p.blue(col);
            }
            p.pixels[pix + 3] = 255;
          }
        }
        p.updatePixels();
      };

      p.windowResized = () => {
        if (!sketchRef.current) return;
        const parentWidth = sketchRef.current.clientWidth;
        const parentHeight = sketchRef.current.clientHeight;
        p.resizeCanvas(parentWidth, parentHeight);
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
}