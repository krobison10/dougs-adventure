"use strict";

/**
 * Represents the slime enemy.
 *
 * @author Cameron Lempitsky
 *
 */
class Slime extends Enemy {
    //static parent = TRUE;

    /**
     * @param {Vec2} pos initial position of the slime.
     * @param {HTMLImageElement} spritesheet spritesheet of the slime.
     * @param {Dimension} size size of the slime.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     */
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints, parent, scale) {
        super(pos, spritesheet, size, spritePadding, damage, hitPoints);
        Object.assign(this, {parent, scale});
        this.animations = [];
       // this.gameEngine = gameEngine;
        this.maxHitPoints = 100;

        //this.hitPoints = 100;
        //dthis.damage = 10;

        this.speed = 250;
        this.velocity = new Vec2(0,0);
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 13, i * this.size.h + 8,
                this.size.w, this.size.h,
                3, .5, 0, false, true);
        }
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
        const entities = gameEngine.entities[Layers.FOREGROUND];
        for(const entity of entities) {
             if (entity instanceof Doug && this.boundingBox.collide(entity.boundingBox)) {
                 this.hitPoints -= 3;
            }
        }
        if (this.hitPoints <= 0) {
            if (this.parent) {
                let slime = new Slime(new Vec2(0,0), ASSET_MANAGER.getAsset("sprites/slime01.png"), 
                    new Dimension(55, 37), new Padding(0, -20, -20, 5), 10, 100, false, .75)
                    let slime2 = new Slime(new Vec2(-3,-3), ASSET_MANAGER.getAsset("sprites/slime01.png"), 
                    new Dimension(55, 37), new Padding(0, -20, -20, 5), 10, 100, false, .75)
                gameEngine.addEntity(slime);
                gameEngine.addEntity(slime2);
            }
            
            this.removeFromWorld = true;
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