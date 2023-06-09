import * as p5 from "p5";
import { PixelHelper } from "./PixelHelper";
import { FloodFillNoiseCBW } from "./FloodFillNoiseCBW";
import { Pixel } from "./Pixel";

export const sketch = (p: p5) => {
  const gridSize = 10;
  const edgeLength = 80;
  let yOffset = 0;

  const TILE_WIDTH = edgeLength;
  const TILE_WIDTH_HALF = TILE_WIDTH / 2;
  const TILE_HEIGHT = edgeLength / 2;
  const TILE_HEIGHT_HALF = TILE_HEIGHT / 2;

  function gridToScreen(grid: p5.Vector): p5.Vector {
    return new p5.Vector(
      (grid.x - grid.y) * TILE_WIDTH_HALF,
      (grid.x + grid.y) * TILE_HEIGHT_HALF
    );
  }

  function screenToRendered(screen: p5.Vector): p5.Vector {
    return new p5.Vector(500 + screen.x, yOffset + screen.y);
  }

  function drawGridOutline(points: p5.Vector[]) {
    // draw the outline of the grid base
    p.beginShape();
    p.color(123, 100);
    p.strokeWeight(1);
    p.noFill();
    p.quad(
      // top
      screenToRendered(points[0]).x,
      screenToRendered(points[0]).y,
      // leftmost
      screenToRendered(points[gridSize - 1]).x,
      screenToRendered(points[gridSize - 1]).y,
      // bottom
      screenToRendered(points[99]).x,
      screenToRendered(points[99]).y,
      // rightmost
      screenToRendered(points[90]).x,
      screenToRendered(points[90]).y
    );

    // p.translate(500 + points[0].x, yOffset + points[0].y);
    // p.vertex(500 + points[9].x, yOffset + points[9].y);
    p.endShape();
  }

  var table;
  var framePx = 150;

  p.setup = () => {
    // table = p.loadTable("/assets/colors.csv", "csv", "header");
    p.createCanvas(1000, 1000);

    p.strokeWeight(4);

    // yOffset = p.height - 10 * TILE_HEIGHT_HALF;

    yOffset = 200;

    const points: p5.Vector[] = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        let screen = gridToScreen(new p5.Vector(x, y));
        console.log(screen);
        points.push(screen);
      }
    }

    points.forEach((point) => {
      const renderedPoint = screenToRendered(point);
      p.point(renderedPoint.x, renderedPoint.y);
    });

    drawGridOutline(points);
  };
};

// p.draw = () => {
//   p.pixelDensity(1);
//   p.background(111);
//   p.noStroke();
//   p.quad(
//     framePx,
//     framePx,
//     framePx,
//     p.height - framePx,
//     p.width - framePx,
//     p.height - framePx,
//     p.width - framePx,
//     framePx
//   );

//   p.loadPixels();

//   const ph: PixelHelper = new PixelHelper(
//     p.pixels,
//     p.width,
//     p.height,
//     p.pixelDensity()
//   );

//   const px = ph.getPixel(10, 10);
//   console.log(JSON.stringify(px, null, 2));

//   p.updatePixels();

//   let expa = 1;
//   let rez = 0.013;

//   const floodFiller = new FloodFillNoiseCBW(p, expa, rez);
//   const fillColour = new Pixel(0, 255, 0, 123);
//   floodFiller.floodFillNoise(
//     p.createVector(framePx + 1, framePx + 1),
//     fillColour,
//     1000,
//     100
//   );
//   p.noLoop();
// };

export const myp5 = new p5(sketch, document.body);
