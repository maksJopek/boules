import './style.css'

import Ball from "./Ball"
import { genGameTable, render } from "./ui";

const balls = Ball.generateStartBalls();
Ball.generateStartBalls();
// const map = <(Ball | null)[][]>[];

genGameTable();

render(balls);
