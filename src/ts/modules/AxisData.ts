import Point from "./Point";

export default class AxisData{
   public readonly Value: string | number;
   public readonly Point: Point;
   
   constructor(Value: string | number, Point: Point){
      this.Value = Value;
      this.Point = Point;
   }
}