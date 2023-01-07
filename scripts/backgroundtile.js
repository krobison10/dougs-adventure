"use strict";

class BackgroundTile extends Entity {
    /**
     *
     * @param {Vec2 | Object} pos position of the tile, object must have an x and y field.
     * @param {Vec2 | Object} size size of the tile, object must have a w and h field.
     * @param {HTMLImageElement} sprite the sprite image.
     * @param {Vec2 | Object} tilemapPos
     */
    constructor(pos, size, sprite, tilemapPos) {
        super(pos, size);
        this.sprite = sprite;
        this.pos.x *= TILE_SIZE;
        this.pos.y *= TILE_SIZE;
        this.tilemapPos = tilemapPos;
    }

    update() {

    }

    draw(ctx) {
        //Decimal values appear because of the funky tilemap, will be fixed eventually
        ctx.drawImage(this.sprite, this.tilemapPos.x * 17.05, this.tilemapPos.y * 17.05, 15, 15,
            this.getScreenPos().x, this.getScreenPos().y, TILE_SIZE, TILE_SIZE);
    }
}