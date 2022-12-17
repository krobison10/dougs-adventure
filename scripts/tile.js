"use strict";

class Tile {
    constructor(game, x, y, sprite) {
        Object.assign(this, {game, x, y, sprite});
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x * 120, this.y * 120, 120, 120)
    }
}