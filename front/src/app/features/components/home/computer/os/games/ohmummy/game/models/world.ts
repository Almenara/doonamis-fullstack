import { ItemTypes } from "../enums/itemTypes";
import { Hero } from "./hero";
import { Item} from "./item";
import { ItemBlock } from "./itemBlock";
import { Level } from "./level";
import { Tile } from "./tile";

export class World {

    public grid: Tile[][];
    private ctx: CanvasRenderingContext2D;
    private gridSize: {rows: number, columns: number};
    public cellSize: number;
    private level: Level;
    private itemsBlocks: ItemBlock[] = [];
    private exitTile: Tile | null = null;
    private itemsLevel: Item[] = [];

    private _hero: Hero | null = null;
    set hero(hero: Hero) {
        this._hero = hero;
    }
    get hero() : Hero | null {
        return this.hero;
    }
    
    private _heroStartPosition: {y: number, x: number} = {y: 0, x: 0};
    get heroStartPosition() {
        return this._heroStartPosition;
    }

    constructor( ctx: CanvasRenderingContext2D, level: Level, private manageItemAcquisition: (item: Item) => void) {
        this.ctx = ctx;
        this.level = level;
        this.gridSize = {rows: this.level.pattern.length, columns: this.level.pattern[0].length,};
        this.cellSize =  Math.round(this.ctx.canvas.width / this.gridSize.rows);
        this.grid = this.createWorldByPattern();
        this.setupItemsBlocks();
        this.setupArroundItemsBlocks();
        // copiamos los items de la level no referenciado
        this.itemsLevel = this.itemsLevel.concat(this.level.items);
        this.assignItemToBlock()
    }

    private createWorldByPattern(): Tile[][] {
        const grid : Tile[][] = [];
        for(let y = 0; y < this.gridSize.rows; y++ ){
            const row : Tile[] = []
            for(let x = 0; x < this.gridSize.columns; x++ ){
                if (this.level.pattern[y] && this.level.pattern[y][x]) {
                    const cell = this.level.pattern[y][x];
                    const tile = new Tile(this.ctx, y, x, 1, 1, this.cellSize, 'white');
                    if (cell === 2) {
                        tile.setIsStart(true);
                        this._heroStartPosition = {y: y, x: x};
                    }
                    if (cell === 3) {
                        tile.setIsObstacle(true);
                        tile.setIsItem(true);
                    }
                    if(cell === 4) {
                        tile.setIsObstacle(true);
                    }
                    if(cell === 5) {
                        tile.setIsObstacle(false);
                        tile.setIsExit(true);
                        this.exitTile = tile;
                    }
                    row.push(tile);
                }
            }
            grid.push(row);
        }
        return grid;
    }

    private setupItemsBlocks() {
        this.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                if(tile.isItem) {
                    this.addTileToItemsBlocks(tile, y, x);
                }
            });
        });
    }

    private setupArroundItemsBlocks() {
        this.itemsBlocks.forEach((itemBlock) => {
            itemBlock.geArroundTiles();
        });
    };

    private addTileToItemsBlocks(tile: Tile, y: number, x: number): void {
        let result: Tile | undefined = undefined;
        this.itemsBlocks.forEach((itemBlock) => {
            
            if(result) return;

            result = itemBlock.tiles.find((t) => ((t.x === tile.x && t.y === tile.y - 1) || (t.y === tile.y && t.x === tile.x - 1)));
            
            if(result) {
                itemBlock.tiles.push(tile);
                itemBlock.to = {y: y, x: x};
                itemBlock.geArroundTiles();
                return;
            }
        })
        if(result) return;
        this.itemsBlocks.push(new ItemBlock(
            {y: y, x: x},
            {y: y, x: x},
            false,
            [tile],
            new Item(ItemTypes.EMPTY),
            this,
            (item: Item) => this.manageItemAcquisition(item),
        ));
    }

    private assignItemToBlock(): void {
        if(this.itemsBlocks.length === 0) return;
        const randomIndex = Math.floor(Math.random() * this.itemsBlocks.length);
        const itemBlock = this.itemsBlocks[randomIndex];
        if(itemBlock.item.type !== ItemTypes.EMPTY){
            this.assignItemToBlock();
            return;
        }
        const itemType = this.getRadomItemType();
        itemBlock.item = new Item(itemType);
        if(this.itemsLevel.length > 0) {
            this.assignItemToBlock();
        }
    }

    private getRadomItemType(): ItemTypes  {
        const total = this.itemsLevel.length;
        if(total === 0) {
            return ItemTypes.EMPTY;
        }
        const randomIndex = Math.floor(Math.random() * total);
        const item = this.itemsLevel[randomIndex];
        this.itemsLevel.splice(randomIndex, 1);
        return item.type;
    }

    public openExit(): void {
        this.exitTile?.setIsExitOpen(true);
    }

    public update() {
        this.itemsBlocks.forEach((itemBlock) => {
            itemBlock.isDiscover();
        });
    }

    public draw() {
        this.grid.forEach((row) => {
            row.forEach((tile) => {
                tile.draw();
            });
        });
    }
   
}