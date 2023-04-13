/**
  * @module Pathfinder
*/

import { Graph, Vertex } from "./Graph";

/**
  * Function that find path from start to goal in given map
  * @param map - map
*/
export default function findPath(map: Graph): Path | null {
  const start = map.find(v => v.start)
  const goal = map.find(v => v.goal)

  if (!start || !goal) {
    throw new Error("Pathfinder@findPath: There's no start and/or goal in given graph")
  }

  return A_Star(start, () => ((start.x! - goal.x!) ** 2 + (start.y! - goal.y!) ** 2) * 0.5);
}

/**
  * Function implementing A Star algorith
  @param start - start
  @param h - heuristic function
*/
function A_Star(start: Vertex, h: (arg0: Vertex) => number): Path | null {
  type verObj = { [index: string]: Vertex }
  type numObj = { [index: string]: number }
  const openSet = [start]
  const cameFrom: verObj = {}
  const gScore: numObj = {}
  gScore[start.uuid] = 0
  const fScore: numObj = {}
  fScore[start.uuid] = h(start)

  while (openSet.length) {
    const current = smallest(openSet, (pv, cv) => getOrInf(fScore, pv.uuid) < getOrInf(fScore, cv.uuid))
    if (current.goal) return reconstruct_path(cameFrom, current)
    removeItem(openSet, current)

    const neighbours = current.edges.filter(edge => edge.to.walkable).map(edge => { return { edge, neighbour: edge.to } });
    for (const { neighbour, edge } of neighbours) {
      const tentative_gScore = getOrInf(gScore, current.uuid) + edge.weight
      if (tentative_gScore < getOrInf(gScore, neighbour.uuid)) {
        cameFrom[neighbour.uuid] = current
        gScore[neighbour.uuid] = tentative_gScore
        fScore[neighbour.uuid] = tentative_gScore + h(neighbour)
        if (!openSet.includes(neighbour)) openSet.push(neighbour)
      }
    }
  }
  return null;
}

/**
  * Function that reconstructs path, from finish to start
  * @param cameFrom - finish
  * @param current - whereami vertex
*/
function reconstruct_path(cameFrom: { [index: string]: Vertex }, current: Vertex): Path {
  let c = current;
  const total_path = [c]
  while (Object.keys(cameFrom).includes(c.uuid)) {
    c = cameFrom[c.uuid];
    total_path.unshift(c)
  }
  return total_path;
}

/** 
  * Getter to get value or object or null
  * @param arr - object to look in
  * @param key - key at which to search
*/
function getOrInf(arr: { [index: string]: number }, key: keyof typeof arr): number {
  return arr[key] ?? Infinity
}

/**
  * Gets smallest element from array 
  * @typeParam T - typeof elements inside given array
  * @param arr - array to look in 
  * @param fn - function to determine which is smaller element
*/
function smallest<T>(arr: Array<T>, fn: (prev: T, curr: T) => boolean): T {
  let smallest = arr[0]
  arr.forEach((el, i) => {
    if (!i) return;
    if (fn(arr[i - 1], el)) smallest = arr[i - 1]
  });
  return smallest;
}

/**
  * Remove element from given array
  * @typeParam T - typeof elements inside given array
  * @param item - to be removed
*/
function removeItem<T>(arr: Array<T>, item: T): Array<T> {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/** Shortcut */
export type Path = Array<Vertex>
