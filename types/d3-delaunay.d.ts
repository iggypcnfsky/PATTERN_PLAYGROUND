// Type definitions for d3-delaunay
// Project: https://github.com/d3/d3-delaunay
// Definitions by: Pattern Playground

declare module 'd3-delaunay' {
  export interface Point {
    0: number;
    1: number;
    [key: number]: number;
  }

  export class Delaunay<P extends Point = [number, number]> {
    points: Float64Array;
    
    constructor(points: ArrayLike<P>);
    
    voronoi(bounds: [number, number, number, number]): Voronoi<P>;
    
    find(x: number, y: number, i?: number): number;
    
    neighbors(i: number): IterableIterator<number>;
    
    render(context?: CanvasRenderingContext2D): Delaunay<P>;
    
    renderHull(context?: CanvasRenderingContext2D): Delaunay<P>;
    
    renderTriangle(i: number, context?: CanvasRenderingContext2D): Delaunay<P>;
    
    renderPoints(context?: CanvasRenderingContext2D): Delaunay<P>;
    
    hullPolygon(): Array<[number, number]>;
    
    trianglePolygon(i: number): Array<[number, number]>;
    
    triangles: Uint32Array;
    
    halfedges: Int32Array;
    
    hull: Uint32Array;
    
    inedges: Int32Array;
    
    static from<P extends Point = [number, number]>(
      points: ArrayLike<P> | Iterable<P>,
      fx?: (d: P) => number,
      fy?: (d: P) => number,
    ): Delaunay<P>;
  }

  export class Voronoi<P extends Point = [number, number]> {
    delaunay: Delaunay<P>;
    
    circumcenters: Float64Array;
    
    vectors: Float64Array;
    
    xmax: number;
    
    ymax: number;
    
    xmin: number;
    
    ymin: number;
    
    contains(i: number, x: number, y: number): boolean;
    
    render(context?: CanvasRenderingContext2D): this;
    
    renderBounds(context?: CanvasRenderingContext2D): this;
    
    renderCell(i: number, context?: CanvasRenderingContext2D): this;
    
    cellPolygon(i: number): Array<[number, number]> | null;
    
    cellPolygons(): IterableIterator<Array<[number, number]>>;
    
    update(): this;
  }
} 