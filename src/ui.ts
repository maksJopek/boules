import Ball from "./Ball";
import { MAP_WIDTH, MAP_HEIGHT, TD_SIZE } from "./consts";
import { genGraph, genMap } from "./map";
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

  await sleep(2000);

  setCurrentPath([]);
  window.balls.push(...Ball.generateNewBalls());
  render();
  turnIsChanging = false;
}
async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
export function tdOnClick(_e: PointerEvent) {
  if (!currentPath.length || turnIsChanging) return;
  const std = getTd(currentPath[0].x!, currentPath[0].y!);
  (std.firstChild as HTMLDivElement).style.width = "";
  (std.firstChild as HTMLDivElement).style.height = "";
  const ib = window.balls.findIndex(b => b.x === currentPath[0].x && b.y === currentPath[0].y)!
  window.balls[ib].x = currentPath[currentPath.length - 1].x!
  window.balls[ib].y = currentPath[currentPath.length - 1].y!
  std.innerHTML = "";
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
    (td.firstChild as HTMLDivElement).style.backgroundColor = color;

    td.onclick = () => {
      if (turnIsChanging) return;
      const circle = td.firstChild as HTMLDivElement;
      setCurrentPath([]);
      const smallerCircle = () => {
        circle.style.width = "";
        circle.style.height = "";
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
export function getTd(x: number, y: number): HTMLTableDataCellElement {
  return getGameMapEl().children[x].children[y] as HTMLTableDataCellElement;
}
