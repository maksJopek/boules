import Ball from "./Ball";
import { MAP_WIDTH, MAP_HEIGHT, TD_SIZE } from "./consts";
import { sleep } from "./utils";
import { findToRemove, genGraph, genMap } from "./map";
import findPath, { Path } from "./pathfinder";

let selectedBall: Ball | null = null;
let currentPath: Path = [];
let turnIsChanging = false;
const setCurrentPath = (p: any) => {
  for (const v of currentPath) {
    getTd(v.x!, v.y!).style.backgroundColor = "";
  }
  currentPath = p;
}

export async function nextTurn() {
  turnIsChanging = true;
  for (const v of currentPath) {
    getTd(v.x!, v.y!).style.backgroundColor = "rgba(50, 50, 50, 0.8)";
  }

  await sleep(1000);

  const toRemove = findToRemove(window.balls);


  window.balls = window.balls.filter(ba => !toRemove.find(b => ba.isEqual(b)))
  for (const b of toRemove) {
    clearTd(b.td)
  }
  pointsEl.innerText = (parseInt(pointsEl.innerText) + toRemove.length).toString()

  setCurrentPath([]);
  window.balls.push(...Ball.generateNewBalls(window.balls));
  render();
  turnIsChanging = false;
}

export function tdOnClick(_e: PointerEvent) {
  if (!currentPath.length || turnIsChanging) return;
  const std = getTd(currentPath[0].x!, currentPath[0].y!);
  clearTd(std)
  const ib = window.balls.findIndex(b => b.x === currentPath[0].x && b.y === currentPath[0].y)!
  window.balls[ib].x = currentPath[currentPath.length - 1].x!
  window.balls[ib].y = currentPath[currentPath.length - 1].y!
  selectedBall = null;
  render(window.balls);
  nextTurn();
}
export function tdOnMouseEnter(_e: PointerEvent, x: number, y: number) {
  if (!selectedBall || turnIsChanging) return;
  const graph = genGraph(genMap(window.balls), { x: selectedBall.x, y: selectedBall.y }, { x, y });
  const path = findPath(graph) ?? [];
  setCurrentPath(path);
  if (!path.length) return;
  for (const v of path) {
    getTd(v.x!, v.y!).style.backgroundColor = "rgba(45, 123, 78, 0.6)";
  }
}
export function render(balls?: Ball[]) {
  balls = balls ? balls : window.balls;
  for (const ball of balls) {
    const { x, y, color } = ball;
    const td = getTd(x, y);
    td.firstChild.style.backgroundColor = color;

    td.onmousedown = () => {
      if (turnIsChanging) return;
      const circle = td.firstChild as HTMLDivElement;
      setCurrentPath([]);
      const smallerCircle = () => {
        if (!selectedBall) return;
        selectedBall.td.firstChild.style.width = ""
        selectedBall.td.firstChild.style.height = ""
      }
      getGameMapEl().onmouseleave = () => {
        if (turnIsChanging) return;
        setCurrentPath([]);
        smallerCircle();
        selectedBall = null;
      }

      if (circle.style.width === TD_SIZE) {
        smallerCircle();
        selectedBall = null;
        return;
      }
      smallerCircle();

      circle.style.width = TD_SIZE;
      circle.style.height = TD_SIZE;
      selectedBall = ball;
    };
  }
}
export function clearTd(td: Td) {
  if (td.localName !== "td") {
    console.log(td)
    throw new Error("Not td passed to clearTd()");
  }
  td.innerHTML = ""
  td.onmousedown = null;
  td.appendChild(document.createElement("div"))
}
export function genGameTable() {
  const table = getGameMapEl();
  for (let i = 0; i < MAP_HEIGHT; i++) {
    const tr = document.createElement("tr")
    for (let j = 0; j < MAP_WIDTH; j++) {
      const td = document.createElement("td")
      // @ts-expect-error
      td.onmouseenter = e => tdOnMouseEnter(e, i, j);
      // @ts-expect-error
      td.onclick = e => tdOnClick(e);
      td.appendChild(document.createElement("div"));
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
}
export function getGameMapEl(): HTMLTableElement {
  return document.querySelector('table')!
}
export interface Td extends HTMLTableCellElement {
  firstChild: HTMLDivElement;
}
export function getTd(x: number, y: number): Td {
  return getGameMapEl().children[x].children[y] as Td;
}
export const pointsEl = document.querySelector("h3 span") as HTMLSpanElement
