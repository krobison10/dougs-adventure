/**
 * Represents the wolf enemy. A basic enemy in the game. It can hunt in packs, is territorial,
 * and prefers to hunt at night.
 *
 * @author Ryan MacLeod
 *
 */
class Wolf extends Enemy {

    /**
     * Constructor for the Wolf {@link Enemy} class. It recieves a position and optional
     * {@link WolfPack} as parameters.
     * 
     * @param {Vec2} pos The position of the top-left corner of the Wolf.
     * @param {WolfPack} wolfPack The {@link WolfPack} the wolf belongs to. 
     * Default is set to null.
     */
    constructor(pos, wolfPack = null) {
        super(
            pos,
            ASSET_MANAGER.getAsset("sprites/wolf_spritesheet.png"),
            new Dimension(32, 64),
            new Padding(),
            50,
            250);
        //Initialize empty animation arrays
        this.animations = [];
        this.idleAnimations = [];

        //Initialize all necessary instance variable
        this.type = 'wolf';
        this.knockbackScale = 0.5;
        this.wolfPack = wolfPack;
        this.aggroRange = 200;
        this.enraged = false;
        this.pursuing = false;
        this.layingDown = false;
        this.animationTime = 0;
        this.hitPoints = this.maxHitPoints; //Make sure it is instantiated before first update call
        this.setSpeed();
        this.directionMem = 0;

        /**
         * The displacement value used to locate animations in the animation arrays.
         */
        this.animDisplace = {
            lay: 4,
            attack: 8
        }

        /**
         * The starting position of the wolf (top-left corner of the wolf). This can also be considered
         * the wolfs home.
         */
        this.startPos = {
            x: this.pos.x,
            y: this.pos.y
        }

        /**
         * Variables used to track the time left of each animation. It is 0 when the animation is not
         * happening.
         */
        this.animationTime = {
            lay: 0,
            howl: 0
        }

        /**
         * Statistics about the distance between the wolf and the player.
         */
        this.playerRange = {
            xDif: doug.getCenter().x - this.getCenter().x,
            yDif: doug.getCenter().y - this.getCenter().y,
            dist: Math.sqrt(Math.pow(doug.getCenter().x - this.getCenter().x, 2)
                + Math.pow(doug.getCenter().y - this.getCenter().x, 2))
        }

        /**
         * Statistics about the distance between the wolf and it's starting position (home).
         */
        this.startRange = {
            xDif: 0,
            yDif: 0,
            dist: 0
        }

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

        this.setAnimations();
    }

