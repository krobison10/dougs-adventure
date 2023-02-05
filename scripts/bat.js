"use strict";

/**
 * Represents the bat enemy.
 *
 * @author Cameron Lempitsky
 *
 */
class Bat extends Enemy {
    /**
     * @param {Vec2} pos initial position of the bat.
     * @param {HTMLImageElement} spritesheet spritesheet of the bat.
     * @param {Dimension} size size of the bat.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {number} damage how much damage the entity deals to the player
     * @param {number} maxHitPoints maximum health of the enemy.
     */
    constructor(pos, spritesheet, size, spritePadding, damage, maxHitPoints) {
        super(pos, spritesheet, size, spritePadding, damage, maxHitPoints);
        this.animations = [];

        this.speed = 200;
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, this.size.w, i * this.size.h,
                this.size.w, this.size.h,
                3, .1, 0, false, true);
        }
    }

    /**
     * Updates the bat for the frame.
     */
    update() {
        this.route();
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }

        const entities = gameEngine.entities[Layers.FOREGROUND];
        // for(const entity of entities) {
        //      if (entity instanceof Doug && this.boundingBox.collide(entity.boundingBox)) {
        //          this.hitPoints = 0;
        //     }
        // }
        if (this.hitPoints <= 0) {
            
            console.log("1");

            this.removeFromWorld = true;
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    route() {
        let x = 200;
        if (this.pos.x >= x && this.pos.y >= x) {
            this.velocity.x = 0;
            this.velocity.y = -this.speed;
        }

        if (this.pos.x >= x && this.pos.y <=0) {
            this.velocity.y = 0;
            this.velocity.x = -this.speed;
        }

        if (this.pos.x <= 0 && this.pos.y <= 0) {
            this.velocity.x = 0;
            this.velocity.y = this.speed;
        }

        if(this.pos.x <= 0 && this.pos.y >= x) {
            this.velocity.x = this.speed;
            this.velocity.y = 0;
        }
    }

    draw(ctx) {

        //this.drawAnim(ctx, this.animations[7]);

        if(this.velocity.x < 0) {//left
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0) {//right
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && this.velocity.x === 0) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && this.velocity.x === 0) {//up
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[3]);
        }

        this.boundingBox.draw(ctx);
    }

     drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
     }
}