import AxisData from "./AxisData";
import Point from "./Point";

export default class Painter{
   private locations: Point[];
   private cx: CanvasRenderingContext2D;
   private scaleMetrix: Point;
   private canvas: HTMLCanvasElement;
   private maxMinValues: [number, number, number, number];

   constructor(pointList: Point[], canvas: HTMLCanvasElement){
      this.canvas = canvas;
      this.cx = this.canvas.getContext('2d')!;

      this.maxMinValues = this.fitlerPointList(pointList);
      this.scaleMetrix = this.printCoordLines(...this.maxMinValues);
      this.locations = this.convertLocations(pointList);

      console.log(this.locations);

      //this.printCoordLines();

      this.loop = this.loop.bind(this);

      this.cx.fillStyle = 'orange';
      this.cx.fillRect(0, 0, canvas.width, canvas.height);
   }

   private renderAxis(): void{
      const obj : {
         'Zero': AxisData | null,
         'Y': AxisData[],
         'X': AxisData[]
      } = { 'Zero': null, 'X': [], 'Y': [] };

      const deltaXZero = 0 - this.maxMinValues[3];
      const deltaYZero = 0 - this.maxMinValues[1];
      
      obj.Zero = new AxisData('0', new Point(this.convertXLocation(deltaXZero), this.convertYLocation(deltaYZero)));
      console.log(obj.Zero);

      this.renderArc(obj.Zero.Point, 10, 'green');
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

   private convertXLocation(x: number): number{
      return Math.abs(x) * this.scaleMetrix.X;
   }

   private convertYLocation(y: number): number{
      return this.canvas.height - Math.abs(y) * this.scaleMetrix.Y;
   }

   //private 
   private convertLocations(pointList: Point[]): Point[]{
      return pointList.map(point => new Point(this.convertXLocation(point.X), this.convertYLocation(point.Y)));
   }

   private renderArc(point: Point, radius: number = 3, color: string = 'red'){
      this.cx.beginPath();
      this.cx.fillStyle = color;
      this.cx.arc(point.X, point.Y, radius, 0, 2 * Math.PI, true);
      this.cx.fill();
   }

   private loop(){
      this.locations.forEach(point => this.renderArc(point));
      this.renderAxis();


      //requestAnimationFrame(this.loop);
   }

   public Start(){
      //this.loop();
      requestAnimationFrame(this.loop);
   }
}