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

        // this.animation = new Animator(this.spritesheet, 52, 2*72, 52, 72,
        //     2, .07, 0, false, true);
        this.animations = [];


        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 0, i * 72, 52, 72,
                1, 1, 0, false, true);
        }
        for(let i = 0; i < 4; i++) {
            this.animations[i + 4] = new Animator(this.spritesheet, 52, i * 72, 52, 72,
                2, .1, 0, false, true);
        }

        this.speed = 250;
        this.velocity = {x: 0, y : 0};
        this.directionMem = 0;
    }

    /**
     * Updates the player for the frame.
     */
    update() {
        this.velocity.x = this.velocity.y = 0;

        if(this.game.keys["a"]) this.velocity.x -= this.speed;
        if(this.game.keys["d"]) this.velocity.x += this.speed;
        if(this.game.keys["w"]) this.velocity.y -= this.speed;
        if(this.game.keys["s"]) this.velocity.y += this.speed;

        //If the resulting vector's magnitude exceeds the speed
        if(Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y) > this.speed) {
            //Modify components so that vector's magnitude (total speed) matches actual speed
            this.velocity.x = this.speed/Math.sqrt(2) * this.velocity.x/this.speed;
            this.velocity.y = this.speed/Math.sqrt(2) * this.velocity.y/this.speed;
        }

        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    draw(ctx) {
        if(this.velocity.x < 0) {
            this.drawAnim(ctx, this.animations[5]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0) {
            this.drawAnim(ctx, this.animations[6]);
            this.directionMem = 2;
        }
        if(this.velocity.y === this.speed) {
            this.drawAnim(ctx, this.animations[4]);
            this.directionMem = 0;
        }
        if(this.velocity.y === -this.speed) {
            this.drawAnim(ctx, this.animations[7]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[this.directionMem]);
        }
    }

    getCenter() {
        return {x: this.x + 52/2, y: this.y + 72/2};
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(this.game.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}