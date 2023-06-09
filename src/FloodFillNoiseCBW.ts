import * as p5 from "p5";
import { Pixel } from "./Pixel";

export class FloodFillNoiseCBW {
  static BlackPixel = new Pixel(0, 0, 0, 0);

  constructor(private _p5: p5, private _expa: number, private _rez: number) {}

  floodFillNoise(
    seed: p5.Vector,
    baseFillColor: Pixel,
    noiseTime: number,
    noiseIncrement: number
  ) {
    this._p5.loadPixels();
    let stack = 0;
    let index = 4 * (this._p5.width * seed.y + seed.x);

    // store the color at the seed fill point
    const oldColor = new Pixel(
      this._p5.pixels[index],
      this._p5.pixels[index + 1],
      this._p5.pixels[index + 2],
      this._p5.pixels[index + 3]
    );

    if (Pixel.pixelEquals(baseFillColor, oldColor, 10)) {
      return;
    }

    // if close to black, stop
    if (
      this._p5.pixels[index] < 10 &&
      this._p5.pixels[index + 1] < 10 &&
      this._p5.pixels[index + 2] < 10
    ) {
      return;
    }

    let queue: p5.Vector[] = [];

    queue.push(seed); //put the seed (starting vector) into new array

    while (queue.length && stack < 500000 * this._expa * 5) {
      // go until array is empty
      stack++;
      let current = queue.pop(); //current equals last element (vector) in queue array and then that last element is removed from array
      index = 4 * (this._p5.width * current.y + current.x);

      let thisPixColor = new Pixel(
        this._p5.pixels[index],
        this._p5.pixels[index + 1],
        this._p5.pixels[index + 2],
        this._p5.pixels[index + 3]
      );

      // don't do below function if the colors are the same
      if (!Pixel.pixelEquals(thisPixColor, oldColor, 10)) {
        continue;
      }

      const n1 =
        this._p5.noise(
          current.x * this._rez + noiseTime,
          current.y * this._rez + noiseTime
        ) * 1.4;
      this._p5.pixels[index + 0] = baseFillColor.r * n1;
      this._p5.pixels[index + 1] = baseFillColor.g * n1;
      this._p5.pixels[index + 2] = baseFillColor.b * n1;
      this._p5.pixels[index + 3] = baseFillColor.alpha;

      //fill current pixel with variations of fill color
      queue = this.expandToNeighboursOrig(this._p5, queue, current);
    } //replacing the queue array with new array from the called function

    this._p5.updatePixels();

    noiseTime += noiseIncrement;
  }

  private expandToNeighboursOrig(
    p: p5,
    queue: p5.Vector[],
    current: p5.Vector
  ) {
    let x3 = current.x;
    let y3 = current.y;
    // if within window boundaries, add new vectors to array above, below, and to sides of current position;

    if (y3 < p.height + 1) {
      queue.push(p.createVector(x3, y3 + 1));
    }
    if (y3 > -1) {
      queue.push(p.createVector(x3, y3 - 1));
    }
    if (x3 > -1) {
      queue.push(p.createVector(x3 - 1, y3));
    }
    if (x3 < p.width + 1) {
      queue.push(p.createVector(x3 + 1, y3));
    }
    return queue;
  }
}
