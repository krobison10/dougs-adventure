"use strict";

class Tile extends Entity {
    constructor(pos, sprite) {
        super(pos);
        this.sprite = sprite;
        this.pos.x *= TILE_SIZE;
        this.pos.y *= TILE_SIZE;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.getScreenPos().x, this.getScreenPos().y, TILE_SIZE, TILE_SIZE)
    }
}