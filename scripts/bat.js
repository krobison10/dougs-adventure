"use strict";

/**
 * Represents the player character.
 *
 * @author Cameron Lempitsky
 *
 */
class Bat extends Character {
    /**
     * @param {Vec2} pos initial position of the player.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Dimension} size size of the sprite.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     */
    constructor(pos, spritesheet, size, spritePadding) {
        super(pos, spritesheet, size, spritePadding);
        this.animations = [];

        this.maxHitPoints = 100;

        //Change to see health bar
        this.hitPoints = 100;
        this.damage = 12;

        this.speed = 250;
        this.velocity = new Vec2(0,0);
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

        //this.velocity.x = this.velocity.y = 0;
        
        if (this.pos.x >= 200 && this.pos.y >= 200) {
            this.velocity.x = 0;
            this.velocity.y = -this.speed;
        }

        if (this.pos.x >= 200 && this.pos.y <=0) {
            this.velocity.y = 0;
            this.velocity.x = -this.speed;
        }

        if (this.pos.x <= 0 && this.pos.y <= 0) {
            this.velocity.x = 0;
            this.velocity.y = this.speed;
        }

        if(this.pos.x <= 0 && this.pos.y >= 200) {
            this.velocity.x = this.speed;
            this.velocity.y = 0;
        }

        this.pos.x += this.velocity.x * gameEngine.clockTick;
        this.pos.y += this.velocity.y * gameEngine.clockTick;


        /**
         * Check for collision, we do two separate checks
         */
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")


        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    draw(ctx) {


        if(this.velocity.x < 0) {//left
            this.drawAnim(ctx, this.animations[7]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0) {//right
            this.drawAnim(ctx, this.animations[5]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && this.velocity.x === 0) {//down
            this.drawAnim(ctx, this.animations[4]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && this.velocity.x === 0) {//up
            this.drawAnim(ctx, this.animations[6]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[5]);
        }

        this.boundingBox.draw(ctx);
    }

     drawAnim(ctx, animator) {
         animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, 1.5);
     }
}