    /**
     * The necessary update method for the game engine. It handles any new conditions that may occur
     * each {@link gameEngine.clockTick}.
     */
    update() {
        //Ensures wolves get removed from the world if the wolf pack is removed. Optimization reasons.
        if(this.wolfPack.removeFromWorld) {
            this.removeFromWorld = true;
            return;
        }
        super.update();
        this.setSpeed();
        this.determineRange();
        this.determineSize();
        this.determineVelocity();
        this.determineKnockback();
        this.determineCollision();

        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);
    }

    /**
     * The necessary draw method for the game engine. It draws a new frame every {@link gameEngine.clockTick}.
     * 
     * @param ctx The canvas the frame will be drawn on.
     */
    draw(ctx) {
        this.determineFrameDirection();
        if(this.boundingBox.collide(doug.boundingBox)) { //Attack
            this.layingDown = false;
            this.drawAnim(ctx, this.animations[this.directionMem + this.animDisplace.attack]);
        } 
        else if(this.startRange.dist <= 1) { //Lay
            if(this.layingDown && this.animationTime.lay <= 0) { //Laying animation complete, idle on floor
                this.drawAnim(ctx, this.idleAnimations[this.directionMem + this.animDisplace.lay]);
            } else if(!this.layingDown && this.animationTime.lay <= 0) { //Starting laying animation, just got home
                this.layingDown = true;
                this.animationTime.lay = this.animations[this.directionMem + this.animDisplace.lay].totalTime;
                this.drawAnim(ctx, this.animations[this.directionMem + this.animDisplace.lay]);
            } else if(this.layingDown && this.animationTime.lay > 0) { //In the process of laying down
                this.animationTime.lay -= gameEngine.clockTick;
                this.drawAnim(ctx, this.animations[this.directionMem + this.animDisplace.lay]);
            } else { //Fail-safe to ensure wolf is always drawn. This shouldn't be reached.
                this.drawAnim(ctx, this.idleAnimations[this.directionMem]);
            }
        } 
        else { //Walk
            this.layingDown = false;
            this.drawAnim(ctx, this.animations[this.directionMem]);
        }

        this.boundingBox.draw(ctx);
    }

    /**
     * A method to play the sound of the wolf taking damage.
     */
    hitSound() {
        ASSET_MANAGER.playAsset("sounds/wolf_hit.wav");
    }

    /**
     * A method to play the sound of the wolf dying.
     */
    deathSound() {
        ASSET_MANAGER.playAsset("sounds/wolf_kill.wav");
    }

    /**
     * A helper method used to determine if the wolf has collided with anything and updates
     * the position if not.
     */
    determineCollision() {
        const collisionLat = this.checkCollide("lateral");
        const collisionVert = this.checkCollide("vertical")
        if(!collisionLat) {
            this.pos.x += this.velocity.x * gameEngine.clockTick;
        }
        if(!collisionVert) {
            this.pos.y += this.velocity.y * gameEngine.clockTick;
        }
    }

    /**
     * A helper method that determines if the wolf is being knockedback and updates the velocity
     * if it is. Otherwise, the {@link determineVelocity} method is called.
     */
    determineKnockback() {
        if(this.knockback) {
            this.velocity = new Vec2(this.knockbackDir.x, this.knockbackDir.y);

            let scalingFactor = this.knockbackSpeed / this.knockbackDir.magnitude();

            this.velocity.x *= scalingFactor;
            this.velocity.y *= scalingFactor;
        } else {
            this.determineVelocity();
        }
    }

    /**
     * A helper method to determine the size of the wolf this frame and reset it.
     * It uses the {@link directionMem} variable to see if the wolf is vertical.
     * Since vertical frames are even and horizontal odd, the method takes the mod
     * 2 of directionMem and if it is 0 sets the size to vertical and so-forth.
     */
    determineSize() {
        if(this.directionMem % 2 == 0) {
            this.size = new Dimension(32, 64);
        } else {
            this.size = new Dimension(64, 32);
        }
    }

    /**
     * A helper method that calculates the new ranges of the wolf to the player and it's den,
     * then updates them. First it finds the differences of the x and y values and then it 
     * uses Pythagoream Theorem to find the distances.
     */
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

    /**
     * A helper method to help determine the behavior of the wolf and update the velocity
     * accordingly. It first checks if the wolf is within range of the player and updates
     * the {@link pursuing} variable. It then determines if the wolf should call the 
     * {@link move} method, if not it sets the velocity to 0.
     */
    determineVelocity() {
        if(!doug.dead && this.playerRange.dist < this.aggroRange) {
            this.pursuing = true;
        } else {
            this.pursuing = false;
        }
        if(this.enraged //If another wolf in it's pack has been attacked.
            || (this.pursuing && !this.boundingBox.collide(doug.boundingBox))
            || (this.startRange.dist > 1 && !this.pursuing)) {
            this.move();
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    /**
     * A helper method that determines what direction the wolf is facing this frame and updates
     * the {@link directionMem} variable accordingly. If the velocities are the same (for example
     * 0,0) then the direction will not change.
     */
    determineFrameDirection() {
        const xAbsVel = Math.abs(this.velocity.x);
        const yAbsVel = Math.abs(this.velocity.y);
        
        if(xAbsVel > yAbsVel) { //--------Horizontal Frame
            if (this.velocity.x < 0) { //----Left
                this.directionMem = 3;
            } else { //----------------------Right
                this.directionMem = 1;
            }
        } else if (xAbsVel < yAbsVel) { //Vertical Frame
            if(this.velocity.y > 0) { //----Down
                this.directionMem = 0;
            } else { //---------------------Up
                this.directionMem = 2;
            }
        }
    }

    /**
     * A method that determines if the wolf is moving to the player or back home, then updates the 
     * wolf's velocity accordingly.
     */
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
     * Helper method to build animations list. It sets both the moving and idle animations to the same
     * index. For example: a walking left animation and idle standing left are the same index. Furthermore,
     * the directions of the frames are entered in the same pattern (Down, Right, Up, Left). This allows
     * the {@link animDisplace} variables to be used in combination with the {@link directionMem} variable
     * to find corresponding activites. For example: If the directionMem is 0 (Down) and you want the down
     * bite animation, the sum of the directionMem and animDisplace.bite variables would yield the bite
     * down animation index (8).
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
            0, 64,                      //Start Positions
            32, 64,                     //Dimensions
            3, 0.2, 0, false, false);   //Frame Stats

        //Lay Right
        this.animations[5] = new Animator(this.spritesheet, 
            384, 0,                     //Start Positions
            64, 32,                     //Dimensions
            3, 0.2, 0, false, false);   //Frame Stats

        //Lay Up
        this.animations[6] = new Animator(this.spritesheet, 
            160, 64,                    //Start Positions
            32, 64,                     //Dimensions
            3, 0.2, 0, false, false);   //Frame Stats

        //Lay Left
        this.animations[7] = new Animator(this.spritesheet, 
            384, 192,                   //Start Positions
            64, 32,                     //Dimensions
            3, 0.2, 0, false, false);   //Frame Stats

        //Idle Lay Down
        this.idleAnimations[4] = new Animator(this.spritesheet, 
            96, 64,                     //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Lay Right
        this.idleAnimations[5] = new Animator(this.spritesheet, 
            512, 0,                     //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Lay Up
        this.idleAnimations[6] = new Animator(this.spritesheet, 
            256, 64,                    //Start Positions
            32, 64,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Idle Lay Left
        this.idleAnimations[7] = new Animator(this.spritesheet, 
            512, 192,                   //Start Positions
            64, 32,                     //Dimensions
            1, 0.2, 0, false, true);    //Frame Stats

        //Bite Down
        this.animations[8] = new Animator(this.spritesheet, 
            0, 256,                     //Start Positions
            32, 64,                     //Dimensions
            4, 0.15, 0, false, true);   //Frame Stats

        //Bite Right
        this.animations[9] = new Animator(this.spritesheet, 
            384, 160,                   //Start Positions
            64, 32,                     //Dimensions
            4, 0.15, 0, false, true);   //Frame Stats

        //Bite Up
        this.animations[10] = new Animator(this.spritesheet, 
            160, 256,                   //Start Positions
            32, 64,                     //Dimensions
            4, 0.15, 0, false, true);   //Frame Stats

        //Bite Left
        this.animations[11] = new Animator(this.spritesheet, 
            384, 352,                   //Start Positions
            64, 32,                     //Dimensions
            4, 0.15, 0, false, true);   //Frame Stats
    }

    /**
     * A helper mutator method that sets the speed of the wolf based off the time of day. The speed will
     * be increased in the day time.
     */
    setSpeed() {
        if(lightingSystem.dayTime) {
            this.speed = 100;
        } else {
            this.speed = 250;
        }
    }
    
}