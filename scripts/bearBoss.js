/**
 * Represents the bear enemy.
 *
 * @author Alay Kidane
 *
 */
class BearBoss extends Enemy {
    /**
     * Creates a new bear boss that represents a stationary, potentially collidable object in came
     * @param {Vec2} pos the position of the object in the game world.
     * @param {Dimension} size the size of the object in the game world.
     * @param {HTMLImageElement} spritesheet the sprite or spritesheet.
     * @param {boolean} collidable represents whether other entities will collide with the obstacle.
     * @param {LightSource} lightSource to add to the object
     * @param {Vec2} sheetPos the position of the sprite within the spritesheet.
     * @param {Dimension} sheetSize the size of the sprite in the spritesheet.
     */
    
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints) {
        super(pos, spritesheet, size, spritePadding, damage, hitPoints);

        this.animations = [];
        this.maxHitPoints = hitPoints;
        this.hitPoints = hitPoints;
        this.damage = damage;
        this.speed = 75;
        this.velocity = new Vec2(0, -this.speed);
        this.direction = "up";
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);


 //create the special attack animation

 // this.specialAttackAnimation = new Animator(this.spritesheet, 0, 4* this.size.h,
//         this.size.w, this.size.h,
//         5, 0.1, 0, false, true);


        // Create animations for different directions
        this.animations["up"] = new Animator(this.spritesheet, 0, 0, this.size.w, this.size.h, 3, 0.1, 0, false, true);
        this.animations["down"] = new Animator(this.spritesheet, 0, this.size.h, this.size.w, this.size.h, 3, 0.1, 0, false, true);
        this.animations["left"] = new Animator(this.spritesheet, 0, this.size.h * 2, this.size.w, this.size.h, 3, 0.1, 0, false, true);
        this.animations["right"] = new Animator(this.spritesheet, 0, this.size.h * 3, this.size.w, this.size.h, 3, 0.1, 0, false, true);
    }

    

    update() {
        // Move the boss in the direction it is facing
        this.pos.x += this.velocity.x * gameEngine.clockTick;
        this.pos.y += this.velocity.y * gameEngine.clockTick;

        // Check for collision with boundaries
        //left
        if (this.pos.x < 0) {
            //speed down
            this.velocity.y = this.speed;
            this.pos.x=0;
            this.velocity.x = 0;
            this.direction = "up";
        }
        //to his up
        else if (this.pos.x + this.size.w > 300) {
  
            this.velocity.y = -this.speed;
            this.velocity.x = 0;
            this.pos.x=300-this.size.w;
            this.direction = "right";
        }
        else if (this.pos.y < 0) {
            this.velocity.y = 0;
            this.pos.y=0;
            this.velocity.x = -this.speed;
            this.direction = "down";
        }

        //to his left
        else if(this.pos.y + this.size.h >= 300) {
            this.velocity.y = 0;
            this.pos.y=300 - this.size.h;
            this.velocity.x = this.speed;
            this.direction = "left";
        }

        //new



        //

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }

    draw(ctx) {
        // Draw the boss facing the direction it is moving
        this.drawAnim(ctx, this.animations[this.direction]);
    }

    // Custom move function that allows the boss to move in a specific direction
    move(direction) {
        this.direction = direction;
        switch(direction) {
            case "up":
                this.velocity.x = 0;
                this.velocity.y = -this.speed;
                break;
            case "down":
                this.velocity.x = 0;
                this.velocity.y = this.speed;
                break;
            case "left":
                this.velocity.x = -this.speed;
                this.velocity.y = 0;
                break;
            case "right":
                this.velocity.x = this.speed;
                this.velocity.y = 0;
                break;
            default:
                console.log("Invalid direction");
        }
        
    }
    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, 1.5);
    
}
}
