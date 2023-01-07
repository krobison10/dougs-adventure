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
     * @param {Vec2 | Object} pos the position of the entity.
     * @param {Dimension | Object} size the size of the entity.
     */
    constructor(pos, size) {
        if(this.constructor === Entity) {
            throw new Error("Entity is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {pos, size});

        this.removeFromWorld = false;
    }

    /**
     * @returns {Vec2} the center point of the entity
     */
    getCenter() {
        return new Vec2(this.pos.x + this.size.w / 2, this.pos.y + this.size.h / 2);
    }

    /**
     * Returns the position of the entity on the screen, rather than it's true game location.
     * @returns {Vec2}
     */
    getScreenPos() {
        return new Vec2(this.pos.x - gameEngine.camera.pos.x, this.pos.y - gameEngine.camera.pos.y);
    }
}