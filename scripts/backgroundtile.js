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
        ctx.drawImage(this.sprite, this.tilemapPos.x * 16, this.tilemapPos.y * 16, 16, 16,
            this.getScreenPos().x, this.getScreenPos().y, TILE_SIZE + 1, TILE_SIZE + 1);
    }
}