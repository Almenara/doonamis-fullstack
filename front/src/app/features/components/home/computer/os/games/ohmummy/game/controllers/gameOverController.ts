import { scenes } from "../enums/scenes";

/**
 * @description: Controlador del juego, se encarga de la logica del juego
 * @class GameController
 * @example: const gameController = new GameController(ctx);
 * @param ctx: CanvasRenderingContext2D
 */
export class GameOverController{

    private ctx: CanvasRenderingContext2D;
    private keyEnterHandler = (e: KeyboardEvent) => {
        if(e.key === 'Enter'){
            this.nextScene(scenes.TITLE);
        }
    };
    constructor(ctx: CanvasRenderingContext2D, private nextScene:(nextSene:scenes) => void) {
        this.ctx = ctx;
        this.setupListeners();
    }

    
    /**
     * @description: Configura los listeners de teclado
     * @returns: void
     * @example: this.setupListeners();
     */
    private setupListeners(): void {
        window.addEventListener('keyup', this.keyEnterHandler);
    }
    
    /**
     * @description: Actualiza el juego, se llama en cada frame
     * @returns: void
     * @example: this.update();
     */
    public update() {
    }
    
    /**
     * @description: Dibuja el juego, se llama en cada frame
     * @returns: void
     * @example: this.draw();
     */
    public draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Game Over", 50, 50);
        this.ctx.fillText("Press Enter to Restart", 50, 100);
    }

    public reset(){
    }

    public destroy() {
        window.removeEventListener('keyup', this.keyEnterHandler);
    }
}