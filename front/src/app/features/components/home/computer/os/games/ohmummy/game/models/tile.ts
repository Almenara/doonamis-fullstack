export class Tile {
    public pixelUnits: number; // Tamaño de la celda en píxeles minimo
    public y: number;
    public x: number;
    public width: number;
    public height: number;
    public color: string = 'white';
    public isObstacle: boolean = false;
    public isTraversed: boolean = false;
    public isItem: boolean = false;
    public isStart: boolean = false;
    public isExit: boolean = false;
    public isExitOpen: boolean = false;
    public ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, y: number, x: number, width: number, height: number, pixelUnits: number, color: string) {
        this.ctx = ctx;
        this.y = y;
        this.x = x;
        this.width = width;
        this.height = height;
        this.pixelUnits = pixelUnits;
        this.color = color;
    }

    public setColor(color: string) {
        this.color = color;
    }
    public setIsStart(isStart: boolean) {
        this.isStart = isStart;
        this.color = isStart ? 'orange' : this.color;
    }
    public setIsObstacle(isObstacle: boolean) {
        this.isObstacle = isObstacle;
        this.color = isObstacle ? '#232425' : this.color;
    }
    public setIsItem(isItem: boolean) {
        this.isItem = isItem;
        this.color = isItem ? 'green' : this.color;
    }
    public setIsTraversed() {
        if(!this.isObstacle) this.isTraversed = true;
        this.color = 'yellow';
    }
    public setIsExit(exit: boolean) {
        this.isObstacle = exit;
        this.isExit = exit;
        this.color = this.isExitOpen ? 'gray' : '#232425';
    }
    public setIsExitOpen(open: boolean) {
        this.isObstacle = !open;
        this.isExitOpen = open;
        this.color = 'gray';
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x * this.pixelUnits, this.y * this.pixelUnits, this.width * this.pixelUnits, this.height * this.pixelUnits);
    } 
}