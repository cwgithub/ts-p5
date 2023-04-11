import * as p5 from "p5";
import { Color } from "p5";
import { Pixel } from "./Pixel";

export class FloodFillNoiseCBW {
  constructor(
    private p: p5,
    private _expa: number,
    private _rez: number,
    private _j: p5.Color
  ) {}

  floodFillNoise(
    seed: p5.Vector,
    fillColor: Pixel,
    noiseTime: number,
    noiseIncrement: number
  ) {
    let done = false;
    let stack = 0;
    let index = 4 * (p.width * seed.y + seed.x);

    // store the color where the seed is pointing
    const oldColor = new Pixel(
      p.pixels[index],
      p.pixels[index + 1],
      p.pixels[index + 2],
      p.pixels[index + 3]
    );

    if (this.pixelEquals(fillColor, oldColor)) {
      done = true;
      return;
    }

    if (
      p.pixels[index] < 10 &&
      p.pixels[index + 1] < 10 &&
      p.pixels[index + 2] < 10
    ) {
      done = true; //if close to black, stop
      return;
    }

    let queue: p5.Vector[] = [];

    queue.push(seed); //put the seed (starting vector) into new array

    while (queue.length && stack < 500000 * this._expa * 5) {
      // go until array is empty
      stack++;
      let current = queue.pop(); //current equals last element (vector) in queue array and then that last element is removed from array
      index = 4 * (p.width * current.y + current.x);
      let thisPixColor = new Pixel(
        p.pixels[index],
        p.pixels[index + 1],
        p.pixels[index + 2],
        p.pixels[index + 3]
      );

      if (!Pixel.pixelEquals(thisPixColor, oldColor)) {
        continue;
      } //don't do below function if the colors are the same

      const n1 =
        p.noise(
          current.x * this._rez + noiseTime,
          current.y * this._rez + noiseTime
        ) * 1.4;
      p.pixels[index + 0] = fillColor.r * n1;
      p.pixels[index + 1] = fillColor.g * n1;
      p.pixels[index + 2] = fillColor.b * n1;
      p.pixels[index + 3] = fillColor.alpha;

      //fill current pixel with variations of fill color
      queue = this.expandToNeighboursOrig(p, queue, current);
    } //replacing the queue array with new array from the called function

    p.updatePixels();
    done = true;
    j++;
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
