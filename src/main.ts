import './style.css'

import Ball, { Nexts } from "./Ball"
import { genGameTable, render } from "./ui";

declare global {
  interface Window { balls: Ball[]; }
}
Nexts.setEls();
window.balls = Ball.generateNewBalls([]);

genGameTable();
render();
