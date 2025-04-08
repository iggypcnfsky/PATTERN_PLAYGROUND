'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Share2,
  Download,
  Play,
  Pause,
  RefreshCcw,
  Info,
  GraduationCap
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FibonacciSpiral = dynamic(() => import('@/components/sketches/fibonacci-spiral'), {
  ssr: false,
});

const WaveInterference = dynamic(() => import('@/components/sketches/wave-interference'), {
  ssr: false,
});

const LSystemFractal = dynamic(() => import('@/components/sketches/l-system-fractal'), {
  ssr: false,
});

const PerlinNoiseField = dynamic(() => import('@/components/sketches/perlin-noise-field'), {
  ssr: false,
});

const HexagonalTiling = dynamic(() => import('@/components/sketches/hexagonal-tiling'), {
  ssr: false,
});

const VoronoiTessellation = dynamic(() => import('@/components/sketches/voronoi-tessellation'), {
  ssr: false,
});

const Mandelbrot = dynamic(() => import('@/components/sketches/mandelbrot'), {
  ssr: false,
});

const Phyllotaxis = dynamic(() => import('@/components/sketches/phyllotaxis'), {
  ssr: false,
});

export function PatternPlayground() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePattern, setActivePattern] = useState('fibonacci');
  const [parameters, setParameters] = useState({
    fibonacci: { growthFactor: 1.618, rotation: 137.5 },
    wave: { wavelength: 50, amplitude: 30, frequency: 0.02 },
    lsystem: { iterations: 4, angle: 25 },
    perlin: { scale: 0.01, speed: 0.002, particles: 1000 },
    hexagonal: { size: 30, spacing: 2 },
    voronoi: { cellCount: 50, borderThickness: 2, jitter: 1 },
    mandelbrot: { maxIterations: 100, zoom: 1, colorScale: 10 },
    phyllotaxis: { divergence: 137.5, scale: 4, dotSize: 8 }
  });

  const handleParameterChange = (category: string, param: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [param]: value
      }
    }));
  };

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `pattern-${activePattern}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleReset = () => {
    const defaultParams = {
      fibonacci: { growthFactor: 1.618, rotation: 137.5 },
      wave: { wavelength: 50, amplitude: 30, frequency: 0.02 },
      lsystem: { iterations: 4, angle: 25 },
      perlin: { scale: 0.01, speed: 0.002, particles: 1000 },
      hexagonal: { size: 30, spacing: 2 },
      voronoi: { cellCount: 50, borderThickness: 2, jitter: 1 },
      mandelbrot: { maxIterations: 100, zoom: 1, colorScale: 10 },
      phyllotaxis: { divergence: 137.5, scale: 4, dotSize: 8 }
    };
    setParameters(defaultParams);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">Pattern Playground</h1>
          <div className="flex space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Pattern</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Pattern</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="https://www.uni-konstanz.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-md"
                  >
                    <GraduationCap className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Learn about Double Degree program</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Tabs defaultValue="fibonacci" onValueChange={setActivePattern} className="h-[calc(100vh-12rem)]">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
            <TabsTrigger value="wave">Wave</TabsTrigger>
            <TabsTrigger value="lsystem">L-System</TabsTrigger>
            <TabsTrigger value="perlin">Flow Field</TabsTrigger>
            <TabsTrigger value="hexagonal">Hexagonal</TabsTrigger>
            <TabsTrigger value="voronoi">Voronoi</TabsTrigger>
            <TabsTrigger value="mandelbrot">Mandelbrot</TabsTrigger>
            <TabsTrigger value="phyllotaxis">Phyllotaxis</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 h-full">
            <div className="md:col-span-2 h-full">
              <Card className="w-full h-full">
                <CardContent className="p-0 h-full">
                  <TabsContent value="fibonacci" className="mt-0 h-full">
                    <FibonacciSpiral parameters={parameters.fibonacci} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="wave" className="mt-0 h-full">
                    <WaveInterference parameters={parameters.wave} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="lsystem" className="mt-0 h-full">
                    <LSystemFractal parameters={parameters.lsystem} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="perlin" className="mt-0 h-full">
                    <PerlinNoiseField parameters={parameters.perlin} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="hexagonal" className="mt-0 h-full">
                    <HexagonalTiling parameters={parameters.hexagonal} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="voronoi" className="mt-0 h-full">
                    <VoronoiTessellation parameters={parameters.voronoi} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="mandelbrot" className="mt-0 h-full">
                    <Mandelbrot parameters={parameters.mandelbrot} isPlaying={isPlaying} />
                  </TabsContent>
                  <TabsContent value="phyllotaxis" className="mt-0 h-full">
                    <Phyllotaxis parameters={parameters.phyllotaxis} isPlaying={isPlaying} />
                  </TabsContent>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Controls</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {activePattern === 'fibonacci' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Growth Factor</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.fibonacci.growthFactor}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.fibonacci.growthFactor]}
                          min={1}
                          max={2}
                          step={0.001}
                          onValueChange={([value]) =>
                            handleParameterChange('fibonacci', 'growthFactor', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Rotation (degrees)</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.fibonacci.rotation}°
                          </span>
                        </div>
                        <Slider
                          value={[parameters.fibonacci.rotation]}
                          min={0}
                          max={360}
                          step={0.1}
                          onValueChange={([value]) =>
                            handleParameterChange('fibonacci', 'rotation', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'wave' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Wavelength</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.wave.wavelength}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.wave.wavelength]}
                          min={10}
                          max={100}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('wave', 'wavelength', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Amplitude</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.wave.amplitude}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.wave.amplitude]}
                          min={5}
                          max={50}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('wave', 'amplitude', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Frequency</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.wave.frequency}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.wave.frequency]}
                          min={0.001}
                          max={0.05}
                          step={0.001}
                          onValueChange={([value]) =>
                            handleParameterChange('wave', 'frequency', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'lsystem' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Iterations</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.lsystem.iterations}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.lsystem.iterations]}
                          min={1}
                          max={6}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('lsystem', 'iterations', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Angle (degrees)</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.lsystem.angle}°
                          </span>
                        </div>
                        <Slider
                          value={[parameters.lsystem.angle]}
                          min={0}
                          max={45}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('lsystem', 'angle', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'perlin' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Scale</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.perlin.scale}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.perlin.scale]}
                          min={0.001}
                          max={0.05}
                          step={0.001}
                          onValueChange={([value]) =>
                            handleParameterChange('perlin', 'scale', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Speed</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.perlin.speed}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.perlin.speed]}
                          min={0.001}
                          max={0.01}
                          step={0.001}
                          onValueChange={([value]) =>
                            handleParameterChange('perlin', 'speed', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Particles</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.perlin.particles}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.perlin.particles]}
                          min={100}
                          max={2000}
                          step={100}
                          onValueChange={([value]) =>
                            handleParameterChange('perlin', 'particles', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'hexagonal' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Size</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.hexagonal.size}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.hexagonal.size]}
                          min={10}
                          max={50}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('hexagonal', 'size', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Spacing</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.hexagonal.spacing}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.hexagonal.spacing]}
                          min={0}
                          max={10}
                          step={0.5}
                          onValueChange={([value]) =>
                            handleParameterChange('hexagonal', 'spacing', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'voronoi' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Cell Count</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.voronoi.cellCount}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.voronoi.cellCount]}
                          min={10}
                          max={100}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('voronoi', 'cellCount', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Border Thickness</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.voronoi.borderThickness}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.voronoi.borderThickness]}
                          min={0}
                          max={5}
                          step={0.1}
                          onValueChange={([value]) =>
                            handleParameterChange('voronoi', 'borderThickness', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Jitter</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.voronoi.jitter}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.voronoi.jitter]}
                          min={0}
                          max={5}
                          step={0.1}
                          onValueChange={([value]) =>
                            handleParameterChange('voronoi', 'jitter', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'mandelbrot' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Max Iterations</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.mandelbrot.maxIterations}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.mandelbrot.maxIterations]}
                          min={50}
                          max={200}
                          step={10}
                          onValueChange={([value]) =>
                            handleParameterChange('mandelbrot', 'maxIterations', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Zoom</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.mandelbrot.zoom}x
                          </span>
                        </div>
                        <Slider
                          value={[parameters.mandelbrot.zoom]}
                          min={1}
                          max={10}
                          step={0.1}
                          onValueChange={([value]) =>
                            handleParameterChange('mandelbrot', 'zoom', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Color Scale</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.mandelbrot.colorScale}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.mandelbrot.colorScale]}
                          min={1}
                          max={20}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('mandelbrot', 'colorScale', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {activePattern === 'phyllotaxis' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Divergence Angle</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.phyllotaxis.divergence}°
                          </span>
                        </div>
                        <Slider
                          value={[parameters.phyllotaxis.divergence]}
                          min={0}
                          max={360}
                          step={0.1}
                          onValueChange={([value]) =>
                            handleParameterChange('phyllotaxis', 'divergence', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Scale</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.phyllotaxis.scale}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.phyllotaxis.scale]}
                          min={1}
                          max={10}
                          step={0.1}
                          onValueChange={([value]) =>
                            handleParameterChange('phyllotaxis', 'scale', value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Dot Size</label>
                          <span className="text-sm text-muted-foreground">
                            {parameters.phyllotaxis.dotSize}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.phyllotaxis.dotSize]}
                          min={2}
                          max={20}
                          step={1}
                          onValueChange={([value]) =>
                            handleParameterChange('phyllotaxis', 'dotSize', value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <h3 className="text-lg font-semibold">Pattern Info</h3>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {activePattern === 'fibonacci' && (
                      "The Fibonacci spiral, also known as the golden spiral, is a mathematical marvel found throughout nature. You can see it in the spiral arrangement of seeds in sunflowers, the shell of the nautilus, the unfurling of fern fronds, hurricane formations, and even in the shape of entire galaxies. The spiral's growth is based on the golden ratio (approximately 1.618), which creates an aesthetically pleasing and efficient pattern for growth and organization in nature."
                    )}
                    {activePattern === 'wave' && (
                      "Wave interference patterns are fundamental to our understanding of physics and nature. These patterns emerge when waves combine, creating beautiful and complex interactions. You can observe similar patterns in ripples on a pond, in the iridescent colors of soap bubbles, in the moiré patterns of overlapping fabrics, and even in the quantum behavior of particles. The interference of light waves creates the stunning colors we see in peacock feathers and butterfly wings."
                    )}
                    {activePattern === 'lsystem' && (
                      "L-Systems (Lindenmayer Systems) are mathematical rules that can generate incredibly complex, organic-looking patterns. Originally designed to model plant growth, they can recreate the branching patterns of trees, the intricate structures of coral reefs, and the delicate patterns of snowflakes. In nature, you can see L-System-like patterns in the branching of blood vessels, river networks, and lightning bolts. Even the way cities grow and transportation networks develop often follows similar branching patterns."
                    )}
                    {activePattern === 'perlin' && (
                      "Perlin noise creates natural-looking random patterns that simulate the organic irregularity found in nature. This flow field visualization mimics patterns seen in wind currents, ocean currents, and magnetic fields. You can observe similar flowing patterns in cloud formations, smoke trails, and the grain patterns in wood. The technique is widely used in computer graphics to generate realistic terrain, textures, and natural phenomena like fire and water."
                    )}
                    {activePattern === 'hexagonal' && (
                      "Hexagonal tiling is one of nature's most efficient patterns for packing and organization. The most famous example is the honeycomb structure built by bees, but it appears in many other contexts: the compound eyes of insects, the scales of fish, the spots on a turtle's shell, and even in the molecular structure of graphene. At a microscopic level, many crystals and minerals naturally form hexagonal patterns. The pattern is so efficient that it's used in modern technology, from solar panels to sound-absorbing panels."
                    )}
                    {activePattern === 'voronoi' && (
                      "Voronoi patterns are nature's way of dividing space into regions. These patterns can be seen in the cracking patterns of dried mud, the spots on a giraffe's coat, and the structure of dragonfly wings. At the microscopic level, cell membranes in living tissues often form Voronoi-like patterns. The pattern is also visible in the distribution of galaxies in space and is used in fields ranging from ecology (studying animal territories) to urban planning (optimizing the placement of services like hospitals and fire stations)."
                    )}
                    {activePattern === 'mandelbrot' && (
                      "The Mandelbrot set is often called 'the thumbprint of God' due to its infinite complexity and beauty. This mathematical wonder contains an endless array of intricate patterns that repeat at every scale, demonstrating the concept of self-similarity found in nature. Similar fractal patterns appear in coastlines, mountain ranges, and river networks. The principles behind the Mandelbrot set help explain how complex systems in nature, from weather patterns to financial markets, behave and evolve."
                    )}
                    {activePattern === 'phyllotaxis' && (
                      "Phyllotaxis is nature's solution to efficient packing and light capture in plants. The most famous example is the spiral arrangement of seeds in a sunflower head, where seeds are arranged in intersecting spirals following the golden angle (137.5°). This pattern maximizes the space for each seed while optimizing sunlight exposure. You can see similar arrangements in pinecones, pineapples, romanesco broccoli, and the spiral arrangement of leaves around a stem. This pattern demonstrates how mathematics underlies the efficiency of natural growth patterns."
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}