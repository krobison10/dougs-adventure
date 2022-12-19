"use strict";

/**
 * Abstract class that represents characters in game such as
 * the Player, NPCs, or Enemies, that need keyframe animation.
 *
 * @abstract
 * @author Kyler Robison
 */
class Character extends Entity {
    /**
     * @param {Vec2 | Object} pos initial position, object must have an x and y field.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Dimension | Object} size size of the sprite, object must have a 'w' and 'h' field.
     */
    constructor(pos, spritesheet, size) {
        super(pos);
        if(this.constructor === Character) {
            throw new Error("Character is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {spritesheet, size});

        //Makes default animation as forward facing single keyframe
        this.animation = new Animator(this.spritesheet, 0,0, size.w, size.h,
            1, 1, 0, false, true);
    }

    /**
     * Executes updates that should occur each frame.
     * @abstract
     */
    update() {
        throw new Error("Method is abstract, must be implemented in subclass");
    }

    /**
     * Draws the current frame of the animation at the current position of the Character.
     * @param {CanvasRenderingContext2D} ctx the rendering context.
     */
    draw(ctx) {
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}