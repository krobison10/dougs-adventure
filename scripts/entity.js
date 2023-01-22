"use strict";

/**
 * Represents an entity in the game
 *
 * @abstract
 * @author Kyler Robison
 */
class Entity {
    /**
     * Constructs an abstract entity
     * @param {Vec2} pos the position of the entity.
     * @param {Dimension} size the size of the entity.
     */
    constructor(pos, size) {
        if(this.constructor === Entity) {
            throw new Error("Entity is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {pos, size});

        /**
         * Whether the entity should be removed from the world on the next update.
         * @type {boolean}
         */
        this.removeFromWorld = false;
    }

    /**
     * @returns {Vec2} the center point of the entity
     */
    getCenter() {
        return new Vec2(this.pos.x + this.size.w / 2, this.pos.y + this.size.h / 2);
    }

    /**
     * Returns the position of the entity on the screen, rather than its true game location.
     * @returns {Vec2}
     */
    getScreenPos() {
        return new Vec2(this.pos.x - gameEngine.camera.pos.x, this.pos.y - gameEngine.camera.pos.y);
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

    update() {

    }
}