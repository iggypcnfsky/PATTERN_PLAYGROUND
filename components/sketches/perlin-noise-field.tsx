'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface PerlinNoiseFieldProps {
  parameters: {
    scale: number;
    speed: number;
    particles: number;
  };
  isPlaying: boolean;
}

export default function PerlinNoiseField({ parameters, isPlaying }: PerlinNoiseFieldProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let particles: Array<{ x: number; y: number; hue: number }> = [];
      let time = 0;

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.colorMode(p.HSB, 360, 100, 100, 0.1);
        initParticles();
      };

      function initParticles() {
        particles = [];
        for (let i = 0; i < parameters.particles; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            hue: p.random(360)
          });
        }
      }

      p.draw = () => {
        if (!isPlaying) return;

        p.background(220, 20, 95, 0.1);
        
        particles.forEach((particle, i) => {
          const angle = p.noise(
            particle.x * parameters.scale,
            particle.y * parameters.scale,
            time
          ) * p.TWO_PI * 4;

          particle.x += p.cos(angle) * 2;
          particle.y += p.sin(angle) * 2;

          if (particle.x < 0) particle.x = p.width;
          if (particle.x > p.width) particle.x = 0;
          if (particle.y < 0) particle.y = p.height;
          if (particle.y > p.height) particle.y = 0;

          p.stroke(particle.hue, 80, 90);
          p.strokeWeight(2);
          p.point(particle.x, particle.y);
        });

        time += parameters.speed;
      };

      p.windowResized = () => {
        if (!sketchRef.current) return;
        const parentWidth = sketchRef.current.clientWidth;
        const parentHeight = sketchRef.current.clientHeight;
        p.resizeCanvas(parentWidth, parentHeight);
        initParticles();
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [parameters]);

  return <div ref={sketchRef} className="w-full h-full" />;
}