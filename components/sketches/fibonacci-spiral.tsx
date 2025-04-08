'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface FibonacciSpiralProps {
  parameters: {
    growthFactor: number;
    rotation: number;
  };
  isPlaying: boolean;
}

export default function FibonacciSpiral({ parameters, isPlaying }: FibonacciSpiralProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let width: number;
      let height: number;
      let centerX: number;
      let centerY: number;
      let scale: number;
      let angle = 0;

      p.setup = () => {
        width = sketchRef.current?.clientWidth || 800;
        height = sketchRef.current?.clientHeight || 800;
        p.createCanvas(width, height);
        centerX = width / 2;
        centerY = height / 2;
        scale = Math.min(width, height) / 8;
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.noFill();
      };

      p.draw = () => {
        if (!isPlaying) return;

        p.background(0, 0, 100);
        p.translate(centerX, centerY);

        let radius = 1;
        angle += 0.01;

        // Store points for connecting lines with interpolation
        const points: { x: number; y: number }[] = [];
        const numPoints = 500; // Increased number of points for smoother curve

        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1) * 100; // Interpolate between 0 and 100
          const currentRadius = Math.pow(parameters.growthFactor, t) * scale;
          const currentAngle = angle + t * parameters.rotation * p.PI / 180;

          const x = p.cos(currentAngle) * currentRadius;
          const y = p.sin(currentAngle) * currentRadius;

          points.push({ x, y });
        }

        // Draw the spiral curve
        p.beginShape();
        p.noFill();
        points.forEach((point, i) => {
          const hue = (i * 360 / numPoints) % 360;
          p.stroke(hue, 70, 80);
          p.strokeWeight(2);
          p.vertex(point.x, point.y);
        });
        p.endShape();

        // Draw points at regular intervals
        for (let i = 0; i < points.length; i += 10) {
          const point = points[i];
          const hue = (i * 360 / points.length) % 360;
          p.stroke(hue, 70, 80);
          p.strokeWeight(4);
          p.point(point.x, point.y);
        }
      };

      p.windowResized = () => {
        if (!sketchRef.current) return;
        width = sketchRef.current.clientWidth;
        height = sketchRef.current.clientHeight;
        p.resizeCanvas(width, height);
        centerX = width / 2;
        centerY = height / 2;
        scale = Math.min(width, height) / 8;
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [parameters, isPlaying]);

  return <div ref={sketchRef} className="w-full h-full" />;
}