class Enemy extends Character {
    /**
     * @param {Vec2} pos initial position.
     * @param {Dimension} size size of the sprite.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     */
    constructor(pos, spritesheet, size, spritePadding = new Padding()) {
        super(pos, spritesheet, size, spritePadding);
        if(this.constructor === Enemy) {
            throw new Error("Enemy is an abstract class, cannot be instantiated");
        }
        //Object.assign(this, {spritesheet, spritePadding});

        //this.velocity = new Vec2(0, 0);

        //Makes default animation as forward facing single keyframe
        //this.animation = new Animator(this.spritesheet, 0,0, size.w, size.h,
           // 1, 1, 0, false, true);
    }

    /**
     * Executes updates that should occur each frame.
     * @abstract
     */
    update() {
        console.error("Method is abstract, must be implemented in subclass");
    }

    /**
     * Draws the current frame of the animation at the current position of the Enemy.
     * @param {CanvasRenderingContext2D} ctx the rendering context.
     */
    draw(ctx) {
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}