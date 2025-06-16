import { ItemTypes } from '../enums/itemTypes';
import { scenes } from '../enums/scenes';

import { ScoreBoard } from '../models/scoreBoard';
import { World } from "../models/world";
import { Hero } from "../models/hero";
import { Mummy } from "../models/mummy";
import { Level } from "../models/level";
import { Item } from '../models/item';
import { allLevels } from '../levels/levels';

/**
 * @description: Controlador del juego, se encarga de la logica del juego
 * @class GameController
 * @example: const gameController = new GameController(ctx);
 * @param ctx: CanvasRenderingContext2D
 */
export class GameController{

    private ctx: CanvasRenderingContext2D;
    private speed:number = .5;  // velocidad del juego .5 o 1, cualquier otro valor no es valido
    private key: string = '';  // tecla que se presiona
    private keyPressed: string[] = []; // tecla que se presiona, lo utilizamos para guardar el movimiento hasta el siguiente frame
    private keyReleased: string[] = []; // tecla que se suelta, lo utilizamos para guardar el movimiento hasta el siguiente frame
    private gamepadIndex: number | null = null; // indice del gamepad
    private cellSize: number;   // tamaño de la celda
    private gameWorld: World;   // mundo del juego
    private heroStartPosition: {x: number, y: number}; // posicion inicial del heroe
    private hero: Hero;         // heroe del juego
    private heroLives: number = 5;  // vidas del heroe
    private levels: Level[] = this.addLevels(); // niveles del juego
    private currentLevel: number = 0;           // nivel actual
    private mummies: (Mummy | null)[] = [];     // array de mummies
    private scoreBoard: ScoreBoard; // puntuacion del juego
    private keyDownHandler = (e: KeyboardEvent) => {
        if(this.keyPressed.includes(e.key)) return;
        this.keyPressed.push(e.key);
    };
    private keyUpHandler = (e: KeyboardEvent) => {
        if(this.keyReleased.includes(e.key)) return;
        this.keyReleased.push(e.key);
    };


    constructor(ctx: CanvasRenderingContext2D, private nextScene:(nextSene:scenes) => void) {
        this.ctx                = ctx;
        this.gameWorld          = new World(this.ctx, this.levels[this.currentLevel], (item: Item) => this.ManageItemAcquisition(item));
        this.heroStartPosition  = this.gameWorld.heroStartPosition;
        this.cellSize           = this.gameWorld.cellSize;
        this.hero               = new Hero(this.ctx, this.heroStartPosition.x, this.heroStartPosition.y, 1, 1, this.cellSize, this.speed, this.gameWorld, () => this.HeroDeath(), (boolean) => this.levelCompleted(boolean));
        this.scoreBoard         = new ScoreBoard(this.ctx, this.cellSize, this.heroLives);

        for(let i = 0; i < this.levels[this.currentLevel].mummies; i++) {
            this.mummies.push(this.createMummy());
        }
        
        this.setupListeners();
    }

    /**
     * @description: Configura los listeners de teclado
     * @returns: void
     * @example: this.setupListeners();
     */
    private setupListeners(): void {
        // Configura los listeners de teclado
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);

