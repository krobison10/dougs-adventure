"use strict";

/**
 * Abstract class that represents characters in game such as
 * the Player, NPCs, or Enemies, that need keyframe animation.
 *
 * @abstract
 * @author Kyler Robison
 */
class Character extends GameObject {
    /**
     * @param {GameEngine} game reference to the game engine object.
     * @param {number} x initial x position.
     * @param {number} y initial y position.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     */
    constructor(game, x, y, spritesheet) {
        super(x, y);
        if(this.constructor === Character) {
            throw new Error("Character is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {game, spritesheet});

        //Makes default animation as forward facing single keyframe
        this.animation = new Animator(this.spritesheet, 0,0, 52, 72,
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
        this.animation.drawFrame(this.game.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}