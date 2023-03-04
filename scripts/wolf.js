/**
 * Represents the wolf enemy.
 *
 * @author Ryan MacLeod
 *
 */

class Wolf extends Enemy {

    constructor(pos) {
        super(
            pos,
            ASSET_MANAGER.getAsset("sprites/wolf_spritesheet.png"),
            new Dimension(32, 64),
            new Padding(),
            40,
            150);
        this.animations = [];
        this.idleAnimations = [];

        this.type = 'wolf';
        this.knockbackScale = 0.5;

        this.animDisplace = {
            lay: 4,
            attack: 8
        }

        this.startPos = {
            x: this.pos.x,
            y: this.pos.y
        }

        this.aggroRange = 200;
        this.enraged = false;
        this.pursuing = false;
        this.hitPoints = this.maxHitPoints; //Make sure it is instantiated before first update call

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
        super.update();
        this.setSpeed();
        this.determineRange();
        this.determineSize();
        this.determineVelocity();
        if(this.knockback) {
            this.velocity = new Vec2(this.knockbackDir.x, this.knockbackDir.y);

            let scalingFactor = this.knockbackSpeed / this.knockbackDir.magnitude();

            this.velocity.x *= scalingFactor;
            this.velocity.y *= scalingFactor;
        } else {
            this.determineVelocity();
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

    draw(ctx) {
        this.determineFrameDirection();
        if(this.boundingBox.collide(doug.boundingBox)) { //Attack
            this.drawAnim(ctx, this.animations[this.directionMem + this.animDisplace.attack]);
        } 
        else if(this.startRange.dist <= 1) { //Lay - currently just an idle standing animation
            this.drawAnim(ctx, this.idleAnimations[this.directionMem]);
        } 
        else { //Walk
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
        
        this.startRange.xDif = this.startPos.x - this.pos.x,
        this.startRange.yDif = this.startPos.y - this.pos.y,
        this.startRange.dist = Math.sqrt(Math.pow(this.startRange.xDif, 2)
                + Math.pow(this.startRange.yDif, 2));
    }

    determineVelocity() {
        if(!doug.dead && this.playerRange.dist < this.aggroRange) {
            this.pursuing = true;
        } else {
            this.pursuing = false;
        }
        if(this.enraged || (this.pursuing && !this.boundingBox.collide(doug.boundingBox)) || (this.startRange.dist > 1 && !this.pursuing)) {
            this.move();
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    determineFrameDirection() {
        const xAbsVel = Math.abs(this.velocity.x);
        const yAbsVel = Math.abs(this.velocity.y);
        
        if(xAbsVel > yAbsVel) { //Horizontal Frame
            if (this.velocity.x < 0) { //Left
                this.directionMem = 3;
            } else { //Right
                this.directionMem = 1;
            }
        } else if (xAbsVel < yAbsVel) { //Vertical Frame
            if(this.velocity.y > 0) { //Down
                this.directionMem = 0;
            } else { //Up
                this.directionMem = 2;
            }
        }
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
        this.idleAnimations[0] = new Animator(this.spritesheet, 
            0, 128,                     //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Right
        this.idleAnimations[1] = new Animator(this.spritesheet, 
            384, 96,                    //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Up
        this.idleAnimations[2] = new Animator(this.spritesheet, 
            160, 128,                   //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Left
        this.idleAnimations[3] = new Animator(this.spritesheet, 
            384, 288,                   //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame 
            
        //Lay Down
        this.animations[4] = new Animator(this.spritesheet, 
            0, 64,                     //Start Positions
            32, 64,                     //Dimensions
            4, 0.2, 0, false, false);    //Frame Stats

        //Lay Right
        this.animations[5] = new Animator(this.spritesheet, 
            384, 0,                    //Start Positions
            64, 32,                     //Dimensions
            4, 0.2, 0, false, false);    //Frame Stats

        //Lay Up
        this.animations[6] = new Animator(this.spritesheet, 
            160, 64,                   //Start Positions
            32, 64,                     //Dimensions
            4, 0.2, 0, false, false);    //Frame Stats

        //Lay Left
        this.animations[7] = new Animator(this.spritesheet, 
            384, 192,                   //Start Positions
            64, 32,                     //Dimensions
            4, 0.2, 0, false, false);    //Frame Stats

        //Idle Lay Down
        this.idleAnimations[4] = new Animator(this.spritesheet, 
            0, 64,                     //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Lay Right
        this.idleAnimations[5] = new Animator(this.spritesheet, 
            384, 0,                    //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Lay Up
        this.idleAnimations[6] = new Animator(this.spritesheet, 
            160, 64,                   //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Lay Left
        this.idleAnimations[7] = new Animator(this.spritesheet, 
            384, 192,                   //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, false);    //Frame Stats

        //Bite Down
        this.animations[8] = new Animator(this.spritesheet, 
            0, 256,                     //Start Positions
            32, 64,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats

        //Bite Right
        this.animations[9] = new Animator(this.spritesheet, 
            384, 160,                    //Start Positions
            64, 32,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats

        //Bite Up
        this.animations[10] = new Animator(this.spritesheet, 
            160, 256,                   //Start Positions
            32, 64,                     //Dimensions
            4, 0.2, 0, false, true);    //Frame Stats

        //Bite Left
        this.animations[11] = new Animator(this.spritesheet, 
            384, 352,                   //Start Positions
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