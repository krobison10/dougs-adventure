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
        this.scale = 1;
        this.speed = 200;
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        this.time = 0;
        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, this.size.w, i * this.size.h,
                this.size.w, this.size.h,
                3, .1, 0, false, true);
        }

        this.targetID = 0;
        this.path = [{x: 0, y: 0}, {x: 200, y: 0}, {x: 200, y: 200}, {x: 0, y: 200}];
        this.target = this.path[this.targetID % 4];

        let dist = getDistance(this.pos, this.target)
        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

    }

    /**
     * Updates the bat for the frame.
     */
    update() {
        let dist = getDistance(this.pos, this.target);
        if (dist < 5) {
            this.targetID++;
        }
        this.target = this.path[this.targetID % 4];
        dist = getDistance(this.pos, this.target)
        console.log(this.pos)

        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

        //this.route();
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }

        if (this.hitPoints <= 0) {
            this.removeFromWorld = true;
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/bat_kill.wav")
    }

    route() {
        let x = 200;

        if (timeInSecondsBetween(Date.now(), this.time) < 1) {
            this.velocity.x = 0;
            this.velocity.y = -this.speed;
        }
        if (timeInSecondsBetween(Date.now(), this.time) >= 1) {
            this.velocity.y = 0;
            this.velocity.x = -this.speed;
        }
        if (timeInSecondsBetween(Date.now(), this.time) < 2) {
            this.velocity.x = 0;
            this.velocity.y = this.speed;
        }
        if (timeInSecondsBetween(Date.now(), this.time) < 2) {
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