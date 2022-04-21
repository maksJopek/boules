import './style.css'

/* For documentation only */
import * as UI from "./ui";
// import * as Consts from "./consts";
// import * as Map from "./map";
// import * as Utils from "./utils";
import * as Ball from "./Ball";
// import * as Pathfinder from "./pathfinder";
// import * as Graph from "./pathfinder/Graph";
// export { UI, Consts, Map, Utils, Ball, Pathfinder, Graph };

/** Global array of {@linkcode Ball} */
declare global {
  interface Window { balls: Ball.Ball[]; startTime: number; }
}

/** Sets preview of next balls */
Ball.Nexts.setEls();
/** Generate stat balls */
window.balls = Ball.Ball.generateNewBalls([]);

/** Generate html table for balls */
UI.genGameTable();
/** renders balls */
UI.render();
window.startTime = Date.now()
