
export class ScoreBoard {

    private ctx: CanvasRenderingContext2D;
    private pixelUnits: number;

    public score: number = 0;
    public level: number = 1;
    public hasKey: boolean = false;
    private lives: number;
    
    constructor(ctx: CanvasRenderingContext2D, pixelUnits: number, lives: number) {
        this.ctx = ctx;
        this.pixelUnits = pixelUnits;
        this.lives = lives;
    }

    public addScore(points: number): void {
        this.score += points;
    }

    public setLevel(level: number): void {
        this.level = level;
    }

    public setKey(key:boolean = true): void {
        this.hasKey = key;
    }
    
    public setLives(lives: number): void {
        this.lives = lives;
    }

    public draw(): void {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 200, 50);
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${this.pixelUnits}px Arial`;
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
        this.ctx.fillText(`Level: ${this.level}`, 10, 40);
        this.ctx.fillText(`Key: ${this.hasKey ? 'Yes' : 'No'}`, 100, 20);
        this.ctx.fillText(`Lives: ${this.lives}`, 100, 40);
    }
}