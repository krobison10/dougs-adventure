"use strict";

class Tile extends GameObject {
    constructor(game, x, y, sprite) {
        super(x, y);
        Object.assign(this, {game, sprite});
        this.x *= 120;
        this.y *= 120;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.getScreenPos().x, this.getScreenPos().y, 120, 120)
    }
}