/**
 * Represents the bear enemy.
 *
 * @author Alay Kidane
 *
 */

'use strict';
class BearBoss extends Enemy {
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints,x,y,direction) {
        super(pos, spritesheet, size, spritePadding, damage, hitPoints);


        this.x=x;
        this.y=y;
        this.direction=direction;
        // max hitpoints and damage of the boss
        this.maxHitPoints = 500;
        this.hitPoints = this.maxHitPoints;
        this.damage = 50;

        // boss's movement speed
        this.speed = 100;
        this.velocity = new Vec2(0, 0);

        // boss's collision bounding box
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        // animations for the boss
        //xstart,ystart,width,height,fraamecount,frameduration,framepadding,reverse,loop
      this.animations = [
        
           // new Animator(this.spritesheet, 0, 0, 0, 0, 1, 1, 0, false, true), //idle
            new Animator(this.spritesheet, 0, 0, 56, 56, 3, 0.2, 0, false, true), //up
             new Animator(this.spritesheet, 0,56, 56, 56, 3, 0.2, 0, false, true), //down
             new Animator(this.spritesheet, 0, 56*2, 56, 56, 3, 0.2, 0, false, true),//left
             new Animator(this.spritesheet, 0, 56*3, 56, 56, 3, 0.2, 0, false, true), //right
            //, new Animator(this.spritesheet, 0, this.size.h * 5, this.size.w, this.size.h, 3, 0.2, 0, false, true),
      ];  
        this.currentAnim = this.animations[0];
 
    }

   
    update() {
// call custom move function
this.move();

        // change direction and velocity randomly
        if (Math.random() < 0.05) {
            this.velocity.x = (Math.random() - 0.5) * 5;
            this.velocity.y = (Math.random() - 0.5) * 5;
        }
    
// update the current animation based on the direction of the bear boss

    

        // // check if the bear boss is dead
        if (this.hitPoints <= 0) {
            this.velocity.x = this.velocity.y = 0;
            return;
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
    if(Math.random() < 0.25) {
      const randomDirection = Math.floor(Math.random() * 4);
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
      }
    }
  //  Change animation based on direction
    // if (this.directionMem === 1) {
    //   this.currentAnim = this.animations.moveLeft;
    // } else if (this.directionMem === 2) {
    //   this.currentAnim = this.animations.moveRight;
    // } else if (this.directionMem === 3) {
    //   this.currentAnim = this.animations.moveUp;
    // } else if (this.directionMem === 4) {
    //   this.currentAnim = this.animations.moveDown;
    // }
  }
draw(ctx){
  // this.drawAnim(ctx, this.animations[3]);
    if (this.velocity.x > 0) { //right
         this.drawAnim(ctx, this.animations[2]);
      } else if (this.velocity.x < 0) {//left
        this.drawAnim(ctx, this.animations[1]);
      } else if (this.velocity.y > 0) { //down
        this.drawAnim(ctx, this.animations[0]);
      } else if (this.velocity.y < 0) { //up
        this.drawAnim(ctx, this.animations[3]);
      } else {
        // this.drawAnim = this.animations[0];
      }
      // this.boundingBox.draw(ctx);

}

drawAnim(ctx,animation) {
    animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, 1.5);
  }
      
} 
