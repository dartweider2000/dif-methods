import AxisData from "./AxisData";
import FullLocations from "./FullLocations";
import Point from "./Point";
import Size from "./Size";

export default class Painter{
   private locations: FullLocations[];
   private cx: CanvasRenderingContext2D;
   private scaleMetrix: Point;
   private canvas: HTMLCanvasElement;
   private maxMinValues: [number, number, number, number];
   private canvasSize: Size;
   private canvasPadding: number;
   private pointList: Point[];

   constructor(pointList: Point[], canvas: HTMLCanvasElement){
      this.canvas = canvas;
      this.cx = this.canvas.getContext('2d')!;

      this.canvasPadding = 20;
      this.canvasSize = new Size(this.canvas.width - this.canvasPadding * 2, this.canvas.height - this.canvasPadding * 2);

      this.pointList = pointList;
      this.maxMinValues = this.fitlerPointList(this.pointList);
      this.scaleMetrix = this.printCoordLines(...this.maxMinValues);
      this.locations = this.convertLocations(this.pointList);

      console.log(this.locations);

      //this.printCoordLines();

      this.loop = this.loop.bind(this);

      this.cx.fillStyle = 'orange';
      this.cx.fillRect(0, 0, canvas.width, canvas.height);
   }

   private renderAxis(): void{
      const obj : {
         'Zero': AxisData | null,
         'Y': {
            'start': AxisData | null,
            'end': AxisData | null,
            'other': AxisData[]
         },
         'X': {
            'start': AxisData | null,
            'end': AxisData | null,
            'other': AxisData[]
         },
      } = { 'Zero': null, 'X': { 'end': null, 'start': null, 'other': []}, 'Y': { 'end': null, 'start': null, 'other': []} };

      const deltaXZero = 0 - this.maxMinValues[3];
      const deltaYZero = 0 - this.maxMinValues[1];
      
      obj.Zero = new AxisData('0', new Point(this.convertXLocation(deltaXZero), this.convertYLocation(deltaYZero)));
      console.log(obj.Zero);

      this.renderArc(obj.Zero.Point, 10, 'green');

      if(this.maxMinValues[3] < 0){
         const start = this.locations.find(loc => loc.MathPoint.X == this.maxMinValues[3])!;
         obj.X.start = new AxisData(`${~~start.MathPoint.X}`, new Point(start.ProgramPoint.X, obj.Zero.Point.Y));
      }else{
         obj.X.start = obj.Zero;
      } 

      if(this.maxMinValues[2] > 0){
         const end = this.locations.find(loc => loc.MathPoint.X == this.maxMinValues[2])!;
         obj.X.end = new AxisData(`${~~end.MathPoint.X}`, new Point(end.ProgramPoint.X, obj.Zero.Point.Y));
      }else{
         obj.X.end = obj.Zero;
      } 

      if(this.maxMinValues[1] < 0){
         const start = this.locations.find(loc => loc.MathPoint.Y == this.maxMinValues[1])!;
         obj.Y.start = new AxisData(`${~~start.MathPoint.Y}`, new Point(obj.Zero.Point.X, start.ProgramPoint.Y));
      }else{
         obj.Y.start = obj.Zero;
      } 

      if(this.maxMinValues[0] > 0){
         const end = this.locations.find(loc => loc.MathPoint.Y == this.maxMinValues[0])!;
         obj.Y.end = new AxisData(`${~~end.MathPoint.Y}`, new Point(obj.Zero.Point.X, end.ProgramPoint.Y));
      }else{
         obj.Y.end = obj.Zero;
      } 

      // this.renderArc(obj.X.start.Point, 10, 'blue');
      // this.renderArc(obj.X.end.Point, 10, 'blue');

      // this.renderArc(obj.Y.start.Point, 10, 'green');
      // this.renderArc(obj.Y.end.Point, 10, 'green');

         
      this.rederLine(obj.X.start.Point, obj.X.end.Point);
      this.rederLine(obj.Y.start.Point, obj.Y.end.Point);


      this.renderText(obj.Y.end.Value, obj.Y.end.Point);
      this.renderText(obj.Y.start.Value, obj.Y.start.Point, true);
      this.renderText(obj.X.end.Value, obj.X.end.Point, true, true);
   }

   private renderText(text: string | number, point: Point, isUp: boolean = false, isNear: boolean = false, fontSize: number = 30){
      this.cx.fillStyle = 'red';
      this.cx.font = `${fontSize}px serif`;
      this.cx.fillText(
         `${text}`,
         this.getRenderXLocation(isNear ? point.X - fontSize / 2 : point.X + fontSize / 2),
         this.getRenderXLocation(isUp ? point.Y - fontSize / 4 : point.Y + fontSize / 4)
      );
   }

   private rederLine(from: Point, to: Point){
      this.cx.beginPath();
      this.cx.moveTo(this.getRenderXLocation(from.X), this.getRenderYLocation(from.Y));
      this.cx.lineTo(this.getRenderXLocation(to.X), this.getRenderYLocation(to.Y));
      this.cx.strokeStyle = 'black';
      this.cx.stroke();
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
      const canvasWidth = this.canvasSize.Width;
      const canvasHeight = this.canvasSize.Height;

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
      return this.canvasSize.Height - Math.abs(y) * this.scaleMetrix.Y;
   }

   //private 
   private convertLocations(pointList: Point[]): FullLocations[]{
      return pointList.map(mathPoint => new FullLocations(new Point(this.convertXLocation(mathPoint.X), this.convertYLocation(mathPoint.Y)), mathPoint));
   }

   private renderArc(point: Point, radius: number = 3, color: string = 'red'){
      this.cx.beginPath();
      this.cx.fillStyle = color;
      this.cx.arc(this.getRenderXLocation(point.X), this.getRenderYLocation(point.Y), radius, 0, 2 * Math.PI, true);
      this.cx.fill();
   }

   private getRenderXLocation(coord: number): number{
      return this.canvasPadding + coord;
   }

   private getRenderYLocation(coord: number): number{
      return coord + this.canvasPadding;
   }

   private loop(){
      this.locations.forEach(fullLoc => this.renderArc(fullLoc.ProgramPoint));
      this.renderAxis();


      //requestAnimationFrame(this.loop);
   }

   public Start(){
      //this.loop();
      requestAnimationFrame(this.loop);
   }
}