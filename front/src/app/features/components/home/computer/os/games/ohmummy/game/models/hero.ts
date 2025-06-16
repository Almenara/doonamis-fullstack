import { Tile } from "./tile";
import { World } from "./world";

export class Hero {

    private pixelUnits: number;
    private stop: boolean = false;
    private start: {x: number, y: number};
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D;
    private walking: boolean = false;
    private speed: number = 1;
    private direction: string = '';
    private grid: Tile[][];
    private respawning: boolean = false;
    private color: string = 'red';
    private gameWorld: World;

    private lives: number = 5;
    
    constructor( ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, pixelUnits: number, speed: number, gameWorld: World, private iDeath: () => void, private levelCompleted: (levelCompleted: boolean) => void ) {
        this.ctx = ctx;
        this.start = {x, y};
        this.y = y;
        this.x = x;
        this.width = width;
        this.height = height;
        this.pixelUnits = pixelUnits;
        this.speed = speed;
        this.gameWorld = gameWorld;
        this.grid = gameWorld.grid;
    }

    public setWalking(walking: boolean) {
        this.walking = walking;
    }

    public getWalking() {
        return this.walking;
    }

    public getPosition() {
        return {
            y: this.y,
            x: this.x
        }
    }

    public setLives(lives: number) {
        this.lives = lives;
    }

    public death() {
        if(this.respawning) return;
        this.respawning = true;
        this.iDeath();
        if(this.lives === 0) {
            return;
        }
        this.respawn();
    }

    private respawn(blicks: {times: number, total: number} = {times: 0, total: 25}, stop: boolean = false) {
        this.stop = stop;
        if(this.stop){
            setTimeout(() => {
                this.stop = false;
            }
            , 1000);
        }

        if(blicks.times < blicks.total) {
            setTimeout(() => {
                this.color = this.color === 'red' ? 'cyan' : 'red';
                blicks.times++;
                this.respawn(blicks, false);
            }, 18 * blicks.times);
        }
        else {
            this.color = 'red';
            this.respawning = false;
        }

    }

    public isRespawning() {
        return this.respawning;
    }
    

    update(key: string) {
        if(this.stop) return;
        if(!this.walking) this.direction = key;
        if(!this.canIMove()) return;

        if (this.direction === 'ArrowUp')      this.y -= this.speed;
        if (this.direction === 'ArrowDown')    this.y += this.speed;
        if (this.direction === 'ArrowLeft')    this.x -= this.speed;
        if (this.direction === 'ArrowRight')   this.x += this.speed;

        // comprabamos si el numero es divisible entre el tamaño de la celda
        if((this.y * this.pixelUnits) % this.pixelUnits === 0 && (this.x * this.pixelUnits) % this.pixelUnits === 0)
        {
            this.walking = false;
            if(this.grid[this.y][this.x] 
                && this.grid[this.y][this.x].isObstacle === false 
                && this.grid[this.y][this.x].isStart === false
                && this.grid[this.y][this.x].isExit === false){
                    this.grid[this.y][this.x].setIsTraversed();
                }
            
            if(this.grid[this.y][this.x] && this.grid[this.y][this.x].isExitOpen === true) {
                this.levelCompleted(true);
                this.stop = true;
            }    
            
            
            return;
        }
        this.walking = true;
    }

    private canIMove(): boolean {
        if(this.stop) return false;
        const position : {x:number, y:number} = {x:this.x, y:this.y};
        if(this.walking) return true;

        if(this.direction === 'ArrowUp')
            return this.grid[position.y - 1][position.x] && this.grid[position.y- 1][position.x].isObstacle === false && position.x >= 0;
        if(this.direction === 'ArrowDown')
            return this.grid[position.y + 1][position.x] && this.grid[position.y + 1][position.x].isObstacle === false && position.x <= this.grid[0].length;
        if(this.direction === 'ArrowLeft')
            return this.grid[position.y] && this.grid[position.y][position.x - 1].isObstacle === false && position.y >= 0;
        if(this.direction === 'ArrowRight')
            return this.grid[position.y] && this.grid[position.y][position.x + 1].isObstacle === false && position.y <= this.grid.length;
        return true;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x * this.pixelUnits, this.y * this.pixelUnits, this.width * this.pixelUnits, this.height * this.pixelUnits);
    } 
}