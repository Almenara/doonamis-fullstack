import { GameController } from "./controllers/gameController";
import { GameOverController } from "./controllers/gameOverController";
import { TitleController } from "./controllers/titleController";
import { scenes } from "./enums/scenes";


export class ohmommyGame{

    private ctx: CanvasRenderingContext2D;
    private animationFrameId: number | null = null;
    private lastTime: number = 0;
    private canvas: HTMLCanvasElement;
    private currentScene: TitleController | GameController | GameOverController | null = null;

    constructor(private htmlCanvas: HTMLCanvasElement) {
        this.canvas = htmlCanvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.currentScene = new TitleController(this.ctx, (next: scenes) => this.nextScene(next));
        this.loop = this.loop.bind(this);
        this.run();
    }

    public onResize(): void {  
        
    }

    public nextScene(next:scenes): void {
        this.currentScene?.destroy();
        this.currentScene = null;
        if(next === scenes.TITLE){
            this.currentScene = new TitleController(this.ctx, (next: scenes) => this.nextScene(next));
        }else if(next === scenes.GAME){
            this.currentScene = new GameController(this.ctx, (next: scenes) => this.nextScene(next));
        }else if(next === scenes.GAME_OVER){
            this.currentScene = new GameOverController(this.ctx, (next: scenes) => this.nextScene(next));
        }
        else(
            this.currentScene = new TitleController(this.ctx, (next: scenes) => this.nextScene(next))
        )
    }

    public run() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.loop(0);
    }

    public loop(time: number) {
        const delta = time - this.lastTime;
        if (delta > 70) { // 60 FPS
            this.update();
            this.draw();
            this.lastTime = time;
        }
        this.animationFrameId = requestAnimationFrame(this.loop);
        
    }

    public update() {
        this.currentScene?.update();
    }
    
    public draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentScene?.draw();
    }

}