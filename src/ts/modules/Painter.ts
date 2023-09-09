import AxisBigData from "./AxisBigData";
import AxisData from "./AxisData";
import FullLocations from "./FullLocations";
import MinMaxValues from "./MinMaxValues";
import Point from "./Point";
import Size from "./Size";

export default class Painter{
   private locations: FullLocations[];
   private cx: CanvasRenderingContext2D;
   private scaleMetrix: Point;
   private canvas: HTMLCanvasElement;
   private canvasSize: Size;
   private canvasPadding: number;
   private pointList: Point[];
   private pointRadius: number;
   private axisBigData: AxisBigData;
   private minMaxValues: MinMaxValues;
   private hoverLocation: FullLocations | null;
   private fontSize: number;

   constructor(pointList: Point[], canvas: HTMLCanvasElement, xMax: number, innderWidth: number){
      this.canvas = canvas;
      this.cx = this.canvas.getContext('2d')!;

      this.axisBigData = new AxisBigData();
      this.hoverLocation = null;

      this.canvasPadding = this.executeCanvasPaddng(innderWidth);
      this.fontSize = this.executeFontSize(innderWidth);
      this.pointRadius = this.executeRadius(xMax, innderWidth);

      this.canvasSize = new Size(this.canvas.width - this.canvasPadding * 2, this.canvas.height - this.canvasPadding * 2);
      //this.pointRadius = this.executeRadius(xMax, innderWidth);

      this.pointList = pointList;
      this.minMaxValues = new MinMaxValues(...this.fitlerPointList(this.pointList));
      this.scaleMetrix = this.printCoordLines();
      this.locations = this.convertLocations(this.pointList);

      this.executeAxis();

      console.log(this.locations);

      console.log(this.minMaxValues);

      //this.printCoordLines();

      this.loop = this.loop.bind(this);

      this.cx.fillStyle = 'orange';
      this.cx.fillRect(0, 0, canvas.width, canvas.height);

      this.canvas.onmousemove = e => {
         const {offsetX, offsetY} = e;
         const display = document.querySelector('.display') as HTMLElement;

         let loc: FullLocations | null;

         loc = this.locations.reduce((result: {'loc': FullLocations, 'hypot': number}, value) => {
            const xPoint = this.getRenderXLocation(value.ProgramPoint.X);
            const yPoint = this.getRenderXLocation(value.ProgramPoint.Y);

            const xLength = Math.abs(xPoint - offsetX);
            const yLength = Math.abs(yPoint - offsetY);
            const hypot = Math.hypot(xLength, yLength);

            if(hypot < result.hypot){
               result.loc = value;
               result.hypot = hypot;
            }

            return result;
         }, {'loc': this.locations[0], 'hypot': Infinity}).loc;
         
         if(!loc)
            return;

         display.style.visibility = 'visible';

         display.querySelector('.display__value_x')!.textContent = `${loc?.MathPoint.X}`;
         display.querySelector('.display__value_y')!.textContent = `${loc?.MathPoint.Y}`;

         this.hoverLocation = loc;

         requestAnimationFrame(this.loop);
      };
   }

   private executeCanvasPaddng(innderWidth: number): number{
      
      if(innderWidth > 900){
         return 30;
      }else if(innderWidth > 500){
         return 20;
      }else{
         return 15;
      }
   }

   private executeFontSize(innderWidth: number): number{
      if(innderWidth > 900){
         return 30;
      }else if(innderWidth > 500){
         return 20;
      }else{
         return 15;
      }
   }

   private executeRadius(xMax: number, innderWidth: number): number{
      if(xMax <= 150 && innderWidth > 1000){
         return 5;
      }else if(xMax <= 300 && innderWidth > 700){
         return 2;
      }else if(xMax <= 800 && innderWidth > 400){
         return 1;
      }else{
         return 0.5;
      }
   }

