'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface WaveInterferenceProps {
  parameters: {
    wavelength: number;
    amplitude: number;
    frequency: number;
  };
  isPlaying: boolean;
}

export default function WaveInterference({ parameters, isPlaying }: WaveInterferenceProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let time = 0;

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 400;
        const parentHeight = sketchRef.current?.clientHeight || 400;
        p.createCanvas(parentWidth, parentHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
      };

      p.draw = () => {
        if (!isPlaying) return;

        p.background(220, 20, 95);
        p.noFill();

        const rows = 20;
        const cols = 20;
        const cellWidth = p.width / cols;
        const cellHeight = p.height / rows;

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const x = j * cellWidth;
            const y = i * cellHeight;
            const distance = p.dist(x, y, p.width / 2, p.height / 2);
            const wave = p.sin(distance / parameters.wavelength + time * parameters.frequency);
            const size = p.map(wave, -1, 1, 5, parameters.amplitude);
            const hue = p.map(wave, -1, 1, 180, 240);

            p.stroke(hue, 80, 90);
            p.strokeWeight(2);
            p.circle(x + cellWidth / 2, y + cellHeight / 2, size);
          }
        }

        time += 1;
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