import Point from "./Point";

export default class Painter{
   private pointList: Point[];
   private cx: CanvasRenderingContext2D;

   constructor(pointList: Point[], canvas: HTMLCanvasElement){
      this.pointList = pointList;
      this.cx = canvas.getContext('2d')!;

      this.loop = this.loop.bind(this);

      this.cx.fillStyle = 'orange';
      this.cx.fillRect(0, 0, canvas.width, canvas.height);
   }

   //private 

   private loop(){



      requestAnimationFrame(this.loop);
   }

   public Start(){
      this.loop;
   }
}