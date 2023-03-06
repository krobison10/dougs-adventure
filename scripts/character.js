"use strict";

/**
 * Abstract class that represents characters in game such as
 * the Player, NPCs, or Enemies, that need keyframe animation.
 *
 * @author Kyler Robison
 */
class Character extends Entity {
    /**
     * @param {Vec2} pos initial position.
     * @param {Dimension} size size of the sprite.
     * @param {HTMLImageElement} spritesheet spritesheet of the player.
     * @param {Padding} spritePadding represents the padding between the actual size of the entity and its collision box.
     */
    constructor(pos, spritesheet, size,
                spritePadding = new Padding()) {
        super(pos, size);
        if(this.constructor === Character) {
            throw new Error("Character is an abstract class, cannot be instantiated");
        }
        Object.assign(this, {spritesheet, spritePadding});

        this.hitPoints = undefined;
        this.maxHitPoints = undefined;

        /**
         * The velocity of the character
         * @type {Vec2}
         */
        this.velocity = new Vec2(0, 0);

        //Makes default animation as forward facing single keyframe
        this.animation = new Animator(this.spritesheet, 0,0, size.w, size.h,
            1, 1, 0, false, true);
    }

    /**
     * Checks for a collision in a certain direction by using the current velocity and creating a test bounding
     * box created by mo
     * @param dir
     * @returns {boolean}
     */
    checkCollide(dir) {

        let futurePos = {};
        futurePos.x = this.pos.x + (dir === 'lateral' ? this.velocity.x * gameEngine.clockTick : 0);
        futurePos.y = this.pos.y + (dir === 'vertical' ? this.velocity.y * gameEngine.clockTick : 0);
        let box = Character.createBB(new Vec2(futurePos.x, futurePos.y), this.size, this.spritePadding);

        const entities = gameEngine.entities[Layers.FOREGROUND];
        for(const entity of entities) {
            if(entity.boundingBox && entity instanceof Obstacle) {
                if(entity !== this && box.collide(entity.boundingBox)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @param {Vec2} pos position of the bounding box.
     * @param {Dimension} size size of the parent.
     * @param {Padding} padding padding between size of parent and the bounding box.
     * @returns {BoundingBox} the bounding box created by these parameters.
     */
    static createBB(pos, size, padding) {
        return new BoundingBox(
            new Vec2( pos.x + padding.left, pos.y + padding.top),
            new Dimension(size.w - (padding.left + padding.right), size.h - (padding.top + padding.bottom))
        );
    }

    /**
     * Creates the death particles for the character.
     */
    deathParticles() {
        let count = this.size.h * this.size.w / 50;
        Particle.generateDeathParticles(this.getCenter().clone(), count, this.size.w / 2, 4, 2);
    }
    /**
     * Executes updates that should occur each frame.
     * @abstract
     */
    update() {
        console.error("Method is abstract, must be implemented in subclass");
    }

    /**
     * Draws the current frame of the animation at the current position of the Character.
     * @param {CanvasRenderingContext2D} ctx the rendering context.
     */
    draw(ctx) {
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.getScreenPos().x, this.getScreenPos().y);
    }
}

