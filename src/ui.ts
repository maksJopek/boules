/** 
  * @module UI
  * The only place with side effects
*/

import { Ball } from "./Ball";
import { MAP_WIDTH, MAP_HEIGHT, TD_SIZE } from "./consts";
import { sleep } from "./utils";
import { findToRemove, genGraph, genMap } from "./map";
import findPath, { Path } from "./pathfinder";

/** @internal */
let selectedBall: Ball | null = null;
/** @internal */
let newBalls = <Ball[]>[];
/** @internal */
let currentPath: Path = [];
/** @internal */
let turnIsChanging = false;

/**
  * Setter for path, to automatically remove old one
  * @param p - new path
*/
const setCurrentPath = (p: Path) => {
  for (const v of currentPath) {
    getTd(v.x!, v.y!).style.backgroundColor = "";
  }
  currentPath = p;
}

/** Function that handles making new turn */
export async function nextTurn() {
  turnIsChanging = true;
  for (const v of currentPath) {
    getTd(v.x!, v.y!).style.backgroundColor = "rgba(50, 50, 50, 0.8)";
  }

  // await sleep(1000);

  await clearAndGenerateBalls();
  setCurrentPath([]);

  turnIsChanging = false;
}
/** Function to clear balls that should be deleted and generate new ones, also check for some to delete after that */
export async function clearAndGenerateBalls() {
  let toRemove = findToRemove(window.balls);
  const remFromGlobal = () => window.balls = window.balls.filter(ba => !toRemove.find(b => ba.isEqual(b)));
  const colorNewBalls = () => newBalls.forEach(nb => nb.td.style.backgroundColor = "rgba(123, 45, 99, 0.8)")
  const clearNewBalls = () => newBalls.forEach(nb => nb.td.style.backgroundColor = "")


  do {
    await sleep(1000);
    remFromGlobal()
    pointsEl.innerText = (parseInt(pointsEl.innerText) + toRemove.length).toString()
    clearNewBalls()
    newBalls = Ball.generateNewBalls(window.balls)
    colorNewBalls()
    window.balls.push(...newBalls);
    render()
    if (window.balls.length >= MAP_WIDTH * MAP_HEIGHT) {
      finishGame();
      return;
    }
    toRemove.clear()
    toRemove = findToRemove(window.balls);
  } while (toRemove.length)
}
// export async function clearAndGenerateBalls2() {
//   let toRemove = findToRemove(window.balls);

//   window.balls = window.balls.filter(ba => !toRemove.find(b => ba.isEqual(b)))
//   toRemove.clear();
//   pointsEl.innerText = (parseInt(pointsEl.innerText) + toRemove.length).toString()

//   for (const ball of newBalls) {
//     ball.td.style.backgroundColor = ""
//   }
//   newBalls = Ball.generateNewBalls(window.balls)
//   for (const ball of newBalls) {
//     ball.td.style.backgroundColor = "rgba(123, 45, 99, 0.8)"
//   }
//   window.balls.push(...newBalls);
//   render();
//   if (window.balls.length >= MAP_WIDTH * MAP_HEIGHT) {
//     console.log("too many balls")
//     finishGame();
//     return;
//   }

//   toRemove = findToRemove(window.balls);

//   if (toRemove.length) {
//     render();
//     await sleep(1000);
//     window.balls = window.balls.filter(ba => !toRemove.find(b => ba.isEqual(b)))
//     toRemove.clear();
//     pointsEl.innerText = (parseInt(pointsEl.innerText) + toRemove.length).toString()
//   }
//   if (window.balls.length >= MAP_WIDTH * MAP_HEIGHT) {
//     finishGame();
//     return;
//   }
//   render();
// }

/**
  * Function that handles finishing the game
  * @param finish - should it finish the game or only do everything except it
*/
export function finishGame(finish = true) {
  turnIsChanging = true;
  const gameTime = ((Date.now() - window.startTime) / 1000).toFixed(2)
  if (finish) {
    setTimeout(() => {
      alert("You lost, because you are too bad even for simple Boules game, you have made " + pointsEl.innerText + " points. It took you " + `${gameTime} seconds`)
      throw new Error("Game has been finished")
    }, 1)
  }
}
/**
  * Function that is set as OnClickHandler for td elements
  * @param _e - not used
*/
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

/**
  * Function that is set as MouseEnter for td elements
  * @param _e - not used
  * @param x - x cordinate of td
  * @param y - y cordinate of td
*/
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

/**
  * Function that renders the balls
  * @param balls - array of current {@link Ball} if null then use global balls
*/
export function render(balls?: Ball[]) {
  balls = balls ? balls : window.balls;
  for (const ball of balls) {
    const { x, y, color } = ball;
    const td = getTd(x, y);
    td.firstChild.style.backgroundColor = color;

    td.onmousedown = () => {
      if (turnIsChanging || ballCantMove(ball)) return;
      const circle = td.firstChild as HTMLDivElement;
      setCurrentPath([]);
      const smallerCircle = () => {
        if (!selectedBall || turnIsChanging) return;
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

/** 
  * Checks if selcted ball can mpve anywhere
  * @param ball ball to check
*/
export function ballCantMove(ball: Ball): boolean {
  const sb = ball;
  const top = !!window.balls.find(b => b.x === sb.x && b.y === sb.y + 1) || sb.y + 1 >= MAP_HEIGHT
  const bottom = !!window.balls.find(b => b.x === sb.x && b.y === sb.y - 1) || sb.y - 1 < 0
  const right = !!window.balls.find(b => b.x === sb.x + 1 && b.y === sb.y) || sb.x + 1 >= MAP_WIDTH
  const left = !!window.balls.find(b => b.x === sb.x - 1 && b.y === sb.y) || sb.x - 1 < 0

  const out = (top && bottom && left && right)
  return out;
}

/**
  * Function that clear visual look of given td
  * @param td - td (HTML td element)
*/
export function clearTd(td: Td) {
  if (td.localName !== "td") {
    throw new Error("Not td passed to clearTd()");
  }
  td.innerHTML = ""
  td.onmousedown = null;
  td.style.backgroundColor = ""
  td.appendChild(document.createElement("div"))
}

/** Funtion that generates game table */
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

/** Setter for funny text on funny element */
export function setFunnyText(t: string) {
  document.querySelector("#funny")!.innerHTML = t;
}

/** Getter for game map HTML element */
export function getGameMapEl(): HTMLTableElement {
  return document.querySelector('table')!
}

/** Fixes HTMLTableCellElement interface */
export interface Td extends HTMLTableCellElement {
  firstChild: HTMLDivElement;
}

/**
  * Getter for td element at given cordinates
  * @param x - x coordinate
  * @param y - y coordinate
  * @return wanted td
*/
export function getTd(x: number, y: number): Td {
  return getGameMapEl().children[x].children[y] as Td;
}
/** HTML element when points are visible */
export const pointsEl = document.querySelector("h3 span") as HTMLSpanElement
