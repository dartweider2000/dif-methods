import AxisBigData from "./AxisBigData";
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
   private pointRadius: number;
   private axisBigData: AxisBigData;

   private hoverLocation: FullLocations | null;

   constructor(pointList: Point[], canvas: HTMLCanvasElement){
      this.canvas = canvas;
      this.cx = this.canvas.getContext('2d')!;
      this.axisBigData = new AxisBigData();
      this.hoverLocation = null;

      this.canvasPadding = 20;
      this.canvasSize = new Size(this.canvas.width - this.canvasPadding * 2, this.canvas.height - this.canvasPadding * 2);
      this.pointRadius = 5;

      this.pointList = pointList;
      this.maxMinValues = this.fitlerPointList(this.pointList);
      this.scaleMetrix = this.printCoordLines(...this.maxMinValues);
      this.locations = this.convertLocations(this.pointList);

      this.executeAxis();

      console.log(this.locations);

      //this.printCoordLines();

      this.loop = this.loop.bind(this);

      this.cx.fillStyle = 'orange';
      this.cx.fillRect(0, 0, canvas.width, canvas.height);

      this.canvas.onmousemove = e => {
         const {offsetX, offsetY} = e;
         const display = document.querySelector('.display') as HTMLElement;

         // const loc = this.locations.find(loc => this.getRenderXLocation(loc.ProgramPoint.X - this.pointRadius) <= offsetX && 
         //    this.getRenderXLocation(loc.ProgramPoint.X + this.pointRadius) >= offsetX && 
         //    this.getRenderYLocation(loc.ProgramPoint.Y - this.pointRadius) <= offsetY && 
         //    this.getRenderYLocation(loc.ProgramPoint.Y + this.pointRadius) >= offsetY
         // );

         const locArr = this.locations.filter(loc => 
            this.getRenderYLocation(loc.ProgramPoint.Y - this.pointRadius) <= offsetY && 
            this.getRenderYLocation(loc.ProgramPoint.Y + this.pointRadius) >= offsetY
         );


         let loc: FullLocations | null;
         
         if(locArr.length === 1){
            loc = locArr.pop()!;
         }else{
            loc = locArr.find(loc => this.getRenderXLocation(loc.ProgramPoint.X - this.pointRadius) <= offsetX && 
               this.getRenderXLocation(loc.ProgramPoint.X + this.pointRadius) >= offsetX &&
               this.getRenderYLocation(loc.ProgramPoint.Y - this.pointRadius) <= offsetY && 
               this.getRenderYLocation(loc.ProgramPoint.Y + this.pointRadius) >= offsetY
            )!;
         }


         //console.log(loc);
      
         if(!loc)
            return;

         display.style.visibility = 'visible';

         display.querySelector('.display__value_x')!.textContent = `${loc?.MathPoint.X}`;
         display.querySelector('.display__value_y')!.textContent = `${loc?.MathPoint.Y}`;

         this.hoverLocation = loc;
      };
   }

   private executeAxis(): void{
      const deltaXZero = 0 - this.maxMinValues[3];
      const deltaYZero = 0 - this.maxMinValues[1];
      
      this.axisBigData.Zero = new AxisData('0', new Point(this.convertXLocation(deltaXZero), this.convertYLocation(deltaYZero)));

      if(this.maxMinValues[3] < 0){
         const start = this.locations.find(loc => loc.MathPoint.X == this.maxMinValues[3])!;
         this.axisBigData.X.start = new AxisData(`${~~start.MathPoint.X}`, new Point(start.ProgramPoint.X, this.axisBigData.Zero.Point.Y));
      }else{
         this.axisBigData.X.start = this.axisBigData.Zero;
      } 

      if(this.maxMinValues[2] > 0){
         const end = this.locations.find(loc => loc.MathPoint.X == this.maxMinValues[2])!;
         this.axisBigData.X.end = new AxisData(`${~~end.MathPoint.X}`, new Point(end.ProgramPoint.X, this.axisBigData.Zero.Point.Y));
      }else{
         this.axisBigData.X.end = this.axisBigData.Zero;
      } 

      if(this.maxMinValues[1] < 0){
         const start = this.locations.find(loc => loc.MathPoint.Y == this.maxMinValues[1])!;
         this.axisBigData.Y.start = new AxisData(`${~~start.MathPoint.Y}`, new Point(this.axisBigData.Zero.Point.X, start.ProgramPoint.Y));
      }else{
         this.axisBigData.Y.start = this.axisBigData.Zero;
      } 

      if(this.maxMinValues[0] > 0){
         const end = this.locations.find(loc => loc.MathPoint.Y == this.maxMinValues[0])!;
         this.axisBigData.Y.end = new AxisData(`${~~end.MathPoint.Y}`, new Point(this.axisBigData.Zero.Point.X, end.ProgramPoint.Y));
      }else{
         this.axisBigData.Y.end = this.axisBigData.Zero;
      } 
   }

   private renderAxis(): void{
      if(!this.axisBigData.X.start || !this.axisBigData.Y.start || !this.axisBigData.X.end || !this.axisBigData.Y.end) 
         return;  


      this.rederLine(this.axisBigData.X.start.Point, this.axisBigData.X.end.Point);
      this.rederLine(this.axisBigData.Y.start.Point, this.axisBigData.Y.end.Point);


      this.renderText(this.axisBigData.Y.end.Value, this.axisBigData.Y.end.Point);
      this.renderText(this.axisBigData.Y.start.Value, this.axisBigData.Y.start.Point, true);
      this.renderText(this.axisBigData.X.end.Value, this.axisBigData.X.end.Point, true, true);
   }

   private renderText(text: string | number, point: Point, isUp: boolean = false, isNear: boolean = false, fontSize: number = 30, color: string = 'black'){
      this.cx.fillStyle = color;
      this.cx.font = `${fontSize}px serif`;
      this.cx.fillText(
         `${text}`,
         this.getRenderXLocation(isNear ? point.X - fontSize : point.X + fontSize / 4),
         this.getRenderXLocation(isUp ? point.Y - fontSize / 4 : point.Y + fontSize / 4)
      );
   }

   private rederLine(from: Point, to: Point, color: string = 'black'){
      this.cx.beginPath();
      this.cx.moveTo(this.getRenderXLocation(from.X), this.getRenderYLocation(from.Y));
      this.cx.lineTo(this.getRenderXLocation(to.X), this.getRenderYLocation(to.Y));
      this.cx.strokeStyle = color;
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

   private renderArc(point: Point, radius: number = this.pointRadius, color: string = 'red'){
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

   private renderBackground(){
      this.cx.fillStyle = '#edece9';
      this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
   }

   private loop(){
      this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderBackground();
      this.locations.forEach(fullLoc => this.renderArc(fullLoc.ProgramPoint));
      this.renderAxis();

      if(this.hoverLocation){
         const xZero = new Point(this.axisBigData.Zero!.Point.X, this.hoverLocation.ProgramPoint.Y);
         const yZero = new Point(this.hoverLocation.ProgramPoint.X, this.axisBigData.Zero!.Point.Y);

         this.rederLine(this.hoverLocation.ProgramPoint, xZero, 'green');
         this.rederLine(this.hoverLocation.ProgramPoint, yZero, 'green');

         this.renderText(`${this.hoverLocation.MathPoint.Y}`, xZero, true, false, 25, 'orange');
         this.renderText(`${this.hoverLocation.MathPoint.X}`, yZero, true, false, 25, 'orange');
      }

      requestAnimationFrame(this.loop);
   }

   public Start(){
      //this.loop();
      requestAnimationFrame(this.loop);
   }
}