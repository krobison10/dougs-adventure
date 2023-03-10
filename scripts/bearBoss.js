'use strict';


/**
 * Represents the bear enemy.
 *
 * @author Alay Kidane
 *
 */
class BearBoss extends Enemy {
    constructor(pos) {
        super(pos, ASSET_MANAGER.getAsset("sprites/bear.png"),
            new Dimension(84, 84), new Padding(8, 3, 8, 3), 40, 500); // top, right, bottom, left


        this.changeDirectionDelay = 8;
        this.pursueRange=400; //set the range at which the bear starts pursuing the player
        this.direction="right";  //default
        this.hitPoints = this.maxHitPoints;

        this.type = "bear";
        // store the original padding
        this.originalPadding = this.spritePadding;

        // boss's movement speed
        this.speed = 100;
        this.velocity = new Vec2(1, 0);
        this.velocity.x = this.speed
        this.velocity.y = 0

        // boss's collision bounding box
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        // animations for the boss
        //xstart,ystart,width,height,fraamecount,frameduration,framepadding,reverse,loop
        this.animations = [

            new Animator(this.spritesheet, 0, 56*4, 56, 56, 3, 0.2, 0, false, true), //up
             new Animator(this.spritesheet, 0,56*5, 56, 56, 3, 0.2, 0, false, true), //down
             new Animator(this.spritesheet, 0, 56*6, 56, 56, 3, 0.2, 0, false, true),//left
             new Animator(this.spritesheet, 0, 56*7, 56, 56, 3, 0.2, 0, false, true), //right
        ];
 
    }

    die() {
         log.addMessage("Bear has been defeated", MessageLog.colors.purple);
         super.die();
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/bear_kill.wav");
    }


    update() {
        // call custom move function
        this.move();

        // // check if the bear boss is dead
        if (this.hitPoints <= 0) {
            this.velocity.x = this.velocity.y = 0;
            return;
        }  
        
        // adjust the padding when moving to the right or left
        if (this.velocity.x > 0) { // moving right
            this.spritePadding = new Padding(
                this.originalPadding.top + 3,  // top padding + 5
                this.originalPadding.right, 
                this.originalPadding.bottom + 3,  // bottom padding + 5
                this.originalPadding.left
            );
        } else if (this.velocity.x < 0) { // moving left
            this.spritePadding = new Padding(
                this.originalPadding.top + 5, 
                this.originalPadding.right, 
                this.originalPadding.bottom + 5, 
                this.originalPadding.left
            );
        } else { // not moving
            this.spritePadding = new Padding(
                this.originalPadding.top + 5, 
                this.originalPadding.right, 
                this.originalPadding.bottom + 5, 
                this.originalPadding.left
            );
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

    move() {
        //Decrement the direction delay by 1
        this.changeDirectionDelay-= gameEngine.clockTick;
        if(getDistance(this.getCenter(), doug.getCenter()) < this.pursueRange && !doug.dead) {
            // calculate the direction vector from bear to player
            let bearCenter = this.getCenter();
            let playerCenter = doug.getCenter();
            let direction = {
                x : bearCenter.x  - playerCenter.x,
                y: bearCenter.y - playerCenter.y
            }
            let direction_magnitude = direction.x*direction.x + direction.y * direction.y

            direction_magnitude = Math.sqrt(direction_magnitude)

            direction.x/= direction_magnitude
            direction.y/= direction_magnitude

            this.velocity.x = direction.x * -this.speed;
            this.velocity.y = direction.y * -this.speed;
        }
        else {
            if (this.changeDirectionDelay <= 0) {
                // Reset the direction delay to a new value
                this.changeDirectionDelay = 8;

                // Change direction and velocity randomly with probability

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
        }
    }

    draw(ctx){
      // this.drawAnim(ctx, this.animations[3]);
        if(Math.abs(this.velocity.x) > Math.abs(this.velocity.y)){
            if (this.velocity.x > 0) { //right
               this.drawAnim(ctx, this.animations[2]);
            }
            else if (this.velocity.x < 0) {//left
               this.drawAnim(ctx, this.animations[1]);
            }
        }
        else {
             if (this.velocity.y > 0) { //down
                  this.drawAnim(ctx, this.animations[0]);} else if (this.velocity.y < 0) { //up
                  this.drawAnim(ctx, this.animations[3]);
             }
        }
        this.boundingBox.draw(ctx);
    }

    drawAnim(ctx,animation) {
        animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, 1.5);
    }
}
