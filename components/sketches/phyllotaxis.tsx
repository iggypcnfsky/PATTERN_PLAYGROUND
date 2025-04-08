'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface PhyllotaxisProps {
  parameters: {
    divergence: number;
    scale: number;
    dotSize: number;
  };
  isPlaying: boolean;
}

export default function Phyllotaxis({ parameters, isPlaying }: PhyllotaxisProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let n = 0;
      let time = 0;

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.background(0, 0, 100);
      };

      p.draw = () => {
        if (!isPlaying) return;

        p.translate(p.width / 2, p.height / 2);
        time += 0.01;

        const c = parameters.scale;
        const angle = n * parameters.divergence;
        const radius = c * p.sqrt(n);

        const x = radius * p.cos(angle);
        const y = radius * p.sin(angle);

        const hue = (n * 0.5 + time * 10) % 360;
        p.noStroke();
        p.fill(hue, 80, 90);
        p.circle(x, y, parameters.dotSize);

        n++;

        if (radius > p.max(p.width, p.height)) {
          n = 0;
          p.background(0, 0, 100);
        }
      };

      p.windowResized = () => {
        if (!sketchRef.current) return;
        const parentWidth = sketchRef.current.clientWidth;
        const parentHeight = sketchRef.current.clientHeight;
        p.resizeCanvas(parentWidth, parentHeight);
        n = 0;
        p.background(0, 0, 100);
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
}