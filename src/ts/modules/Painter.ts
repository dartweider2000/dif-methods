import Point from "./Point";

export default class Painter{
   private locations: Point[];
   private cx: CanvasRenderingContext2D;
   private scaleMetrix: Point;
   private canvas: HTMLCanvasElement;
   private maxMinPoints: [number, number, number, number];

   constructor(pointList: Point[], canvas: HTMLCanvasElement){
      this.canvas = canvas;
      this.cx = this.canvas.getContext('2d')!;

      this.maxMinPoints = this.fitlerPointList(pointList);
      this.scaleMetrix = this.printCoordLines(...this.maxMinPoints);
      this.locations = this.convertLocations(pointList);

      console.log(this.locations);

      //this.printCoordLines();

      this.loop = this.loop.bind(this);

      this.cx.fillStyle = 'orange';
      this.cx.fillRect(0, 0, canvas.width, canvas.height);
   }

   private renderAxis(): void{
      // const obj = {
      //    'Zero': {'text': '-2', point: },
      //    'Y': {
      //       '-2': {'text': '-2', point: }
      //    }
      // };

   }

   private fitlerPointList(pointList: Point[]): [number, number, number, number]{
      return pointList.reduce((result: [number, number, number, number], value: Point) => {

         if(value.Y > result[0])
            result[0] = value.Y;

         if(value.Y < result[1])
            result[1] = value.Y;


         if(value.X > result[2])
            result[2] = value.X;

         if(value.X < result[3])
            result[3] = value.X;

         return result;
      }, [pointList[0].Y, 0, pointList[0].X, 0]);
   }

   private printCoordLines(highY: number, lowY: number, highX: number, lowX: number): Point{
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;

      const scaleCoordX = canvasWidth / (Math.abs(highX) + Math.abs(lowX));
      const scaleCoordY = canvasHeight / (Math.abs(highY) + Math.abs(lowY));

      console.log(highX, lowX, highY, lowY);
      console.log(canvasWidth, canvasHeight);

      console.log(scaleCoordX, scaleCoordY);

      return new Point(scaleCoordX, scaleCoordY);
   }

   //private 
   private convertLocations(pointList: Point[]): Point[]{
      return pointList.map(point => new Point(Math.abs(point.X) * this.scaleMetrix.X, this.canvas.height - Math.abs(point.Y) * this.scaleMetrix.Y));
   }

   private renderArc(point: Point){
      this.cx.beginPath();
      this.cx.fillStyle = 'red';
      this.cx.arc(point.X, point.Y, 3, 0, 2 * Math.PI, true);
      this.cx.fill();
   }

   private loop(){
      this.locations.forEach(point => this.renderArc(point));


      //requestAnimationFrame(this.loop);
   }

   public Start(){
      //this.loop();
      requestAnimationFrame(this.loop);
   }
}