/**
 * Represents the wolf enemy.
 *
 * @author Ryan MacLeod
 *
 */

class Wolf extends Enemy {
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints) {
        super(pos, spritesheet, size, spritePadding, damage, hitPoints);
        this.animations = [];

        this.xStart = pos.x;
        this.yStart = pos.y;
        this.maxHitPoints = hitPoints;

        this.hitPoints = this.maxHitPoints;
        this.damage = damage;

        this.setSpeed();
        this.velocity = new Vec2(0,0);
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
        let xMax = 200;
        let xMin = 100;
        let yMax = 200;
        let yMin = -100;
        
        //Bottom right
        if (this.pos.x >= xMax && this.pos.y >= yMax) {
            this.velocity.x = 0;
            this.velocity.y = -this.speed;
        }
        
        //Top Right
        if (this.pos.x >= xMax && this.pos.y <= yMin) {
            this.velocity.y = 0;
            this.velocity.x = -this.speed;
        }

        //Top Left
        if (this.pos.x <= xMin && this.pos.y <= yMin) {
            this.velocity.x = 0;
            this.velocity.y = this.speed;
        }

        //Bottom Left
        if(this.pos.x <= xMin && this.pos.y >= yMax) {
            this.velocity.x = this.speed;
            this.velocity.y = 0;
        }
    }

    drawAnim(ctx, animator) {
        animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, 1.5);
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