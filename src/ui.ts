import Ball from "./Ball";
import { MAP_WIDTH, MAP_HEIGHT, TD_SIZE, CIRCLE_SIZE } from "./consts";

let selectedBall: Ball | null = null;
let smallerCircle = () => { };

export function tdOnclick(el: PointerEvent) {
  if (!selectedBall) return;
  // Calc which x, y is clicked
  // pass to shortest path
  // ui
}
export function render(balls: Ball[]) {
  for (const ball of balls) {
    const { x, y, color } = ball;
    const td = getTd(x, y);
    (td.firstChild as HTMLDivElement).style.backgroundColor = color;

    td.onclick = () => {
      const circle = td.firstChild as HTMLDivElement;

      if (circle.style.width === TD_SIZE) {
        smallerCircle();
        selectedBall = null;
        return;
      }
      smallerCircle();


      circle.style.width = TD_SIZE;
      circle.style.height = TD_SIZE;
      selectedBall = ball;

      smallerCircle = () => {
        circle.style.width = CIRCLE_SIZE;
        circle.style.height = CIRCLE_SIZE;
      }
    };
  }
}
// setInterval(() => console.log(selectedBall), 1000);
export function genGameTable() {
  const table = getGameMapEl();
  for (let i = 0; i < MAP_HEIGHT; i++) {
    const tr = document.createElement("tr")
    for (let j = 0; j < MAP_WIDTH; j++) {
      const td = document.createElement("td")
      //@ts-expect-error
      td.onclick = tdOnclick;
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
