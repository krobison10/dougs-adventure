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
    constructor(pos) {
        super(pos,
            ASSET_MANAGER.getAsset("sprites/bat_spritesheet.png"),
            new Dimension(32, 32),
            new Padding(),
            10,
            50);
        this.animations = [];
        this.scale = 1;
        this.speed = 200;
        this.directionMem = 0;
        this.changeDirectionDelay = 1;
        this.type = 'bat';
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
        this.time = 0;
        this.aggroRange = 300;
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
                this.changeDirectionDelay = 1;
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
        ASSET_MANAGER.playAsset("sounds/bat_kill.wav")
    }

    draw(ctx) {

        //this.drawAnim(ctx, this.animations[7]);

        if(this.velocity.x < 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//left
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//right
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
            this.drawAnim(ctx, this.animations[0]);
        }

        this.boundingBox.draw(ctx);
    }

     drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
     }
}