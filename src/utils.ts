/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
export function getRandomEl<T>(arr: Array<T>): T {
  return arr[getRandomInt(0, arr.length)];
}
