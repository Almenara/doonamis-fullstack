import { Hero } from "./hero";
import { Tile } from "./tile";
import { World } from "./world";

export class Mummy {
    private stop: boolean = false;
    private pixelUnits: number;
    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D;
    private speed: number = 1;
    private direction: string = '';
    private gameWorld: World;
    private grid: Tile[][];
    private hero: Hero;
    
    private _walking: boolean = false;
    public get walking(): boolean { return this._walking }
    public set walking(value: boolean) { this._walking = value }
    
    private x!: number;
    private y!: number;
    public getPosition() { return { y: this.y, x: this.x } }
    public setPosition(position: {x: number, y: number}) { this.x = position.x; this.y = position.y; }

    constructor( ctx: CanvasRenderingContext2D,  width: number, height: number, pixelUnits: number, speed: number, gameWorld: World, hero: Hero, public iDeathToo: (m: Mummy) => void) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.pixelUnits = pixelUnits;
        this.speed = speed;
        this.gameWorld = gameWorld;
        this.grid = gameWorld.grid;
        this.hero = hero;
        this.getStartingRandomPosition();
    }

    private getStartingRandomPosition() {
        const randomX = Math.floor(Math.random() * this.grid[0].length);
        const randomY = Math.floor(Math.random() * this.grid.length);
        if(this.grid[randomY][randomX].isObstacle || this.grid[randomY][randomX].isStart) {
            this.getStartingRandomPosition();
        } else {
            this.x = randomX;
            this.y = randomY;
        }
    }

    update() {
        if(this.stop) return;
        if(!this.walking) this.direction = this.getRandomDirection();
        
        while(!this.canIMove()) {
            this.direction = this.getRandomDirection();
        }
        this.canIkillHero();
        
        if(this.direction === 'up')     this.y -= this.speed;
        if(this.direction === 'down')   this.y += this.speed;
        if(this.direction === 'left')   this.x -= this.speed;
        if(this.direction === 'right')  this.x += this.speed;
        
        if((this.x * this.pixelUnits) % this.pixelUnits === 0 && (this.y * this.pixelUnits) % this.pixelUnits === 0)
        {
            this.walking = false;
            return;
        }
        this.walking = true;
    }

    private canIkillHero(): boolean {
        if(this.hero.isRespawning()) return false;
        const position: {x:number, y:number} = {x:this.x, y:this.y};
        const heroPosition: {x:number, y:number} = this.hero.getPosition();
        const xdistance = Math.abs(position.x - heroPosition.x);
        const ydistance = Math.abs(position.y - heroPosition.y);
        if((xdistance < 1 && xdistance > -1) && (ydistance < 1 && ydistance > -1)) {
            
            this.hero.death();
            this.iDeathToo(this);
            return true;
        }
        return false;
    }

    public pause() {
        this.stop = true;
    }

    public start() {
        this.stop = false;
    }

    private canIMove(): boolean {
        if(this.stop) return false;
        const position : {y:number, x:number} = {y:this.y, x:this.x};
        if(this.walking) return true;

        if(this.direction === 'up')
            return this.grid[position.y - 1][position.x] 
                && this.grid[position.y - 1][position.x].isObstacle === false 
                && this.grid[position.y - 1][position.x].isStart === false 
                && this.grid[position.y - 1][position.x].isExit === false
                && position.x >= 0;

        if(this.direction === 'down')
            return this.grid[position.y + 1][position.x] 
                && this.grid[position.y + 1][position.x].isObstacle === false 
                && this.grid[position.y + 1][position.x].isStart === false 
                && this.grid[position.y + 1][position.x].isExit === false
                && position.x <= this.grid[0].length-1;

        if(this.direction === 'left')
            return this.grid[position.y] 
                && this.grid[position.y][position.x - 1].isObstacle === false 
                && this.grid[position.y][position.x - 1].isStart === false
                && this.grid[position.y][position.x - 1].isExit === false
                && position.y >= 0;

        if(this.direction === 'right')
            return this.grid[position.y] 
                && this.grid[position.y][position.x + 1].isObstacle === false 
                && this.grid[position.y][position.x + 1].isStart === false 
                && this.grid[position.y][position.x + 1].isExit === false
                && position.y < this.grid.length;
        return true;
    }

    private getRandomDirection() {
        
        const directions = ['up', 'down', 'left', 'right'];
        
        if(Math.random() < 0.6) return this.direction;

        if(this.direction === 'up') {
            directions.splice(directions.indexOf('down'), 1);
        }
        if(this.direction === 'down') {
            directions.splice(directions.indexOf('up'), 1);
        }
        if(this.direction === 'left') {
            directions.splice(directions.indexOf('right'), 1);
        }
        if(this.direction === 'right') {
            directions.splice(directions.indexOf('left'), 1);
        }

        return directions[Math.floor(Math.random() * directions.length)];
    }

    draw() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x * this.pixelUnits, this.y * this.pixelUnits, this.width * this.pixelUnits, this.height * this.pixelUnits);
    } 
}