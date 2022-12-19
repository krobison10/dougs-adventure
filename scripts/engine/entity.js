"use strict";

/**
 *
 *
 * @abstract
 * @author Kyler Robison
 */
class Entity {
    constructor(x, y) {
        if(this.constructor === Entity) {
            throw new Error("Character is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {x, y});
        this.removeFromWorld = false;
        this.screenX = this.getScreenPos();
        this.screenY = this.getScreenPos();
    }

    update() {
        this.screenX = this.getScreenPos();
        this.screenY = this.getScreenPos();
    }

    getScreenPos() {
        return {x: this.x - gameEngine.camera.x, y: this.y - gameEngine.camera.y};
    }
}