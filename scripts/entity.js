"use strict";

/**
 * Represents an entity in the game
 *
 * @abstract
 * @author Kyler Robison
 */
class Entity {
    constructor(pos) {
        if(this.constructor === Entity) {
            throw new Error("Character is an abstract class, cannot be instantiated");
        }
        this.pos = pos;

        this.removeFromWorld = false;
    }

    getScreenPos() {
        return {x: this.pos.x - gameEngine.camera.pos.x, y: this.pos.y - gameEngine.camera.pos.y};
    }
}