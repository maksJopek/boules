import './style.css'

import Ball from "./Ball"
import { genGameTable, render } from "./ui";

declare global {
  interface Window { balls: Ball[]; }
}
const balls = Ball.generateNewBalls();
window.balls = balls;
// Ball.generateStartBalls();
// const map = <(Ball | null)[][]>[];

genGameTable();

render(balls);