        // Configura los listeners de gamepad
        window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
            this.gamepadIndex = e.gamepad.index;
            this.updateGamepad();
        });    
        window.addEventListener('gamepaddisconnected', () => {
            console.log('Gamepad desconectado');
            this.gamepadIndex = null;
        });
    }

    private updateGamepad(): void {
        if (this.gamepadIndex === null) return;
    
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return;
    
        gamepad.buttons.forEach((button, index) => {
            if (button.pressed) {
                console.log(`Botón ${index} pulsado`);
                if (index === 12) { // Botón A
                    this.keyPressed.push('ArrowUp');
                } else if (index === 13) { // Botón B
                    this.keyPressed.push('ArrowDown');
                } else if (index === 14) { // Botón X
                    this.keyPressed.push('ArrowLeft');
                } else if (index === 15) { // Botón Y
                    this.keyPressed.push('ArrowRight');
                }
            }
            
        });
        const anyPressed = gamepad.buttons.some(btn => btn.pressed);
        if (!anyPressed) {
            this.keyPressed = [];
        }
        requestAnimationFrame(() => this.updateGamepad());
    }
    


    /**
     * @description: Añade los niveles al array de niveles
     * @returns: Level[]
     * @example: this.addLevels();
     */
    private addLevels(): Level[] {
        const levels: Level[] = [];
        for(let i = 0; i < allLevels.length; i++) {
            levels.push(allLevels[i]);
        }
        return levels;
    }

    /**
     * @description: Muestra el mensaje de muerte del heroe
     * @param lives: vidas restantes
     * @returns: void
     * @example: this.HeroDeath(3);
     */
    private HeroDeath(): void{
        this.heroLives--;
        this.scoreBoard.setLives(this.heroLives);
        if(this.heroLives === 0) {
            this.nextScene(scenes.GAME_OVER);
            return;
        }
    }

    /**
     * @description: Crea un nuevo mummy y lo añade al array de mummies
     * @param x: coordenada x del mummy
     * @param y: coordenada y del mummy
     * @returns: Mummy
     * @example: this.createMummy(1, 1);
     */
    private createMummy(x?:number , y?:number): Mummy {
        const mummy = new Mummy(this.ctx, 1, 1, this.cellSize, this.levels[this.currentLevel].mummySpeed, this.gameWorld, this.hero, (m) => this.removeMummy(m));
        if(x && y) {
            mummy.setPosition({x, y});
        }
        return mummy;
    }

    /**
     * @description: Elimina un mummy del array de mummies, se le pasa como callback a la clase mummy
     * @param mummy: Mummy a eliminar
     * @returns: void
     * @example: this.removeMummy(mummy);
     */
    private removeMummy(mummy: Mummy): void {
        const index = this.mummies.indexOf(mummy);
        if(index !== -1) {
            this.mummies.splice(index, 1);
        }
    }

    /**
     * @description: Gestiona la adquisicion de items, se le pasa como callback a la clase world
     * @param item: Item adquirido
     * @returns: void
     * @example: this.ManageItemAcquisition(item);
     */
    public ManageItemAcquisition( item: Item) {

        this.scoreBoard.addScore(item.points);

        switch(item.type) {
            case ItemTypes.EXTRA_LIFE:
                this.heroLives = this.heroLives + 1;
                this.hero.setLives(this.heroLives);
                break;
            case ItemTypes.KEY:
                this.scoreBoard.setKey();
                this.gameWorld.openExit();
                break;
        } 
    }

    /**
     * @description: Actualiza el juego, se llama en cada frame
     * @returns: void
     * @example: this.update();
     */
    public update() {
        this.key = this.keyPressed[this.keyPressed.length - 1] || '';
        this.hero.update(this.key);
        this.keyReleased.forEach((key) => {
            if(this.keyPressed.includes(key)) {
                this.keyPressed = this.keyPressed.filter((k) => k !== key);
                this.keyReleased = this.keyReleased.filter((k) => k !== key);
            }
        });
    
        if(this.mummies.length > 0) {
            this.mummies.forEach((mummy) => {
                if(mummy === null) return;
                mummy.update();
            });
        }

        this.gameWorld.update();
    }
    
    /**
     * @description: Dibuja el juego, se llama en cada frame
     * @returns: void
     * @example: this.draw();
     */
    public draw() {
        this.gameWorld.draw();
        this.scoreBoard.draw();
        
        if(this.mummies.length > 0) {
            this.mummies.forEach((mummy) => {
                if(mummy === null) return;
                mummy.draw();
            });
        }
        
        this.hero.draw();
    }

    public reset(){
        this.gameWorld          = new World(this.ctx, this.levels[this.currentLevel], (item: Item) => this.ManageItemAcquisition(item));
        this.heroStartPosition  = this.gameWorld.heroStartPosition;
        this.cellSize           = this.gameWorld.cellSize;
        this.hero               = new Hero(this.ctx, this.heroStartPosition.x, this.heroStartPosition.y, 1, 1, this.cellSize, this.speed, this.gameWorld, () => this.HeroDeath(), (boolean) => this.levelCompleted(boolean));
        this.scoreBoard         = new ScoreBoard(this.ctx, this.cellSize, this.heroLives);

        this.mummies = [];
        for(let i = 0; i < this.levels[this.currentLevel].mummies; i++) {
            this.mummies.push(this.createMummy());
        }
    }

    private levelCompleted(levelCompleted: boolean) {
        if(levelCompleted) {
            this.currentLevel = this.currentLevel + 1;
            if(this.currentLevel >= this.levels.length) {
                this.nextScene(scenes.GAME_OVER);
                return;
            }
            else{
                this.gameWorld          = new World(this.ctx, this.levels[this.currentLevel], (item: Item) => this.ManageItemAcquisition(item));
                this.heroStartPosition  = this.gameWorld.heroStartPosition;
                this.cellSize           = this.gameWorld.cellSize;
                this.hero               = new Hero(this.ctx, this.heroStartPosition.x, this.heroStartPosition.y, 1, 1, this.cellSize, this.speed, this.gameWorld, () => this.HeroDeath(), (boolean) => this.levelCompleted(boolean));
                this.hero.setLives(this.heroLives);
                this.scoreBoard.setLives(this.heroLives);
                this.scoreBoard.setKey(false);
                this.mummies = [];
                for(let i = 0; i < this.levels[this.currentLevel].mummies; i++) {
                    this.mummies.push(this.createMummy());
                }
            }

        }
    }

    public destroy() {
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
    }
}