'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface HexagonalTilingProps {
  parameters: {
    size: number;
    spacing: number;
  };
  isPlaying: boolean;
}

export default function HexagonalTiling({ parameters, isPlaying }: HexagonalTilingProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let time = 0;

      function drawHexagon(x: number, y: number, size: number, hue: number) {
        const angle = p.TWO_PI / 6;
        p.beginShape();
        for (let a = 0; a < p.TWO_PI; a += angle) {
          const sx = x + p.cos(a) * size;
          const sy = y + p.sin(a) * size;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
      };

      p.draw = () => {
        if (!isPlaying) return;

        p.background(220, 20, 95);
        time += 0.02;

        const w = parameters.size * 2;
        const h = p.sqrt(3) * parameters.size;
        const spacing = parameters.spacing;

        for (let row = 0; row < p.height / h + 2; row++) {
          for (let col = 0; col < p.width / (w * 0.75) + 2; col++) {
            const x = col * (w - w/4) * (1 + spacing/10);
            const y = row * h * (1 + spacing/10) + (col % 2) * h/2;
            
            const distanceFromCenter = p.dist(x, y, p.width/2, p.height/2);
            const hue = (distanceFromCenter * 0.5 + time * 20) % 360;
            
            p.noStroke();
            p.fill(hue, 70, 90);
            drawHexagon(x, y, parameters.size, hue);
          }
        }
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
  }, [parameters]);

  return <div ref={sketchRef} className="w-full h-full" />;
}