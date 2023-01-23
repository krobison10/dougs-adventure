"use strict";

class Item {
    //Number of cols in the spritesheet
    static spriteSheetCols = 16;
    //Number of rows in the spritesheet
    static spriteSheetRows = 22;
    //Size of the sprites in the sheet
    static spriteSize = 16;
    /**
     * Stores the names of items by id
     */
    static itemNames = {
        76: 'Diamond Bow',
        85: 'Candle',
        246: 'Healing Potion',
        336: 'Iron Sword'
    }

    /**
     * Given the id of an item, returns the location of the sprite in the items spritesheet
     * @param id
     * @returns {{size: number, x: number, y: number}}
     */
    static getItemSpriteLocById(id) {
        if(id < 1 || id > 350) {
            throw new Error("Invalid item ID requested");
        }
        id -= 1;
        let col = id % this.spriteSheetCols;
        let row = Math.floor(id / this.spriteSheetCols);
        return {x: col * Item.spriteSize, y: row * Item.spriteSize, size: Item.spriteSize};
    }

}