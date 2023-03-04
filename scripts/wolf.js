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

        this.startX = this.pos.x;
        this.startY = this.pos.y;
        this.aggroRange = 200;
        this.enraged = false;
        this.pursuing = false;
        this.hitPoints = maxHitPoints;

        this.playerRange = {
            xDif: doug.getCenter().x - this.getCenter().x,
            yDif: doug.getCenter().y - this.getCenter().y,
            dist: Math.sqrt(Math.pow(doug.getCenter().x - this.getCenter().x, 2)
                + Math.pow(doug.getCenter().y - this.getCenter().x, 2))
        }

        this.startRange = {
            xDif: 0,
            yDif: 0,
            dist: 0
        }

        this.setSpeed();
        this.directionMem = 0;
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        this.setAnimations();
    }

    update() {
        this.setSpeed();
        this.determineRange();
        if(!doug.dead && this.playerRange.dist < this.aggroRange && this.playerRange.dist > 1) {
            this.pursuing = true;
        } else {
            this.pursuing = false;
        }
        if(this.enraged || this.pursuing || this.startRange.dist > 1) {
            this.move();
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }

        this.determineSize();
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }

    draw(ctx) {
        const xAbsVel = Math.abs(this.velocity.x);
        const yAbsVel = Math.abs(this.velocity.y);
        if(xAbsVel > yAbsVel) { //Horizontal Frame
            if (this.velocity.x < 0) { //Left
                this.drawAnim(ctx, this.animations[3]);
                this.directionMem = 3;
            } else { //Right
                this.drawAnim(ctx, this.animations[1]);
                this.directionMem = 1;
            }
        } else if (xAbsVel < yAbsVel) { //Vertical Frame
            if(this.velocity.y > 0) { //Down
                this.drawAnim(ctx, this.animations[0]);
                this.directionMem = 0;
            } else { //Up
                this.drawAnim(ctx, this.animations[2]);
                this.directionMem = 2;
            }
        } else { //Idle Frame
            this.drawAnim(ctx, this.animations[this.directionMem + 4]);
        }

        this.boundingBox.draw(ctx);
    }

    hitSound() {
        ASSET_MANAGER.playAsset("sounds/wolf_hit.wav");
    }

    deathSound() {
        ASSET_MANAGER.playAsset("sounds/wolf_kill.wav");
    }

    determineSize() {
        if(this.directionMem % 2 == 0) {
            this.size = new Dimension(32, 64);
        } else {
            this.size = new Dimension(64, 32);
        }
    }

    determineRange() {
        this.playerRange.xDif = doug.getCenter().x - this.getCenter().x;
        this.playerRange.yDif = doug.getCenter().y - this.getCenter().y;
        this.playerRange.dist =  Math.sqrt(Math.pow(this.playerRange.xDif, 2)
            + Math.pow(this.playerRange.yDif, 2));
        
        this.startRange.xDif = this.startX - this.pos.x,
        this.startRange.yDif = this.startY - this.pos.y,
        this.startRange.dist = Math.sqrt(Math.pow(this.startRange.xDif, 2)
                + Math.pow(this.startRange.yDif, 2));
    }

    move() {
        if(this.enraged || this.pursuing) {
            this.velocity.x = (this.playerRange.xDif / this.playerRange.dist) * this.speed;
            this.velocity.y = (this.playerRange.yDif / this.playerRange.dist) * this.speed;
        } else {
            this.velocity.x = (this.startRange.xDif / this.startRange.dist) * this.speed;
            this.velocity.y = (this.startRange.yDif / this.startRange.dist) * this.speed;
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
        
        //Idle Down
        this.animations[4] = new Animator(this.spritesheet, 
            0, 128,                     //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Right
        this.animations[5] = new Animator(this.spritesheet, 
            384, 96,                    //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Up
        this.animations[6] = new Animator(this.spritesheet, 
            160, 128,                   //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Walk Left
        this.animations[7] = new Animator(this.spritesheet, 
            384, 288,                   //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats
    }

    setSpeed() {
        if(lightMap.dayTime) {
            this.speed = 100;
        } else {
            this.speed = 250;
        }
    }
    
}