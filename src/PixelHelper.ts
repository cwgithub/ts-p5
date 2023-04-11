export class Pixel {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public alpha: number
  ) {}
}

export class PixelHelper {
  constructor(
    public pixelsMatrix: number[],
    public imageWidth: number,
    public imageHeight: number,
    public pxDensity = 1
  ) {
    console.log("======================================");
    console.log(
      "_pixelsMatrix  : " +
        this.pixelsMatrix.length +
        " (pixels : " +
        this.pixelsMatrix.length / 4 +
        ")"
    );
    console.log("_imageWidth    : " + this.imageWidth);
    console.log("_imageHeight   : " + this.imageHeight);
    console.log("_pxDensity     : " + this.pxDensity);
    console.log("======================================");
  }

  getPixel(x: number, y: number): Pixel {
    let r: number;
    let g: number;
    let b: number;
    let a: number;

    for (let i = 0; i < this.pxDensity; i++) {
      for (let j = 0; j < this.pxDensity; j++) {
        const index =
          4 *
          ((y * this.pxDensity + j) * this.imageWidth * this.pxDensity +
            (x * this.pxDensity + i));
        r = this.pixelsMatrix[index];
        g = this.pixelsMatrix[index + 1];
        b = this.pixelsMatrix[index + 2];
        a = this.pixelsMatrix[index + 3];
        console.log(
          `-- ${x}, ${y} ----- ${i}, ${j} ------------------------------------`
        );
        console.log(`${index} r = ${r}`);
        console.log(`${index + 1} r = ${g}`);
        console.log(`${index + 2} r = ${b}`);
        console.log(`${index + 3} r = ${a}`);
      }
    }

    return new Pixel(r, g, b, a);
  }
}

// let img;
// function preload() {
//   img = loadImage("assets/rockies.jpg");
// }

// function setup() {
//   image(img, 0, 0, width, height);
//   let d = pixelDensity();
//   let halfImage = 4 * (width * d) * ((height * d) / 2);
//   loadPixels();
//   for (let i = 0; i < halfImage; i++) {
//     pixels[i + halfImage] = pixels[i];
//   }
//   updatePixels();
// }
