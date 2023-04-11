import * as p5 from "p5";
import { PixelHelper } from "./PixelHelper";
import { FloodFillNoiseCBW } from "./FloodFillNoiseCBW";

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(220);
    p.ellipse(50, 50, 80, 80);
    p.quad(100, 100, 100, 200, 200, 200, 200, 100);

    p.loadPixels();

    const ph: PixelHelper = new PixelHelper(
      p.pixels,
      p.width,
      p.height,
      p.pixelDensity()
    );

    const px = ph.getPixel(10, 10);

    console.log(JSON.stringify(px, null, 2));

    p.updatePixels();

    const ff = new FloodFillNoiseCBW(p);

    p.noLoop();

    // console.log("Draw!");
  };
};

export const myp5 = new p5(sketch, document.body);
