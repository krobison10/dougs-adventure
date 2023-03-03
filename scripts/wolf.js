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

        this.type = 'wolf';

        this.startX = doug.getCenter().x;
        this.startY = doug.getCenter().y;
        this.aggroRange = 200;

        this.setSpeed();
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        this.setAnimations();
    }

    update() {
        this.setSpeed();
        this.route(doug.pos);
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
            this.directionMem = 3;
        }
        if(this.velocity.x > 0) {//right
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 1;
        }
        if(this.velocity.y > 0 && this.velocity.x === 0) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && this.velocity.x === 0) {//up
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 2;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
            this.drawAnim(ctx, this.animations[this.directionMem]);
        }

        this.boundingBox.draw(ctx);
    }

    hitSound() {
        ASSET_MANAGER.playAsset("sounds/wolf_hit.wav");
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/wolf_kill.wav");
    }

    route(dest) {
        const xDif = dest.x - this.pos.x;
        const yDif = dest.y - this.pos.y;
        const dist = Math.sqrt(xDif * xDif + yDif * yDif);
        
        if(dist < this.aggroRange && dist > 1) { // Stops at one to smooth attack
            if(xDif > 0 && yDif > 0) { //Move Up
                this.velocity.y = this.speed;
                this.velocity.x = 0;
            } else if(xDif < 0 && yDif > 0) { //Move Left
                this.velocity.y = 0;
                this.velocity.x = -this.speed;
            } else if(xDif < 0 && yDif < 0) { //Move Down
                this.velocity.y = -this.speed;
                this.velocity.x = 0;
            } else if(xDif > 0 && yDif < 0) { //Move Right
                this.velocity.y = 0;
                this.velocity.x = this.speed;
            }
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
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