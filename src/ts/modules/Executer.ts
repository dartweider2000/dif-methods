import Point from "./Point";

export default class Executer{
   private tay: number;
   private x_max: number;

   private x: number;

   private y: [number, number];
   private yy: [number, number];

   private pointList: Point[];

   private funcId: number;

   constructor(tay: number, x_max: number, x_0: number, y_0: [number, number], functId: number){
      if(this.x_max < x_0)
         throw new Error();

      this.tay = tay;
      this.x_max = x_max;

      this.x= x_0;

      this.y = y_0;
      this.yy = [0, 0];

      this.funcId = functId;

      this.pointList = [];

      this.addToList(this.x, this.y[0]);
      this.addToList(this.x, this.y[1]);
   }

   private getDerivate(x: number, y: [number, number], i: number): number{
      // switch(this.funcId){
      //    case 1:
      //       return (this.y + 3.5 * (this.x - 1) - 3.5) / this.x;
      //    case 2:
      //       return Math.sin(this.x) + 1 / this.y;
      //    case 3:
      //       return this.x**2 - 2 * this.y - 50;
      //    case 4:
      //       return 2 * this.y + this.x;
      //    default:
      //       return (this.y + 3.5 * (this.x - 1) - 3.5) / this.x;
      // }
      if(this.funcId == 5){
         switch(i){
            case 0:
               return Math.sin(x + y[0] * y[1]);
            case 1:
               return Math.cos(x**2 - y[0] + y[1]);
            default:
               return 0;
         }
      }else if(this.funcId == 6){
         switch(i){
            case 0:
               return y[1];
            case 1:
               return -0.04 * Math.E**(-x);
            default:
               return 0;
         }
      }else{
         return 0;
      }
   }

   // private setNewY(): void{
   //    this.y = this.getDerivate() * this.tay + this.y;
   // }

   private setNewX(): void{
      this.x += this.tay;

      // if(!this.x)
      //    this.setNewX();
   }

   private addToList(x: number, y: number): void{
      this.pointList.push(new Point(x, y));
   }

   private loop(): void{
      for(this.x; this.x < this.x_max; this.x += this.tay){

         for(let i = 0; i < this.y.length; i++){
            this.yy[i] = this.getDerivate(this.x, this.y, i) * this.tay + this.y[i]; 
         }

         for(let i = 0; i < this.y.length; i++){
            this.y[i] = this.yy[i];

            this.addToList(this.x, this.y[i]);
         }
      }

      // while(this.x_max > this.x){
      //    this.setNewY();
      //    this.setNewX();
      //    this.addToList();
      // }

      //console.log(this.pointList);
   }

   public Start(): void{
      this.loop();
   }

   public get PointList(): Point[]{
      return this.pointList;
   }
}