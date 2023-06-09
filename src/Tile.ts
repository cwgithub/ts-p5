export class Tile {
  constructor(
    private _id: string,
    private _north: p5.Vector,
    private _east: p5.Vector,
    private _south: p5.Vector,
    private _west: p5.Vector
  ) {}

  public get id(): string {
    return this._id;
  }

  public get north(): p5.Vector {
    return this._north;
  }

  public get east(): p5.Vector {
    return this._east;
  }

  public get south(): p5.Vector {
    return this._south;
  }

  public get west(): p5.Vector {
    return this._west;
  }

  // pointsList(): number[] {
  //   return [
  //     this.north.x,
  //     this.north.y,
  //     this.east.x,
  //     this.east.y,
  //     this.south.x,
  //     this.south.y,
  //     this.west.x,
  //     this.west.y,
  //   ];
  // }
}
