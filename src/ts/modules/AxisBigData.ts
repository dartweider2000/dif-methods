import AxisData from "./AxisData";

export default class AxisBigData{
   public Zero: AxisData | null;
   public Y: {
      'start': AxisData | null,
      'end': AxisData | null,
   };
   public X: {
      'start': AxisData | null,
      'end': AxisData | null,
   };

   constructor(){
      this.Zero = null;
      this.Y = { 'start': null, 'end': null };
      this.X = { 'start': null, 'end': null };
   }
}