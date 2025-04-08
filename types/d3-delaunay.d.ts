declare module 'd3-delaunay' {
  export class Delaunay<P = [number, number]> {
    voronoi(bounds: number[]): Voronoi<P>;
    static from(points: P[]): Delaunay<P>;
  }
  
  export class Voronoi<P = [number, number]> {
    cellPolygon(index: number): Array<[number, number]> | null;
  }
} 