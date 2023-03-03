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
        this.type = 'bat';
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        this.time = 0;
        this.aggroRange = 300;
        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, this.size.w, i * this.size.h,
                this.size.w, this.size.h,
                3, .1, 0, false, true);
        }

        this.targetID = randomInt(3);
        this.path = [{x: this.pos.x, y: this.pos.y}, {x: this.pos.x+ 200, y: this.pos.y}, {x: this.pos.x+200, y: this.pos.y+200}, {x: this.pos.x, y: this.pos.y+200}];
        this.target = this.path[this.targetID % this.path.length];

        let dist = getDistance(this.pos, this.target)
        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

    }

    /**
     * Updates the bat for the frame.
     */
    update() {
        let dist = getDistance(this.pos, this.target);
        let dougDist = getDistance(this.pos, doug.pos);

        if(dougDist < this.aggroRange && !doug.dead) {
            this.target = doug.pos;
        } else {
            if (dist < 5) {
                this.targetID++;
            }
            this.target = this.path[this.targetID % 4];
            dist = getDistance(this.pos, this.target)
        }

        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }else {
            this.targetID = randomInt(3);
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }else {
            this.targetID = randomInt(3);
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/bat_kill.wav")
    }

    draw(ctx) {

        //this.drawAnim(ctx, this.animations[7]);

        if(this.velocity.x < 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//left
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0 && this.velocity.x >= this.velocity.y) {//right
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//up
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