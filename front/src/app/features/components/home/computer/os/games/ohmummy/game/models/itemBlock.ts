import { Item } from "./item";
import { Tile } from "./tile";
import { World } from "./world";

export class ItemBlock {
    public from:         {y: number, x: number};
    public to:           {y: number, x: number};
    public discover:     boolean;
    public tiles:        Tile[];
    public arroundTiles: Tile[] = [];
    public item:        Item;
    private world:       World;
    private manageItemFunction: (item: Item) => void;


    constructor(from: {y: number, x: number}, to: {y: number, x: number}, discover: boolean, tiles: Tile[], item: Item, world: World, manageItemFunction: (item: Item) => void) {
        this.from       = from;
        this.to         = to;
        this.discover   = discover;
        this.tiles      = tiles;
        this.item       = item;
        this.world      = world;
        this.manageItemFunction = manageItemFunction;
    }
    
    public geArroundTiles(): void {

        this.tiles.forEach((tile) => {
            const y = tile.y;
            const x = tile.x;
            if((y > 0 && y < this.world.grid.length - 1) && (x > 0 && x < this.world.grid[0].length - 1)) {
                if(!this.world.grid[y-1][x].isObstacle){
                    this.arroundTiles.push(this.world.grid[y-1][x]);
                }
                if(!this.world.grid[y-1][x-1].isObstacle){
                    this.arroundTiles.push(this.world.grid[y-1][x-1]);
                }
                if(!this.world.grid[y-1][x+1].isObstacle){
                    this.arroundTiles.push(this.world.grid[y-1][x+1]);
                }
                if(!this.world.grid[y][x-1].isObstacle){
                    this.arroundTiles.push(this.world.grid[y][x-1]);
                }
                if(!this.world.grid[y][x+1].isObstacle){
                    this.arroundTiles.push(this.world.grid[y][x+1]);
                }
                if(!this.world.grid[y+1][x].isObstacle){
                    this.arroundTiles.push(this.world.grid[y+1][x]);
                }
                if(!this.world.grid[y+1][x-1].isObstacle){
                    this.arroundTiles.push(this.world.grid[y+1][x-1]);
                }
                if(!this.world.grid[y+1][x+1].isObstacle){
                    this.arroundTiles.push(this.world.grid[y+1][x+1]);
                }
            }
        });
    }

    public isDiscover(): boolean {
        if(this.discover) return true;
        this.discover = this.arroundTiles.find((tile) => tile.isTraversed === false) ? false : true;
        if(this.discover) {
            this.manageItemFunction(this.item);
            this.tiles.forEach((tile) => {
                tile.setColor('violet');
            });
        }
        return this.discover;
    }

}