"use strict";

/**
 * Represents the slime enemy.
 *
 * @author Cameron Lempitsky
 *
 */
class Slime extends Enemy {

    /**
     * @param {Vec2} pos initial position of the slime.
     * @param {HTMLImageElement} spritesheet spritesheet of the slime.
     * @param {Dimension} size size of the slime in the spritesheet.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {number} damage how much damage the entity deals to the player
     * @param {number} maxHitPoints maximum health of the enemy.
     */
    constructor(pos, spritesheet, size, spritePadding, damage, maxHitPoints, parent, scale) {
        super(pos, spritesheet, size, spritePadding, damage, maxHitPoints, scale);

        this.parent = parent;
        this.scale = scale;

        this.animations = [];

        this.speed = 150;

        this.directionMem = 0;

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 13, i * this.size.h + 8,
                this.size.w, this.size.h,
                3, .5, 0, false, true);
        }

        this.size.w *= scale;
        this.size.h *= scale;

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        gameEngine.addEntity(new HealthBar(this), 4)

    }

    /**
     * Updates the slime for the frame.
     */
    update() {
        this.route();

        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
       // var that = this;
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }
       
        
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }
    route() {
        let x = 120;
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

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/slime_kill.wav")
    }
    
    die() {
        if (this.hitPoints <= 0) {
            if (this.parent) {
                let slime = new Slime(new Vec2(this.pos.x, this.pos.y), ASSET_MANAGER.getAsset("sprites/slime01.png"),
                    new Dimension(55, 37), new Padding(0,0,0,0), 10, 100, false, .7);
                let slime2 = new Slime(new Vec2(this.pos.x + 55, this.pos.y), ASSET_MANAGER.getAsset("sprites/slime01.png"),
                    new Dimension(55, 37), new Padding(0,0,0,0), 10, 100, false, .7);
    
                gameEngine.addEntity(slime);
                gameEngine.addEntity(slime2);
            }
    
            this.removeFromWorld = true;
        }
    }
    draw(ctx) {

            //this.drawAnim(ctx, this.animations[2]);
        if(this.velocity.x < 0) {//left
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0) {//right
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && this.velocity.x === 0) {//down
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && this.velocity.x === 0) {//up
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[1]);
        }

        this.boundingBox.draw(ctx);
    }

     drawAnim(ctx, animator) {
         animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, this.scale);
     }
}