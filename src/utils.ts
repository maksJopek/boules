/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * @param min - minimum
 * @param max - maximum
 * @returns Random int
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
/**
  * Gets random element from array
  * @typeParam T - type of elements inside given array
  * @param arr - array
  * @returns Random element from given array
*/
export function getRandomEl<T>(arr: Array<T>): T {
  return arr[getRandomInt(0, arr.length)];
}
/**
  * Function that sleeps
  * @param time - sleep for this time [ms]
  * @returns Promise that resolves after `time`s
*/
export async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