   private executeAxis(): void{
      const deltaXZero = this.minMaxValues.XMin > 0 ? 0 : 0 - this.minMaxValues.XMin;
      const deltaYZero = this.minMaxValues.YMin > 0 ? 0 : 0 - this.minMaxValues.YMin;

      console.log(deltaXZero, deltaYZero);
      
      this.axisBigData.Zero = new AxisData('0', new Point(this.convertXLocation(deltaXZero), this.convertYLocation(deltaYZero)));

      if(this.minMaxValues.XMin < 0){
         const start = this.locations.find(loc => loc.MathPoint.X == this.minMaxValues.XMin)!;
         this.axisBigData.X.start = new AxisData(`${start.MathPoint.X.toFixed(1)}`, new Point(start.ProgramPoint.X, this.axisBigData.Zero.Point.Y));
      }else{
         this.axisBigData.X.start = this.axisBigData.Zero;
      } 

      if(this.minMaxValues.XMax > 0){
         const end = this.locations.find(loc => loc.MathPoint.X == this.minMaxValues.XMax)!;
         this.axisBigData.X.end = new AxisData(`${end.MathPoint.X.toFixed(1)}`, new Point(end.ProgramPoint.X, this.axisBigData.Zero.Point.Y));
      }else{
         this.axisBigData.X.end = this.axisBigData.Zero;
      } 

      if(this.minMaxValues.YMin < 0){
         const start = this.locations.find(loc => loc.MathPoint.Y == this.minMaxValues.YMin)!;
         this.axisBigData.Y.start = new AxisData(`${start.MathPoint.Y.toFixed(1)}`, new Point(this.axisBigData.Zero.Point.X, start.ProgramPoint.Y));
      }else{
         console.log('!!');
         this.axisBigData.Y.start = this.axisBigData.Zero;
      } 

      if(this.minMaxValues.YMax > 0){
         const end = this.locations.find(loc => loc.MathPoint.Y == this.minMaxValues.YMax)!;
         this.axisBigData.Y.end = new AxisData(`${end.MathPoint.Y.toFixed(1)}`, new Point(this.axisBigData.Zero.Point.X, end.ProgramPoint.Y));
      }else{
         this.axisBigData.Y.end = this.axisBigData.Zero;
      } 

      console.log(this.axisBigData);
   }

   private renderAxis(): void{
      if(!this.axisBigData.X.start || !this.axisBigData.Y.start || !this.axisBigData.X.end || !this.axisBigData.Y.end) 
         return;  

      this.rederLine(this.axisBigData.X.start.Point, this.axisBigData.X.end.Point);
      this.rederLine(this.axisBigData.Y.start.Point, this.axisBigData.Y.end.Point);


      this.renderText(this.axisBigData.Zero!.Value, this.axisBigData.Zero!.Point, true);

      this.renderText(this.axisBigData.Y.end.Value, this.axisBigData.Y.end.Point);
      this.renderText(this.axisBigData.X.end.Value, this.axisBigData.X.end.Point, true, true);

      if(this.axisBigData.Zero!.Point.X !== this.axisBigData.X.start.Point.X)
         this.renderText(this.axisBigData.X.start.Value, this.axisBigData.X.start.Point, true, true);

      if(this.axisBigData.Zero!.Point.Y !== this.axisBigData.Y.start.Point.Y)
         this.renderText(this.axisBigData.Y.start.Value, this.axisBigData.Y.start.Point, true);
   }

   private renderText(text: string | number, point: Point, isUp: boolean = false, isNear: boolean = false, fontSize: number = this.fontSize, color: string = 'black'){
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
      }, [-Infinity, Infinity, -Infinity, Infinity]);
   }

   private printCoordLines(): Point{
      const canvasWidth = this.canvasSize.Width;
      const canvasHeight = this.canvasSize.Height;

      const scaleCoordX = canvasWidth / (Math.abs(this.minMaxValues.XMax) + (this.minMaxValues.XMin > 0 ? 0 : Math.abs(this.minMaxValues.XMin)));
      const scaleCoordY = canvasHeight / (Math.abs(this.minMaxValues.YMax) + (this.minMaxValues.YMin > 0 ? 0 : Math.abs(this.minMaxValues.YMin)));

      // console.log(highX, lowX, highY, lowY);
      // console.log(canvasWidth, canvasHeight);

      // console.log(scaleCoordX, scaleCoordY);

      return new Point(scaleCoordX, scaleCoordY);
   }

   private convertXLocation(x: number): number{
      return Math.abs(x) * this.scaleMetrix.X;
   }

   private convertYLocation(y: number): number{
      return this.canvasSize.Height - y * this.scaleMetrix.Y;
      //return this.canvasSize.Height - y * this.scaleMetrix.Y;
   }

   //private 
   private convertLocations(pointList: Point[]): FullLocations[]{
      let dopX = 0;
      let dopY = 0;
      
      if(this.minMaxValues.XMin < 0){
         dopX = Math.abs(this.minMaxValues.XMin);
      }

      if(this.minMaxValues.YMin < 0){
         dopY = Math.abs(this.minMaxValues.YMin);
      }

      const helpArray: Point[] = pointList.map(point => new Point(point.X + dopX, point.Y + dopY));

      return pointList.map((mathPoint, index) => new FullLocations(new Point(this.convertXLocation(helpArray[index].X), this.convertYLocation(helpArray[index].Y)), mathPoint));
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

         this.renderText(`${this.hoverLocation.MathPoint.Y}`, xZero, true, false, this.fontSize, 'orange');
         this.renderText(`${this.hoverLocation.MathPoint.X}`, yZero, true, false, this.fontSize, 'orange');
      }

      //requestAnimationFrame(this.loop);
   }

   public Start(){
      requestAnimationFrame(this.loop);
   }
}