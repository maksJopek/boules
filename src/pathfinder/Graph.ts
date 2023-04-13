/**
  @module Graph
*/
/** Types for directed graph */
/** Shortuct */
export type Graph = Array<Vertex>;

/** Type for vertex of graph */
export interface Vertex {
  edges: Array<Edge>; // Graph is directed so all edges will have from set to `this`
  start: boolean;
  goal: boolean;
  walkable: boolean;
  uuid: string;
  graph: Graph;
  x?: number;
  y?: number;
}
/** Type for edge of graph */
export interface Edge {
  from: Vertex;
  to: Vertex;
  weight: number;
}

