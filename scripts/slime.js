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
     * @param {number} hitPoints health of the enemy.
     * @param {Boolean} parent whether the slime will split on death or not.
     * @param {Number} scale in relation to the spritesheet size.
     */
    constructor(pos, spritesheet, size, spritePadding,
                damage, hitPoints, parent, scale) {
        super(pos, spritesheet, new Dimension(size.w * scale, size.h * scale), spritePadding, damage, hitPoints);

        this.type = 'slime';

        this.parent = parent;
        this.scale = scale;

        this.animations = [];
        this.changeDirectionDelay = 1;
        this.speed = 150;

        this.directionMem = 0;

        this.aggroRange = 250;

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 13, (i * 37) + 8,
                55, 37,
                3, .5, 0, false, true);
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    /**
     * Updates the slime for the frame.
     */
    update() {
        super.update();

        if(this.knockback) {
            this.velocity = new Vec2(this.knockbackDir.x, this.knockbackDir.y);

            let scalingFactor = this.knockbackSpeed / this.knockbackDir.magnitude();

            this.velocity.x *= scalingFactor;
            this.velocity.y *= scalingFactor;
        }
        else {           
            this.move()
        }

        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }
        
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }
    move() {
        let center = this.getCenter();
        let dougDist = getDistance(center, doug.getCenter());
        let dougCenter = doug.getCenter();

        //Decrement the direction delay by 1
        this.changeDirectionDelay-= gameEngine.clockTick;
        //console.log(this.changeDirectionDelay);
        //Check if the direction delay has elapsed
        if(dougDist < this.aggroRange && !doug.dead && dougDist > 2) {
            //this.target = doug.pos;
            this.velocity= new Vec2((dougCenter.x - center.x)/dougDist * this.speed,(dougCenter.y - center.y)/dougDist * this.speed);
        } else {
            if(dougDist <= 2) {
                this.velocity.x=0;
                this.velocity.y=0;
            }

            if (this.changeDirectionDelay <= 0) {
                            // Reset the direction delay to a new value
                this.changeDirectionDelay = 3;
                    // Change direction and velocity randomly with probability

                const randomDirection = Math.floor(Math.random() * 5);
                switch (randomDirection) {
                    case 0:
                        this.velocity.x = -this.speed;
                        this.velocity.y = 0;
                        this.directionMem = 1;
                        break;
                    case 1:
                        this.velocity.x = this.speed;
                        this.velocity.y = 0;
                        this.directionMem = 2;
                        break;
                    case 2:
                        this.velocity.x = 0;
                        this.velocity.y = -this.speed;
                        this.directionMem = 3;
                        break;
                    case 3:
                        this.velocity.x = 0; 
                        this.velocity.y = this.speed;
                        this.directionMem = 4;
                        break;
                    case 4:
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                }
            }
        } 
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/slime_kill.wav")
    }
    
    die() {
        super.die();
        if (this.hitPoints <= 0) {
            if (this.parent) {
                let slime = new Slime(new Vec2(this.pos.x, this.pos.y), ASSET_MANAGER.getAsset("sprites/slime01.png"),
                    new Dimension(55, 37), new Padding(0,0,0,0), 10, 100, false, .7);
                let slime2 = new Slime(new Vec2(this.pos.x + 55, this.pos.y), ASSET_MANAGER.getAsset("sprites/slime01.png"),
                    new Dimension(55, 37), new Padding(0,0,0,0), 10, 100, false, .7);
                slime.targetID += 1;
                gameEngine.addEntity(slime);
                gameEngine.addEntity(slime2);
            }
    
            this.removeFromWorld = true;
        }
    }
    draw(ctx) {

        //this.drawAnim(ctx, this.animations[1]); 0 3 1 2 1

        if(this.velocity.x < 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//left
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//right
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//down
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//up
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