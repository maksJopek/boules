import { START_NO_OF_BALLS, MAP_WIDTH, MAP_HEIGHT, COLORS } from "./consts";
import { getRandomInt, getRandomEl } from "./utils";

export default class Ball {
  x: number;
  y: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
  static generateNewBalls(): Array<Ball> {
    const out = <Ball[]>[];
    for (let i = 0; i < START_NO_OF_BALLS; i++) {
      let x: number, y: number, color: string;
      do {
        [x, y, color] = [getRandomInt(0, MAP_HEIGHT), getRandomInt(0, MAP_WIDTH), getRandomEl(COLORS)];
      } while (out.filter(b => b.x === x && b.y === y).length !== 0)
      out.push(new Ball(x, y, color));
    }
    return out;
  }
}
