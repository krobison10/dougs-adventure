"use strict";

class Item {
    //Number of cols in the spritesheet
    static spriteSheetCols = 16;
    //Number of rows in the spritesheet
    static spriteSheetRows = 22;
    //Size of the sprites in the sheet
    static spriteSize = 16;

    static items = {
        76: {
            name: 'Diamond Bow',
            stackable: true,
            stackName: 'arrow',
            reverse: true
        },
        85: {
            name: 'Candle',
            stackable: false,
            reverse: false
        },
        246: {
            name: 'Healing Potion',
            stackable: true,
            stackName: 'healing potion',
            reverse: false
        },
        336: {
            name: 'Iron Sword',
            stackable: false,
            reverse: true
        },
        351: {
            name: 'Mana Bolt',
            stackable: false,
            reverse: false
        }
    }

    /**
     * Given the id of an item, returns the location of the sprite in the items spritesheet
     * @param id
     * @returns {{size: number, x: number, y: number}}
     */
    static getItemSpriteLocById(id) {
        if(id < 1 || id > 351) {
            throw new Error("Invalid item ID requested");
        }
        id -= 1;
        let col = id % this.spriteSheetCols;
        let row = Math.floor(id / this.spriteSheetCols);
        return {x: col * Item.spriteSize, y: row * Item.spriteSize, size: Item.spriteSize};
    }
}