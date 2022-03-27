import { START_NO_OF_BALLS, MAP_WIDTH, MAP_HEIGHT, COLORS } from "./consts";
import { getRandomInt, getRandomEl } from "./utils";
import { getTd } from "./ui";

export default class Ball {
  x: number;
  y: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  get td() {
    return getTd(this.x, this.y);
  }
  isEqual(b: Ball) {
    if (!b) throw Error("b is undeifneds")
    if (!this) throw Error("this is undeifneds")
    return this.x === b.x && this.y === b.y;
  }

  static generateNewBalls(currentBalls: Ball[]): Array<Ball> {
    const out = <Ball[]>[];
    for (let i = 0; i < START_NO_OF_BALLS; i++) {
      let x: number, y: number, color: string;
      do {
        [x, y, color] = [getRandomInt(0, MAP_HEIGHT), getRandomInt(0, MAP_WIDTH), Nexts.pop()];
      } while (
        out.find(b => b.x === x && b.y === y) ||
        currentBalls.find(b => b.x === x && b.y === y)
      )
      out.push(new Ball(x, y, color));
    }
    return out;
  }
}

export class Nexts {
  static els = Array.from(document.querySelectorAll("#next div")) as HTMLDivElement[]
  static setEls() {
    for (const el of this.els) {
      if (el.style.backgroundColor === "") {
        el.style.backgroundColor = getRandomEl(COLORS);
      }
    }
  }
  static pop() {
    const out = this.els[0].style.backgroundColor;
    this.els[0].style.backgroundColor = this.els[1].style.backgroundColor;
    this.els[1].style.backgroundColor = this.els[2].style.backgroundColor
    this.els[2].style.backgroundColor = getRandomEl(COLORS)
    return out;
  }
}
