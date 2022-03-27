import Ball from "./Ball";
import { MAP_HEIGHT, MAP_WIDTH } from "./consts";
import { Graph } from "./pathfinder/Graph";

export type Map = (Ball | null)[][];
export function genMap(balls: Array<Ball>): Map {
  const map = <Map>[];
  for (let i = 0; i < MAP_HEIGHT; i++) {
    map.push([]);
    for (let j = 0; j < MAP_WIDTH; j++) {
      map[i].push(null);
    }
  }
  for (const b of balls) {
    map[b.x][b.y] = b
  }
  return map;
}

type Coord = { x: number; y: number };
export function genGraph(map: Map, start: Coord, goal: Coord): Graph {
  const graph: Graph = [];
  map.forEach((row, i) => {
    row.forEach((b, j) => {
      graph.push({
        start: i === start.x && j === start.y,
        goal: i === goal.x && j === goal.y,
        walkable: b === null,
        uuid: uuidv4(),
        graph,
        x: i,
        y: j,
        edges: [],
      });
    });
  });
  map.forEach((row, i) => {
    row.forEach((_, j) => {
      const vertex = graph.find(v => v.x === i && v.y === j);
      if (!vertex) return;
      const n1 = graph.find(v => v.x === i - 1 && v.y === j);
      const n2 = graph.find(v => v.x === i + 1 && v.y === j);
      const n3 = graph.find(v => v.x === i && v.y === j - 1);
      const n4 = graph.find(v => v.x === i && v.y === j + 1);
      for (const n of [n1, n2, n3, n4]) {
        if (n) {
          vertex.edges.push({
            from: vertex,
            to: n,
            weight: 1,
          });
        }
      }
    });
  });
  return graph;
}

function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

