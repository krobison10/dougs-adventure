"use strict";

/**
 * Represents the player character.
 *
 * @author Kyler Robison
 *
 */
class Doug extends Character {
    /**
     * @param {Vec2} pos initial position of the player.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Dimension} size size of the sprite.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     */
    constructor(pos, spritesheet, size, spritePadding) {
        super(pos, spritesheet, size, spritePadding);
        this.animations = [];

        /**
         * Represents the maximum hitpoints of doug
         * @type {number}
         */
        this.maxHitPoints = 100;

        /**
         * Represents the health of doug. Should not exceed 400 because the health bar will break.
         * @type {number}
         */
        this.hitPoints = 100;

        this.speed = 250;
        this.velocity = new Vec2(0, 0);
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

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

        this.velocity.x = this.velocity.y = 0;

        if(gameEngine.keys["a"]) this.velocity.x -= this.speed;
        if(gameEngine.keys["d"]) this.velocity.x += this.speed;
        if(gameEngine.keys["w"]) this.velocity.y -= this.speed;
        if(gameEngine.keys["s"]) this.velocity.y += this.speed;

        //If the resulting vector's magnitude exceeds the speed
        if(Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y) > this.speed) {
            //Modify components so that vector's magnitude (total speed) matches desired speed
            this.velocity.x = this.speed/Math.sqrt(2) * this.velocity.x/this.speed;//Might be redundant code
            this.velocity.y = this.speed/Math.sqrt(2) * this.velocity.y/this.speed;
        }

        /**
         * Check for collision, we do two separate checks so that if a player is colliding in one axis
         * they can still possibly be able to move on the other axis.
         */
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

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

        this.boundingBox.draw(ctx);
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}