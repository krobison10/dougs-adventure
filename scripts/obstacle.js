'use strict'

/**
 * Represents an obstacle in the game world.
 *
 * @author Kyler Robison
 */
class Obstacle extends Entity {
    /**
     * Creates a new obstacle that represents a stationary, potentially collidable object in came
     * @param {Vec2} pos the position of the object in the game world.
     * @param {Dimension} size the size of the object in the game world.
     * @param {HTMLImageElement} spritesheet the sprite or spritesheet.
     * @param {boolean} collidable represents whether other entities will collide with the obstacle.
     * @param {LightSource} lightSource to add to the object
     * @param {Vec2} sheetPos the position of the sprite within the spritesheet.
     * @param {Dimension} sheetSize the size of the sprite in the spritesheet.
     */
    constructor(pos, size, spritesheet, collidable = false,
                lightSource = null, sheetPos = new Vec2(0,0 ),
                sheetSize = size) {
        super(pos, size);
        Object.assign(this, {spritesheet, collidable, sheetPos, sheetSize});
        if(collidable) this.boundingBox = new BoundingBox(pos, size);

        if(lightSource) {
            lightSource.attachTo = this;
            lightMap.addLightSource(lightSource);
        }
    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.sheetPos.x, this.sheetPos.y, this.sheetSize.w, this.sheetSize.h,
            this.getScreenPos().x, this.getScreenPos().y, this.size.w, this.size.h);

        if(this.collidable) this.boundingBox.draw(ctx);
    }
}

class InvisibleBorder extends Entity {
    constructor(pos, size) {
        super(pos, size);
        pos.x = pos.x * TILE_SIZE;
        pos.y = pos.y * TILE_SIZE;
        size.w = size.w * TILE_SIZE;
        size.h = size.h * TILE_SIZE;
        this.boundingBox = Character.createBB(pos, size, new Padding(0, 0, 0 ,0));
    }

    draw(ctx) {
        this.boundingBox.draw(ctx);
    }
}