'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface LSystemFractalProps {
  parameters: {
    iterations: number;
    angle: number;
  };
  isPlaying: boolean;
}

export default function LSystemFractal({ parameters, isPlaying }: LSystemFractalProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let axiom = 'F';
      let sentence = axiom;
      let rules = {
        F: 'FF+[+F-F-F]-[-F+F+F]'
      };
      let len = 100;
      let angle = 0;

      function generate() {
        len *= 0.5;
        let nextSentence = '';
        for (let i = 0; i < sentence.length; i++) {
          let current = sentence.charAt(i);
          let found = rules[current as keyof typeof rules];
          if (found) {
            nextSentence += found;
          } else {
            nextSentence += current;
          }
        }
        sentence = nextSentence;
      }

      p.setup = () => {
        const parentWidth = sketchRef.current?.clientWidth || 800;
        const parentHeight = sketchRef.current?.clientHeight || 800;
        p.createCanvas(parentWidth, parentHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        // Generate the L-system based on iterations
        sentence = axiom;
        len = parentHeight * 0.3;
        for (let i = 0; i < parameters.iterations; i++) {
          generate();
        }
      };

      p.draw = () => {
        if (!isPlaying) return;
        
        p.background(220, 20, 95);
        p.translate(p.width / 2, p.height);
        
        angle += 0.001;
        p.stroke(120, 80, 70);
        p.strokeWeight(2);
        
        for (let i = 0; i < sentence.length; i++) {
          let current = sentence.charAt(i);
          
          if (current === 'F') {
            const hue = (i * 2) % 360;
            p.stroke(hue, 80, 70);
            p.line(0, 0, 0, -len);
            p.translate(0, -len);
          } else if (current === '+') {
            p.rotate(parameters.angle * p.PI / 180);
          } else if (current === '-') {
            p.rotate(-parameters.angle * p.PI / 180);
          } else if (current === '[') {
            p.push();
          } else if (current === ']') {
            p.pop();
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