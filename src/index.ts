import * as p5 from "p5";

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(220);
    p.ellipse(50, 50, 80, 80);
    p.quad(100, 100, 100, 200, 200, 200, 200, 100);
    // console.log("Draw!");
  };
};

export const myp5 = new p5(sketch, document.body);
