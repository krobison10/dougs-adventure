"use strict";

/**
 * Represents the player character.
 *
 * @author Kyler Robison
 *
 */
class Player extends Character {
    /**
     * @param {GameEngine} game reference to the game engine object.
     * @param {number} x initial x position.
     * @param {number} y initial y position.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     */
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);

        this.animation = new Animator(this.spritesheet, 52, 2*72, 52, 72,
            2, .09, 0, false, true);

        this.speed = 3;
    }

    /**
     * Updates the player for the frame.
     */
    update() {
        this.x += this.speed;
        if(this.x >= 1024) {
            this.x = -52;
        }
    }
}