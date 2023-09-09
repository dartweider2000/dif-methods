export default class MinMaxValues{
   public readonly XMax: number;
   public readonly YMax: number;
   public readonly XMin: number;
   public readonly YMin: number;

   constructor(YMax: number,YMin: number, XMax: number, XMin: number){
      this.XMax = XMax;
      this.YMax = YMax;
      this.XMin = XMin;
      this.YMin = YMin;
   }
}