import { ItemTypes } from "../enums/itemTypes";
export class Item {
    public type: ItemTypes;
    public isDiscover: boolean;
    public points: number = 0;

    constructor(type: ItemTypes, isDiscover?: boolean) {
        this.type = type;
        this.isDiscover = isDiscover || false;

        switch (type) {
            case ItemTypes.EMPTY:
                this.points = 10;
                break;
            case ItemTypes.TREASURE:
                this.points = 150;
                break;
        }
    }

    public discovered(): void {
        this.isDiscover = true;
    }
}