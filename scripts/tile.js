"use strict";

class Tile {
    constructor(game, x, y, sprite) {
        Object.assign(this, {game, x, y, sprite});
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x * 16, this.y * 16)
    }
}