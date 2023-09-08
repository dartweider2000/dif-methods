import Point from "./Point";

export default class Executer{
   private tay: number;
   private x_max: number;

   private x: number;
   private y: number;

   private pointList: Point[];

   constructor(tay: number, x_max: number, x_0: number, y_0: number){
      if(this.x_max < x_0)
         throw new Error();

      this.tay = tay;
      this.x_max = x_max;

      this.x= x_0;
      this.y = y_0;

      this.pointList = [];
   }

   private getDerivate(): number{
      return (this.y + 3.5 * (this.x - 1) - 3.5) / this.x;
   }

   private setNewY(){
      this.y = this.getDerivate() * this.tay + this.y;
   }

   private setNewX(){
      this.x += this.tay;
   }

   private addToList(){
      this.pointList.push(new Point(this.x, this.y));
   }

   public Start(){

   }
}