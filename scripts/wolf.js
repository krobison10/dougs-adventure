/**
 * Represents the wolf enemy.
 *
 * @author Ryan MacLeod
 *
 */

class Wolf extends Enemy {
    constructor(pos, spritesheet, size, spritePadding, damage, maxHitPoints) {
        super(pos, spritesheet, size, spritePadding, damage, maxHitPoints);
        this.animations = [];

        this.startX = doug.getCenter().x;
        this.startY = doug.getCenter().y;
        this.aggroRange = 10;

        this.setSpeed();
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        this.setAnimations();
    }

    update() {
        this.route();
        this.setSpeed();
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

    draw(ctx) {
        if(this.velocity.x < 0) {//left
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0) {//right
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && this.velocity.x === 0) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && this.velocity.x === 0) {//up
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[2]);
        }

        this.boundingBox.draw(ctx);
    }

    route() {
        // const xMax = startX + 10;
        // const xMin = startX - 10;
        // const yMax = startY + 10;
        // const yMin = startY - 10;

        const deltaX = this.pos.x - doug.getCenter().x;
        const deltaY = this.pos.y - doug.getCenter().y;

        if((Math.abs(deltaX) || Math.abs(deltaY)) <= this.aggroRange) {
            this.velocity.x = x2 - x1;
            this.velocity.y = y2 - y1;

            const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            this.velocity.x /= magnitude;
            this.velocity.y /= magnitude;
        }

        // //Bottom Right
        // if (xDif < 0 && yDif > 0) {
        //     this.velocity.x = 0;
        //     this.velocity.y = -this.speed;
        // }
        
        // //Top Right
        // if (xDif < 0 && yDif < 0) {
        //     this.velocity.y = 0;
        //     this.velocity.x = -this.speed;
        // }

        // //Top Left
        // if (xDif > 0 && yDif < 0) {
        //     this.velocity.x = 0;
        //     this.velocity.y = this.speed;
        // }

        // //Bottom Left
        // if(xDif > 0 && yDif > 0) {
        //     this.velocity.x = this.speed;
        //     this.velocity.y = 0;
        // }
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }

    /**
     * Helper method to build animations list.
     */
    setAnimations() {
        //Walk Down
        this.animations[0] = new Animator(this.spritesheet, 
            0, 128,                     //Start Positions
            32, 64,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats

        //Wallk Right
        this.animations[1] = new Animator(this.spritesheet, 
            384, 96,                    //Start Positions
            64, 32,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats

        //Walk Up
        this.animations[2] = new Animator(this.spritesheet, 
            160, 128,                   //Start Positions
            32, 64,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats

        //Walk Left
        this.animations[3] = new Animator(this.spritesheet, 
            384, 288,                   //Start Positions
            64, 32,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats
    }

    setSpeed() {
        if(lightMap.dayTime) {
            this.speed = 100;
        } else {
            this.speed = 250;
        }
    }
    
}