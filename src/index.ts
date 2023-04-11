import * as p5 from "p5";
import { PixelHelper } from "./PixelHelper";

export const sketch = (p5: p5) => {
  p5.setup = () => {
    p5.createCanvas(400, 400);
  };

  p5.draw = () => {
    p5.background(220);
    p5.ellipse(50, 50, 80, 80);
    p5.quad(100, 100, 100, 200, 200, 200, 200, 100);

    p5.loadPixels();

    const ph: PixelHelper = new PixelHelper(
      p5.pixels,
      p5.width,
      p5.height,
      p5.pixelDensity()
    );

    const px = ph.getPixel(10, 10);

    console.log(JSON.stringify(px, null, 2));

    p5.updatePixels();

    p5.noLoop();

    // console.log("Draw!");
  };
};

export const myp5 = new p5(sketch, document.body);
