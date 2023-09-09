import Point from "./Point";

export default class Executer{
   private tay: number;
   private x_max: number;

   private x: number;
   private y: number;

   private pointList: Point[];

   private funcId: number;

   constructor(tay: number, x_max: number, x_0: number, y_0: number, functId: number){
      if(this.x_max < x_0)
         throw new Error();

      this.tay = tay;
      this.x_max = x_max;

      this.x= x_0;
      this.y = y_0;

      this.funcId = functId;
      console.log(this.funcId);

      this.pointList = [];
      this.addToList();
   }

   private getDerivate(): number{
      switch(this.funcId){
         case 1:
            return (this.y + 3.5 * (this.x - 1) - 3.5) / this.x;
         case 2:
            return Math.sin(this.x) + 1 / this.y;
         case 3:
            return this.x**2 - 2 * this.y - 50;
         case 4:
            return 2 * this.y + this.x;
         default:
            return (this.y + 3.5 * (this.x - 1) - 3.5) / this.x;
      }
   }

   private setNewY(): void{
      this.y = this.getDerivate() * this.tay + this.y;
   }

   private setNewX(): void{
      this.x += this.tay;

      // if(!this.x)
      //    this.setNewX();
   }

   private addToList(): void{
      this.pointList.push(new Point(this.x, this.y));
   }

   private loop(): void{
      while(this.x_max > this.x){
         this.setNewY();
         this.setNewX();
         this.addToList();
      }

      //console.log(this.pointList);
   }

   public Start(): void{
      this.loop();
   }

   public get PointList(): Point[]{
      return this.pointList;
   }
}