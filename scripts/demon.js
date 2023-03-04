class Demon extends Enemy {
    /**
     * @param {Vec2} pos initial position of the demon.
     * @param {HTMLImageElement} spritesheet spritesheet of the demon.
     * @param {Dimension} size size of the demon.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     * @param {number} damage how much damage the entity deals to the player
     * @param {number} hitPoints maximum health of the enemy.
     */
    constructor(pos, spritesheet, size, spritePadding, damage, hitPoints) {

        let scale1 = 3;
        super(pos, spritesheet, new Dimension(size.w*scale1, size.h*scale1), spritePadding, damage, hitPoints);
        this.animations = [];
        this.scale = scale1
        this.maxHitPoints = 1000;
        this.hitPoints = 1000;
        this.damage = 20;
        this.aggroRange = 200;
        this.dead = false;
        this.type = "demon";

        this.speed = 200;
        this.velocity = new Vec2(0,0);
        this.directionMem = 0;
        this.time = 0;

        for(let i = 0; i < 4; i++) {
            this.animations[i] = new Animator(this.spritesheet, 0, (i * 70),
                100, 70,
                3, .4, 0, false, true);
        }
        
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);


        this.targetID = 1;
        this.path = [{x: this.pos.x, y: this.pos.y}, {x: this.pos.x+ 200, y: this.pos.y}, {x: this.pos.x+200, y: this.pos.y+200}, {x: this.pos.x, y: this.pos.y+200}];
        this.target = this.path[this.targetID % 4];

        let dist = getDistance(this.pos, this.target)
        this.velocity = new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);

    }

    /**
     * Updates the demon for the frame.
     */
    update() {
        let dist = getDistance(this.pos, this.target);
        let dougDist = getDistance(this.pos, doug.pos);

        if(dougDist < this.aggroRange && !doug.dead) {
            this.target = doug.pos;
        } else {
            if (dist < 5) {
                this.targetID++;
            }
            this.target = this.path[this.targetID % 4];
            dist = getDistance(this.pos, this.target)
        }

        this.velocity= new Vec2((this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed);
       // this.velocity = new Vec2(200,200);
        this.pos.x += this.velocity.x * gameEngine.clockTick;
        this.pos.y += this.velocity.y * gameEngine.clockTick;
        //console.log(this.velocity, (this.target.x - this.pos.x)/dist * this.speed,(this.target.y - this.pos.y)/dist * this.speed)
        //console.log(this.target)
        //console.log(this.path)
        this.boundingBox = Character.createBB(this.pos, this.size, this.spritePadding);

    }

    die() {
        log.addMessage("Demon has been defeated", MessageLog.colors.purple);
        super.die();
    }

    // deathSound() {
    //     ASSET_MANAGER.playAsset("sounds/dragon_kill.wav");
    // }

    draw(ctx) {

       //this.drawAnim(ctx, this.animations[3]); //1 2 0 3

        if(this.velocity.x < 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//left
            this.drawAnim(ctx, this.animations[1]);
            this.directionMem = 1;
        }
        if(this.velocity.x > 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y)) {//right
            this.drawAnim(ctx, this.animations[2]);
            this.directionMem = 2;
        }
        if(this.velocity.y > 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//down
            this.drawAnim(ctx, this.animations[0]);
            this.directionMem = 0;
        }
        if(this.velocity.y < 0 && Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {//up
            this.drawAnim(ctx, this.animations[3]);
            this.directionMem = 3;
        }
        if(this.velocity.y === 0 && this.velocity.x === 0) {
           console.log("true")
            this.drawAnim(ctx, this.animations[0]);
        }
        //console.log(this.velocity)

        this.boundingBox.draw(ctx);
    }

     drawAnim(ctx, animator) {
         animator.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y, this.scale);
     }
}