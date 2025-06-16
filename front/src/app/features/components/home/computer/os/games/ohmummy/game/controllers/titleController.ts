import { scenes } from '../enums/scenes';
export class TitleController{

    private ctx: CanvasRenderingContext2D;
    private keyEnterHandler = (e: KeyboardEvent) => {
        if(e.key === 'Enter'){
            this.nextScene(scenes.GAME);
        }
    };
    private gamePadHandler = (e: GamepadEvent) => {
        const gamepadIndex = e.gamepad.index
        this.updateGamepad(gamepadIndex);
    }
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
        window.addEventListener('gamepadconnected', this.gamePadHandler);
    }

    private updateGamepad(index:number) {
        const gamepad = navigator.getGamepads()[index];
        if(gamepad){
            const buttonA = gamepad.buttons[9];
            if(buttonA.pressed){
                window.removeEventListener('gamepadconnected', this.gamePadHandler);
                window.removeEventListener('gamepaddisconnected', this.gamePadHandler);
                this.nextScene(scenes.GAME);
            }
        }
        requestAnimationFrame(() => this.updateGamepad(index));
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
        this.ctx.fillText("Oh Mummy!", 50, 50);
        this.ctx.fillText("Press Enter to Start", 50, 100);
    }

    public reset(){
    }

    public destroy() {
        window.removeEventListener('keyup', this.keyEnterHandler);
    }
}