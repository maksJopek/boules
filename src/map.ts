import Ball from "./Ball";
import { DELETE_FROM_BALLS, MAP_HEIGHT, MAP_WIDTH } from "./consts";
import { Graph } from "./pathfinder/Graph";

export function findToRemove(balls: Ball[]): Ball[] {
  const out = new Set<Ball>()
  for (const ball of balls) {
    const xNeighbours = new Set<Ball>();
    for (let x = ball.x; x < MAP_HEIGHT; x++) {
      const b = balls.find(b => b.y === ball.y && b.x === x && b.color === ball.color);
      if (!b) break;
      xNeighbours.add(b)
    }
    for (let x = ball.x - 1; x >= 0; x--) {
      const b = balls.find(b => b.y === ball.y && b.x === x && b.color === ball.color)
      if (!b) break;
      xNeighbours.add(b)
    }

    const yNeighbours = new Set<Ball>();
    for (let y = ball.y; y < MAP_WIDTH; y++) {
      const b = balls.find(b => b.x === ball.x && b.y === y && b.color === ball.color);
      if (!b) break;
      yNeighbours.add(b)
    }
    for (let y = ball.y - 1; y >= 0; y--) {
      const b = balls.find(b => b.x === ball.x && b.y === y && b.color === ball.color)
      if (!b) break;
      yNeighbours.add(b)
    }

    //    same(Sign)XYNeigbours
    const sxyNeighbours = new Set<Ball>();
    for (let x = ball.x, y = ball.y; x >= 0 && y >= 0; x--, y--) {
      const b = balls.find(b => b.x === x && b.y === y && b.color === ball.color)
      if (!b) break;
      sxyNeighbours.add(b)
    }
    for (let x = ball.x + 1, y = ball.y + 1; x < MAP_HEIGHT && y < MAP_WIDTH; x--, y--) {
      const b = balls.find(b => b.x === x && b.y === y && b.color === ball.color)
      if (!b) break;
      sxyNeighbours.add(b)
    }

    //    diffrent(Sign)XYNeigbours
    const dxyNeighbours = new Set<Ball>();
    for (let x = ball.x, y = ball.y; x >= 0 && y < MAP_WIDTH; x--, y++) {
      const b = balls.find(b => b.x === x && b.y === y && b.color === ball.color)
      if (!b) break;
      dxyNeighbours.add(b)
    }
    for (let x = ball.x + 1, y = ball.y - 1; x >= 0 && y >= 0; x++, y--) {
      const b = balls.find(b => b.x === x && b.y === y && b.color === ball.color)
      if (!b) break;
      dxyNeighbours.add(b)
    }

    const sets = [xNeighbours, yNeighbours, sxyNeighbours, dxyNeighbours]
    for (const s of sets) {
      if (s.size >= DELETE_FROM_BALLS) s.forEach(b => out.add(b))
    }
  }
  return [...out];
}

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

