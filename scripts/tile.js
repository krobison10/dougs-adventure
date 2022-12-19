"use strict";

class Tile extends Entity {
    constructor(x, y, sprite) {
        super(x, y);
        this.sprite = sprite;
        this.x *= 120;
        this.y *= 120;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.getScreenPos().x, this.getScreenPos().y, 120, 120)
    }
}