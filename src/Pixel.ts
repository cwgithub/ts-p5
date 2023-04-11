export class Pixel {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public alpha: number
  ) {}

  static pixelEquals(a: Pixel, b: Pixel, tolerance: number = 0) {
    return (
      Math.abs(a.r - b.r) < tolerance &&
      Math.abs(a.g - b.g) < tolerance &&
      Math.abs(a.b - b.b) < tolerance
    );
  }
}
