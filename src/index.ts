import * as p5 from "p5";
import { PixelHelper } from "./PixelHelper";
import { FloodFillNoiseCBW } from "./FloodFillNoiseCBW";
import { Pixel } from "./Pixel";
import { Tile } from "./Tile";

export const sketch = (p: p5) => {
  const gridPoints = 10;
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

  function screenToRendered(screen: p5.Vector, height = 0): p5.Vector {
    return new p5.Vector(500 + screen.x, yOffset - height + screen.y);
  }

  function drawGridOutline(gridPoints: number, points: p5.Vector[]) {
    // draw the outline of the grid base
    p.beginShape();
    p.color(123, 100);
    p.strokeWeight(1);
    p.noFill();

    const firstOfLastCol = (gridPoints - 1) * gridPoints;
    const lastPoint = gridPoints * gridPoints - 1;

    p.quad(
      // top
      screenToRendered(points[0]).x,
      screenToRendered(points[0]).y,
      // leftmost
      screenToRendered(points[gridPoints - 1]).x,
      screenToRendered(points[gridPoints - 1]).y,
      // bottom
      screenToRendered(points[lastPoint]).x,
      screenToRendered(points[lastPoint]).y,
      // rightmost
      screenToRendered(points[firstOfLastCol]).x,
      screenToRendered(points[firstOfLastCol]).y
    );

    p.endShape();
  }

  function drawTile(tile: Tile) {
    // draw the outline of the grid base
    p.beginShape();
    p.strokeWeight(0);
    p.fill(200, 200, 200);

    const n = screenToRendered(tile.north);
    const e = screenToRendered(tile.east);
    const s = screenToRendered(tile.south);
    const w = screenToRendered(tile.west);

    p.quad(n.x, n.y, e.x, e.y, s.x, s.y, w.x, w.y);

    p.endShape();
  }

  function drawCube(tile: Tile) {
    // draw the outline of the grid base
    p.beginShape();
    p.strokeWeight(1);

    const baseN = screenToRendered(tile.north);
    const baseE = screenToRendered(tile.east);
    const baseS = screenToRendered(tile.south);
    const baseW = screenToRendered(tile.west);

    const topN = screenToRendered(tile.north, TILE_HEIGHT);
    const topE = screenToRendered(tile.east, TILE_HEIGHT);
    const topS = screenToRendered(tile.south, TILE_HEIGHT);
    const topW = screenToRendered(tile.west, TILE_HEIGHT);

    // base
    p.fill(255, 64, 64, 12);
    // p.quad(
    //   baseN.x,
    //   baseN.y,
    //   baseE.x,
    //   baseE.y,
    //   baseS.x,
    //   baseS.y,
    //   baseW.x,
    //   baseW.y
    // );

    // y end
    p.fill(0, 255, 64);
    p.quad(topE.x, topE.y, baseE.x, baseE.y, baseS.x, baseS.y, topS.x, topS.y);

    // x wns
    p.fill(255, 64, 64);
    p.quad(topS.x, topS.y, baseS.x, baseS.y, baseW.x, baseW.y, topW.x, topW.y);

    // top
    p.fill(64, 64, 255);
    p.quad(topN.x, topN.y, topE.x, topE.y, topS.x, topS.y, topW.x, topW.y);

    p.endShape();
  }

  function mergeTiles(startTile: Tile, endTile: Tile): Tile {
    const xDiff = startTile.gridX - endTile.gridX;
    const yDiff = startTile.gridY - endTile.gridY;

    if (xDiff !== 0 && yDiff !== 0) {
      throw new Error("Tiles must be on the same X or Y axis");
    }

    let north, east, south, west: p5.Vector;

    // on same Y axis
    if (xDiff === 0) {
      if (yDiff < 0) {
        north = startTile.north;
        east = startTile.east;
        south = endTile.south;
        west = endTile.west;
      } else {
        north = endTile.north;
        east = endTile.east;
        south = startTile.south;
        west = startTile.west;
      }
    }

    // on same X axis
    if (yDiff === 0) {
      if (xDiff < 0) {
        north = startTile.north;
        east = endTile.east;
        south = endTile.south;
        west = startTile.west;
      } else {
        north = endTile.north;
        east = startTile.east;
        south = startTile.south;
        west = endTile.west;
      }
    }

    return new Tile(
      `Merged ${startTile.id} and ${endTile.id}`,
      null,
      null,
      north,
      east,
      south,
      west
    );
  }

  function pointsToTiles(gridPoints: number, points: p5.Vector[]): Tile[][] {
    const tiles = [];

    for (let x = 0; x < gridPoints - 1; x++) {
      const row = [];
      for (let y = 0; y < gridPoints - 1; y++) {
        const n = x * gridPoints + y;
        const e = n + gridPoints;
        const s = e + 1;
        const w = n + 1;
        const tile = new Tile(
          `[${x},${y}]`,
          x,
          y,
          points[n],
          points[e],
          points[s],
          points[w]
        );
        row.push(tile);
      }
      tiles.push(row);
    }

    return tiles;
  }

  var table;
  var framePx = 150;

  p.setup = () => {
    // table = p.loadTable("/assets/colors.csv", "csv", "header");
    p.createCanvas(1000, 1000);

    // yOffset = p.height - 10 * TILE_HEIGHT_HALF;

    yOffset = 200;

    const points: p5.Vector[] = [];

    for (let x = 0; x < gridPoints; x++) {
      for (let y = 0; y < gridPoints; y++) {
        let screen = gridToScreen(new p5.Vector(x, y));
        console.log(screen);
        points.push(screen);
      }
    }

    p.strokeWeight(0.5);
    points.forEach((point) => {
      const renderedPoint = screenToRendered(point);
      p.point(renderedPoint.x, renderedPoint.y);
    });

    drawGridOutline(gridPoints, points);

    const tiles = pointsToTiles(gridPoints, points);

    // drawTile(tiles[2][2]);
    // drawCube(tiles[0][1]);

    const mergedTitle = mergeTiles(tiles[0][4], tiles[0][1]);
    drawCube(mergedTitle);

    drawCube(mergeTiles(tiles[0][6], tiles[4][6]));
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
