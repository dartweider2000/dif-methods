import Point from "./Point";

export default class FullLocations{
   public readonly ProgramPoint: Point;
   public readonly MathPoint: Point;

   constructor(ProgramPoint: Point, MathPoint: Point){
      this.ProgramPoint = ProgramPoint;
      this.MathPoint = MathPoint;
   }
}