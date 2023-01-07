"use strict";

/**
 * Represents the player character.
 *
 * @author Kyler Robison
 *
 */
class Player extends Character {
    /**
     * @param {Vec2 | Object} pos initial position of the player, object must have an x and y field.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Dimension | Object} size size of the sprite, object must have a 'w' and 'h' field.
     */
    constructor(pos, spritesheet, size) {
        super(pos, spritesheet, size);
        this.animations = [];

        this.speed = 250;
        this._velocity = new Vec2(0, 0);
        this._directionMem = 0;

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 0, i * this.size.h,
                this.size.w, this.size.h,
                1, 1, 0, false, true);
        }
        for(let i = 0; i < 4; i++) {
            this.animations[i + 4] = new Animator(this.spritesheet, this.size.w, i * this.size.h,
                this.size.w, this.size.h,
                2, .1, 0, false, true);
        }
    }

    /**
     * Updates the player for the frame.
     */
    update() {
        this._velocity.x = this._velocity.y = 0;

        if(gameEngine.keys["a"]) this._velocity.x -= this.speed;
        if(gameEngine.keys["d"]) this._velocity.x += this.speed;
        if(gameEngine.keys["w"]) this._velocity.y -= this.speed;
        if(gameEngine.keys["s"]) this._velocity.y += this.speed;

        //If the resulting vector's magnitude exceeds the speed
        if(Math.sqrt(this._velocity.x * this._velocity.x + this._velocity.y * this._velocity.y) > this.speed) {
            //Modify components so that vector's magnitude (total speed) matches desired speed
            this._velocity.x = this.speed/Math.sqrt(2) * this._velocity.x/this.speed;
            this._velocity.y = this.speed/Math.sqrt(2) * this._velocity.y/this.speed;
        }

        this.pos.x += this._velocity.x * gameEngine.clockTick;
        this.pos.y += this._velocity.y * gameEngine.clockTick;

        //To make sure tiles are drawn pretty, fractional pixels can make things get weird
        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);

        this.updateDebug();
    }

    /**
     * Updates the position label below the canvas
     */
    updateDebug() {
        const label = document.getElementById("position");
        label.innerText = `X: ${Math.round(this.pos.x / TILE_SIZE)}, Y: ${Math.round(this.pos.y / TILE_SIZE)}`;
    }

    draw(ctx) {
        if(this._velocity.x < 0) {
            this.drawAnim(ctx, this.animations[5]);
            this._directionMem = 1;
        }
        if(this._velocity.x > 0) {
            this.drawAnim(ctx, this.animations[6]);
            this._directionMem = 2;
        }
        if(this._velocity.y === this.speed) {
            this.drawAnim(ctx, this.animations[4]);
            this._directionMem = 0;
        }
        if(this._velocity.y === -this.speed) {
            this.drawAnim(ctx, this.animations[7]);
            this._directionMem = 3;
        }
        if(this._velocity.y === 0 && this._velocity.x === 0) {
            this.drawAnim(ctx, this.animations[this._directionMem]);
        }
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}