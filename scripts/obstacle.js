'use strict'

class Obstacle extends Entity {
    /**
     * Creates a new obstacle that represents a stationary, potentially collidable object in came
     * @param {Vec2 | Object} pos the position of the object in the game world.
     * @param {Dimension | Object} size the size of the object in the game world.
     * @param {HTMLImageElement} spritesheet the sprite or spritesheet.
     * @param {boolean} collidable represents whether other entities will collide with the obstacle.
     * @param {Vec2 | Object} sheetPos the position of the sprite within the spritesheet.
     * @param {Dimension | Object} sheetSize the size of the sprite in the spritesheet.
     */
    constructor(pos, size, spritesheet, collidable = false,
                sheetPos = new Vec2(0,0 ), sheetSize = size) {
        super(pos, size);
        Object.assign(this, {spritesheet, sheetPos, sheetSize});
        if(collidable) this.boundingBox = new BoundingBox(pos, size);
    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.sheetPos.x, this.sheetPos.y, this.sheetSize.w, this.sheetSize.h,
            this.getScreenPos().x, this.getScreenPos().y, this.size.w, this.size.h);

    }

    update() {

    }
}