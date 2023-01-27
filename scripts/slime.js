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
     * @param {Dimension} size size of the slime in the spritesheet.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {damage} damage represents the damage of the slime
     * @param {hitPoints} hitPoints represenets the heath of the slime
     * @param {parent} parent is boolean true if this is the parent slime that spawn 2 little slimes. little slimes are false
     * @param {scale} scale of the slime in the game small slimes are .5 of the big slime
     */
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints, parent, scale) {
        super(pos, spritesheet, size, spritePadding, damage, hitPoints);
        Object.assign(this, {parent, scale});
        this.animations = [];
        this.maxHitPoints = 100;

        //this.hitPoints = 100;
        //this.damage = 10;

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
    takeDamage(amount) {
            this.hitPoints -= amount;
            if(this.hitPoints <= 0) {
                this.hitPoints = 0;
                this.die();
            }
    }
    
    die() {
        if (this.hitPoints <= 0) {
            if (this.parent) {
                //this.pos.x+1,this.pos.y
                //(-3,-3)
                let slime = new Slime(new Vec2(-3,-3), ASSET_MANAGER.getAsset("sprites/slime01.png"), 
                    new Dimension(55, 37), new Padding(0, 15, 10, 5), 10, 100, false, .75)
                let slime2 = new Slime(new Vec2(-9,-3), ASSET_MANAGER.getAsset("sprites/slime01.png"), 
                    new Dimension(55, 37), new Padding(0, 15, 10, 5), 10, 100, false, .75)
                    
                slime
                
                let slime1Bar = new HealthBar(slime);
                let slime2Bar = new HealthBar(slime2);
                
                gameEngine.addEntity(slime);
                gameEngine.addEntity(slime2);
                gameEngine.addEntity(slime1Bar);
                gameEngine.addEntity(slime2Bar);
                
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