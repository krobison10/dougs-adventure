/**
 * Represents the bear enemy.
 *
 * @author Alay Kidane
 *
 */
'use strict';

class BearBoss extends Enemy {
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints) {
        super(pos, spritesheet, size, spritePadding, damage, hitPoints);

        // max hitpoints and damage of the boss
        this.maxHitPoints = 500;
        this.damage = 50;

        // boss's movement speed
        this.speed = 100;
        this.velocity = new Vec2(0, 0);

        // boss's collision bounding box
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        // animations for the boss
        this.animations = {
            idle: new Animator(this.spritesheet, 0, 0, this.size.w, this.size.h, 1, 1, 0, false, true),
            moveUp: new Animator(this.spritesheet, 0, this.size.h, this.size.w, this.size.h, 3, 0.2, 0, false, true),
            moveDown: new Animator(this.spritesheet, 0, this.size.h * 2, this.size.w, this.size.h, 3, 0.2, 0, false, true),
            moveLeft: new Animator(this.spritesheet, 0, this.size.h * 3, this.size.w, this.size.h, 3, 0.2, 0, false, true),
            moveRight: new Animator(this.spritesheet, 0, this.size.h * 4, this.size.w, this.size.h, 3, 0.2, 0, false, true),
            attack: new Animator(this.spritesheet, 0, this.size.h * 5, this.size.w, this.size.h, 3, 0.2, 0, false, true),
        };
    }

   
    update() {
// call custom move function
this.move();

        // change direction and velocity randomly
        if (Math.random() < 0.05) {
            this.velocity.x = (Math.random() - 0.5) * 5;
            this.velocity.y = (Math.random() - 0.5) * 5;
        }
    
        // check if the bear boss is dead
        if (this.hitPoints <= 0) {
            this.velocity.x = this.velocity.y = 0;
            return;
        }
//new
   // update direction based on velocity
   if (this.velocity.x < 0) {
    this.drawAnim(gameEngine.ctx, this.animations.moveLeft);
} else if (this.velocity.x > 0) {
    this.drawAnim(gameEngine.ctx, this.animations.moveRight);
} else if (this.velocity.y < 0) {
    this.drawAnim(gameEngine.ctx, this.animations.moveUp);
} else if (this.velocity.y > 0) {
    this.drawAnim(gameEngine.ctx, this.animations.moveDown);
} else {
    this.drawAnim(gameEngine.ctx, this.animations.idle);
}

    
        /**
         * Check for collision, we do two separate checks
         */
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical");
        if (!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if (!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }
    
        // update bounding box
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }
    
    
/*
calculate the angle of the velocity vector and 
set the animator based on that angle
*/
move() {
    // Change direction and velocity randomly
    if(Math.random() < 0.5) {
        this.velocity.x = (Math.random() - 0.1) * this.speed;
        this.velocity.y = (Math.random() - 0.1) * this.speed;
    }
    
    // Determine the direction the bear is facing based on its velocity
    if (this.velocity.x < 0) {
        this.currentAnimation = this.animations.moveRight;
    } else if (this.velocity.x < 0) {
        this.currentAnimation = this.animations.moveLeft;
    } else if (this.velocity.y < 0) {
        this.currentAnimation = this.animations.moveDown;
    } else if (this.velocity.y < 0) {
        this.currentAnimation = this.animations.moveUp;
    }
}


    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, 1.5);
    }
}    


