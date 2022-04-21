/**
  * @module Ball
*/
import { START_NO_OF_BALLS, MAP_WIDTH, MAP_HEIGHT, COLORS } from "./consts";
import { getRandomInt, getRandomEl } from "./utils";
import { finishGame, getTd, setFunnyText } from "./ui";

/** Ball is the class for holding ball data and ball logic */
export class Ball {
  /// x coordinate
  x: number;
  /// y coordinate
  y: number;
  /// color of ball
  color: string;

  /**
    * Basic constructor for ball
    * @param x x coord
    * @param y y coord
    * @param color color 
  */
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  /**
    * Getter for this ball <td>
    * @returns Td of this ball
  */
  get td() {
    return getTd(this.x, this.y);
  }

  /**
    * Helper 
    * @param b Another abll to check for equality with this
    * @returns True if balls have same coordinates else false
  */
  isEqual(b: Ball) {
    if (!b) throw Error("b is undeifneds")
    if (!this) throw Error("this is undeifneds")
    return this.x === b.x && this.y === b.y;
  }

  /** Makes generating balls more funny */
  @funny
  /**
    * Creates table of new balls
    * @param currentBalls Current balls
    * @returns New balls
  */
  static generateNewBalls(currentBalls: Ball[]): Array<Ball> {
    const out = <Ball[]>[];
    for (let i = 0; i < START_NO_OF_BALLS; i++) {
      let x: number, y: number, color: string;
      do {
        [x, y, color] = [getRandomInt(0, MAP_HEIGHT), getRandomInt(0, MAP_WIDTH), Nexts.pop()];
        if (currentBalls.length + out.length >= MAP_WIDTH * MAP_HEIGHT) {
          finishGame(false);
          return out;
        }
      } while (
        out.find(b => b.x === x && b.y === y) ||
        currentBalls.find(b => b.x === x && b.y === y)
      )
      out.push(new Ball(x, y, color));
    }
    // out.push(new Ball(1, 1, COLORS[1]))
    return out;
  }
}
/**
 * Function used only as a decorator, makes `generateNewBalls` more funny
 * @param _target - not used
 * @param _propertyKey - name of decorated function
 * @param descriptor - object with decorated function
*/
function funny(_target: any, _propertyKey: "generateNewBalls", descriptor: PropertyDescriptor) {
  const orig = descriptor.value;
  descriptor.value = function(currentBalls: Ball[]) {
    let bolzNumber = currentBalls.length + START_NO_OF_BALLS;
    if (bolzNumber > 81) bolzNumber = 81

    const txts = [
      "Mmmmmm masz " + bolzNumber + " kuleczek",
      bolzNumber + " pysznych kuleczek",
      "Masz jakas rozowa kuleczke?",
      "Show me your bolz!",
      "Deez nuts",
      `Vous avez ${bolzNumber} boules`,
      "Yummy yummu yummy, must be funny",
      "Ou, I thought you died of ligma",
      "Kuleczek moc!!",
      "Keep it goin' bro",
      "You know deez?",
      "Luuubie kuleczki ^^",
      "BoulzNumber: " + bolzNumber + ". It's under 9000!",
    ]
    setFunnyText(getRandomEl(txts))
    return orig(currentBalls);
  };
};
/** Class wraper for showing next balls */
export class Nexts {
  /** HTMLDivElements that shows next balls */
  static els = Array.from(document.querySelectorAll("#next div")) as HTMLDivElement[]

  /** Setter to properly set new next balls */
  static setEls() {
    for (const el of this.els) {
      if (el.style.backgroundColor === "") {
        el.style.backgroundColor = getRandomEl(COLORS);
      }
    }
  }

  /** Function to get first new color and rotate rest of them */
  static pop() {
    const out = this.els[0].style.backgroundColor;
    this.els[0].style.backgroundColor = this.els[1].style.backgroundColor;
    this.els[1].style.backgroundColor = this.els[2].style.backgroundColor
    this.els[2].style.backgroundColor = getRandomEl(COLORS)
    return out;
  }
}
